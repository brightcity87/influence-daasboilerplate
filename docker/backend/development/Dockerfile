FROM node:18-alpine

# Installing libvips-dev and other dependencies for sharp compatibility
RUN apk update \
    && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git \
    && yarn global add node-gyp

# Set environment variables
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV PATH /app/node_modules/.bin:$PATH

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY ./backend/package.json /app/
COPY ./backend/yarn.lock /app/

# Set yarn network timeout and install dependencies
RUN yarn config set network-timeout 600000 -g && yarn install
RUN yarn add nodemailer

# Copy the rest of the Strapi project
COPY ./backend /app

# Change ownership of /app to user node
RUN chown -R node:node /app

# Switch to user node
USER node

# # Build the Strapi project
# RUN ["yarn", "start"]

# Expose ports
EXPOSE ${BACKEND_PORT}

# Run the Strapi app in development mode
CMD ["yarn", "develop", "--watch-admin"]
