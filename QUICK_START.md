# Authentication Quick Start Guide

Get up and running with Supabase authentication in 5 minutes.

## 1. Environment Setup

Make sure you have the required environment variables set:

```bash
# Check .env.example for all required variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/api/auth/callback
```

These are automatically set if you've connected Supabase integration. For local development, copy these values from your Supabase project settings.

## 2. Test the Auth System

### Sign Up
1. Open http://localhost:3000/auth/sign-up
2. Fill in the form:
   - Email: your-email@example.com
   - Password: SecurePassword123
   - Role: Customer
   - Name: John Doe
3. Click "Create Account"
4. Check your email for verification link
5. Click verification link in email
6. You'll be redirected to sign-up success page

### Sign In
1. Open http://localhost:3000/auth/login
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to http://localhost:3000/dashboard
5. Dashboard shows your profile information

### Password Reset
1. From login page, click "Forgot Password?"
2. Enter your email
3. Click "Send Reset Link"
4. Check your email for reset link
5. Click link and set new password
6. Sign in with new password

## 3. Using Auth in Your Components

### Check if User is Logged In
```typescript
'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export default function MyComponent() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return <div>Welcome, {user.email}!</div>
}
```

### Get User Profile
```typescript
const { profile } = useAuth()

console.log(profile?.first_name)  // User's first name
console.log(profile?.role)         // User's role: 'user', 'studio_owner', 'admin'
console.log(profile?.is_email_verified) // Boolean
```

### Check User Role
```typescript
const { profile } = useAuth()

if (profile?.role === 'admin') {
  // Show admin panel
}
```

### Sign Out
```typescript
import LogoutButton from '@/app/components/logout-button'

// Use the logout button component
<LogoutButton />
```

## 4. Create Protected Routes

```typescript
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AdminPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (!loading && profile?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user || profile?.role !== 'admin') return null

  return <div>Admin Panel</div>
}
```

## 5. Query Protected Data

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect, useState } from 'react'

export default function UserData() {
  const { user } = useAuth()
  const supabase = createClient()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setData(data)
    }

    fetchData()
  }, [user, supabase])

  return <div>{data && <p>Name: {data.first_name}</p>}</div>
}
```

## 6. Update User Data

```typescript
const supabase = createClient()

// Update user profile
const { error } = await supabase
  .from('users')
  .update({
    first_name: 'John',
    last_name: 'Doe',
    phone: '555-1234',
  })
  .eq('id', user.id)

if (error) {
  console.error('Update failed:', error)
} else {
  console.log('Profile updated!')
}
```

## 7. Available Pages

| Page | URL | Purpose |
|------|-----|---------|
| Sign Up | `/auth/sign-up` | Create new account |
| Sign In | `/auth/login` | Log in to account |
| Forgot Password | `/auth/forgot-password` | Request password reset |
| Reset Password | `/auth/reset-password` | Set new password |
| Dashboard | `/dashboard` | Main app dashboard |

## 8. Common Tasks

### Get Current Session
```typescript
const { user } = useAuth()
// user is null if not logged in
// user.email contains the email address
```

### Check Email Verification
```typescript
const { profile } = useAuth()

if (profile?.is_email_verified) {
  // User has verified email
}
```

### Handle Auth Errors
```typescript
import { useAuth } from '@/lib/hooks/useAuth'

const { error } = useAuth()

if (error) {
  console.error('Auth error:', error.message)
}
```

### Create New User (Admin)
```typescript
const supabase = createClient()

// Admin can create users via Supabase Auth Admin API
// For normal sign-up, use the sign-up page at /auth/sign-up
```

## 9. Debugging

### Check Auth Status in Console
```typescript
const { user, profile } = useAuth()
console.log('User:', user)
console.log('Profile:', profile)
```

### See Supabase Logs
1. Open Supabase Dashboard
2. Go to "Logs" → "Auth" to see auth events
3. Go to "Logs" → "Database" to see RLS policy decisions

### Test Protected Route
1. Try accessing `/dashboard` without logging in
2. Should redirect to `/auth/login`
3. After login, should be able to access `/dashboard`

## 10. Next Steps

1. **Customize pages** - Edit auth pages in `app/auth/`
2. **Add more fields** - Extend `public.users` table
3. **Implement role-based features** - Use `profile?.role` to show different content
4. **Add social login** - Configure OAuth in Supabase
5. **Set up email templates** - Customize email designs in Supabase
6. **Add user profile page** - Let users edit their profile

## Troubleshooting

### Not receiving verification email?
- Check spam folder
- Verify email address in Supabase Auth settings
- Try requesting a new verification link

### Can't sign in after email verification?
- Clear browser cache and cookies
- Try using incognito/private browsing
- Verify user exists in Supabase Auth

### Password reset link not working?
- Links expire after 1 hour - request new link
- Check that NEXT_PUBLIC_SUPABASE_REDIRECT_URL is correct
- Use link within 1 hour

### Getting "Session not found" error?
- User not authenticated
- Sign in first at `/auth/login`
- Check browser cookies are enabled

## More Help

- **Full Documentation:** See `AUTHENTICATION.md`
- **Code Examples:** See `AUTH_QUICK_REFERENCE.md`
- **Migration from NextAuth:** See `MIGRATION_GUIDE.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`

## Key URLs During Development

- App: http://localhost:3000
- Sign Up: http://localhost:3000/auth/sign-up
- Sign In: http://localhost:3000/auth/login
- Dashboard: http://localhost:3000/dashboard
- Supabase Dashboard: https://app.supabase.com

---

That's it! You now have a fully functional authentication system. Start by testing the sign-up and sign-in flows, then integrate it into your pages using the `useAuth` hook.
