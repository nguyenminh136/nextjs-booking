'use client'

import Link from 'next/link'

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Created!</h1>
          <p className="text-slate-600 mb-6">
            We've sent a verification email to your email address. Please check your email and click the verification
            link to complete your registration.
          </p>

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-8 text-sm">
            <strong>Note:</strong> Verification links expire in 24 hours. If you don't see the email, please check your
            spam folder.
          </div>

          <p className="text-slate-600 mb-4">After verifying your email, you can sign in to your account.</p>

          <Link
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Go to Sign In
          </Link>

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
