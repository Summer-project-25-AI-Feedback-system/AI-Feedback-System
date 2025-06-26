# Base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install git (and any other necessary tools)
RUN apk add --no-cache git

# Copy package files for client only
COPY ./client/package*.json ./client/

# Install client dependencies
RUN cd client && npm install

# Copy entire folders needed for build (client, server, shared)
COPY ./client ./client
COPY ./shared ./shared

WORKDIR /app/client
CMD ["npm", "run", "dev"]
