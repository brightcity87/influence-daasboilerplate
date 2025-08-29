import { Context } from 'koa';
import Stripe from 'stripe';
const unparsed = require('koa-body/unparsed.js');

export default async (policyContext, config, { strapi }) => {
  try {
    const signature = policyContext.request.headers['stripe-signature'];
    if (!signature) {
      return false;
    }

    const webhookSecret = strapi.config.server.stripe.webhookSecret;
    if (!webhookSecret) {
      return false;
    }

    const stripe = new Stripe(strapi.config.server.stripe.secretKey, {
      apiVersion: '2024-06-20'
    });
    try {
      // Verify the webhook signature
      stripe.webhooks.constructEvent(
        policyContext.request.body[unparsed],
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(err)
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};
