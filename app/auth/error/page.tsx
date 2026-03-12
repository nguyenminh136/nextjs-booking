'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'An authentication error occurred'
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Authentication Error</h1>
          <p className="text-slate-600 mb-6">{error}</p>

          {errorDescription && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {errorDescription}
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Try Signing In Again
            </Link>
            <Link
              href="/auth/sign-up"
              className="block bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Create New Account
            </Link>
          </div>

          <p className="text-center text-slate-600 mt-8">
            <button
              onClick={() => window.location.href = 'mailto:support@example.com'}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Need help? Contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
