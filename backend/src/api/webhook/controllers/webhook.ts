import Stripe from 'stripe';
import { factories } from '@strapi/strapi'
import { findCheckoutSession } from '../../../stripe';
const unparsed = require('koa-body/unparsed.js');
import jwt from 'jsonwebtoken';
import { getEmailTemplate } from '../../../utils/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../../postmark';
import axios from 'axios';

const PROJECTNAME = process.env.PROJECTNAME;

// Constants
const WEBHOOK_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

// Add constants for tracked events
const ALLOWED_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.created',
  'customer.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.payment_action_required',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
] as const;

type AllowedEvent = typeof ALLOWED_EVENTS[number];

// Utility functions for event processing
const acquireLock = async (eventId: string): Promise<boolean> => {
  try {
    const now = new Date();
    const lockExpiration = new Date(now.getTime() + WEBHOOK_TIMEOUT);

    await strapi.db.query('api::stripe-event.stripe-event').create({
      data: {
        eventId,
        type: 'pending',
        processed: false,
        lockExpiresAt: lockExpiration,
      },
    });
    return true;
  } catch (error) {
    // If there's a unique constraint violation, the event is already being processed
    return false;
  }
};

const releaseLock = async (eventId: string) => {
  await strapi.db.query('api::stripe-event.stripe-event').update({
    where: { eventId },
    data: {
      lockExpiresAt: null,
    },
  });
};

const markEventProcessed = async (eventId: string) => {
  await strapi.db.query('api::stripe-event.stripe-event').update({
    where: { eventId },
    data: {
      processed: true,
      lastProcessedAt: new Date(),
    },
  });
};

const wasEventProcessed = async (eventId: string): Promise<boolean> => {
  const event = await strapi.db.query('api::stripe-event.stripe-event').findOne({
    where: { eventId },
  });
  return event?.processed === true;
};

// Sync function to prevent race conditions
const syncStripeDataToUser = async (customerId: string) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method']
    });

    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: { customerId }
    });

    if (!user) return null;

    await strapi.entityService.update('plugin::users-permissions.user', user.id, {
      data: {
        hasAccess: subscriptions.data.length > 0 && subscriptions.data[0].status === 'active',
        priceId: subscriptions.data[0]?.items.data[0]?.price.id,
      }
    });

    return user;
  } catch (error) {
    console.error('Error syncing stripe data:', error);
    throw error;
  }
};

// Error handling
const logStripeError = async (eventId: string, error: Error) => {
  await strapi.db.query('api::stripe-error.stripe-error').create({
    data: {
      eventId,
      eventType: 'webhook_processing',
      error: error.message,
      timestamp: Date.now(),
      retryCount: 0,
    }
  });
};

// Webhook controller
export default factories.createCoreController('api::webhook.webhook', ({ strapi }) => ({
  async webhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    const unparsedBody = ctx.request.body[unparsed];

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(unparsedBody, sig, webhookSecret);
    } catch (err) {
      strapi.log.error(`Webhook signature verification failed: ${err.message}`);
      return ctx.badRequest(`Webhook Error: ${err.message}`);
    }

    // Check for duplicate events
    if (await wasEventProcessed(event.id)) {
      strapi.log.info(`Duplicate webhook event received: ${event.id}`);
      return ctx.send({ received: true, status: 'duplicate' });
    }

    // Try to acquire lock
    if (!await acquireLock(event.id)) {
      strapi.log.warn(`Failed to acquire lock for event: ${event.id}`);
      return ctx.send({ received: true, status: 'locked' });
    }

    try {
      const data = event.data;
      const eventType = event.type;

      strapi.log.info(`Webhook received for ${eventType}`);

      switch (eventType) {
        case "checkout.session.completed": {
          const payload = data.object as Stripe.Checkout.Session;
          const session = await findCheckoutSession(payload.id);
          const customerId = session?.customer as string;
          const purchaseProduct = session?.line_items?.data[0]?.price.product as string;
          const priceId = session?.line_items?.data[0]?.price.id;
          const customer = await stripe.customers.retrieve(customerId as string);

          let user;
          if (customerId) {
            user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId } });
          } else if ('email' in customer) {
            user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: customer.email } });
          }
          const product = await strapi.query('api::product.product').findOne({
            where: {
              stripe: purchaseProduct,
              priceId: priceId
            }
          });

          if (!user) {
            const myUuid = uuidv4().toString();
            const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'authenticated' } });


            user = await strapi.entityService.create('plugin::users-permissions.user', {
              data: {
                email: 'email' in customer ? customer.email : '',
                username: 'name' in customer ? customer.name : '',
                provider: 'local',
                customerId: customerId,
                hasAccess: true,
                uuid: myUuid,
                subscriptionTier: product.id,
                subscriptionStatus: 'active',
                subscriptionStartDate: new Date(payload.created * 1000),
                role: role.id,
              }
            });
          } else {
            user = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                priceId: priceId,
                customerId: customerId,
                hasAccess: true,
                subscriptionTier: product.id,
                subscriptionStatus: 'active',
                subscriptionStartDate: new Date(),
              }
            });
          }

          // Generate access token
          const accessToken = jwt.sign(
            {
              id: user.id,
              email: user.email,
              type: user.subscriptionTier,
              time: Date.now()
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
          );

          // Get and render welcome email template
          const emailContent = await getEmailTemplate('welcome-email', {
            projectName: PROJECTNAME,
            userName: user.username,
            accessUrl: `<a href="${strapi.config.server.frontendUrl}/access?token=${accessToken}">Login to your account</a>`,
            discordUrl: 'https://discord.gg/mjn8X7hY54',
            supportEmail: strapi.config.server.supportEmail
          }, ['accessUrl', 'userName', 'projectName']);

          // Send welcome email
          await sendEmail({
            from: process.env.FROMEMAIL,
            to: user.email,
            subject: emailContent.subject,
            htmlbody: emailContent.htmlBody,
            textbody: emailContent.textBody,
            messageStream: 'outbound',
          });
          break;
        }
        case "customer.subscription.updated": {
          const payload = data.object as Stripe.Subscription;
          const customerId = payload.customer as string;
          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId } });

          if (user) {
            // Get the subscription item price ID
            const priceId = payload.items.data[0]?.price?.id;


            // Define update data with proper types based on schema
            // If subscription is scheduled for cancellation
            if (payload.cancel_at_period_end && payload.cancel_at) {
              const isFutureCancelation = new Date(payload.cancel_at * 1000) > new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

              await strapi.entityService.update('plugin::users-permissions.user', user.id, {
                data: {
                  hasAccess: isFutureCancelation ? true : false,
                  subscriptionStatus: isFutureCancelation ? 'active' : 'inactive',
                  subscriptionEndDate: new Date(payload.cancel_at * 1000)
                }
              });
            } else if (payload.canceled_at) {
              // If subscription is already canceled
              await strapi.entityService.update('plugin::users-permissions.user', user.id, {
                data: {
                  subscriptionStatus: 'inactive',
                  hasAccess: false,
                  subscriptionTier: null,
                  subscriptionEndDate: new Date(payload.canceled_at * 1000),
                }
              });
            } else {
              // Subscription is active
              const productStripeId = payload.items.data[0]?.price?.product as string;
              const product = await strapi.query('api::product.product').findOne({
                where: {
                  stripe: productStripeId
                }
              });
              if (!product) {
                break;
              }
              const productId = product.id;
              await strapi.entityService.update('plugin::users-permissions.user', user.id, {
                data: {
                  subscriptionEndDate: null,
                  priceId: priceId,
                  subscriptionTier: productId,
                  subscriptionStatus: 'active'
                }
              });
            }
          }
          break;
        }

        // Handle other events...
        case "customer.subscription.deleted":
        case "invoice.payment_failed": {
          const payload = data.object as Stripe.Invoice;
          const customerId = payload.customer as string;
          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId } });
          if (user) {
            await strapi.entityService.update('plugin::users-permissions.user', user.id, {
              data: {
                hasAccess: false,
                subscriptionStatus: 'inactive',
                subscriptionEndDate: new Date(),
                subscriptionTier: null
              }
            });
          }
          break;
        }

        case "customer.created": {
          const payload = data.object as Stripe.Customer;
          const customer = payload;
          const existingUser = await strapi.query('plugin::users-permissions.user').findOne({
            where: { email: customer.email }
          });


          if (!existingUser) {
            const authenticatedRole = await strapi
              .query('plugin::users-permissions.role')
              .findOne({ where: { type: 'authenticated' } });
            await strapi.entityService.create('plugin::users-permissions.user', {
              data: {
                email: customer.email,
                username: customer.name,
                provider: 'local',
                customerId: customer.id,
                hasAccess: false,
                uuid: uuidv4().toString(),
                role: authenticatedRole.id,
              }
            });
          }
          break;
        }

        case "customer.deleted": {
          const payload = data.object as Stripe.Customer;
          const customerId = payload.id;
          const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { customerId } });
          if (user) {
            await strapi.entityService.delete('plugin::users-permissions.user', user.id);
          }
          break;
        }

        case "product.created":
        case "product.updated": {
          const payload = data.object as Stripe.Product;
          const previous = data.previous_attributes as Stripe.Product;

          // Find existing product
          const existingProduct = await strapi.query('api::product.product').findOne({
            where: { stripe: payload.id }
          });
          const joinedFeatures = Array.isArray(existingProduct?.features) ? existingProduct.features : [];
          payload.marketing_features?.forEach(f => joinedFeatures.includes(f.name) ? null : joinedFeatures.push(f.name));

          const productData = {
            title: payload.name,
            description: payload.description || '',
            stripe: payload.id,
            priceId: payload.default_price,
            oldpriceId: previous?.default_price,
            active: payload.active,
            publishedAt: payload.active ? new Date(payload.created) : null,
            features: joinedFeatures,
            metadata: payload.metadata || {},
            // images: payload.images || [],
            // Map other relevant fields from Stripe product
            // @ts-ignore
          } as Partial<Input<"api::product.product">>;

          if (existingProduct) {
            await strapi.entityService.update('api::product.product', existingProduct.id, {
              data: productData
            });
          } else {
            await strapi.entityService.create('api::product.product', {
              data: {
                ...productData,
                subscriptionSettings: {
                  searchLimit: 100,
                  exportLimit: 10,
                  apiAccess: 'none',
                  allowedDataColumns: ['*'],
                  allowCopy: true,
                  allowExport: true,
                  supportLevel: 'community',
                  period: 'month',
                  maxRecords: 0,
                }
              }
            });
          }
          break;
        }

        case "product.deleted": {
          const payload = data.object as Stripe.Product;
          const product = await strapi.query('api::product.product').findOne({
            where: { stripe: payload.id }
          });

          if (product) {
            // Instead of deleting, we can mark it as inactive
            await strapi.entityService.update('api::product.product', product.id, {
              data: {
                active: false,
                publishedAt: null // This will unpublish it
              }
            });
          }
          break;
        }
        case "price.created":
        case "price.updated": {
          const payload = data.object as Stripe.Price;

          const product = await strapi.query('api::product.product').findOne({
            where: { stripe: payload.product }
          });

          if (!product) {
            break;
          }

          // Only update if this is the current priceId or if no priceId is set and price is active
          if (product.priceId === payload.id || (!product.priceId && payload.active)) {
            await strapi.entityService.update('api::product.product', product.id, {
              data: {
                priceId: payload.id,
                price: payload.unit_amount / 100,
                mode: payload.type === 'recurring' ? 'subscription' : 'payment'
              }
            });
          }
          break;
        }

      }
      await markEventProcessed(event.id);
      return ctx.send({ received: true, status: 'processed' });
    } catch (error) {
      console.error(`Error processing webhook::${event.id}::${event.type}::\n`, error?.details?.errors);
      strapi.log.error(`Error processing webhook::${event.id}::${event.type}::${error.message}`, {
        eventId: event.id,
        eventType: event.type,
        error: error.stack
      });
      console.log(error);

      await logStripeError(event.id, error);


      return ctx.send({ received: true, status: 'error' });
    } finally {
      // await markEventProcessed(event.id);
      await releaseLock(event.id);
    }
  },

  // Monitoring endpoints
  async getWebhookStats(ctx) {
    if (ctx.request.body.token !== process.env.WEBHOOK_TOKEN) {
      return ctx.forbidden('Admin access required');
    }

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      const [processed, failed] = await Promise.all([
        strapi.db.query('api::stripe-event.stripe-event').count({
          where: {
            processed: true,
            lastProcessedAt: { $gte: last24Hours }
          }
        }),
        strapi.db.query('api::stripe-error.stripe-error').count({
          where: {
            timestamp: { $gte: last24Hours.getTime() }
          }
        })
      ]);

      return ctx.send({ processed, failed, since: last24Hours });
    } catch (error) {
      strapi.log.error('Error fetching webhook stats:', error);
      return ctx.throw(500, 'Error fetching webhook stats');
    }
  },

  // Add back the create method
  async create(ctx) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    console.log('Creating Stripe checkout session');

    const extraParams: Stripe.Checkout.SessionCreateParams = {
      payment_intent_data: { setup_future_usage: "on_session" },
      tax_id_collection: { enabled: true },
      customer_creation: 'always',
    };

    const { priceId, successUrl, cancelUrl, referralId, mode } = ctx.request.body;
    console.log('Received parameters:', { priceId, successUrl, cancelUrl, referralId, mode });
    if (mode === 'subscription') {
      delete extraParams.payment_intent_data;
      delete extraParams.customer_creation;
    }
    try {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: mode || 'payment',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...extraParams,
      };

      if (referralId) {
        sessionParams.client_reference_id = referralId;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log('Stripe session created:', session.id);

      ctx.response.status = 303;
      ctx.set('sessionUrl', session.url)
      ctx.send({ id: session.id, sessionUrl: session.url })
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      ctx.throw(500, 'Error creating Stripe session');
    }
  },

  // Add back setGithub method
  async setGithub(ctx) {

    const jwtUser = ctx.state.user;
    const github = ctx.request.body.github as string;

    if (!jwtUser) {
      return ctx.unauthorized('User not found');
    }
    if (!github) {
      return ctx.badRequest('GitHub username is required');
    }

    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: jwtUser.email } });
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

  // Add back sendLoginLink method
  async sendLoginLink(ctx) {
    const email = ctx.request.body.email as string;
    if (!email) {
      return ctx.badRequest('Email is required');
    }
    try {
      const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email: email } });

      if (!user) {
        return ctx.notFound('User not found');
      }

      if (!user.hasAccess || !user.priceId || user.subscriptionStatus !== 'active') {
        return ctx.forbidden('User does not have access');
      }

      const token = jwt.sign(
        {
          email: email,
          id: user.id,
          type: user.priceId,
          time: Date.now()
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
      );

      const loginLink = `${strapi.config.server.frontendUrl}/database?token=${token}`;

      const emailContent = await getEmailTemplate('login-email', {
        projectName: PROJECTNAME,
        userName: user.username,
        accessUrl: `<a href="${loginLink}">Login to your account</a>`,
        discordUrl: 'https://discord.gg/mjn8X7hY54',
        supportEmail: strapi.config.server.supportEmail
      }, ['accessUrl', 'userName', 'projectName']);

      await sendEmail({
        from: process.env.FROMEMAIL,
        to: email,
        subject: emailContent.subject,
        htmlbody: emailContent.htmlBody,
        textbody: emailContent.textBody,
        messageStream: 'outbound',
      });


      ctx.send({ success: true, message: 'Login link sent successfully' });
    } catch (error) {
      console.error('Error sending login link:', error);
      ctx.throw('Error processing request, try again');
    }
  },

  // token verification is done in the daas-auth middleware
  // this is just a placeholder to keep the route
  // TODO: change the controller to reflect the new auth flow
  async verifyToken(ctx) {
    // The middleware has already verified the token and populated ctx.state.user
    if (ctx.state.user) {
      return ctx.send({
        valid: true,
        user: {
          id: ctx.state.user.id,
          email: ctx.state.user.email
        }
      });
    }
    return ctx.unauthorized('Invalid token');
  },

  // Add back contactus method
  async contactus(ctx) {
    try {
      const { name, email, message, captchaToken } = ctx.request.body;

      // Verify reCAPTCHA token
      if (!captchaToken) {
        return ctx.badRequest('Captcha token is required');
      }
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
      const recaptchaResponse = await axios.post(verificationURL);

      if (!recaptchaResponse.data.success) {
        return ctx.badRequest('reCAPTCHA verification failed');
      }
      if (!name) {
        return ctx.badRequest('Name is required');
      }
      if (!email) {
        return ctx.badRequest('Email is required');
      }
      if (!message) {
        return ctx.badRequest('Message is required');
      }

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