#!/bin/bash

# This is a simplified Chatwoot setup script
# It will pull and run the official Chatwoot Docker image with all dependencies

set -e

echo "Setting up Chatwoot with Docker..."

# Create network
docker network create chatwoot-network || true

# Start PostgreSQL
docker run -d \
  --name chatwoot-postgres \
  --network chatwoot-network \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=chatwoot_production \
  -v chatwoot-postgres:/var/lib/postgresql/data \
  postgres:12

# Start Redis
docker run -d \
  --name chatwoot-redis \
  --network chatwoot-network \
  redis:alpine

# Wait for PostgreSQL to start
sleep 10

# Start Chatwoot
docker run -d \
  --name chatwoot-web \
  --network chatwoot-network \
  -e RAILS_ENV=production \
  -e NODE_ENV=production \
  -e POSTGRES_HOST=chatwoot-postgres \
  -e POSTGRES_USERNAME=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DATABASE=chatwoot_production \
  -e REDIS_URL=redis://chatwoot-redis:6379 \
  -e SECRET_KEY_BASE=chatwootdev123 \
  -e FRONTEND_URL=http://localhost:3031 \
  -e ENABLE_ACCOUNT_SIGNUP=true \
  -e RAILS_LOG_TO_STDOUT=true \
  -p 3031:3000 \
  chatwoot/chatwoot:latest \
  sh -c "bundle exec rails db:prepare && bundle exec rails db:migrate && bundle exec rake setup && bundle exec rails s -p 3000 -b 0.0.0.0"

echo "Chatwoot should now be available at http://localhost:3031"
echo "Initial setup may take a few minutes to complete"
