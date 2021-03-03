FROM node:14-alpine

LABEL description="Serve client files during development"
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Copy in node files and get node modules
COPY package*.json ./

USER node

RUN npm ci

# Copy client files onto server
COPY --chown=node:node . .

# Expose the dev port
EXPOSE 3000

CMD ["npm", "start"]