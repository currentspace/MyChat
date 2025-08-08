# Cloudflare Pages Deployment Setup Guide

This guide will help you set up automatic deployment to Cloudflare Pages using GitHub Actions.

## Prerequisites

1. A Cloudflare account (free tier is fine)
2. Your project pushed to GitHub (✅ Already done)

## Step 1: Create a Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the left sidebar
3. Click **Create a project** → **Connect to Git**
4. Select **GitHub** and authorize Cloudflare to access your repository
5. Select the `MyChat` repository
6. Configure build settings:
   - **Production branch**: `main`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
7. Click **Save and Deploy**
8. Note your **Project name** (it will be something like `mychat` or `mychat-xyz`)

## Step 2: Get Your Cloudflare Credentials

### A. Get your Account ID:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain (or go to Pages)
3. On the right sidebar, you'll see **Account ID**
4. Copy this value

### B. Create an API Token:
1. Go to [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use **Custom token** and configure:
   - **Token name**: `GitHub Actions Deploy`
   - **Permissions**:
     - Account → Cloudflare Pages:Edit
     - Zone → Zone:Read (optional, if you have a custom domain)
   - **Account Resources**: Include → Your account
   - **Zone Resources**: Include → All zones (or specific zone if using custom domain)
4. Click **Continue to summary** → **Create Token**
5. **IMPORTANT**: Copy the token now (you won't be able to see it again!)

## Step 3: Add Secrets to GitHub Repository

1. Go to your GitHub repository: https://github.com/currentspace/MyChat
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

### Secret 1: CLOUDFLARE_API_TOKEN
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Value**: The API token you created in Step 2.B

### Secret 2: CLOUDFLARE_ACCOUNT_ID
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: Your Account ID from Step 2.A

## Step 4: Update the Workflow (if needed)

The workflow file (`.github/workflows/deploy.yml`) is already configured. You may need to update:

```yaml
projectName: mychat  # Change this to match your Cloudflare Pages project name
```

## Step 5: Test the Deployment

1. Make a small change to your code
2. Commit and push to the `main` branch
3. Go to the **Actions** tab in your GitHub repository
4. Watch the deployment workflow run
5. Once complete, visit your site at:
   - `https://mychat.pages.dev` (or your project name)
   - Or your custom domain if configured

## Troubleshooting

### Common Issues:

1. **Authentication Error**: Double-check your API token has the correct permissions
2. **Project Not Found**: Ensure the `projectName` in the workflow matches your Cloudflare Pages project
3. **Build Failures**: Check the build logs in GitHub Actions for specific errors

### Debugging:

- GitHub Actions logs: Repository → Actions tab
- Cloudflare Pages logs: Cloudflare Dashboard → Pages → Your project → Deployments

## Optional: Custom Domain

To add a custom domain:
1. Go to Cloudflare Pages → Your project → Custom domains
2. Add your domain
3. Follow the DNS configuration instructions

## Security Notes

- Never commit API tokens or secrets directly to your repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate your API tokens
- Use the minimum required permissions for API tokens

## Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action)

---

Once you've completed these steps, every push to the `main` branch will automatically deploy to Cloudflare Pages! 🚀