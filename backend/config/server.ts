import cronTasks from './cront-tasks';
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  name: env('PROJECT_NAME', 'DaaS Boilerplate'),
  domain: env('DOMAIN', 'daasboilerplate.com'),
  url: env('BACKEND_URL', 'http://localhost:1337'),
  frontendUrl: env('FRONTEND_URL', 'http://localhost:3005'),
  jwtSecret: env('JWT_SECRET', 'daasboilerplate'),
  exportExpiration: env('EXPORT_EXPIRATION', '1d'),
  exportFileLocation: env('EXPORT_FILE_LOCATION', 'public'),
  stripe: {
    webhookSecret: env('STRIPE_WEBHOOK_SECRET', 'daasboilerplate'),
    secretKey: env('STRIPE_SECRET_KEY', 'daasboilerplate'),
  },
  google: {
    recaptchaSecretKey: env('RECAPTCHA_SECRET_KEY', 'daasboilerplate'),
  },
  email: {
    apiKey: env('POSTMARK_API_KEY', 'daasboilerplate'),
    fromEmail: env('FROM_EMAIL', 'noreply@daasboilerplate.com'),
    supportEmail: env('SUPPORT_EMAIL', 'support@daasboilerplate.com'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
  proxy: {
    global: true,
  },
  seed: env('SEED', 'true'),
});
