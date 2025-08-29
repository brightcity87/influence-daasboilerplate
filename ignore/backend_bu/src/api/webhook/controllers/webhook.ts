import Stripe from 'stripe';
import { factories } from '@strapi/strapi'
import { findCheckoutSession } from '../../../stripe';
const unparsed = require('koa-body/unparsed.js');
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../../postmark';
import axios from 'axios';

const PROJECTNAME = process.env.PROJECTNAME;
// New function to verify JWT token
const verifyJwtToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    // Check if the token has expired
    if (Date.now() >= decoded.exp * 1000) {
      throw new Error('Token has expired');
    }

    // Fetch the user from the database
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user still has access
    if (!user.hasAccess) {
      throw new Error('User does not have access');
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        // Add any other user properties you want to return
      },
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
};

export default factories.createCoreController('api::webhook.webhook', ({ strapi }) => ({
  async webhook(ctx) {
    //This part of the code handles the webhooks from Stripe, you generally don't need to change this.
    const sig = ctx.request.headers['stripe-signature'];
    
    const unparsedBody = ctx.request.body[unparsed];


    let event;
    try {

      event = stripe.webhooks.constructEvent(unparsedBody, sig, webhookSecret);

    } catch (err) {
      return ctx.badRequest(`Webhook Error: ${err.message}`);
    }

    const data = event.data;
    const eventType = event.type;

    strapi.log.info(`Webhook received for ${eventType}`);

    try {
      switch (eventType) {
        case "checkout.session.completed": {
          const session = await findCheckoutSession(data.object.id);

          const customerId = session?.customer as string;
          const priceId = session?.line_items?.data[0]?.price.id;

          
          const customer = await stripe.customers.retrieve(customerId as string);

          let user;

          if (customerId) {
            user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId: customerId } });
          } else if ('email' in customer) {
            user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: customer.email } });
          }

          console.log('customer', customer);
          console.log('customerId', customerId);
          console.log('user', user);
          
          if (!user) {
            const myUuid = uuidv4().toString(); //generate a uuid

            user = await strapi.entityService.create('plugin::users-permissions.user', {
              data: {
                email: 'email' in customer ? customer.email : '',
                username: 'email' in customer ? customer.email : '',
                provider: 'local',
                customerId: customerId,
                hasAccess: true,
                uuid: myUuid,
              }
            });

          } else {
            user =await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                priceId: priceId,
                customerId: customerId,
                hasAccess: true,
              }
            });
          }

          // await sendEmail(
          //   {
          //     from: process.env.FROMEMAIL,
          //     to: user.email,
          //     subject: `Welcome to ${PROJECTNAME}`,
          //     htmlbody: `<p>
          //     Welcome to ${PROJECTNAME},
          //     <br>
          //     To gain access to the boilerplate code, please visit your unique link below (do not share this link with anyone)

          //     <a href="${process.env.FRONTEND_URL}/access?userid=${user.uuid}">${process.env.FRONTEND_URL}/access?userid=${user.uuid}</a>
          //     <br>
          //     <br>
          //     Please click the link below to get started:
          //     <br>
          //     <a href="${process.env.DISCORD_URL}">${process.env.DISCORD_URL}</a>

          //     </p>`,
          //     textbody: `Welcome to ${PROJECTNAME},
          //     Please click the link below to get started:
          //     ${process.env.DISCORD_URL}`,

          //     messageStream: 'outbound',
          //   }
          // );

          // Generate magic login link
          const token = jwt.sign(
            { 
              email: user.email,
              id: user.id,
              time: Date.now()
            }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '7d' }
          );
          
          const loginLink = `${process.env.FRONTEND_URL}?token=${token}`;
          
          await sendEmail({
            from: process.env.FROMEMAIL,
            to: user.email,
            subject: 'Your Magic Login Link',
            htmlbody: `
              <p>Hello,</p>
              <p>Click <a href="${loginLink}">here</a> to log in to your account.</p>
              <p>This link will expire in 7 days.</p>
              <p>If you didn't request this, please ignore this email.</p>
            `,
            textbody: `
              Hello,
              
              Click on the following link to log in to your account:
              ${loginLink}
              
              This link will expire in 7 days.
              
              If you didn't request this, please ignore this email.
            `,
            messageStream: 'outbound',
          });

          break;
        }

        case "checkout.session.expired": {
          const session = await findCheckoutSession(data.object.id);
          const customerId = session?.customer as string;

          if (customerId) {
            const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId: customerId } });
            if (user) {
              await strapi.entityService.update('plugin::users-permissions.user', user.id, {
                data: {
                  hasAccess: false,
                }
              });
            }
          }
          break;
        }

        case "customer.subscription.updated": {
          const subscription = data.object;
          const customerId = subscription.customer as string;
          const priceId = subscription.items.data[0].price.id;

          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId: customerId } });

          if (user) {
            await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                priceId: priceId,
                hasAccess: subscription.status === 'active',
              }
            });
          }
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = await stripe.subscriptions.retrieve(data.object.id);
          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId: subscription.customer } });

          if (user) {
            await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                hasAccess: false,
              }
            });
          }

          break;
        }

        case "invoice.paid": {
          const priceId = data.object.lines.data[0].price.id;
          const customerId = data.object.customer;

          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId: customerId } });

          if (user && user.priceId === priceId) {
            await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                hasAccess: true,
              }
            });
          }

          break;
        }

        case "invoice.payment_failed": {
          const customerId = data.object.customer;
          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId: customerId } });

          if (user) {
            await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                hasAccess: false,
              }
            });
          }
          break;
        }

        case "customer.created": {
          const customer = data.object;
          const existingUser = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: customer.email } });
          const myUuid = uuidv4().toString(); //generate a uuid
          if (!existingUser) {
            await strapi.entityService.create('plugin::users-permissions.user', {
              data: {
                email: customer.email,
                username: customer.email,
                provider: 'local',
                customerId: customer.id,
                hasAccess: false,
                uuid: myUuid,
              }
            });
          }
          break;
        }

        case "customer.deleted": {
          const customerId = data.object.id;
          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId: customerId } });

          if (user) {
            await strapi.entityService.delete('plugin::users-permissions.user', user.id);
          }
          break;
        }

        default:
          strapi.log.warn(`Unhandled event type: ${eventType}`);
      }
    } catch (e) {
      strapi.log.error(`Stripe error: ${e.message} | EVENT TYPE: ${eventType}`);
    }

    return ctx.send({ received: true });
  },
  async create(ctx) {
    //This part of the code handles the session creation from Stripe, which then sends a webhook to the backend, you generally don't need to change this.
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    console.log('stripe', stripe);
    const extraParams: Stripe.Checkout.SessionCreateParams = {
      payment_intent_data: { setup_future_usage: "on_session" },
      tax_id_collection: { enabled: true }
    };

    const priceId = ctx.request.body.priceId as string;
    const successUrl = ctx.request.body.successUrl as string;
    const cancelUrl = ctx.request.body.cancelUrl as string;
    console.log('priceId', priceId);
    console.log('successUrl', successUrl);
    console.log('cancelUrl', cancelUrl);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_creation: 'always',
      ...extraParams,
    });

    ctx.response.status = 303;
    ctx.set('sessionUrl', session.url)
    ctx.send({ id: session.id, sessionUrl: session.url })
  },
  async setGithub(ctx) {
    const uuid = ctx.request.body.userid as string;
    const github = ctx.request.body.github as string;

    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { uuid: uuid } });
    if (user) {
      await strapi.entityService.update('plugin::users-permissions.user', user.id, {
        data: {
          githubUsername: github,
        }
      });

      try {
        const repo = process.env.GITHUB_REPO_NAME;
        const owner = process.env.GITHUB_OWNER_NAME;
        const url = `https://api.github.com/repos/${owner}/${repo}/collaborators/${github}`;
        const headers = {
          'Authorization': `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        };
        const data = {
          permission: 'pull'
        };

        const response = await axios.put(url, data, { headers });

        if (response.status === 201) {
          ctx.send({ success: true, message: 'GitHub invitation sent successfully' });
        } else if (response.status === 204) {
          ctx.send({ success: true, message: 'GitHub collaborator updated successfully' });
        } else {
          throw new Error(`Unexpected response from GitHub API: ${response.status}`);
        }
      } catch (error) {
        console.error('Error managing GitHub collaborator:', error);
        if (axios.isAxiosError(error) && error.response) {
          ctx.throw(error.response.status, `Failed to manage GitHub collaborator: ${error.response.data.message}`);
        } else {
          ctx.throw(500, 'Failed to manage GitHub collaborator');
        }
      }
    } else {
      ctx.throw(404, 'User not found');
    }
  },
  async sendLoginLink(ctx) {
    const email = ctx.request.body.email as string;
    
    try {
      const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: email } });
      
      if (!user) {
        return ctx.throw(404, 'User not found');
      }
      
      if (!user.hasAccess) {
        return ctx.throw(403, 'User does not have access');
      }

      console.log(process.env.JWT_SECRET);
      
      const token = jwt.sign(
        { 
          email: email,
          id: user.id,
          time: Date.now()
        }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '7d' }  // Changed to 7 days for longer session
      );
      
      const loginLink = `${process.env.FRONTEND_URL}?token=${token}`;
      
      await sendEmail({
        from: process.env.FROMEMAIL,
        to: email,
        subject: 'Your Login Link',
        htmlbody: `
          <p>Hello,</p>
          <p>Click <a href="${loginLink}">here</a> to log in to your account.</p>
          <p>This link will expire in 7 days.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
        textbody: `
          Hello,
          
          Click on the following link to log in to your account:
          ${loginLink}
          
          This link will expire in 7 days.
          
          If you didn't request this, please ignore this email.
        `,
        messageStream: 'outbound',
      });
      
      ctx.send({ success: true, message: 'Login link sent successfully' });
    } catch (error) {
      console.error('Error sending login link:', error);
      ctx.throw(500, 'Failed to send login link');
    }
  },
  async verifyToken(ctx) {
    try {
      const { token } = ctx.request.body;

      if (!token) {
        return ctx.badRequest('Token is required');
      }

      const result = await verifyJwtToken(token);
      ctx.send(result);
    } catch (error) {
      console.error('Error verifying token:', error);
      ctx.unauthorized(error.message);
    }
  },
  async contactus(ctx) {
    try {
      const { name, email, message, captchaToken } = ctx.request.body;

      // Verify reCAPTCHA token
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
      const recaptchaResponse = await axios.post(verificationURL);

      if (!recaptchaResponse.data.success) {
        return ctx.badRequest('reCAPTCHA verification failed');
      }

      // Process the contact form submission
      // Here you can add logic to save the message to the database or send an email

      console.log('Contact form submission:', { name, email, message });

      await sendEmail({
        from: process.env.FROMEMAIL,
        to: process.env.FROMEMAIL,
        replyTo: email,
        subject: `New Contact Form Submission from ${name}`,
        htmlbody: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
        textbody: `
          New Contact Form Submission

          Name: ${name}
          Email: ${email}
          Message:
          ${message}
        `,
        messageStream: 'outbound',
      });

      ctx.send({ success: true, message: 'Contact form submitted successfully' });
    } catch (error) {
      console.error('Error processing contact form:', error);
      ctx.throw(500, 'Failed to process contact form');
    }
  },
}));
