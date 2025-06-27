# Base image
FROM node:22-alpine

# Install git (and any other necessary tools)
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Install global CLI: repomix
RUN npm install -g repomix

# Copy package files and install deps
# COPY server/package*.json ./server/
COPY ./server/package*.json ./
RUN npm install


# Copy server code and shared interfaces
COPY ./server ./server
COPY ./shared ./shared

# Build backend
RUN cd server && npm run build

# Set working directory to built code
WORKDIR /app/server

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "dist/server/index.js"]