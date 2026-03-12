# Authentication Quick Reference

## Common Code Patterns

### Check if User is Authenticated
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  // User not authenticated
}
```

### Get Current User Profile
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

const { data: profile } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Use Auth Hook in Component
```typescript
'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export default function MyComponent() {
  const { user, profile, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return <div>Welcome, {profile?.first_name}</div>
}
```

### Check User Role
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

const { data: profile } = await supabase
  .from('users')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role === 'admin') {
  // Show admin features
}
```

### Create Protected Route
```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProtectedPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
      }
    }
    checkAuth()
  }, [supabase, router])

  return <div>Protected content</div>
}
```

### Query Data with RLS
```typescript
// Client-side query with RLS
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)

// RLS automatically filters to user's own data
```

### Update User Profile
```typescript
const { error } = await supabase
  .from('users')
  .update({
    first_name: 'John',
    last_name: 'Doe',
    phone: '555-1234',
  })
  .eq('id', user.id)
```

### Sign Out User
```typescript
const supabase = createClient()
await supabase.auth.signOut()
// User is signed out and session is cleared
```

## Page Routes

| Page | URL | Purpose |
|------|-----|---------|
| Sign Up | `/auth/sign-up` | User registration with role selection |
| Sign In | `/auth/login` | User login |
| Forgot Password | `/auth/forgot-password` | Password reset request |
| Reset Password | `/auth/reset-password` | New password entry (with token) |
| Dashboard | `/dashboard` | Main user dashboard (protected) |
| Sign Up Success | `/auth/sign-up-success` | Confirmation after signup |
| Reset Success | `/auth/reset-success` | Confirmation after password reset |
| Error | `/auth/error` | Error page with recovery options |

## Database Tables

### users
```sql
SELECT * FROM users WHERE id = auth.uid();
```

**Common columns:**
- `id` - User UUID (from auth)
- `email` - User email
- `role` - 'user' | 'studio_owner' | 'admin'
- `first_name`, `last_name` - Name fields
- `is_email_verified` - Boolean
- `created_at`, `updated_at` - Timestamps

### password_reset_tokens
Used internally for password reset flow.

## Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key

Optional:
- `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` - For email callbacks
- `NEXT_PUBLIC_APP_URL` - Application base URL

## Common Errors & Solutions

### "Session not found"
- User not authenticated
- Session expired, redirect to `/auth/login`
- Clear browser cookies and sign in again

### "RLS policy violation"
- User doesn't have permission to access data
- Check RLS policies in Supabase dashboard
- Ensure `auth.uid()` matches user making request

### "Email verification required"
- User hasn't verified email
- Check inbox for verification link
- Request new verification link if expired

### "Invalid reset token"
- Reset token expired (expires in 1 hour)
- Request new password reset
- Check URL includes full token from email

## Debugging

### Check Auth State
```typescript
const { data: { session } } = await supabase.auth.getSession()
console.log('Current session:', session)
console.log('User:', session?.user)
```

### Monitor Auth Changes
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event)
    console.log('Session:', session)
  }
)
```

### Check RLS Policies
Visit Supabase dashboard → Authentication → Users to see auth users
Visit Supabase dashboard → SQL Editor to inspect table policies

## Best Practices

1. **Always check auth status before accessing protected data**
   ```typescript
   const { data: { user } } = await supabase.auth.getUser()
   if (!user) throw new Error('Not authenticated')
   ```

2. **Use server-side clients for sensitive operations**
   ```typescript
   import { createClient } from '@/lib/supabase/server'
   const supabase = await createClient()
   ```

3. **Handle errors gracefully**
   ```typescript
   try {
     // auth operation
   } catch (error) {
     console.error('Auth error:', error)
     // Show user-friendly message
   }
   ```

4. **Don't store sensitive data in client state**
   - Store auth tokens in cookies (handled by Supabase)
   - Use RLS policies to protect data at database level

5. **Test protected routes**
   - Try accessing without authentication
   - Verify redirect to login page works
   - Test with different user roles

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Auth Guides](./AUTHENTICATION.md)
- [Implementation Details](./IMPLEMENTATION_SUMMARY.md)
