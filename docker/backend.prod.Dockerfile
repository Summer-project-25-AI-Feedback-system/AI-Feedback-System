# Base image
FROM node:22-alpine AS builder

# Install git (and any other necessary tools)
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Install global CLI: repomix
RUN npm install -g repomix


# Copy package files and install deps
COPY ./server/package*.json ./
RUN npm install

# Copy server code and shared interfaces
COPY ./server ./server
COPY ./shared ./shared

# Build backend
RUN cd server && npm run build


# production runtime
FROM node:22-alpine

# Set working directory to built code
WORKDIR /app

# Install global CLI (again if needed)
RUN npm install -g repomix

# Copy only built output and package.json for runtime
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package*.json ./

# Install production deps
RUN npm install --production

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "dist/server/index.js"]