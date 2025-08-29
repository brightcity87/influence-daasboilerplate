export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const service = await strapi.service('plugin::users-permissions.role');
    const roles = await service.find();
   
    const getRole = async (type) => {
      const { id } = roles.find(r => r.type === type);
      return service.findOne(id);
    };
   
    const resetPermissions = (role) => {
      Object.keys(role.permissions).forEach(t => {
        Object.keys(role.permissions[t].controllers).forEach(c => {
          Object.keys(role.permissions[t].controllers[c]).forEach(a => {
            role.permissions[t].controllers[c][a].enabled = false;
            role.permissions[t].controllers[c][a].policy = '';
          });
        });
      });
    };
   
    const setPermission = (role, type, controller, action, enabled) => {
      try {
        if (role.permissions[type] && 
            role.permissions[type].controllers[controller] && 
            role.permissions[type].controllers[controller][action]) {
          role.permissions[type].controllers[controller][action].enabled = enabled;
        } else {
          throw new Error('Invalid permission structure');
        }
      } catch (e) {
        console.error(`Couldn't set permission ${role.name} ${type}:${controller}:${action}:${enabled}`, e);
      }
    };

    const publicRole = await getRole('public');
    resetPermissions(publicRole);
    setPermission(publicRole, 'api::blog', 'blog', 'find', true);
    setPermission(publicRole, 'api::blog', 'blog', 'findOne', true);

    setPermission(publicRole, 'api::config', 'config', 'find', true);

    setPermission(publicRole, 'api::database', 'database', 'getRows', true);
    setPermission(publicRole, 'api::database', 'database', 'sync', true);
    setPermission(publicRole, 'api::database', 'database', 'filter', true);
    setPermission(publicRole, 'api::database', 'database', 'limited', true);

    setPermission(publicRole, 'api::faq', 'faq', 'find', true);

    setPermission(publicRole, 'api::filteroption', 'filteroption', 'find', true);

    setPermission(publicRole, 'api::product', 'product', 'find', true);

    setPermission(publicRole, 'api::testimonial', 'testimonial', 'find', true);

    setPermission(publicRole, 'api::webhook', 'webhook', 'contactus', true);
    setPermission(publicRole, 'api::webhook', 'webhook', 'find', true);
    setPermission(publicRole, 'api::webhook', 'webhook', 'webhook', true);
    setPermission(publicRole, 'api::webhook', 'webhook', 'create', true);
    setPermission(publicRole, 'api::webhook', 'webhook', 'setGithub', true);
    setPermission(publicRole, 'api::webhook', 'webhook', 'sendLoginLink', true);
    setPermission(publicRole, 'api::webhook', 'webhook', 'verifyToken', true);

    await service.updateRole(publicRole.id, publicRole);

    const config = await strapi.service('api::config.config').find();
    if(config && config.seed_database !== false){
      config.seed_database = false;
      await strapi.entityService.update('api::config.config', config.id, { data: config });

      // Seed blogs
        for (const blog of blogs) {
          await strapi.entityService.create('api::blog.blog', { data: blog });
        }

        for (const faq of faqs) {
          await strapi.entityService.create('api::faq.faq', { data: faq });
        }

        for (const product of products) {
          await strapi.entityService.create('api::product.product', { data: product });
        }

        for (const testimonial of testimonials) {
          await strapi.entityService.create('api::testimonial.testimonial', { data: testimonial });
        }

      console.log('Database seeded successfully');
    }
  }
}

type Blog = {
  title: string;
  author: string;
  description: string;
  slug:string;
  publishedAt: string;
  content: Array<{
    type: 'heading' | 'paragraph';
    level?: number;
    children: Array<{text: string, type?: string}>;
  }>;
};

// FAQ type
type FAQ = {
  question: string;
  answer: string;
};

// Product type
type Product = {
  title: string;
  description: string;
  stripe: string;
  oldprice: number;
  price: number;
  features: string[];
  redirect: string;
  cta_text: string;
  featured: boolean;
  publishedAt: string;

};

// Testimonial type
type Testimonial = {
  name: string;
  title: string;
  testimonial: string;
};
//This is sample data to seed the database with some data
const blogs: Blog[] = [
  {
    title: 'Traffic And Conversion Summit 2024 Review',
    slug: 'traffic-and-conversion-summit-2024-review',
    author: 'Sam',
    publishedAt: new Date().toISOString(),
    description: 'Traffic And Conversion Summit 2024 Review',
    content: [
      {
        type: 'heading',
        level: 1,
        children:[{text: 'This is a WYSIWYG textfield', type: 'text'}],
      },
      {
        type: 'paragraph',
        children:[{text: 'The same styling you see here will also be visible on the frontend', type: 'text'}],
      },
    ],
  },
  {
    title: 'India Affiliate Summit 2023 Review',
    slug: 'india-affiliate-summit-2023-review',
    author: 'Sam',
    description: 'India Affiliate Summit 2023 Review',
    publishedAt: new Date().toISOString(),

    content: [
      {
        type: 'heading',
        level: 1,
        children:[{text: 'This is a WYSIWYG textfield', type: 'text'}],
      },
      {
        type: 'paragraph',
        children:[{text: 'The same styling you see here will also be visible on the frontend', type: 'text'}],
      },
    ],
  },
  
];

const faqs: FAQ[] = [{
  question: 'Your service is expensive. Can I get a discount?',
  answer: 'Unfortunately we do not give out discounts. We price our service to purposely limit access and not dilute the value we provide our subscribers. Our goal is to maximize the value we add to a small number of subscribers.',
},
{
  question: 'I don’t have time to actively reach out to potential clients. Can you do it for me?',
  answer: `Yes. Please send us a message from the <chakra.a href="/contact-us" color={'brand.600'}> contact us </chakra.a> page and we’ll get back to you as soon as possible.\n`,
}
,
{
  question: 'What is the source of your information?',
  answer: `We collect all the data manually one by one and use various publicly available services to cross check all information.\n The data is not the result of some database hack, leak or any other illegal activity.`,
}
,
{
  question: 'Why should I subscribe to DaasBoilerplate?',
  answer: `It's easy to buy a cheap list with thousands of leads and start blasting emails to them from a random person that adds you to Skype. But be prepared for bad results.
Be prepared for wrong, missing and outdated information. Emails sent to these people will bounce back and ruin your company’s domain reputation. Thousands of unqualified leads that will yield no results.
We focus on quality over quantity. We collect all our data manually one by one to ensure validity. We keep our prices high to limit access.
We work with a small number of customers and aren’t planning on changing any time soon.
Your feedback is very important to us. We'll go above and beyond to help grow revenue for your business.`,
},
{
  question: 'What types of companies do you include in your database?',
  answer: `It’s a mixture of affiliates, affiliate networks, advertisers, solution providers (call trackers, affiliate tracking platforms etc), agencies, ad networks etc. It depends on the source.`,
}
,
{
  question: 'Can I buy only certain entries in the database?',
  answer: `No. We are not an a la carte service and not looking to sell what we’ve curated as many times as possible.`,
}
,
{
  question: 'Do I need to sign a contract and am I locked into your service?',
  answer: `No. You can cancel at any time via the <chakra.a href="/contact-us" color={'brand.600'}> contact us </chakra.a> page.`,
}
,
{
  question: 'How do I know my payment infomation is safe?',
  answer: `We use PCI-compliant third-party processors. Payment information is processed by our payment service providers, and we receive a confirmation of payment, which we then associate with your account and any relevant transactions (we do not see your card details).`,
}

];

const products: Product[] = [
  {
    title: 'DaasBoilerplate',
    description: 'Join 281 others building database products',
    stripe: 'price_1PjqTOI9rB',
    oldprice: 297,
    publishedAt: new Date().toISOString(),

    price: 157,
    features: [
      "Early Bird discount",
      "55 page in-depth PDF",
      "Private discord community",
      "Bonus: The Outsource Playbook ($47 value)",
      "Lifetime updates",
      "Lifetime access"
    ],
    redirect: '',
    cta_text: '',
    featured: true,
  },
  {
    title: 'Done for you!',
    description: 'Please contact us',
    stripe: '',
    oldprice: 3977,
    price: 2977,
    publishedAt: new Date().toISOString(),

    features: [
      "Early Bird discount",
      "55 page in-depth PDF",
      "Private discord community",
      "Bonus: The Outsource Playbook ($47 value)",
      "Lifetime updates",
      "Lifetime access"
    ],
    redirect: '/contact-us',
    cta_text: 'Contact us',
    featured: false,
  },
];

const testimonials: Testimonial[] = [
  {
    name: 'Taras Kiseliuk',
    title: 'CEO at ClickDealer',
    testimonial: `"This is a great way for my team to follow-up with new prospects we met at the show as well as prospects we didn’t get the chance to meet with. It’s worked well for our team!"`
  },
  {
    name: 'Ripon Kumar',
    title: 'Founder & CEO Ray Advertising LLC',
    testimonial: `"Great database for every company looking to grow their business in the online marketing space. We closed 11 new clients in the first 2 months during the service!"`
  },
  {
    name: 'Sonny Palta',
    title: 'CEO/Founder The Affiliati Network, Inc',
    testimonial: `"This is incredibly valuable in the right hands. Most networks aren't equipped to handle this kind of prospecting database but luckily we are. Most importantly, using their leads has led to new clients each month, our newest one being worth $175,358/year."`
  },
  {
    name: 'Oscar Macarasig',
    title: 'SVP of Business Operations adMobo',
    testimonial: `"The team is VERY responsive to questions and feedback. I don't want anyone else to sign up because it's our edge vs other industry players!"`
  },
  {
    name: 'Cameron Millband',
    title: 'Performance Director - Canada Finder',
    testimonial: `"This has been an AWESOME resource to grow my book of business. Using the database, I've been keeping my pipeline full."`
  },
  {
    name: 'Robert Lee',
    title: 'Founder Noc Solutions',
    testimonial: `"We scheduled 12 calls within the first 8 weeks and closed 6 deals worth over $800,000! I can’t wait to see how many clients the rest of my team can close!"`
  },
  {
    name: 'Michelle Norman',
    title: 'Senior Growth Solutions Manager All Inclusive Marketing',
    testimonial: `"Utilizing the database is extremely helpful, within the first 2 months I managed to close 13 deals with new clients."`
  },
  {
    name: 'Peter Georgatos',
    title: 'CEO & Founder PureAds',
    testimonial: `"I've tried numerous lead generation services in the past, but this one is by far the best. In just three months, we've closed $351,749 in new business thanks to their targeted database."`
  },
  
];