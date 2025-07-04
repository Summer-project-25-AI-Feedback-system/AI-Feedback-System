#!/usr/bin/env bash
set -e

echo ""
echo "----> 🗑️ Removing stopped containers... <----"
docker container prune -f

echo ""
echo "----> 🗑️ Removing dangling build cache... <----"
docker builder prune -f

echo ""
echo "----> 🚀 Building images without cache... <----"
docker compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "----> 📤 Pushing frontend image... <----"
docker push ghcr.io/summer-project-25-ai-feedback-system/afs-frontend:latest

echo ""
echo "----> 📤 Pushing backend image... <----"
docker push ghcr.io/summer-project-25-ai-feedback-system/afs-backend:latest

echo ""
echo "----> 🗑️ Removing dangling images... <----"
docker image prune -f

echo ""
echo "✅ Done!"
