'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import LogoutButton from '@/app/components/logout-button'

interface User {
  id: string
  email: string
  role: 'user' | 'studio_owner' | 'admin'
  first_name: string | null
  last_name: string | null
}

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authUser, setAuthUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push('/auth/login')
          return
        }

        setAuthUser(session.user)

        // Fetch user profile from public.users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error('Error fetching user:', error)
        } else {
          setUser(data)
        }
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  if (!user || !authUser) {
    return null
  }

  const displayName = user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : authUser.email

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      user: 'Customer',
      studio_owner: 'Studio Owner',
      admin: 'Administrator',
    }
    return roleMap[role] || role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back, {displayName}!</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="text-lg font-semibold text-slate-900">{displayName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <p className="text-lg font-semibold text-slate-900">{authUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Account Type</p>
                <p className="text-lg font-semibold text-blue-600">{getRoleDisplay(user.role)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Email Verified</p>
                <p className={`text-lg font-semibold ${user.is_email_verified ? 'text-green-600' : 'text-red-600'}`}>
                  {user.is_email_verified ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-slate-600">Active Bookings</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-slate-900">0</p>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Account Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                Update Profile
              </button>
              <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors">
                Change Password
              </button>
              <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors">
                Account Settings
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Message based on Role */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Getting Started</h2>
          {user.role === 'user' && (
            <p className="text-slate-600">
              You can now browse available studios and make bookings. Use the navigation menu to find studios near you.
            </p>
          )}
          {user.role === 'studio_owner' && (
            <p className="text-slate-600">
              Welcome to your studio dashboard! You can manage your studio profile, view bookings, and update your availability.
            </p>
          )}
          {user.role === 'admin' && (
            <p className="text-slate-600">
              As an administrator, you have access to manage users, studios, bookings, and system settings.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
