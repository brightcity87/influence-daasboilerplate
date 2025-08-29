/**
 * row router
 */

import { factories } from '@strapi/strapi';

const coreRouter = factories.createCoreRouter('api::webhook.webhook');


const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) routes = innerRouter.routes.concat(extraRoutes);
            return routes;
        },
    };
};


module.exports = customRouter(coreRouter, [
    {
        method: 'POST',
        path: '/webhook/webhook',
        config: {
            auth: false,
            // Avoids abuse of the webhook by default
            // TODO: change this to a more restrictive rate limiter
            // to allow only stripe webhooks
            policies: ['api::webhook.stripe'],
            // middlewares: ['api::webhook.rate-limit'],
            // rateLimiter: 'default',
        },
        handler: 'webhook.webhook', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/webhook/create',
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit'],
            rateLimiter: 'free',
        },
        handler: 'webhook.create',
    },
    {
        method: 'POST',
        path: '/webhook/setGithub',
        config: {
            auth: false,
            middlewares: ['global::daas-auth', 'api::webhook.rate-limit'],
            rateLimiter: 'free',
        },
        handler: 'webhook.setGithub',
    },
    {
        method: 'POST',
        path: '/webhook/sendLoginLink',
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit'],
            rateLimiter: 'free',
        },
        handler: 'webhook.sendLoginLink',
    },
    {
        method: 'POST',
        path: '/webhook/verifyToken',
        config: {
            auth: false,
            middlewares: ['global::daas-auth'],
        },
        handler: 'webhook.verifyToken',
    },
    {
        method: 'POST',
        path: '/webhook/contactus',
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit'],
            rateLimiter: 'free',
        },
        handler: 'webhook.contactus',
    },
    {
        method: 'GET',
        path: '/webhook/get-webhook-stats',
        // USE: curl -X GET http://localhost:1337/api/webhook/get-webhook-stats?token=process.env.WEBHOOK_TOKEN
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit'],
            rateLimiter: 'free',
        },
        handler: 'webhook.getWebhookStats',
    },
]);
