#!/bin/bash
# Deploy script para VPS DigitalOcean
# Solo backend (BD en Neon, no necesita PostgreSQL local)
#
# Uso en el VPS: ./deploy.sh
# Uso desde GitHub Actions: ssh user@host 'bash -s' < deploy.sh

set -e

cd /opt/cenit

echo "=== Pull latest code ==="
git pull origin main

echo "=== Build & restart backend ==="
docker compose build backend
docker compose up -d --force-recreate

echo "=== Clean old images ==="
docker image prune -f

echo "=== Health check ==="
sleep 10
curl -f http://localhost:8080/actuator/health || echo "WARNING: health check failed, revisa los logs"

echo "=== Done ==="
docker compose ps
