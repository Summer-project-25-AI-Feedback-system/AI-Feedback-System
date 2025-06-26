# Base image
FROM node:22-alpine AS builder

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

# Build frontend
RUN cd client && npm run build

# (Optional) Use nginx to serve the built files
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
