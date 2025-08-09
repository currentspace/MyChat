# Google OAuth Setup Guide

## Quick Start

You're seeing "OAuth client was not found" because the Google Client ID needs to be configured. Follow these steps:

## 1. Create a Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - Choose **External** user type
   - Fill in app name: "MyChat"
   - Add your email as support contact
   - Add authorized domains: `current.space` (for production)

## 2. Configure OAuth Client

1. Application type: **Web application**
2. Name: "MyChat Web Client"
3. Add Authorized JavaScript origins:
   ```
   http://localhost:5173        (for local development)
   http://localhost:8787        (for wrangler dev)
   https://mychat.current.space (for production)
   ```
4. Add Authorized redirect URIs (same as origins):
   ```
   http://localhost:5173
   http://localhost:8787
   https://mychat.current.space
   ```
5. Click **CREATE**
6. Copy your **Client ID** (looks like: `123456789-abcdef.apps.googleusercontent.com`)

## 3. Configure MyChat

### For Local Development:

1. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Client ID:
```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

3. Restart the dev server:
```bash
pnpm dev
```

### For Production:

1. Create `.env.production` file:
```bash
cp .env.production.example .env.production
```

2. Add your Client ID:
```env
VITE_GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
```

3. Build and deploy:
```bash
pnpm build
git add .
git commit -m "Add Google OAuth client ID"
git push
```

### For GitHub Actions (CI/CD):

Add the client ID as a repository secret:

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Name: `VITE_GOOGLE_CLIENT_ID`
4. Value: Your client ID
5. Click **Add secret**

## 4. Add Backend Secrets (Required)

The Worker also needs secrets for OAuth to work:

```bash
# Add your Google Client ID as a secret
pnpm wrangler secret put GOOGLE_CLIENT_ID --env production
# Enter your client ID when prompted

# Add JWT secret for session management
pnpm wrangler secret put JWT_SECRET --env production
# Enter: PC9dcOztLov6w9hcGvH5JgLKhkxdSURrL18dwZQM4cI=
```

Or use the provided script:
```bash
./fix-secrets.sh
```

## Troubleshooting

### "The OAuth client was not found"
- Verify the Client ID is correctly set in `.env.local` or `.env.production`
- Check that the file is named exactly `.env.local` (not `.env` or `.env.local.example`)
- Restart your dev server after adding the environment variable

### "Access blocked: Authorization Error"
- Make sure your domain is added to Authorized JavaScript origins
- Verify the OAuth consent screen is configured
- Check that you're using the correct Client ID for your environment

### "401: invalid_client"
- The Client ID doesn't exist or is malformed
- Double-check you copied the entire Client ID including `.apps.googleusercontent.com`

### Button width warning
- This is a known issue with the Google button and can be safely ignored
- The button will still work correctly

## Security Notes

- **NEVER** commit `.env.local` or `.env.production` files to git
- Client IDs are public (safe to expose in frontend)
- Client Secrets should NEVER be in frontend code
- JWT secrets must be kept secure in Cloudflare Workers

## Need Help?

1. Check the [Google OAuth Documentation](https://developers.google.com/identity/gsi/web/guides/overview)
2. Review the [Cloudflare Workers Secrets docs](https://developers.cloudflare.com/workers/configuration/secrets/)
3. Open an issue on [GitHub](https://github.com/currentspace/MyChat/issues)