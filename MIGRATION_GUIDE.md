# Migration Guide: NextAuth → Supabase Auth

This document helps developers migrate from the previous NextAuth-based authentication system to the new Supabase Auth implementation.

## Overview of Changes

| Aspect | NextAuth | Supabase Auth |
|--------|----------|---------------|
| Auth Provider | Auth0/Custom | Supabase Auth |
| Session Type | JWT via cookies | JWT with refresh tokens |
| Database | App-managed | Supabase managed |
| User Profiles | Custom table | Linked to auth.users |
| Email Verification | Not implemented | Built-in, required |
| Password Reset | Not implemented | Built-in with email |
| Roles | Not implemented | Metadata + public.users |
| Rate Limiting | Not implemented | Built-in auth limits |

## Migration Steps for Developers

### 1. Update Imports

**Before (NextAuth):**
```typescript
import { useSession, signIn, signOut } from 'next-auth/react'
import { getServerSession } from 'next-auth'
```

**After (Supabase):**
```typescript
import { createClient } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import { useAuth } from '@/lib/hooks/useAuth'
```

### 2. Get Current User

**Before:**
```typescript
const { data: session } = useSession()
const email = session?.user?.email
```

**After:**
```typescript
import { useAuth } from '@/lib/hooks/useAuth'

const { user, profile } = useAuth()
const email = user?.email
const role = profile?.role
```

### 3. Server-Side Auth Check

**Before:**
```typescript
const session = await getServerSession(authOptions)
if (!session) {
  redirect('/login')
}
```

**After:**
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { session } } = await supabase.auth.getSession()
if (!session) {
  redirect('/auth/login')
}
```

### 4. Sign In

**Before:**
```typescript
await signIn('credentials', { email, password })
```

**After:**
```typescript
const supabase = createClient()
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (!error) {
  router.push('/dashboard')
}
```

### 5. Sign Up

**Before:**
```typescript
// Not implemented in previous system
```

**After:**
```typescript
const supabase = createClient()
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      role: 'user',
      first_name: firstName,
    },
    emailRedirectTo: `${window.location.origin}/api/auth/callback`,
  },
})
```

### 6. Sign Out

**Before:**
```typescript
await signOut({ callbackUrl: '/login' })
```

**After:**
```typescript
const supabase = createClient()
await supabase.auth.signOut()
router.push('/auth/login')
```

### 7. Check User Role

**Before:**
```typescript
// Role not available
```

**After:**
```typescript
import { useAuth } from '@/lib/hooks/useAuth'

const { profile } = useAuth()
if (profile?.role === 'admin') {
  // Show admin features
}
```

### 8. Query Protected Data

**Before:**
```typescript
const response = await fetch('/api/user-data')
```

**After:**
```typescript
const supabase = createClient()
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  // RLS automatically enforces user can only see their data
```

### 9. Update User Profile

**Before:**
```typescript
// Custom API endpoint needed
```

**After:**
```typescript
const supabase = createClient()
const { error } = await supabase
  .from('users')
  .update({ first_name: 'John' })
  .eq('id', user.id)
```

## Route Migration

| Feature | Old Route | New Route |
|---------|-----------|-----------|
| Login | `/login` | `/auth/login` |
| Sign Up | Not available | `/auth/sign-up` |
| Forgot Password | Not available | `/auth/forgot-password` |
| Reset Password | Not available | `/auth/reset-password` |
| Dashboard | `/dashboard` | `/dashboard` (unchanged) |
| Logout | Handled via signOut | Handled via logout button |

## Database Changes

### User Storage
**Before:**
- NextAuth users table
- Session table
- No roles
- No email verification tracking

**After:**
- `auth.users` (Supabase managed)
- `public.users` (application layer)
- `role` enum field
- `is_email_verified` field
- `password_reset_tokens` table

### Migration Path
If you have existing users:
1. Export users from old NextAuth system
2. Manually create them in Supabase Auth via Admin API
3. Ensure emails match
4. Create corresponding `public.users` entries
5. Test authentication for each user

## Component Migration Examples

### Example 1: Protected Page Component

**Before:**
```typescript
import { useSession } from 'next-auth/react'

export default function Dashboard() {
  const { data: session } = useSession()
  
  if (!session) return <div>Not authenticated</div>
  
  return <div>Welcome, {session.user.email}</div>
}
```

**After:**
```typescript
'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export default function Dashboard() {
  const { user, profile, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>
  
  return <div>Welcome, {profile?.first_name || user.email}</div>
}
```

### Example 2: Server-Side Protected Route

**Before:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    notFound()
  }
  
  return <div>Admin content</div>
}
```

**After:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    notFound()
  }
  
  return <div>Admin content</div>
}
```

### Example 3: API Route with Auth

**Before:**
```typescript
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  const session = await getServerSession()
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Handle request
}
```

**After:**
```typescript
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Handle request
}
```

## Removed Dependencies

The following dependencies are no longer needed:
- `next-auth`
- `@next-auth/prisma-adapter` (if using Prisma)
- Any OAuth provider packages (e.g., `next-auth/providers/google`)

**Note:** Keep these if other features depend on them.

## New Dependencies

Already added:
- `@supabase/ssr`
- `@supabase/supabase-js`

## Environment Variables Migration

**Old:**
```
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_PROVIDER_*=...
```

**New:**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=...
```

See `.env.example` for full list.

## Breaking Changes

1. **Session Structure** - Different format between NextAuth and Supabase
   - NextAuth: `session.user` object
   - Supabase: Separate `user` and `profile` objects

2. **Auth URLs** - Routes have changed
   - Login: `/login` → `/auth/login`
   - Sign up: No route → `/auth/sign-up`

3. **User Data** - Structure is different
   - NextAuth: Custom fields in `session.user`
   - Supabase: Fields in `public.users` table + metadata

4. **Role System** - Not available in NextAuth
   - Must update any role-checking logic to use new roles

5. **Password Reset** - New feature
   - Routes: `/auth/forgot-password`, `/auth/reset-password`

## Testing Checklist for Migration

- [ ] Existing users can still log in (if migrated)
- [ ] New users can sign up
- [ ] Email verification works
- [ ] Password reset works
- [ ] Roles are properly set
- [ ] Protected routes redirect correctly
- [ ] User profile displays correctly
- [ ] All API endpoints work with new auth
- [ ] Components display correct user info
- [ ] Logout works correctly

## Rollback Plan

If issues arise:
1. Supabase maintains full auth history
2. Previous NextAuth data still available if not deleted
3. Can temporarily revert to old auth system
4. Use database backup to restore users if needed

## Support & Resources

- See `AUTHENTICATION.md` for complete auth docs
- See `AUTH_QUICK_REFERENCE.md` for code examples
- See `IMPLEMENTATION_SUMMARY.md` for full feature list
- Supabase Docs: https://supabase.com/docs

## FAQ

**Q: Can I keep using my existing users?**
A: Yes, but they need to be migrated to Supabase Auth via the Admin API.

**Q: Does email verification really need to be enabled?**
A: Yes, it's a security best practice. Users can verify immediately.

**Q: What about OAuth/social login?**
A: Not implemented yet, but can be added via Supabase OAuth providers.

**Q: How do I manage existing sessions during migration?**
A: All existing NextAuth sessions will be invalidated. Users need to sign in again.

**Q: Can I use Supabase Auth alongside NextAuth?**
A: Not recommended. Use one auth system.

**Q: How are passwords stored?**
A: Supabase handles password hashing with bcrypt. You never see plaintext passwords.
