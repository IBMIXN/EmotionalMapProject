FROM node:12.21-alpine

LABEL description="Serve client files during development"

WORKDIR /usr/app

# Copy in node files and get node modules
COPY package*.json ./

RUN npm ci

# Copy client files onto server
COPY . .

# Expose the dev port
EXPOSE 3000

CMD ["npm", "start"]