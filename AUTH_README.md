# Authentication System - Quick Links

This application now features a complete Supabase-based authentication system with email verification, role-based access control, and secure password reset.

## 🚀 Quick Start

1. **First Time?** → Read [QUICK_START.md](./QUICK_START.md)
2. **Need Overview?** → Read [COMPLETION_REPORT.md](./COMPLETION_REPORT.md)
3. **Looking for Code?** → Read [AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md)
4. **Need Full Details?** → Read [AUTHENTICATION.md](./AUTHENTICATION.md)

## 📍 Key Pages

**User-Facing:**
- Sign Up: http://localhost:3000/auth/sign-up
- Login: http://localhost:3000/auth/login
- Forgot Password: http://localhost:3000/auth/forgot-password
- Dashboard: http://localhost:3000/dashboard

**Admin/Info:**
- Error Page: http://localhost:3000/auth/error

## ✨ Features

- ✅ User registration with role selection (User, Studio Owner, Admin)
- ✅ Email verification required
- ✅ Secure email/password login
- ✅ Password reset via email
- ✅ Protected dashboard
- ✅ Role-based access control
- ✅ Session management with auto-refresh
- ✅ Logout functionality

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Get started in 5 minutes |
| [COMPLETION_REPORT.md](./COMPLETION_REPORT.md) | What was built (executive summary) |
| [AUTHENTICATION.md](./AUTHENTICATION.md) | Complete system documentation |
| [AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md) | Code patterns & examples |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | NextAuth → Supabase migration |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Technical architecture |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | Testing & deployment |
| [DOCS_INDEX.md](./DOCS_INDEX.md) | Navigation guide for docs |
| [IMPLEMENTATION_OVERVIEW.txt](./IMPLEMENTATION_OVERVIEW.txt) | Visual overview |

## 🔑 Key Concepts

**Roles:** User (customer), Studio Owner, Admin
**Email:** Verification required for all new users
**Password:** Secure reset via email with token expiration
**RLS:** Row Level Security protects all data
**Session:** JWT tokens with auto-refresh

## 🛠️ For Developers

### Using the Auth Hook

```typescript
'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export default function MyComponent() {
  const { user, profile, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return <div>Welcome, {profile?.first_name}!</div>
}
```

### Checking User Role

```typescript
const { profile } = useAuth()

if (profile?.role === 'admin') {
  // Show admin features
}
```

### Making Protected API Calls

```typescript
const supabase = createClient()

const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
```

## ✅ Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/api/auth/callback
```

See `.env.example` for template.

## 🔐 Security

- Database-level access control (RLS)
- Email verification required
- Password hashing with bcrypt
- Secure token-based password reset
- HTTP-only session cookies
- Automatic token refresh
- Protected routes redirect unauthenticated users

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `auth.users` | Supabase auth users (managed) |
| `public.users` | Application user profiles with roles |
| `public.password_reset_tokens` | Password reset token management |

## 🎯 Common Tasks

**Sign In:**
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

**Sign Up:**
```typescript
const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: { role: 'user', first_name: 'John' }
  }
})
```

**Sign Out:**
```typescript
await supabase.auth.signOut()
```

**Get Current User:**
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

## 🧪 Testing

1. Test sign-up at `/auth/sign-up`
2. Verify email (check inbox for verification link)
3. Test login at `/auth/login`
4. Access dashboard at `/dashboard`
5. Test password reset at `/auth/forgot-password`
6. Test logout with button on dashboard

## 📞 Troubleshooting

**Email not received?**
- Check spam folder
- Verify email in Supabase Auth settings

**Can't sign in?**
- Verify email first
- Clear cookies and try again

**Password reset not working?**
- Links expire after 1 hour
- Request new reset link

See [AUTHENTICATION.md](./AUTHENTICATION.md) → "Troubleshooting" section for more.

## 🚀 Deployment

1. Set environment variables in production
2. Configure email provider in Supabase
3. Update `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` for production domain
4. Test all auth flows in staging
5. Deploy to production

See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for deployment checklist.

## 📖 Learning Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/realtime)

## ❓ FAQ

**Q: Can I customize the auth pages?**
A: Yes, all pages are in `app/auth/` and can be customized.

**Q: How do I add social login?**
A: Configure OAuth providers in Supabase (Google, GitHub, etc.).

**Q: What about two-factor authentication?**
A: Supabase supports TOTP-based 2FA if needed.

**Q: How do I delete a user account?**
A: Use Supabase Admin API or create a delete account page.

**Q: Can I customize email templates?**
A: Yes, customize in Supabase dashboard → Auth → Email Templates.

## 📈 Next Features

- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User profile editing
- [ ] Session management UI
- [ ] Account deletion
- [ ] Email template customization

---

**Status:** ✅ Complete and Ready for Testing

**For Help:** Start with [QUICK_START.md](./QUICK_START.md) or [DOCS_INDEX.md](./DOCS_INDEX.md)
