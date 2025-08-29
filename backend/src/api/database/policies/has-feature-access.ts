/**
 * hasFeatureAccess policy
 */

export default async (policyContext, config, { strapi }) => {
  // Add your own logic here.

  const user = policyContext.state.user;

  if (user && !!user.id) {
    return true;
  }
  return false;
};
