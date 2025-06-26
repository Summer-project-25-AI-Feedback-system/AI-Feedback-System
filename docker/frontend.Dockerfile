FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
RUN apk add --no-cache git

# Copy package files for client only
COPY ./client/package*.json ./client/

# Install client dependencies
RUN cd client && npm install

# Copy entire folders needed for build (client, server, shared)
COPY ./client ./client
COPY ./server ./server
COPY ./shared ./shared

# Build frontend inside client folder
RUN cd client && npm run build

# (Optional) Use nginx to serve the built files
FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
