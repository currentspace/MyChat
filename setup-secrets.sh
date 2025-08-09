#!/bin/bash

# Setup script for MyChat Cloudflare secrets
# Run this script to configure all required secrets for production

echo "🔐 MyChat Secrets Setup"
echo "======================="
echo ""
echo "This script will help you add the required secrets to your Cloudflare Worker."
echo "You'll need:"
echo "  1. Your Google OAuth Client ID"
echo "  2. A JWT secret (we'll generate one for you)"
echo "  3. Optional: AI API keys (OpenAI/Anthropic)"
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
echo "Generated JWT Secret: $JWT_SECRET"
echo ""

# Function to add secret
add_secret() {
    local secret_name=$1
    local secret_value=$2
    local env=${3:-production}
    
    echo "Adding $secret_name to $env environment..."
    echo "$secret_value" | wrangler secret put "$secret_name" --env "$env"
}

# Check if running in production or development
read -p "Are you setting up for production? (y/n): " -n 1 -r
echo ""
ENV="production"
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    ENV="development"
fi

echo ""
echo "Setting up secrets for $ENV environment"
echo "========================================"

# Google OAuth setup
echo ""
echo "📱 Google OAuth Setup"
echo "--------------------"
echo "Get your Client ID from: https://console.cloud.google.com/"
echo "Make sure to add these to your OAuth client:"
if [ "$ENV" = "production" ]; then
    echo "  - Authorized JavaScript origins: https://mychat.current.space"
    echo "  - Authorized redirect URIs: https://mychat.current.space"
else
    echo "  - Authorized JavaScript origins: http://localhost:8787"
    echo "  - Authorized redirect URIs: http://localhost:8787"
fi
echo ""
read -p "Enter your Google Client ID: " GOOGLE_CLIENT_ID
if [ ! -z "$GOOGLE_CLIENT_ID" ]; then
    add_secret "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID" "$ENV"
fi

# JWT Secret
echo ""
echo "🔑 JWT Secret"
echo "-------------"
read -p "Use generated JWT secret? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    add_secret "JWT_SECRET" "$JWT_SECRET" "$ENV"
else
    read -p "Enter your JWT secret: " CUSTOM_JWT
    add_secret "JWT_SECRET" "$CUSTOM_JWT" "$ENV"
fi

# Optional: AI API Keys
echo ""
echo "🤖 AI Provider Setup (Optional)"
echo "-------------------------------"
read -p "Do you want to set up AI providers? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # OpenAI
    echo ""
    echo "OpenAI Setup"
    echo "Get your API key from: https://platform.openai.com/api-keys"
    read -p "Enter OpenAI API Key (or press Enter to skip): " OPENAI_KEY
    if [ ! -z "$OPENAI_KEY" ]; then
        add_secret "OPENAI_API_KEY" "$OPENAI_KEY" "$ENV"
        add_secret "OPENAI_MODEL" "gpt-4-turbo-preview" "$ENV"
    fi
    
    # Anthropic
    echo ""
    echo "Anthropic Setup"
    echo "Get your API key from: https://console.anthropic.com/"
    read -p "Enter Anthropic API Key (or press Enter to skip): " ANTHROPIC_KEY
    if [ ! -z "$ANTHROPIC_KEY" ]; then
        add_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_KEY" "$ENV"
        add_secret "ANTHROPIC_MODEL" "claude-3-opus-20240229" "$ENV"
    fi
fi

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "To verify your secrets are set, run:"
echo "  wrangler secret list --env $ENV"
echo ""
echo "To deploy your app, run:"
if [ "$ENV" = "production" ]; then
    echo "  pnpm build && wrangler deploy --env production"
else
    echo "  pnpm dev  # For local development"
    echo "  pnpm wrangler dev  # For local Worker development"
fi
echo ""
echo "Your app will be available at:"
if [ "$ENV" = "production" ]; then
    echo "  https://mychat.current.space"
else
    echo "  http://localhost:8787"
fi