/**
 * config controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::config.config', ({ strapi }) => ({
  async tierConfig(ctx) {
    if (!ctx.state.user) {
      return ctx.forbidden('User not found');
    }
    const jwtUser = ctx.state.user;
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: {
        id: jwtUser.id
      },
      populate: {
        subscriptionTier: {
          populate: {
            subscriptionSettings: true
          }
        }
      }
    });
    if (!user) {
      return ctx.badRequest('User not found');
    }
    const tierSettings = {
      csc: user.allowance.searchCount,
      cec: user.allowance.exportCount,
      cel: user.allowance.exportLimit,
      caa: user.allowance.apiAccess,
      tsc: user.subscriptionTier.subscriptionSettings.searchLimit,
      tel: user.subscriptionTier.subscriptionSettings.exportLimit,
      tef: user.subscriptionTier.subscriptionSettings.allowedExportTypes,
      tae: user.subscriptionTier.subscriptionSettings.allowExport,
      taa: user.subscriptionTier.subscriptionSettings.allowCopy
    }
    return ctx.send(tierSettings);
  }
}));
