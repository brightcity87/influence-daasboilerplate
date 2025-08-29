/**
 * row router
 */

import { factories } from '@strapi/strapi';

const coreRouter = factories.createCoreRouter('api::database.database');


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
        method: 'GET',
        path: '/database',
        config: {
            auth: false,
            policies: ['has-feature-access'],
            middlewares: ['api::webhook.rate-limit', 'api::database.tier-check'],
            requiredFeatures: ['allowCopy'],
            userTypeToRateLimiter: {
                // map product priceId to one of the rate limiters
                // available rate limiters are: 'free', 'premium', 'enterprise', default    
                // 'price_STRIPE_PRODUCT_ID': 'free',
                // 'price_STRIPE_PRODUCT_ID_2': 'premium',
                // 'price_STRIPE_PRODUCT_ID_3': 'enterprise',
            },
        },
        handler: 'database.getRows', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/sync',
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit'],
            rateLimiter: 'default'
        },
        handler: 'database.sync', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/filter',
        config: {
            auth: false,
            middlewares: ['api::database.tier-check'],
            policies: ['has-feature-access'],
            requiredFeatures: ['searchLimit'],
        },
        handler: 'database.filter', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/demo-filter',
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit', 'api::database.tier-check'],
            rateLimiter: 'default',
        },
        handler: 'database.filter', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/limited',
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit'],
            rateLimiter: 'free'
        },
        handler: 'database.limited', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/export',
        config: {
            auth: false,
            middlewares: ['api::database.tier-check'],
            policies: ['has-feature-access'],
            requiredFeatures: ['allowExport'],
        },
        handler: 'database.export',
    },
    {
        method: 'GET',
        path: '/database/download',
        config: {
            auth: false,
            middlewares: ['api::webhook.rate-limit'],
            rateLimiter: 'free'
        },
        handler: 'database.download',
    }
]);
