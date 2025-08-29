// @ts-nocheck

//This is sample data to seed the database with some data
const blogs = [
  {
    title: "Traffic And Conversion Summit 2024 Review",
    slug: "traffic-and-conversion-summit-2024-review",
    author: "Sam",
    publishedAt: new Date().toISOString(),
    description: "Traffic And Conversion Summit 2024 Review",
    content: [
      {
        type: "heading",
        level: 1,
        children: [{ text: "This is a WYSIWYG textfield", type: "text" }],
      },
      {
        type: "paragraph",
        children: [{ text: "The same styling you see here will also be visible on the frontend", type: "text" }],
      },
    ],
  },
  {
    title: "India Affiliate Summit 2023 Review",
    slug: "india-affiliate-summit-2023-review",
    author: "Sam",
    description: "India Affiliate Summit 2023 Review",
    publishedAt: new Date().toISOString(),

    content: [
      {
        type: "heading",
        level: 1,
        children: [{ text: "This is a WYSIWYG textfield", type: "text" }],
      },
      {
        type: "paragraph",
        children: [{ text: "The same styling you see here will also be visible on the frontend", type: "text" }],
      },
    ],
  },
];

const faqs = [
  {
    question: "Your service is expensive. Can I get a discount?",
    answer:
      "Unfortunately we do not give out discounts. We price our service to purposely limit access and not dilute the value we provide our subscribers. Our goal is to maximize the value we add to a small number of subscribers.",
  },
  {
    question: "I don't have time to actively reach out to potential clients. Can you do it for me?",
    answer: `Yes. Please send us a message from the <chakra.a href="/contact-us" color={'brand.600'}> contact us </chakra.a> page and we'll get back to you as soon as possible.\n`,
  },
  {
    question: "What is the source of your information?",
    answer: `We collect all the data manually one by one and use various publicly available services to cross check all information.\n The data is not the result of some database hack, leak or any other illegal activity.`,
  },
  {
    question: "Why should I subscribe to DaasBoilerplate?",
    answer: `It's easy to buy a cheap list with thousands of leads and start blasting emails to them from a random person that adds you to Skype. But be prepared for bad results.
Be prepared for wrong, missing and outdated information. Emails sent to these people will bounce back and ruin your company's domain reputation. Thousands of unqualified leads that will yield no results.
We focus on quality over quantity. We collect all our data manually one by one to ensure validity. We keep our prices high to limit access.
We work with a small number of customers and aren't planning on changing any time soon.
Your feedback is very important to us. We'll go above and beyond to help grow revenue for your business.`,
  },
  {
    question: "What types of companies do you include in your database?",
    answer: `It's a mixture of affiliates, affiliate networks, advertisers, solution providers (call trackers, affiliate tracking platforms etc), agencies, ad networks etc. It depends on the source.`,
  },
  {
    question: "Can I buy only certain entries in the database?",
    answer: `No. We are not an a la carte service and not looking to sell what we've curated as many times as possible.`,
  },
  {
    question: "Do I need to sign a contract and am I locked into your service?",
    answer: `No. You can cancel at any time via the <chakra.a href="/contact-us" color={'brand.600'}> contact us </chakra.a> page.`,
  },
  {
    question: "How do I know my payment infomation is safe?",
    answer: `We use PCI-compliant third-party processors. Payment information is processed by our payment service providers, and we receive a confirmation of payment, which we then associate with your account and any relevant transactions (we do not see your card details).`,
  },
];

const products = [
  {
    title: "DaasBoilerplate",
    description: "Join 281 others building database products",
    stripe: "price_1PjqTOI9rB",
    oldprice: 297,
    publishedAt: new Date().toISOString(),

    price: 157,
    features: [
      "Early Bird discount",
      "55 page in-depth PDF",
      "Private discord community",
      "Bonus: The Outsource Playbook ($47 value)",
      "Lifetime updates",
      "Lifetime access",
    ],
    redirect: "",
    cta_text: "",
    featured: true,
  },
  {
    title: "Done for you!",
    description: "Please contact us",
    stripe: "",
    oldprice: 3977,
    price: 2977,
    publishedAt: new Date().toISOString(),

    features: [
      "Early Bird discount",
      "55 page in-depth PDF",
      "Private discord community",
      "Bonus: The Outsource Playbook ($47 value)",
      "Lifetime updates",
      "Lifetime access",
    ],
    redirect: "/contact-us",
    cta_text: "Contact us",
    featured: false,
  },
];

const testimonials = [
  {
    name: "Taras Kiseliuk",
    title: "CEO at ClickDealer",
    testimonial: `"This is a great way for my team to follow-up with new prospects we met at the show as well as prospects we didn't get the chance to meet with. It's worked well for our team!"`,
  },
  {
    name: "Ripon Kumar",
    title: "Founder & CEO Ray Advertising LLC",
    testimonial: `"Great database for every company looking to grow their business in the online marketing space. We closed 11 new clients in the first 2 months during the service!"`,
  },
  {
    name: "Sonny Palta",
    title: "CEO/Founder The Affiliati Network, Inc",
    testimonial: `"This is incredibly valuable in the right hands. Most networks aren't equipped to handle this kind of prospecting database but luckily we are. Most importantly, using their leads has led to new clients each month, our newest one being worth $175,358/year."`,
  },
  {
    name: "Oscar Macarasig",
    title: "SVP of Business Operations adMobo",
    testimonial: `"The team is VERY responsive to questions and feedback. I don't want anyone else to sign up because it's our edge vs other industry players!"`,
  },
  {
    name: "Cameron Millband",
    title: "Performance Director - Canada Finder",
    testimonial: `"This has been an AWESOME resource to grow my book of business. Using the database, I've been keeping my pipeline full."`,
  },
  {
    name: "Robert Lee",
    title: "Founder Noc Solutions",
    testimonial: `"We scheduled 12 calls within the first 8 weeks and closed 6 deals worth over $800,000! I can't wait to see how many clients the rest of my team can close!"`,
  },
  {
    name: "Michelle Norman",
    title: "Senior Growth Solutions Manager All Inclusive Marketing",
    testimonial: `"Utilizing the database is extremely helpful, within the first 2 months I managed to close 13 deals with new clients."`,
  },
  {
    name: "Peter Georgatos",
    title: "CEO & Founder PureAds",
    testimonial: `"I've tried numerous lead generation services in the past, but this one is by far the best. In just three months, we've closed $351,749 in new business thanks to their targeted database."`,
  },
];

const emailTemplates = [
  {
    name: "welcome-email",
    subject: "Welcome to {{projectName}}",
    htmlBody: [
      {
        type: "heading",
        level: 3,
        children: [
          {
            text: "Welcome to {{projectName}}!",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "Hello {{userName}},",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "Thank you for your purchase! To access your resources, please visit: {{accessUrl}}",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            bold: true,
            text: "This is your personal access link - please do not share it with anyone.",
            type: "text",
            italic: true,
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "Next Steps:",
            type: "text",
          },
        ],
      },
      {
        type: "list",
        format: "unordered",
        children: [
          {
            type: "list-item",
            children: [
              {
                text: "Join our Discord community: {{discordUrl}}",
                type: "text",
              },
            ],
          },
          {
            type: "list-item",
            children: [
              {
                text: "Check out our documentation",
                type: "text",
              },
            ],
          },
          {
            type: "list-item",
            children: [
              {
                text: "Reach out if you need help: {{supportEmail}}",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "Best regards,",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            bold: true,
            text: "The {{projectName}} Team",
            type: "text",
          },
        ],
      },
    ],
    textBody:
      "\nWelcome to {{projectName}}!\n\nHello {{userName}},\n\nThank you for your purchase! To access your resources, please visit:\n{{accessUrl}}\n\nThis is your personal access link - please do not share it with anyone.\n\nNext Steps:\n- Join our Discord community: {{discordUrl}}\n- Check out our documentation\n- Reach out if you need help: {{supportEmail}}\n\nBest regards,\nThe {{projectName}} Team\n",
    variables: {
      userName: "User's name",
      accessUrl: "NAccess URL with token",
      discordUrl: "Discord invitation URL",
      projectName: "Project name",
      supportEmail: "Support email address",
    },
    description: "Welcome email sent after successful purchase",
  },
  {
    name: "login-email",
    subject: "{{projectName}} | Your Login Link",
    htmlBody: [
      {
        type: "paragraph",
        children: [
          {
            bold: true,
            text: "Hello {{userName}},",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "Click on the following link to log in to your account:",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "{{accessUrl}}",
            type: "text",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            bold: true,
            text: "This link will expire in 15min",
            type: "text",
          },
          {
            text: ". If you didn't request this, please ignore this email.",
            type: "text",
          },
        ],
      },
    ],
    textBody:
      "Hello {{userName}},\n\nClick on the following link to log in to your account:\n{{accessUrl}}\n\nThis link will expire in 15min. If you didn't request this, please ignore this email.",
    variables: {
      userName: "User's name",
      accessUrl: "Access URL with token",
      projectName: "Project name",
    },
    description: "Login email sent to users after successful login",
  },
];
const popularSearches = [
  {
    searchTerm: "ai",
    order: 0,
    isActive: true,
  },
  {
    searchTerm: "daas",
    order: 1,
    isActive: true,
  },
];

const config = [
  {
    template: "main",
    seedDatabase: false,
    allowDemo: false,
    onlyDemo: false,
  },
];

const seedData = {
  blogs,
  faqs,
  products,
  testimonials,
  emailTemplates,
  popularSearches,
  config,
};

// Add publishedAt to all items
for (const key in seedData) {
  seedData[key] = seedData[key].map(item => ({
    ...item,
    publishedAt: new Date().toISOString()
  }));
}

export default seedData;
