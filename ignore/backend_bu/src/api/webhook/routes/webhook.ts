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
        },
        handler: 'webhook.webhook', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/webhook/create',
        config: {
            auth: false,
        },
        handler: 'webhook.create',
    },
    {
        method: 'POST',
        path: '/webhook/setGithub',
        config: {
            auth: false,
        },
        handler: 'webhook.setGithub',
    },
    {
        method: 'POST',
        path: '/webhook/sendLoginLink',
        config: {
            auth: false,
        },
        handler: 'webhook.sendLoginLink',
    },
    {
        method: 'POST',
        path: '/webhook/verifyToken',
        config: {
            auth: false,
        },
        handler: 'webhook.verifyToken',
    },
    {
        method: 'POST',
        path: '/webhook/contactus',
        config: {
            auth: false,
        },
        handler: 'webhook.contactus',
    },
]);