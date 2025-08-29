import jwt from 'jsonwebtoken';
import { Context } from 'koa';

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    if (Date.now() >= decoded.exp * 1000) {
      throw new Error('Token has expired');
    }
    if (!decoded.id && !decoded.email && !decoded.type) {
      throw new Error('Token is invalid');
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }
    console.error('Error verifying token:', error);
    return null;
  }
}

export default (config, { strapi }) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const applyTo = config.applyTo || [];
    const exclude = config.exclude || [];
    // allow wildcards in applyTo like /api/database/*
    // allow wildcards in exclude like /api/database/limited
    const token = ctx.request.header.authorization?.split(" ")[1];

    if (
      !applyTo.some(pattern => pattern.test(ctx.path)) ||
      exclude.some(pattern => pattern.test(ctx.path))
    ) {
      // if token is set, then populate the user.
      if (token) {
        ctx.state.user = jwt.decode(token);
      }
      return next();
    }

    try {
      // Check if request is from allowed frontend URL
      const referer = ctx.request.header.referer;
      const origin = ctx.request.header.origin;
      const frontendUrl = strapi.config.get('server.frontendUrl');
      const backendUrl = strapi.config.get('server.url');
      const isDevelopmentEnvironment = process.env.NODE_ENV === 'development';

      if (!isDevelopmentEnvironment && (!frontendUrl || !(referer?.startsWith(backendUrl) || origin === frontendUrl))) {
        return ctx.forbidden('Invalid origin');
      }

      if (!token) {
        return ctx.badRequest('Token is required');
      }
      const decoded = verifyToken(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      /// refresh token if needed
      let needRefresh = false;
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      // Increase refresh window to 15 minutes
      const refreshThreshold = 15 * 60 * 1000; // 15 minutes in milliseconds

      if (currentTime >= (expirationTime - refreshThreshold)) {
        needRefresh = true;
        const newToken = jwt.sign(
          {
            id: decoded.id,
            email: decoded.email,
            type: decoded.type,
            time: Date.now()
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '2h' } // Increase token lifetime to 2 hours
        );
        ctx.state.token = newToken;
        ctx.state.refreshToken = true;
      } else {
        ctx.state.token = token;
      }

      ctx.state.user = decoded;

    } catch (error) {
      console.error('Error verifying token:', error);
      return ctx.unauthorized(error.message);
    }

    await next();

    // If token was refreshed, send it in both cookie and header
    if (ctx.state.refreshToken && ctx.status === 200) {
      // Set HTTP-only cookie for security
      ctx.cookies.set('authToken', ctx.state.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
      });

      // Also send in header for frontend to update
      ctx.set('X-New-Token', ctx.state.token);
    }
  }
}