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
        },
        handler: 'database.getRows', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/sync',
        config: {
            auth: false,
        },
        handler: 'database.sync', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/filter',
        config: {
            auth: false,
        },
        handler: 'database.filter', // This should be a function in your controller
    },
    {
        method: 'POST',
        path: '/database/limited',
        config: {
            auth: false,
        },
        handler: 'database.limited', // This should be a function in your controller
    }
]);