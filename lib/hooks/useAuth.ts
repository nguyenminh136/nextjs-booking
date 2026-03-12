import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as AuthUser } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  role: 'user' | 'studio_owner' | 'admin'
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  is_email_verified: boolean
  created_at: string
  updated_at: string
}

export interface UseAuthReturn {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: Error | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    role: 'user' | 'studio_owner' | 'admin',
    firstName?: string,
    lastName?: string
  ) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const supabase = createClient()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          // Fetch user profile
          const { data, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (fetchError) throw fetchError
          setProfile(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check auth'))
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (data) setProfile(data)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign in failed'))
      throw err
    }
  }

  const signUp = async (
    email: string,
    password: string,
    role: 'user' | 'studio_owner' | 'admin',
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo:
            process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ||
            `${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign up failed'))
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Sign out failed'))
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL ||
          `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Password reset failed'))
      throw err
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Password update failed'))
      throw err
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }
}
