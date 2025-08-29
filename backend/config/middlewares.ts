const isProduction = process.env.NODE_ENV === 'production';
const corsOrigin = isProduction ? process.env.FRONTEND_URL : '*';
const allowedHeaders = isProduction ? ['Content-Type', 'Authorization', 'X-New-Token'] : ['*'];

module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [corsOrigin],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: allowedHeaders,
      expose: ['X-New-Token'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      includeUnparsed: true,
      formLimit: "256mb", // modify form body
      jsonLimit: "256mb", // modify JSON body
      textLimit: "256mb", // modify text body
      formidable: {
        maxFileSize: 200 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
  'strapi::favicon',
  'strapi::public',
  {
    name: 'global::daas-auth',
    config: {
      frontendUrl: process.env.FRONTEND_URL,
      applyTo: [/^\/api\/database\/(?!limited|download|sync|demo-filter$).*$/, /^\/api\/webhook\/verifyToken$/],
      exclude: [/^\/api\/database\/limited|download|sync|demo-filter$/]
    }
  }
];
