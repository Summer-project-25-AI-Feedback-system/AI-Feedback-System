# 1. Base image
FROM node:22-alpine
LABEL org.opencontainers.image.source="https://github.com/Summer-project-25-AI-Feedback-system/AFS"

# 2. Set working directory
WORKDIR /app

# 3. Copy package files and install deps
COPY package*.json ./
RUN npm install

# 4. Copy the rest of the server files
COPY . .

# 5. Build TypeScript
RUN npm run build

# 6. Expose the port (match .env)
EXPOSE 5000

# 7. Start the server
CMD ["npm", "start"]
