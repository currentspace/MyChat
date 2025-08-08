# MyChat - Cloudflare Workers Deployment (2025)

## Current Setup

This project uses the **2025 Cloudflare Workers best practices**:
- ✅ Workers (not Pages) for deployment
- ✅ Free static asset serving
- ✅ Single `src/index.js` worker file
- ✅ Modern `compatibility_date = "2025-01-01"`
- ✅ SPA configuration with `not_found_handling`

## Quick Deploy

```bash
# Build React app
pnpm build

# Deploy to production
pnpm wrangler deploy --env production

# View logs
pnpm wrangler tail --env production
```

## Required Secrets

Set these in Cloudflare Dashboard → Workers & Pages → Your Worker → Settings → Variables:

```bash
# Via CLI (recommended for security)
wrangler secret put GOOGLE_CLIENT_ID --env production
wrangler secret put GOOGLE_CLIENT_SECRET --env production
wrangler secret put JWT_SECRET --env production

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Project Structure

```
mychat/
├── wrangler.toml          # 2025 Worker configuration
├── src/
│   └── index.js          # Main Worker (handles API + serves assets)
├── dist/                 # Built React app
│   ├── index.html
│   ├── assets/          # JS/CSS bundles
│   └── .assetsignore    # Files to exclude from deployment
└── .env.production      # Build-time environment variables
```

## Configuration Breakdown

### wrangler.toml
- `compatibility_date = "2025-01-01"` - Latest Workers features
- `[assets]` block - Modern asset configuration
- `not_found_handling = "single-page-application"` - SPA support
- Environment-specific configurations (dev/preview/production)

### src/index.js
- Handles `/api/*` routes directly
- Falls back to `env.ASSETS.fetch()` for static files
- CORS headers for API endpoints
- JWT session management

## Local Development

```bash
# Start local dev server
pnpm wrangler dev --local

# Test with environment
pnpm wrangler dev --env development --local

# Access at http://localhost:8787
```

## Deployment Environments

### Development
```bash
pnpm wrangler deploy --env development
# URL: https://mychat-dev.{your-subdomain}.workers.dev
```

### Preview
```bash
pnpm wrangler deploy --env preview
# URL: https://mychat-preview.{your-subdomain}.workers.dev
```

### Production
```bash
pnpm wrangler deploy --env production
# Custom domain: https://mychat.current.space
```

## Cost Optimization

- **Static assets**: Free and unlimited (served from edge)
- **API requests**: First 100k/day free
- **Tips**:
  - Assets are cached automatically
  - Use `Cache-Control` headers for API responses
  - Consider KV for session storage (more scalable)

## Monitoring

```bash
# Real-time logs
wrangler tail --env production

# Check metrics in dashboard
# Workers & Pages → Your Worker → Analytics
```

## Troubleshooting

### 405 Method Not Allowed
- Ensure `src/index.js` is handling the route
- Check CORS configuration

### OAuth errors
- Verify secrets are set: `wrangler secret list --env production`
- Check Google Console authorized domains
- Enable observability logs for debugging

### Static assets not updating
- Clear cache: Add `?v=timestamp` to asset URLs
- Redeploy: `wrangler deploy --env production`

## Security Checklist

- [x] HTTPS enforced (automatic with Cloudflare)
- [x] httpOnly cookies for tokens
- [x] Secure and SameSite cookie flags
- [x] CORS properly configured
- [x] Secrets stored securely (never in code)
- [x] JWT token expiration (7 days)

## Next Steps

1. **Add KV for sessions** (optional):
   ```toml
   [[kv_namespaces]]
   binding = "SESSIONS"
   id = "your-kv-namespace-id"
   ```

2. **Add D1 for user data** (optional):
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "mychat-db"
   ```

3. **Implement rate limiting**:
   ```javascript
   // In src/index.js
   const { success } = await env.RATE_LIMITER.limit({ key: clientIP })
   ```

## Links

- [Production App](https://mychat.current.space)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Workers Docs](https://developers.cloudflare.com/workers/)
- [GitHub Repo](https://github.com/currentspace/MyChat)