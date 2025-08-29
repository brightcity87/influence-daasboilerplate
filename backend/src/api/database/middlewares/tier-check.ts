import { Context } from 'koa';

interface Settings {
  searchLimit: number;
  exportLimit: number;
  apiAccess: 'none' | 'limited' | 'unlimited';
  allowedDataColumns: string[];
  allowCopy: boolean;
  allowExport: boolean;
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
  period: 'month' | 'year' | 'weekly' | 'daily' | 'lifetime';
  maxRecords: number;
}
export const demoUser = {
  id: 'demo',
  type: 'demo',
  email: 'demo@demo.com',
  username: 'demo',
  allowance: {
    searchCount: 0,
    exportCount: 0,
  }
}

export const demoTierSettings = {
  searchLimit: 10,
  exportLimit: 1,
  apiAccess: 'none',
  allowedDataColumns: ['*'],
  allowCopy: false,
  allowExport: true,
  supportLevel: 'community',
  period: 'lifetime',
  maxRecords: 500,
}
export default (config, { strapi }) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      // if the request is for the demo-filter route, then we need to set the tier settings to the demo settings
      if (ctx.request.path === '/api/database/demo-filter') {
        ctx.state.tierSettings = demoTierSettings;
        ctx.state.user = demoUser;
        return next();
      }

      // Get the user from context
      const userJWT = ctx.state.user;
      if (!userJWT) {
        return ctx.unauthorized('You must be logged in');
      }

      // Normalize host and server URL by removing protocol
      const requestHost = ctx.request.headers['host']?.replace(/^https?:\/\//, '');
      const serverUrl = strapi.config.server.url?.replace(/^https?:\/\//, '');

      if (requestHost === serverUrl) {
        ctx.state.tierSettings = {
          searchLimit: 0,
          exportLimit: 0,
          apiAccess: 'unlimited',
          allowedDataColumns: ['*'],
          allowCopy: true,
          allowExport: true,
          supportLevel: 'dedicated',
          period: 'month',
          maxRecords: 0,
        }
        return next();
      }

      if (!userJWT.type) {
        return ctx.unauthorized('Your subscription is not active');
      }


      // Get the subscription tier settings
      const product = await strapi.query('api::product.product').findOne({
        where: { priceId: userJWT.type },
        populate: ['subscriptionSettings']
      });

      if (!product) {
        return ctx.unauthorized('No subscription tier found');
      }
      const requiredFeatures = ctx.state.route.config.requiredFeatures || [];
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { id: userJWT.id },
      });

      if (!user.allowance) {
        user.allowance = {
          searchCount: 0,
          exportCount: 0,
        };
      }

      // Get the required features from the route config
      const settings = product.subscriptionSettings;
      // Check each required feature
      for (const feature of requiredFeatures) {
        switch (feature) {
          case 'searchLimit':
            if (settings.searchLimit === 0) continue; // Unlimited

            const currentSearches = user.allowance.searchCount || 0;

            if (currentSearches >= settings.searchLimit && ctx.request.body.searchTerm !== '') {
              return ctx.forbidden('Search limit exceeded for your subscription tier');
            }
            break;

          case 'allowExport':
            if (!settings.allowExport) {
              return ctx.forbidden('Export not allowed for your subscription tier');
            }
            if (!ctx.request.body.exportType) {
              ctx.request.body.exportType = 'csv';
            }
            if (settings.allowedExportTypes && settings.allowedExportTypes.length > 0) {
              if (!settings.allowedExportTypes.includes(ctx.request.body.exportType)) {
                return ctx.forbidden('Export type not allowed for your subscription tier');
              }
            } else {

              if (ctx.request.body.exportType !== 'csv') {
                return ctx.forbidden('Export type not allowed for your subscription tier');
              }
            }

            if (settings.exportLimit > 0) {
              const currentExports = user.allowance.exportCount || 0;

              if (currentExports >= settings.exportLimit) {
                return ctx.forbidden('Export limit exceeded for your subscription tier');
              }
            }
            break;

          case 'allowCopy':
            if (!settings.allowCopy) {
              return ctx.forbidden('Copy not allowed for your subscription tier');
            }
            break;

          default:
            ctx.throw(400, `Unknown feature check: ${feature}`);
        }
      }

      // Store settings in context for later use
      ctx.state.tierSettings = settings;
      if (settings.maxRecords > 0) {
        ctx.state.tierSettings.maxRecords = parseInt(settings.maxRecords, 10);
      }
      // run the controller
      await next();
      // update the allowance after the request is made

      const defaultRequest = {
        "page": 1,
        "pageSize": 25,
        "filteredOptions": {},
        "searchTerm": "",
        "sorting": []
      }
      const request = ctx.request.body || defaultRequest
      // check if request is a default request if it is then we don't need to update the allowance
      if (ctx.request.path === '/api/database/filter') {
        if (request.page === 1
          && request.pageSize === 25
          && Object.keys(request.filteredOptions || {}).length === 0
          && request.searchTerm === ""
          && Array.isArray(request.sorting || [])
          && request.sorting.length === 0) {
          return;
        };
      }


      let allowUpdate = false;
      for (const feature of requiredFeatures) {
        switch (feature) {
          case 'searchLimit':
            if (ctx.request.body.searchTerm !== '') {
              user.allowance.searchCount += 1;
              allowUpdate = true;
            }
            break;
          case 'allowExport':
            user.allowance.exportCount += 1;
            allowUpdate = true;
            break;
          case 'copyLimit':
            user.allowance.copyCount += 1;
            allowUpdate = true;
            break;
        }
      }
      if (allowUpdate) {
        strapi.log.info(`Updating allowance for user ${userJWT.id}`);
        await strapi.query('plugin::users-permissions.user').update({
          where: { id: userJWT.id },
          data: { allowance: user.allowance },
        });
      }
    } catch (error) {
      console.error('Error in tier-check middleware:', error);
      return ctx.throw(500, 'Internal server error during tier check');
    }
  }
}
