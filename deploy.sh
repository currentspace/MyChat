#!/bin/bash
# Deployment script for Cloudflare Workers

echo "Building project..."
pnpm build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo "Deploying to Cloudflare Workers..."
pnpm wrangler deploy

echo "Deployment complete!"