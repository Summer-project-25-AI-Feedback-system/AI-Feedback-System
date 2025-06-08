# 1. Base image
FROM node:22-alpine
LABEL org.opencontainers.image.source="https://github.com/Summer-project-25-AI-Feedback-system/AFS"

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY server/package*.json ./server/
RUN cd server && npm install

# 4. Copy server code and shared interfaces
COPY . .

# 5. Build TypeScript
RUN cd server && npm run build

# 6. Expose port
EXPOSE 5000

# 7. Start app
CMD ["node", "dist/index.js"]
