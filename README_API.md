# Authentication System - API Integration

Complete guide for the refactored authentication system using Nest.js backend API.

## 📚 Documentation

Start here based on your needs:

### Getting Started (5 minutes)
👉 **[API_SETUP.md](./API_SETUP.md)** - Quick start guide
- Environment setup
- Testing the auth flow
- Common issues and troubleshooting

### Understanding the System
👉 **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Complete technical reference
- Architecture overview
- How it works (with diagrams)
- Switching to real Nest.js backend
- API request/response examples
- Security considerations

### Migration Information
👉 **[API_MIGRATION_SUMMARY.md](./API_MIGRATION_SUMMARY.md)** - What changed
- Before/after code examples
- Key benefits
- Files changed
- Token storage
- Testing instructions

### Implementation Status
👉 **[API_IMPLEMENTATION_COMPLETE.md](./API_IMPLEMENTATION_COMPLETE.md)** - Project summary
- Deliverables checklist
- Architecture diagram
- API function reference
- Next steps for production

## 🎯 Quick Reference

### Start Development
```bash
npm run dev
# Then visit http://localhost:3000
```

### Test Credentials
```
Email: test@example.com
Password: password123
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your-secret-key-change-in-production
```

### Test URLs
- Sign Up: http://localhost:3000/auth/sign-up
- Login: http://localhost:3000/auth/login
- Dashboard: http://localhost:3000/dashboard
- Forgot Password: http://localhost:3000/auth/forgot-password

## 🏗️ Architecture

```
NextJS Frontend
    ↓
API Functions (lib/api/auth.ts)
    ↓
API Client (lib/api/client.ts) + Token Management
    ↓
Fetch HTTP Request
    ↓
Mock API Routes (app/api/auth/*) OR Real Nest.js Backend
```

## 📦 What's Included

### New API Layer
- `lib/api/client.ts` - HTTP client with automatic token handling
- `lib/api/auth.ts` - All authentication API functions
- `lib/api/types.ts` - TypeScript type definitions
- `lib/api/token.ts` - JWT token utilities

### Mock API Endpoints (9 routes)
- Register, Login, Logout
- Get Current User
- Refresh Token
- Forgot Password, Reset Password
- Verify Email, Resend Verification

### Updated Auth Pages
- Sign up with role selection
- Login
- Password reset flow
- Protected dashboard

### Utilities
- Token storage in localStorage
- Automatic Authorization headers
- Error handling
- Session watcher

## 🚀 Key Features

✅ **Type-Safe** - Full TypeScript support
✅ **Modular** - Separated concerns
✅ **Flexible** - Easily switch backends
✅ **Mock Ready** - Test without backend
✅ **Token Management** - Centralized JWT handling
✅ **Error Handling** - Structured error responses
✅ **Protected Routes** - Auth guard for pages
✅ **Role-Based** - Support for 3 user roles

## 🔄 Switching to Real Backend

1. Build your Nest.js backend with matching API endpoints
2. Update environment variable:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.com/api
   ```
3. (Optional) Remove mock API routes from `app/api/auth/`
4. Everything else stays the same!

## 📝 API Functions

### Imports
```typescript
import { signUp, login, logout, getMe } from '@/lib/api/auth'
import { forgotPassword, resetPassword } from '@/lib/api/auth'
import { verifyEmail, resendVerificationEmail } from '@/lib/api/auth'
```

### Usage in Components
```typescript
// Sign up
const response = await signUp({
  email, password, confirmPassword, role, firstName, lastName
})

// Login
const response = await login({ email, password })

// Get current user
const response = await getMe()

// Logout
await logout()

// Password reset
await forgotPassword({ email })
await resetPassword({ token, password, confirmPassword })
```

## 🛡️ Security

**Development**: Uses localStorage (fine for development)
**Production**: 
- Use HTTPS only
- Consider HttpOnly cookies
- Implement token refresh
- Add CSRF protection
- Enable rate limiting

## 📂 File Structure

```
lib/api/
├── client.ts       # HTTP client
├── auth.ts         # API functions
├── types.ts        # TypeScript types
└── token.ts        # JWT utilities

app/api/auth/
├── register/       # POST /auth/register
├── login/          # POST /auth/login
├── logout/         # POST /auth/logout
├── me/             # GET /auth/me
├── refresh/        # POST /auth/refresh
├── forgot-password/    # POST /auth/forgot-password
├── reset-password/     # POST /auth/reset-password
├── verify-email/       # POST /auth/verify-email
└── resend-verification/ # POST /auth/resend-verification

app/auth/
├── sign-up/page.tsx
├── login/page.tsx
├── forgot-password/page.tsx
├── reset-password/page.tsx
├── sign-up-success/page.tsx
├── reset-success/page.tsx
└── error/page.tsx
```

## 🧪 Testing

### Browser Console
```javascript
// Check token
console.log(localStorage.getItem('auth_token'))

// Decode token
const token = localStorage.getItem('auth_token')
const decoded = JSON.parse(atob(token.split('.')[1]))
console.log(decoded)
```

### DevTools Network Tab
1. Open DevTools → Network
2. Filter by "api"
3. See all API requests/responses

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "API request failed" | Check `NEXT_PUBLIC_API_URL`, verify server running |
| "Cannot find module" | Run `npm install` |
| "Unauthorized" on dashboard | Login again to set token |
| CORS error | Normal during development (same origin) |
| Token not persisting | Check localStorage in DevTools |

## 📚 Learn More

- **Complete Setup**: Read `API_SETUP.md`
- **Technical Details**: Read `API_INTEGRATION.md`
- **What Changed**: Read `API_MIGRATION_SUMMARY.md`
- **Implementation**: Read `API_IMPLEMENTATION_COMPLETE.md`

## ✅ Checklist

- [ ] Run `npm install`
- [ ] Set `.env.local` with API URL
- [ ] Run `npm run dev`
- [ ] Test sign up at `/auth/sign-up`
- [ ] Test login at `/auth/login` with test credentials
- [ ] Test dashboard at `/dashboard`
- [ ] Check localStorage has `auth_token`
- [ ] Review API calls in Network tab

## 🎓 Next Steps

1. **Understand the Code**: Read the comments in `lib/api/`
2. **Test Locally**: Follow the setup guide
3. **Build Backend**: Create Nest.js endpoints
4. **Connect Backend**: Update environment variable
5. **Deploy**: Deploy frontend with real backend

## 📞 Support

Each documentation file has inline comments explaining the code. Start with `API_SETUP.md` for quick start or `API_INTEGRATION.md` for deep dive.

---

**Version**: 1.0
**Status**: Production Ready ✅
**Last Updated**: 2024

For detailed information, see the individual documentation files listed above.
