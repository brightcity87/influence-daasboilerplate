import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Context } from 'koa';
import { verifyToken } from '../../../middlewares/daas-auth';

type RateLimiterType = 'free' | 'premium' | 'enterprise' | 'default';
type StringToRateLimiterType = Partial<Record<string, RateLimiterType>>;
type Config = {
  userTypeToRateLimiter?: StringToRateLimiterType;
  rateLimiter?: RateLimiterType;
};

// Define rate limits based on user types
const rateLimiters: Record<RateLimiterType, RateLimiterMemory> = {
  free: new RateLimiterMemory({
    points: 6, // Number of requests
    duration: 86400, // Per day
  }),
  premium: new RateLimiterMemory({
    points: 10, // Number of requests
    duration: 60, // Per day
  }),
  enterprise: new RateLimiterMemory({
    points: 100, // Number of requests
    duration: 60, // Per minute
  }),
  default: new RateLimiterMemory({
    points: 20, // Default number of requests
    duration: 60, // Default duration per minute
  }),
};

export default function webhookRateLimiter(config: Config, { strapi }) {
  return async (ctx: Context, next) => {
    // config contains a map of user types to the rate limiter
    const userTypeToRateLimiter: StringToRateLimiterType = config.userTypeToRateLimiter || ctx.state.route?.config?.userTypeToRateLimiter || {};

    const rateLimiterType: RateLimiterType = config.rateLimiter || ctx.state.route?.config?.rateLimiter;
    const ipAddr = ctx.request.headers['x-forwarded-for'] || ctx.request.ip;
    try {
      // Determine the user type from the context; default to 'default' if not set
      // if no user type is set, then we get to the free tier 
      let userType = 'free';
      let rateLimiter: RateLimiterMemory = rateLimiters[userType];
      // Check if request is from same server/environment
      const origin = ctx.request.headers['origin'];
      const userAgent = ctx.request.headers['user-agent'];
      const serverUrl = strapi.config.server.url;

      // First check if it's an internal request from the server itself
      const isInternalRequest = ctx.request.ip === '127.0.0.1' ||
        ctx.request.ip === '::1' ||
        ctx.request.headers['x-forwarded-for'] === '127.0.0.1';

      if (isInternalRequest) {
        strapi.log.info(`Rate limiting disabled for internal request (IP: ${ctx.request.ip})`);
        return next();
      }

      // Then check origin for browser requests
      if (origin) {
        try {
          const originUrl = new URL(origin);
          const serverUrlObj = new URL(serverUrl);

          if (originUrl.origin === serverUrlObj.origin) {
            strapi.log.info(`Rate limiting disabled for same-origin request (Origin: ${origin})`);
            return next();
          }
          strapi.log.debug(`Different origin request - Origin: ${origin}, UA: ${userAgent}`);
        } catch (e) {
          strapi.log.warn(`Invalid origin header: ${origin}`);
        }
      } else {
        strapi.log.debug(`No origin header present in request (UA: ${userAgent})`);
      }

      if (ctx.request.path === '/api/database/demo-filter') {
        userType = 'demo';
        rateLimiter = rateLimiters.default;
        ctx.state.user = {
          id: ipAddr,
          type: 'demo',
          email: 'demo@daasboilerplate.com',
          name: 'Demo User',
        }
        strapi.log.info(`Rate limiting set to default for demo request (IP: ${ipAddr})`);
        await rateLimiter.consume(ipAddr);
        return next();
      }
      // if the middleware is called without the daas-auth middleware, then we get the user from the token
      if (!ctx.state.user && ctx.request.header['Authorization']) {
        const token = ctx.request.header['Authorization'].split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded) {
          ctx.state.user = decoded;
        }
      }

      if (rateLimiterType) {
        rateLimiter = rateLimiters[rateLimiterType];
      } else if (ctx.state.user && ctx.state.user.type) {
        userType = ctx.state.user.type;
        if (userTypeToRateLimiter[userType]) {
          rateLimiter = rateLimiters[userTypeToRateLimiter[userType]];
        }
        if (rateLimiters[userType]) {
          rateLimiter = rateLimiters[userType];
        }
        if (!rateLimiters[userType]) {
          rateLimiter = rateLimiters.default;
        }
      } else if (ctx.state.user) {
        userType = 'default'
        rateLimiter = rateLimiters.default;
      }

      // Use IP address as the key for rate limiting

      // Consume a point for the IP address
      if (process.env.NODE_ENV === 'development') {
        strapi.log.info(`Rate limiting disabled for development---rate-applied ${userType}`);
        return next();
      }
      strapi.log.debug(`Rate limiting check: IP: ${ipAddr}, User Type: ${userType}`);
      await rateLimiter.consume(ipAddr);

      // Proceed to the next middleware or controller
      return next();
    } catch (err) {
      // If rate limit is exceeded, send a 429 response
      ctx.status = 429;
      return ctx.send({
        error: 'Too many requests, please try again later.',
        details: err.message
      });
    }
  };
};
