import Stripe from "stripe";

interface CreateCheckoutParams {
  priceId: string;
  mode: Stripe.Checkout.SessionCreateParams.Mode;
  successUrl: string;
  cancelUrl: string;
  couponId?: string;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

// This is used to create a Stripe Checkout for one-time payments. It's usually triggered with the <ButtonCheckout /> component. Webhooks are used to update the user's state in the database.
export const createCheckout = async ({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  couponId,
  clientReferenceId,
  user,
}: CreateCheckoutParams): Promise<string | null> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

  const extraParams: Stripe.Checkout.SessionCreateParams = {};

  if (user?.customerId) {
    extraParams.customer = user.customerId;
  } else {
    if (mode === "payment") {
      extraParams.customer_creation = "always";
      // The option below costs 0.4% (up to $2) per invoice. Alternatively, you can use https://zenvoice.io/ to create unlimited invoices automatically.
      // extraParams.invoice_creation = { enabled: true };
      extraParams.payment_intent_data = { setup_future_usage: "on_session" };
    }
    if (user?.email) {
      extraParams.customer_email = user.email;
    }
    extraParams.tax_id_collection = { enabled: true };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    mode,
    allow_promotion_codes: true,
    client_reference_id: clientReferenceId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    discounts: couponId
      ? [
          {
            coupon: couponId,
          },
        ]
      : [],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...extraParams,
  });

  return stripeSession.url;
};

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({ customerId, returnUrl }: CreateCustomerPortalParams): Promise<string | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// This is used to get the user checkout session and populate the data so we get the planId the user subscribed to
export const findCheckoutSession = async (sessionId: string): Promise<Stripe.Checkout.Session | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
