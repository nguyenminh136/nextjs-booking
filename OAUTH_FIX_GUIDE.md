# OAuth Configuration Fix Guide

## Problem
The application was throwing this error:
```
[next-auth][error][SIGNIN_OAUTH_ERROR] only valid absolute URLs can be requested
```

This occurred because NextAuth's Auth0 provider couldn't validate URLs during the OAuth flow.

## Root Cause
Missing required environment variables:
- `NEXTAUTH_URL` - The absolute URL of your application (required by NextAuth)
- `NEXTAUTH_SECRET` - A secret key for signing tokens

Without `NEXTAUTH_URL`, NextAuth cannot construct valid callback URLs for OAuth providers like Auth0.

## Solution Applied

### 1. Environment Variables (REQUIRED)
You must set these environment variables in your Vercel project settings:

**Required:**
- `NEXTAUTH_URL` - Set to your application URL
  - Development: `http://localhost:3000`
  - Production: `https://your-domain.com`
- `NEXTAUTH_SECRET` - A random secret (generate with `openssl rand -base64 32`)

**Auth0 Configuration:**
- `AUTH0_CLIENT_ID` - From Auth0 dashboard
- `AUTH0_CLIENT_SECRET` - From Auth0 dashboard
- `AUTH0_ISSUER` - Your Auth0 tenant domain (e.g., `https://your-tenant.us.auth0.com`)
- `AUTH0_AUDIENCE` - Your Auth0 API identifier (optional but recommended)

### 2. Code Changes Made

**File: `/app/api/auth/[...nextauth]/auth-option.ts`**
- Added environment variable validation with helpful warnings
- Added `trustHost: true` - Trusts X-Forwarded-Proto header for HTTPS detection
- Added `secret` configuration from `NEXTAUTH_SECRET`
- Improved error handling for missing credentials

**File: `/app/components/session-watcher.tsx`**
- Updated redirect paths from `/auth/signin` to `/login` (existing page)
- Enhanced 401 error detection for unauthorized API responses
- Improved token expiration handling

## Setup Instructions

### Step 1: Get Auth0 Credentials
1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Create a new Regular Web Application
3. Copy your credentials:
   - Client ID
   - Client Secret
   - Domain (this is your AUTH0_ISSUER)
4. Configure Allowed Callback URLs: `http://localhost:3000/api/auth/callback/auth0` and `https://your-production-domain.com/api/auth/callback/auth0`

### Step 2: Add Environment Variables
Go to your Vercel project settings → Environment Variables and add:

```
NEXTAUTH_URL=http://localhost:3000  (or your production URL)
NEXTAUTH_SECRET=<generate_random_secret>
AUTH0_CLIENT_ID=<your_client_id>
AUTH0_CLIENT_SECRET=<your_client_secret>
AUTH0_ISSUER=https://<your-tenant>.us.auth0.com
AUTH0_AUDIENCE=<optional_api_identifier>
```

### Step 3: Restart Development Server
After setting environment variables, restart your dev server for changes to take effect.

### Step 4: Test OAuth Flow
1. Click "Sign in" on the login page
2. You should be redirected to Auth0 login
3. After authentication, you'll be redirected back to `/dashboard`

## Troubleshooting

### "only valid absolute URLs can be requested"
- Verify `NEXTAUTH_URL` is set correctly
- Ensure no trailing slashes in URLs
- Check that `NEXTAUTH_SECRET` is set

### "invalid_grant" from Auth0
- Verify Allowed Callback URLs in Auth0 dashboard match your `NEXTAUTH_URL`
- Check that `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET` are correct

### "Unauthorized" errors in API calls
- The session-watcher automatically detects 401 errors
- Users will be redirected to `/login` to re-authenticate
- Tokens expire based on `AUTH0_ISSUER` settings

## Best Practices

1. **Development vs Production URLs**
   - Use `http://localhost:3000` for local development
   - Use your production domain for deployed environments

2. **Secret Management**
   - Never commit `NEXTAUTH_SECRET` to git
   - Generate a strong random secret for production
   - Rotate secrets periodically

3. **Token Expiration**
   - Default session maxAge: 24 hours
   - Configure Auth0 token lifetime in your tenant settings
   - Expired tokens trigger automatic re-login

4. **HTTPS in Production**
   - `trustHost: true` handles X-Forwarded-Proto correctly
   - Vercel automatically provides HTTPS
   - Auth0 requires HTTPS callback URLs in production
