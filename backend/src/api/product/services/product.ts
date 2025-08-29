/**
 * product service
 */

import { factories } from '@strapi/strapi';


export default factories.createCoreService('api::product.product', ({ strapi }) => ({
  // async updateSubscription(subscription) {
  //   const customerId = subscription.customerId;
  //   const tierId = subscription.productId; // Assuming price.product maps to tier

  //   // Find the user based on customerId
  //   const user = await strapi.entityService.findMany('plugin::users-permissions.user', {
  //     filters: { customerId: customerId },
  //   });

  //   if (user.length === 0) return;

  //   // Update subscription details
  //   await strapi.entityService.update('plugin::users-permissions.user', user[0].id, {
  //     data: {
  //       subscriptionTier: tierId,
  //       subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
  //       subscriptionStartDate: new Date(subscription.start_date * 1000).toISOString(),
  //       subscriptionEndDate: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
  //     },
  //   });
  // },
}));
