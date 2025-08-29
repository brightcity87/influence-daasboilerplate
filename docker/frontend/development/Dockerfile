FROM node:18.17-alpine

ENV PORT ${FRONTEND_PORT}

# where our Next.js app will live
RUN mkdir -p /app

# Set /app as the working directory
WORKDIR /app

# Copy package.json and package-lock.json
# to the /app working directory
COPY ./frontend/package.json /app/
COPY ./backend/.env /app/.env

# Install dependencies in /app
RUN yarn config set network-timeout 600000 -g && yarn install
RUN yarn add sharp --ignore-engines

# Copy the rest of our Next.js folder into /app
COPY ./frontend /app


# Ensure port 3005 is accessible to our system
EXPOSE ${FRONTEND_PORT}

# Run yarn dev, as we would via the command line 
CMD [ "yarn", "dev" ]