# Authentication System Documentation

This application uses Supabase Authentication with email/password authentication and role-based access control.

## Features

- **User Registration** with role selection (User, Studio Owner, Admin)
- **Email Verification** - Users must verify their email before full access
- **Password Reset** - Secure password recovery via email link
- **Role-Based Access Control** - Different user types have different permissions
- **Session Management** - Automatic session handling with token refresh

## User Roles

1. **User (Customer)** - Can browse studios and make bookings
2. **Studio Owner** - Can manage their studio profile, view bookings, and update availability
3. **Admin** - Can manage users, studios, bookings, and system settings

## Database Schema

### Users Table (`public.users`)
- `id` (UUID) - References `auth.users(id)`
- `email` (TEXT) - User's email address
- `role` (user_role ENUM) - User's role (user, studio_owner, admin)
- `first_name` (TEXT) - First name
- `last_name` (TEXT) - Last name
- `phone` (TEXT) - Phone number
- `avatar_url` (TEXT) - Profile picture URL
- `is_email_verified` (BOOLEAN) - Email verification status
- `created_at` (TIMESTAMP) - Account creation time
- `updated_at` (TIMESTAMP) - Last update time

### Password Reset Tokens Table (`public.password_reset_tokens`)
- `id` (UUID) - Token ID
- `user_id` (UUID) - References `auth.users(id)`
- `token` (TEXT) - Reset token
- `expires_at` (TIMESTAMP) - Token expiration time
- `used_at` (TIMESTAMP) - When token was used (NULL if unused)
- `created_at` (TIMESTAMP) - Token creation time

## Authentication Flow

### Sign Up
1. User navigates to `/auth/sign-up`
2. Fills in email, password, role, and name
3. System creates account in Supabase Auth with metadata (role, first_name, last_name)
4. Database trigger automatically creates user record in `public.users`
5. Email verification sent to user
6. User redirected to `/auth/sign-up-success` page
7. User must verify email via link before accessing protected pages

### Sign In
1. User navigates to `/auth/login`
2. Enters email and password
3. Supabase validates credentials
4. Session is established
5. User redirected to `/dashboard`
6. Dashboard shows different content based on user role

### Password Reset
1. User navigates to `/auth/forgot-password`
2. Enters their email address
3. Supabase sends password reset email with verification link
4. User clicks link in email, redirected to `/auth/reset-password`
5. User enters new password
6. Password is updated in Supabase Auth
7. User redirected to `/auth/reset-success`
8. User can sign in with new password

## Environment Variables

Required environment variables (set by Supabase integration):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional environment variables:
```
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/api/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Routes

### POST `/api/auth/password-reset`
Initiates password reset flow.

**Request:**
```json
{
  "email": "user@example.com",
  "redirectUrl": "https://yourdomain.com/auth/reset-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

### GET `/api/auth/callback`
Handles email verification and password reset callbacks from Supabase.

**Query Parameters:**
- `code` - Authorization code from Supabase
- `next` - Redirect destination (default: `/dashboard`)

## Protected Pages

The following pages require authentication:
- `/dashboard` - Main user dashboard
- Any page under `/protected` (if created)

Unauthenticated users are automatically redirected to `/auth/login`.

## Client Setup

### Creating Supabase Client
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

### Server-Side Client
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
```

## Common Tasks

### Check Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### Get User Profile
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Update User Role (Admin Only)
```typescript
const { error } = await supabase
  .from('users')
  .update({ role: 'studio_owner' })
  .eq('id', userId)
```

### Sign Out
```typescript
await supabase.auth.signOut()
```

## Security

- **Row Level Security (RLS)** - All tables have RLS policies
- **Email Verification** - Required before full access
- **Password Hashing** - Handled by Supabase
- **Session Management** - Token refresh handled automatically
- **HTTPS Required** - In production

## Troubleshooting

### Email not received
- Check spam folder
- Verify email in Supabase Auth settings
- Check Supabase logs for send errors

### Cannot sign in after email verification
- Clear browser cookies and try again
- Verify email status in Supabase dashboard
- Check if user exists in `public.users` table

### Password reset link not working
- Links expire after 1 hour
- Request a new reset link
- Check that NEXT_PUBLIC_SUPABASE_REDIRECT_URL is correct

## Next Steps

1. Set up email provider in Supabase (currently uses Auth0 rate limits)
2. Customize email templates in Supabase
3. Add social login (Google, GitHub, etc.)
4. Implement role-based access control in pages
5. Add user profile update functionality
6. Implement booking system
