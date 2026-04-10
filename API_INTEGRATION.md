# API Integration Guide

This document explains how the frontend connects to the Nest.js backend API for authentication.

## Architecture Overview

The NextJS frontend now uses a **mock API layer** that simulates the Nest.js backend. This allows for:

1. **Local Development**: Test the full auth flow without needing the backend
2. **Easy Migration**: Switch to real Nest.js endpoints by updating `NEXT_PUBLIC_API_URL`
3. **Type Safety**: Consistent API contracts through TypeScript interfaces
4. **Token Management**: Centralized JWT token handling

## Project Structure

```
lib/
  ├── api/
  │   ├── client.ts         # API client with fetch logic
  │   ├── token.ts          # JWT token utilities
  │   ├── types.ts          # TypeScript interfaces
  │   └── auth.ts           # Auth-specific API functions
  └── hooks/
      └── useAuth.ts        # Custom auth hook (optional)

app/
  ├── api/
  │   └── auth/
  │       ├── register/     # Mock signup endpoint
  │       ├── login/        # Mock login endpoint
  │       ├── forgot-password/  # Mock password reset request
  │       ├── reset-password/   # Mock password reset confirm
  │       ├── refresh/      # Mock token refresh
  │       ├── me/           # Mock get current user
  │       ├── logout/       # Mock logout
  │       ├── verify-email/ # Mock email verification
  │       └── resend-verification/  # Mock resend verification
  └── auth/
      ├── sign-up/          # Registration page
      ├── login/            # Login page
      ├── forgot-password/  # Password reset request
      └── reset-password/   # Password reset form
```

## Environment Variables

### Development (Using Mock API)

```env
# Uses local Next.js API routes (http://localhost:3000/api)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
JWT_SECRET=your-secret-key-change-in-production
```

### Production (Using Nest.js Backend)

```env
# Switch to your Nest.js backend URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
JWT_SECRET=your-production-secret-key
```

## How It Works

### 1. Authentication Flow

**Sign Up**
```
User → SignUp Form → API Client → /api/auth/register → Mock Backend
                                 ↓
                            Validate Input
                            Create User
                            Generate JWT
                                 ↓
                            Return Token + User Data
                                 ↓
                            Store in localStorage
```

**Login**
```
User → Login Form → API Client → /api/auth/login → Mock Backend
                                ↓
                            Validate Credentials
                            Generate JWT
                                ↓
                            Return Token + User Data
                                ↓
                            Store in localStorage
```

**Protected Routes**
```
Page Load → SessionWatcher → Check localStorage token
                              ↓
                         Token exists? → Continue
                                   ↓
                         No Token → Redirect to /auth/login
```

### 2. Token Management

Tokens are stored in `localStorage` with the key `auth_token`:

```typescript
// Store token after login/signup
localStorage.setItem('auth_token', response.accessToken)

// Retrieve token for API requests
const token = localStorage.getItem('auth_token')

// Clear token on logout
localStorage.removeItem('auth_token')
```

The `apiClient` automatically adds the token to all requests:
```
Authorization: Bearer <token>
```

### 3. API Request Flow

```typescript
import { login } from '@/lib/api/auth'

const response = await login({ email, password })
// ↓
// apiClient.post('/auth/login', { email, password })
// ↓
// Adds Authorization header with token
// ↓
// Fetch request to NEXT_PUBLIC_API_URL + endpoint
```

## Switching to Real Nest.js Backend

### Step 1: Update Environment Variable
```env
# Change from mock to real backend
NEXT_PUBLIC_API_URL=https://your-nestjs-backend.com/api
```

### Step 2: Remove Mock API Routes

Delete or comment out the mock endpoints:
```
app/api/auth/register/route.ts
app/api/auth/login/route.ts
app/api/auth/forgot-password/route.ts
... (all other mock endpoints)
```

### Step 3: Ensure API Contracts Match

Verify your Nest.js backend returns the same response format:

**Register Response**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "user",
    "isEmailVerified": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Registration successful"
}
```

**Login Response**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "user",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "Login successful"
}
```

**Get Me (/auth/me)**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "user",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

## Testing the API

### Test Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "user",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

## Error Handling

All API functions throw typed errors:

```typescript
try {
  await login({ email, password })
} catch (error) {
  // error is typed as ApiError
  console.log(error.message)      // "Invalid credentials"
  console.log(error.statusCode)   // 401
  console.log(error.error)        // "UNAUTHORIZED"
}
```

## Token Refresh (Optional)

If your backend uses short-lived access tokens, implement refresh logic:

```typescript
// In apiClient.ts
private async refreshTokenIfNeeded(): Promise<void> {
  const token = localStorage.getItem('auth_token')
  const refreshToken = localStorage.getItem('refresh_token')
  
  if (!token || !refreshToken) return
  
  const { getRefreshTime } = await import('./token')
  const refreshTime = getRefreshTime(token)
  
  if (refreshTime < 60000) { // 1 minute remaining
    const response = await this.post('/auth/refresh', { refreshToken })
    localStorage.setItem('auth_token', response.accessToken)
  }
}
```

## Debugging

Enable detailed logging:

```typescript
// In api/client.ts
async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${this.baseUrl}${endpoint}`
  console.log('[API] Request:', { url, method: options.method, body: options.body })
  
  // ... rest of method
  
  console.log('[API] Response:', { status: response.status, data })
  return data
}
```

## Security Considerations

1. **Token Storage**: Currently using `localStorage` (vulnerable to XSS)
   - For production, consider: HttpOnly cookies, sessionStorage, or memory-only storage
   
2. **HTTPS Only**: Always use HTTPS in production
   
3. **CORS**: Backend should have proper CORS configuration
   
4. **Token Expiration**: Implement token refresh for long-lived sessions
   
5. **Password Security**: Passwords hashed with bcrypt (handled by backend)

## Related Files

- `/lib/api/client.ts` - Main API client
- `/lib/api/auth.ts` - Auth API functions
- `/lib/api/types.ts` - Type definitions
- `/app/components/logout-button.tsx` - Logout example
- `/app/dashboard/page.tsx` - Protected page example
