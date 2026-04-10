# API Setup Guide

Quick start guide for using the new API-based authentication system.

## Development Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Environment Variables
Create `.env.local` in the project root:

```env
# API Configuration (uses local mock API)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT Secret (change in production)
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Testing the Auth Flow

### Test Sign Up
1. Go to http://localhost:3000/auth/sign-up
2. Fill in the form (any email/password combination works)
3. Select a role (User, Studio Owner, or Admin)
4. Click "Create Account"
5. You'll be redirected to sign-up success page

### Test Login
1. Go to http://localhost:3000/auth/login
2. Use these credentials:
   - **Email**: `test@example.com`
   - **Password**: `password123`
3. You'll be redirected to `/dashboard`

### Test Password Reset
1. Go to http://localhost:3000/auth/forgot-password
2. Enter any email address
3. You'll see a success message
4. Go to http://localhost:3000/auth/reset-password?token=any-token
5. Enter a new password and confirm
6. You'll be redirected to reset success page

### Test Logout
1. On the dashboard, click the "Sign Out" button
2. You'll be logged out and redirected to login page

## Understanding the Architecture

### API Layers

```
Frontend Page Component
         ↓
    API Functions (lib/api/auth.ts)
         ↓
    API Client (lib/api/client.ts)
         ↓
    Fetch API
         ↓
    Next.js API Route (app/api/auth/*)
         ↓
    Mock Handler (or Real Backend)
```

### Token Flow

```
Sign Up/Login Page
    ↓
Call API Function (signUp/login)
    ↓
Receive accessToken
    ↓
Store in localStorage
    ↓
API Client auto-adds to headers
    ↓
Protected Pages check token
```

## API Functions Reference

All functions are imported from `@/lib/api/auth`:

### Authentication
- `signUp(data)` - Register new user
- `login(data)` - Login user
- `logout()` - Logout user
- `getMe()` - Get current user

### Password Reset
- `forgotPassword(data)` - Request password reset email
- `resetPassword(data)` - Confirm password reset

### Email Verification
- `verifyEmail(token)` - Verify email with token
- `resendVerificationEmail(email)` - Resend verification email

### Token Management
- `refreshToken(refreshToken)` - Refresh access token

## Using API in Components

### Sign Up Example
```typescript
import { signUp } from '@/lib/api/auth'

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp({
        email: 'user@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'user'
      })
      router.push('/auth/sign-up-success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  )
}
```

### Protected Page Example
```typescript
import { getMe } from '@/lib/api/auth'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe()
        setUser(response.user)
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('auth_token')
        router.push('/auth/login')
      }
    }

    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth/login')
    } else {
      fetchUser()
    }
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <p>Role: {user.role}</p>
    </div>
  )
}
```

## Browser DevTools Tips

### Check Token Storage
1. Open DevTools → Application → Local Storage
2. Look for `auth_token` key
3. Contains your JWT token

### Monitor API Calls
1. Open DevTools → Network tab
2. Filter by "api"
3. See all requests to `/api/auth/*`

### Decode JWT Token
In browser console:
```javascript
const token = localStorage.getItem('auth_token')
const decoded = JSON.parse(atob(token.split('.')[1]))
console.log(decoded)
```

## Switching to Real Backend

Once you have a Nest.js backend running:

### 1. Update Environment Variable
```env
NEXT_PUBLIC_API_URL=https://your-backend.com/api
```

### 2. Remove Mock API Routes
Delete these files (optional, can keep for reference):
```
app/api/auth/register/route.ts
app/api/auth/login/route.ts
app/api/auth/forgot-password/route.ts
app/api/auth/reset-password/route.ts
app/api/auth/refresh/route.ts
app/api/auth/me/route.ts
app/api/auth/logout/route.ts
app/api/auth/verify-email/route.ts
app/api/auth/resend-verification/route.ts
```

### 3. Test with Backend
The API functions will work with your backend without any changes to the component code!

## File Structure

```
lib/
  ├── api/
  │   ├── client.ts          # HTTP client
  │   ├── auth.ts            # Auth functions
  │   ├── types.ts           # TypeScript types
  │   └── token.ts           # JWT utilities
  └── hooks/
      └── useAuth.ts         # Auth hook (optional)

app/
  ├── api/auth/              # Mock endpoints
  │   ├── register/
  │   ├── login/
  │   ├── logout/
  │   ├── me/
  │   ├── refresh/
  │   ├── forgot-password/
  │   ├── reset-password/
  │   ├── verify-email/
  │   └── resend-verification/
  ├── auth/                  # Auth pages
  │   ├── sign-up/
  │   ├── login/
  │   ├── forgot-password/
  │   └── reset-password/
  └── components/
      ├── logout-button.tsx
      └── session-watcher.tsx
```

## Error Handling

All API calls throw errors with this structure:

```typescript
try {
  await login({ email, password })
} catch (error) {
  console.log(error.message)      // Error message
  console.log(error.statusCode)   // HTTP status
  console.log(error.error)        // Error code
}
```

Common errors:
- `400` - Bad request (validation error)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (email not verified)
- `500` - Server error

## Security Notes

For development, the mock API is fine. For production:

1. **Use HTTPS only** - Never send tokens over HTTP
2. **Secure token storage** - Consider HttpOnly cookies
3. **CORS properly configured** - Backend should allow requests
4. **Token expiration** - Implement token refresh
5. **Password validation** - Backend handles hashing
6. **Rate limiting** - Prevent brute force attacks

## Next Steps

1. ✅ Run the development server
2. ✅ Test the sign-up and login flows
3. ✅ Check token storage in DevTools
4. ✅ Try the protected dashboard page
5. 📋 Build your Nest.js backend
6. 📋 Update `NEXT_PUBLIC_API_URL`
7. 📋 Deploy to production

## Troubleshooting

### Problem: "Cannot find module '@/lib/api/auth'"
**Solution**: Make sure you ran `npm install` and the `lib/api/` files exist

### Problem: "API request failed"
**Solution**: 
- Check `NEXT_PUBLIC_API_URL` in env.local
- Make sure dev server is running on port 3000
- Check browser console for error details

### Problem: "Token not found" on dashboard
**Solution**:
- You must login first to set token
- Check localStorage has `auth_token` key
- Try logging in again

### Problem: CORS error
**Solution**:
- For development, this shouldn't happen (same origin)
- For production, ensure backend has CORS headers configured

## Documentation

- **Detailed API Reference**: See `API_INTEGRATION.md`
- **Migration Guide**: See `API_MIGRATION_SUMMARY.md`
- **Types Reference**: Check `lib/api/types.ts`

Need help? Check the inline comments in the code files.
