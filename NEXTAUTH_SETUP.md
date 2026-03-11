# NextAuth Setup Guide

## Why Login Redirects to Localhost

The issue occurs when `NEXTAUTH_URL` is not properly configured. NextAuth needs to know the absolute URL of your application to correctly redirect OAuth callbacks. Without it, it defaults to `http://localhost:3000`, causing the redirect loop.

## How It's Fixed

The auth configuration now automatically derives `NEXTAUTH_URL` from:

1. **Explicit `NEXTAUTH_URL` environment variable** (highest priority)
2. **Vercel's `VERCEL_URL`** (automatically set on Vercel deployments)
3. **Development fallback** (`http://localhost:3000` for local development)

## Setup Instructions

### For Local Development

1. Copy the environment template:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local`:
   - Set `NEXTAUTH_URL=http://localhost:3000`
   - Set `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - Add your Auth0 credentials

3. Restart your dev server:
   ```bash
   npm run dev
   ```

### For Vercel Production Deployment

The application will **automatically use `VERCEL_URL`** which Vercel sets for you:

1. In Vercel Project Settings → Environment Variables, add:
   - `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `AUTH0_CLIENT_ID`
   - `AUTH0_CLIENT_SECRET`
   - `AUTH0_ISSUER`
   - `AUTH0_AUDIENCE` (optional)

2. **Don't set `NEXTAUTH_URL`** on Vercel - it's automatically derived from `VERCEL_URL`

### For Other Production Deployments

Set `NEXTAUTH_URL` to your production domain:
```
NEXTAUTH_URL=https://your-domain.com
```

## Auth0 Configuration

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Create or select your application
3. In Application Settings, set:
   - **Allowed Callback URLs**: `http://localhost:3000/api/auth/callback/auth0` (local) or `https://your-domain.com/api/auth/callback/auth0` (production)
   - **Allowed Logout URLs**: `http://localhost:3000` (local) or `https://your-domain.com` (production)
4. Copy the credentials to your environment variables

## Verify the Fix

After setting up environment variables:

1. Restart your dev server
2. Check server logs for: `[NextAuth] Using NEXTAUTH_URL: ...`
3. Click the login button
4. You should be redirected to Auth0 login (not localhost)

## Common Issues

| Issue | Solution |
|-------|----------|
| Redirects to localhost | Add `NEXTAUTH_URL` environment variable |
| "Invalid client ID" error | Check `AUTH0_CLIENT_ID` in Auth0 dashboard |
| Callback URL mismatch | Ensure Auth0 Allowed Callback URLs match your `NEXTAUTH_URL/api/auth/callback/auth0` |
| NEXTAUTH_SECRET not found | Generate with `openssl rand -base64 32` |
