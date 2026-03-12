-- Create enum type for user roles
CREATE TYPE user_role AS ENUM ('user', 'studio_owner', 'admin');

-- Create public.users table that references auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'user',
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can view and update their own profile
CREATE POLICY "users_select_own" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_delete_own" ON public.users 
  FOR DELETE USING (auth.uid() = id);

-- Admin can view all users
CREATE POLICY "admin_view_all" ON public.users 
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Create password_reset_tokens table for password reset functionality
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on password_reset_tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Only users can see their own reset tokens
CREATE POLICY "reset_tokens_select_own" ON public.password_reset_tokens 
  FOR SELECT USING (auth.uid() = user_id);

-- Index for token lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
