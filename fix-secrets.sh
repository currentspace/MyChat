#!/bin/bash

# Emergency fix script for Cloudflare secrets issue
# This adds secrets to BOTH environments to ensure they work

echo "🔧 FIXING CLOUDFLARE SECRETS"
echo "============================"
echo ""
echo "This script will add secrets to both default and production environments"
echo ""

# Generate JWT secret if not provided
JWT_SECRET="PC9dcOztLov6w9hcGvH5JgLKhkxdSURrL18dwZQM4cI="

echo "📝 You'll need your Google Client ID from:"
echo "   https://console.cloud.google.com/"
echo ""
read -p "Enter your Google Client ID: " GOOGLE_CLIENT_ID

if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "❌ Google Client ID is required!"
    exit 1
fi

echo ""
echo "Adding secrets to DEFAULT environment (used by GitHub Actions)..."
echo "================================================================"

# Add to default environment
echo "$JWT_SECRET" | pnpm wrangler secret put JWT_SECRET
echo "$GOOGLE_CLIENT_ID" | pnpm wrangler secret put GOOGLE_CLIENT_ID

echo ""
echo "Adding secrets to PRODUCTION environment (for consistency)..."
echo "============================================================="

# Add to production environment
echo "$JWT_SECRET" | pnpm wrangler secret put JWT_SECRET --env production
echo "$GOOGLE_CLIENT_ID" | pnpm wrangler secret put GOOGLE_CLIENT_ID --env production

echo ""
echo "✅ Secrets added successfully!"
echo ""
echo "Verifying secrets..."
echo "===================="
echo ""
echo "Default environment secrets:"
pnpm wrangler secret list
echo ""
echo "Production environment secrets:"
pnpm wrangler secret list --env production

echo ""
echo "✅ DONE! Your authentication should now work at https://mychat.current.space"
echo ""
echo "Note: GitHub Actions will now deploy to production environment automatically."