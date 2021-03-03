FROM node:12.21-alpine as client

WORKDIR /usr/app/client/

# Copy node files
COPY client/package*.json ./

RUN npm ci

# Copy client code
COPY client/ ./

# Build client
RUN npm run build


# Backend
FROM node:12.21-alpine

# Copy client build into /usr/app/client/build on this container
WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/

# Move into server folder and copy node files
WORKDIR /usr/app/server/
COPY server/package*.json ./
# Install deps for server
RUN npm ci --production
# Copy server code to container
COPY server/ ./

# Set port environment variable
ENV PORT 8080
EXPOSE 8080

# Run the express server
CMD ["npm", "start"]