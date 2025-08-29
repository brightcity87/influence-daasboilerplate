FROM node:18-alpine

# Add the required repositories and install vips-dev
RUN apk update \
    && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git > /dev/null 2>&1 \
    && yarn global add node-gyp

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

# Copy package.json and yarn.lock
COPY ./backend/package.json /app/
COPY ./backend/yarn.lock /app/

# Set yarn network timeout and install dependencies
RUN yarn config set network-timeout 600000 -g && yarn install

# Copy the rest of the Strapi project
COPY ./backend /app

# Create uploads directory and set permissions
# This is needed for Strapi to be able to write to the uploads directory
# RUN mkdir -p /app/public/uploads && chmod 777 /app/public/uploads

# Change ownership of /app to user node
RUN chown -R node:node /app


# Switch to user node
USER node

RUN yarn build

# Expose ports
EXPOSE ${BACKEND_PORT}

# Build the Strapi project
CMD ["yarn", "start"]
