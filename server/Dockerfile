FROM node:12.21-alpine

LABEL description="Serve server for Emotion Map during development"

WORKDIR /usr/app

# Copy in node files and get node modules

COPY package*.json ./

RUN npm ci

# Copy server files onto server
COPY . .

# Expose the server port
ENV PORT 8080
EXPOSE 8080
CMD ["npm", "run", "dev"]