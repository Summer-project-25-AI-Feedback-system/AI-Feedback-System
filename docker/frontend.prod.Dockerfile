# Base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install git (and any other necessary tools)
RUN apk add --no-cache git

# Copy package files and install deps
COPY ./client/package*.json ./

# Install dependencies
RUN npm install

# Copy entire folders needed for build (client, server, shared)
COPY ./client ./client
COPY ./shared ./shared

# Build frontend
RUN cd client && npm run build

# (Optional) Use nginx to serve the built files
FROM nginx:alpine

# Set working directory for clarity
WORKDIR /usr/share/nginx/html

# Copy built files into nginx html dir
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy custom nginx config
COPY ./docker/nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
