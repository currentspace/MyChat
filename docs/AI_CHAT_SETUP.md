# AI Chat Setup Guide

## Overview
MyChat now supports AI-powered conversations using either OpenAI (GPT-4) or Anthropic (Claude 3). The chat interface includes:
- 🤖 Multiple AI provider support
- 📍 Location-aware responses
- 💬 Conversation history
- 🔄 Session management
- ⚡ Streaming responses (optional)

## Quick Setup

### 1. Choose Your AI Provider

#### Option A: OpenAI (GPT-4)
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add to Cloudflare secrets:
```bash
wrangler secret put OPENAI_API_KEY
# Enter: sk-...your-key...

wrangler secret put OPENAI_MODEL
# Enter: gpt-4-turbo-preview (or gpt-3.5-turbo for cheaper option)
```

#### Option B: Anthropic (Claude 3)
1. Get API key from [Anthropic Console](https://console.anthropic.com/)
2. Add to Cloudflare secrets:
```bash
wrangler secret put ANTHROPIC_API_KEY
# Enter: sk-ant-...your-key...

wrangler secret put ANTHROPIC_MODEL
# Enter: claude-3-opus-20240229 (or claude-3-sonnet-20240229 for faster)
```

#### Option C: Both Providers
Set up both for automatic fallback and provider selection.

### 2. Optional: Enable Chat History (Recommended)

Create a KV namespace to store conversation history:

```bash
# Create the namespace
wrangler kv:namespace create CHAT_HISTORY

# Output will show:
# id = "abc123..."

# Add to wrangler.toml:
[[kv_namespaces]]
binding = "CHAT_HISTORY"
id = "abc123..." # Use the ID from above
```

### 3. Deploy

```bash
pnpm build
pnpm wrangler deploy
```

## Features

### Location-Aware Responses
When users enable location sharing, the AI can provide:
- Local recommendations
- Distance calculations
- Area-specific information
- Weather and events

### Conversation Memory
With KV storage enabled:
- Remembers last 20 messages per session
- Context carries across page refreshes
- Sessions expire after 7 days
- New chat button clears history

### Provider Selection
Users can switch between providers in the chat interface:
- GPT-4: Better for complex reasoning
- Claude 3: Better for creative writing and analysis
- Automatic fallback if one fails

## API Endpoints

### Standard Chat
```javascript
POST /api/chat
{
  "message": "Hello, how are you?",
  "sessionId": "uuid-here",
  "location": { "lat": 37.7749, "lng": -122.4194 },
  "provider": "openai" // or "anthropic"
}
```

### Streaming Chat (Future)
```javascript
POST /api/chat/stream
// Same body, returns Server-Sent Events stream
```

## Cost Optimization

### OpenAI Pricing (as of 2025)
- GPT-4 Turbo: ~$0.01 per 1K input tokens, $0.03 per 1K output
- GPT-3.5 Turbo: ~$0.0005 per 1K input, $0.0015 per 1K output

### Anthropic Pricing (as of 2025)
- Claude 3 Opus: ~$0.015 per 1K input, $0.075 per 1K output
- Claude 3 Sonnet: ~$0.003 per 1K input, $0.015 per 1K output

### Tips to Reduce Costs
1. Use GPT-3.5 or Claude Sonnet for simple queries
2. Implement rate limiting per user
3. Cache common responses in KV
4. Limit max tokens to 1000
5. Clear old sessions regularly

## Security Best Practices

1. **Never expose API keys in frontend code**
2. **Implement rate limiting**:
```javascript
// In your Worker
const { success } = await env.RATE_LIMITER.limit({ 
  key: `chat_${userId}`,
  limit: 50, // 50 requests
  interval: 3600 // per hour
})
```

3. **Validate and sanitize inputs**
4. **Monitor usage** via provider dashboards
5. **Set spending limits** in provider accounts

## Troubleshooting

### "API key not configured"
- Ensure secrets are set: `wrangler secret list`
- Check environment: `--env production`

### "Rate limit exceeded"
- Check provider dashboard for limits
- Implement client-side throttling
- Consider upgrading API tier

### "Context length exceeded"
- Reduce conversation history
- Decrease max_tokens setting
- Clear old sessions

### Responses are slow
- Switch to faster models (GPT-3.5, Claude Sonnet)
- Enable streaming responses
- Use edge caching for common queries

## Advanced Configuration

### Custom System Prompts
Edit `src/api/chat.js` to customize the AI personality:
```javascript
function buildSystemPrompt(location) {
  return `You are MyChat, a friendly local guide...`
}
```

### Multi-Language Support
Add language detection:
```javascript
const language = request.headers.get('Accept-Language')
// Adjust system prompt based on language
```

### Web Search Integration
Future enhancement to add real-time information:
```javascript
// Coming soon: Brave Search API integration
const searchResults = await searchWeb(query)
messages.push({ role: 'system', content: `Search results: ${searchResults}` })
```

## Monitoring

Check usage and costs:
- OpenAI: https://platform.openai.com/usage
- Anthropic: https://console.anthropic.com/usage
- Cloudflare: Workers Analytics dashboard

## Support

- Issues: https://github.com/currentspace/MyChat/issues
- Cloudflare Discord: https://discord.cloudflare.com
- API Provider Support:
  - OpenAI: https://help.openai.com
  - Anthropic: https://support.anthropic.com