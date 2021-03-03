FROM node:14-alpine

LABEL description="Serve server for Emotion Map during development"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Copy in node files and get node modules

COPY package*.json ./

USER node

RUN npm ci

# Copy server files onto server
COPY --chown=node:node . .

# Expose the server port
ENV PORT 8080
EXPOSE 8080

CMD ["npm", "run", "dev"]