# Base image
FROM node:22-alpine

# Install git (and any other necessary tools)
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Install global CLI: repomix
RUN npm install -g repomix

# Copy package files and install deps
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy server code and shared interfaces
COPY . .

# Build TypeScript
WORKDIR /app/server
RUN npm run build

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "dist/server/index.js"]