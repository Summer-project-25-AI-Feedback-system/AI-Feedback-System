# Base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install git (and any other necessary tools)
RUN apk add --no-cache git

# Install global CLI: repomix
RUN npm install -g repomix

# Copy package files and install deps
COPY ./server/package*.json ./server/
RUN cd server && npm install

# Copy server code and shared interfaces
COPY ./server ./server
COPY ./shared ./shared

# Build backend
RUN cd server && npm run build

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "dist/index.js"]