# Google OAuth Setup Guide

## Prerequisites
- Google Cloud Console account
- Cloudflare account with Workers enabled

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
5. If prompted, configure OAuth consent screen first:
   - Choose **External** user type
   - Fill in required fields (app name, support email, etc.)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in development

6. For OAuth client ID:
   - Application type: **Web application**
   - Name: `MyChat Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://mychat.current.space` (for production)
     - Your custom domain if applicable
   - Authorized redirect URIs (if needed):
     - `http://localhost:5173/auth/callback`
     - `https://mychat.current.space/auth/callback`

7. Save and copy:
   - **Client ID**: Will be used as `VITE_GOOGLE_CLIENT_ID`
   - **Client Secret**: Will be used as `GOOGLE_CLIENT_SECRET`

## Step 2: Configure Local Development

1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Add your Google Client ID:
```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here
```

## Step 3: Configure Cloudflare Workers

1. Go to your Cloudflare dashboard
2. Navigate to **Workers & Pages** > Your worker
3. Go to **Settings** > **Variables**
4. Add the following secrets:
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `JWT_SECRET`: Generate a secure random string (32+ characters)
   - `FRONTEND_URL`: Your production URL (e.g., `https://mychat.current.space`)

### Generate JWT Secret
```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 4: Deploy Worker with Auth

1. Build the project:
```bash
pnpm build
```

2. Deploy to Cloudflare:
```bash
pnpm wrangler deploy
```

## Step 5: Test Authentication

1. Start local development:
```bash
pnpm dev
```

2. Click "Sign in with Google" button
3. Authorize the application
4. Verify user profile appears in header

## Troubleshooting

### "redirect_uri_mismatch" Error
- Ensure authorized origins match exactly (including protocol and port)
- Check both JavaScript origins and redirect URIs in Google Console

### CORS Errors
- Verify `FRONTEND_URL` in wrangler.toml matches your actual domain
- Check Worker CORS configuration in `functions/api/auth/[[route]].ts`

### Token Verification Fails
- Ensure `GOOGLE_CLIENT_ID` matches in both frontend (.env) and Worker (Cloudflare secrets)
- Check JWT_SECRET is set correctly in Cloudflare

### Session Not Persisting
- Verify cookies are enabled in browser
- Check cookie settings in Worker (httpOnly, secure, sameSite)
- For local development, ensure using `localhost` not `127.0.0.1`

## Security Best Practices

1. **Never commit secrets**: Keep `.env` in `.gitignore`
2. **Use environment variables**: Never hardcode client IDs or secrets
3. **Validate tokens server-side**: Always verify Google tokens in your Worker
4. **Use HTTPS in production**: OAuth requires secure connections
5. **Implement CSRF protection**: Use state parameter for OAuth flows
6. **Regular token rotation**: Periodically refresh JWT secrets
7. **Audit logs**: Monitor authentication attempts and failures