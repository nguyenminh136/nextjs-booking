# API Migration Summary: Supabase → Nest.js Backend

## What Changed

The authentication system has been refactored from **direct Supabase client calls** to **API-based architecture** using a Nest.js backend.

### Before (Supabase Direct)
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { error } = await supabase.auth.signUp({
  email, password,
  options: { ... }
})
```

### After (API Layer)
```typescript
import { signUp } from '@/lib/api/auth'

await signUp({ email, password, role, ... })
```

## Key Benefits

1. **Backend Agnostic**: Switch backends by changing one environment variable
2. **Consistent API Contracts**: TypeScript types for all requests/responses
3. **Centralized Token Management**: All JWT handling in one place
4. **Better Testing**: Mock API routes for development
5. **Separation of Concerns**: Frontend doesn't know about database

## Files Changed

### New API Layer
- `lib/api/client.ts` - HTTP client with token handling
- `lib/api/auth.ts` - Auth-specific API functions
- `lib/api/types.ts` - TypeScript interfaces
- `lib/api/token.ts` - JWT utilities

### Mock API Endpoints
- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`
- `app/api/auth/refresh/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/verify-email/route.ts`
- `app/api/auth/resend-verification/route.ts`

### Updated Auth Pages
- `app/auth/sign-up/page.tsx` - Now uses `signUp()` from `lib/api/auth`
- `app/auth/login/page.tsx` - Now uses `login()` from `lib/api/auth`
- `app/auth/forgot-password/page.tsx` - Now uses `forgotPassword()`
- `app/auth/reset-password/page.tsx` - Now uses `resetPassword()`

### Updated Components
- `app/components/logout-button.tsx` - Uses `logout()` from `lib/api/auth`
- `app/components/session-watcher.tsx` - Checks localStorage instead of Supabase
- `app/components/session-provider.tsx` - Simplified (no NextAuth)
- `app/dashboard/page.tsx` - Uses `getMe()` from `lib/api/auth`

### Updated Utilities
- `lib/hooks/useAuth.ts` - Custom auth hook using API layer

## Token Storage

Tokens are now stored in `localStorage`:
```typescript
// Login/SignUp
localStorage.setItem('auth_token', response.accessToken)

// Protected routes check
const token = localStorage.getItem('auth_token')

// Logout
localStorage.removeItem('auth_token')
```

## API Base URL Configuration

**Development**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Production**
```env
NEXT_PUBLIC_API_URL=https://your-nestjs-backend.com/api
```

## Using the API

### Sign Up
```typescript
import { signUp } from '@/lib/api/auth'

const response = await signUp({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  role: 'user', // 'user' | 'studio_owner' | 'admin'
  firstName: 'John',
  lastName: 'Doe'
})

// response.accessToken - JWT token
// response.user - User data
```

### Login
```typescript
import { login } from '@/lib/api/auth'

const response = await login({
  email: 'user@example.com',
  password: 'password123'
})

// response.accessToken - JWT token
// response.user - User data
```

### Get Current User
```typescript
import { getMe } from '@/lib/api/auth'

const response = await getMe()
// response.user - Current user data
```

### Logout
```typescript
import { logout } from '@/lib/api/auth'

await logout()
// Token automatically cleared from localStorage
```

### Password Reset
```typescript
import { forgotPassword, resetPassword } from '@/lib/api/auth'

// Step 1: Request reset
await forgotPassword({ email: 'user@example.com' })

// Step 2: Reset with token (from email link)
await resetPassword({
  token: 'reset_token_from_email',
  password: 'newpassword',
  confirmPassword: 'newpassword'
})
```

## Connecting to Real Nest.js Backend

### 1. Update Environment Variable
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-nestjs-backend.com/api
```

### 2. Ensure Backend Endpoints Match

Your Nest.js backend should have these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/logout` | POST | User logout |
| `/auth/me` | GET | Get current user |
| `/auth/refresh` | POST | Refresh token |
| `/auth/forgot-password` | POST | Request password reset |
| `/auth/reset-password` | POST | Confirm password reset |
| `/auth/verify-email` | POST | Verify email |
| `/auth/resend-verification` | POST | Resend verification |

### 3. Verify Response Formats

All responses must match the types in `lib/api/types.ts`:

```typescript
// Auth responses must include:
{
  accessToken: string
  user: {
    id: string
    email: string
    role: 'user' | 'studio_owner' | 'admin'
    firstName?: string
    lastName?: string
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
  }
}

// Error responses:
{
  message: string
  statusCode: number
  error?: string
}
```

## Current Limitations of Mock API

The mock endpoints currently:
- Accept all requests (no real validation against database)
- Return mock data
- Don't send actual emails
- Don't persist data across requests

For production, replace mock endpoints with real Nest.js backend.

## Testing Locally

### Start the dev server
```bash
npm run dev
```

### Test Sign Up
Navigate to http://localhost:3000/auth/sign-up

### Test Login
Use the mock user:
- Email: `test@example.com`
- Password: `password123`

### View API Calls
Check browser DevTools → Network tab to see API requests

## Troubleshooting

**"API request failed"**
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify backend is running
- Check browser console for error details

**"Unauthorized" on protected pages**
- Token missing from localStorage
- Try logging in again
- Check token expiration in DevTools Storage

**CORS errors**
- Backend needs proper CORS headers
- Ensure `NEXT_PUBLIC_API_URL` is whitelisted

## Next Steps

1. Test the mock API locally
2. Build your Nest.js backend with matching endpoints
3. Update `NEXT_PUBLIC_API_URL` to point to backend
4. Remove or repurpose mock API routes
5. Deploy to production

## Questions?

See `API_INTEGRATION.md` for detailed documentation.
