/**
 * config router
 */

import { factories } from '@strapi/strapi';

const defaultRoutes = factories.createCoreRouter('api::config.config');
// allow predefined routes and add custom routes  

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

export default customRouter(defaultRoutes, [
  {
    method: 'GET',
    path: '/me/tier-config',
    handler: 'config.tierConfig',
    config: {
      auth: false,
      middlewares: ['global::daas-auth'],
    }
  },
]);
