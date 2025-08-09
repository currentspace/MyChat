#!/bin/bash

# Script to add AI provider secrets for chat functionality
# Supports OpenAI and Anthropic APIs

echo "🤖 AI Provider Secrets Setup"
echo "============================"
echo ""
echo "This script will add AI provider secrets for chat functionality"
echo "You can set up one or both providers (recommended: both for fallback)"
echo ""

# Function to add secret to both environments
add_ai_secret() {
    local secret_name=$1
    local secret_value=$2
    
    echo "Adding $secret_name..."
    echo "$secret_value" | pnpm wrangler secret put "$secret_name" 2>/dev/null
    echo "$secret_value" | pnpm wrangler secret put "$secret_name" --env production 2>/dev/null
    echo "✓ $secret_name added to both environments"
}

# OpenAI Setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📘 OpenAI Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get your API key from: https://platform.openai.com/api-keys"
echo "Leave blank to skip OpenAI setup"
echo ""
read -p "Enter your OpenAI API Key (sk-...): " OPENAI_KEY

if [ ! -z "$OPENAI_KEY" ]; then
    add_ai_secret "OPENAI_API_KEY" "$OPENAI_KEY"
    
    echo ""
    echo "Select OpenAI model:"
    echo "1) gpt-4-turbo-preview (Best, ~\$0.01/1K input)"
    echo "2) gpt-4o (Faster, ~\$0.005/1K input)"
    echo "3) gpt-3.5-turbo (Cheapest, ~\$0.0005/1K input)"
    read -p "Choice (1-3, default=1): " MODEL_CHOICE
    
    case "$MODEL_CHOICE" in
        2) MODEL="gpt-4o" ;;
        3) MODEL="gpt-3.5-turbo" ;;
        *) MODEL="gpt-4-turbo-preview" ;;
    esac
    
    add_ai_secret "OPENAI_MODEL" "$MODEL"
    echo "✅ OpenAI configured with model: $MODEL"
else
    echo "⏭️  Skipping OpenAI setup"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧠 Anthropic Claude Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Get your API key from: https://console.anthropic.com/"
echo "Leave blank to skip Anthropic setup"
echo ""
read -p "Enter your Anthropic API Key (sk-ant-...): " ANTHROPIC_KEY

if [ ! -z "$ANTHROPIC_KEY" ]; then
    add_ai_secret "ANTHROPIC_API_KEY" "$ANTHROPIC_KEY"
    
    echo ""
    echo "Select Claude model:"
    echo "1) claude-3-opus-20240229 (Best, ~\$0.015/1K input)"
    echo "2) claude-3-5-sonnet-20241022 (Balanced, ~\$0.003/1K input)"
    echo "3) claude-3-haiku-20240307 (Fastest, ~\$0.00025/1K input)"
    read -p "Choice (1-3, default=2): " MODEL_CHOICE
    
    case "$MODEL_CHOICE" in
        1) MODEL="claude-3-opus-20240229" ;;
        3) MODEL="claude-3-haiku-20240307" ;;
        *) MODEL="claude-3-5-sonnet-20241022" ;;
    esac
    
    add_ai_secret "ANTHROPIC_MODEL" "$MODEL"
    echo "✅ Anthropic configured with model: $MODEL"
else
    echo "⏭️  Skipping Anthropic setup"
fi

# Optional: Set up KV namespace for chat history
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💾 Chat History Storage (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Set up KV storage for chat history? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating KV namespace..."
    KV_OUTPUT=$(pnpm wrangler kv namespace create CHAT_HISTORY 2>&1)
    KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)
    
    if [ ! -z "$KV_ID" ]; then
        echo ""
        echo "✅ KV namespace created!"
        echo ""
        echo "Add this to your wrangler.toml:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "[[kv_namespaces]]"
        echo "binding = \"CHAT_HISTORY\""
        echo "id = \"$KV_ID\""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    else
        echo "⚠️  KV namespace may already exist or creation failed"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Production environment secrets:"
pnpm wrangler secret list --env production

echo ""
echo "✅ AI Provider setup complete!"
echo ""
echo "Your chat interface at https://mychat.current.space will now:"
if [ ! -z "$OPENAI_KEY" ]; then
    echo "  • Support OpenAI GPT models"
fi
if [ ! -z "$ANTHROPIC_KEY" ]; then
    echo "  • Support Anthropic Claude models"
fi
echo "  • Allow users to switch between providers"
echo "  • Fall back if one provider fails"
echo ""
echo "Deploy changes with: git push (GitHub Actions will auto-deploy)"