'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Try to get email from URL params (Stripe can pass it)
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to HaulVerify V1!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was successful. You now have lifetime access to HaulVerify V1.
        </p>

        <div className="bg-purple-50 rounded-xl p-6 mb-6 text-left">
          <h2 className="font-semibold text-purple-900 mb-3">Next Steps:</h2>
          <ol className="space-y-3 text-purple-800">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span>Check your email for a login code from HaulVerify</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span>Go to login and enter your email</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span>Enter the 6-digit code from your email</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span>Start checking brokers!</span>
            </li>
          </ol>
        </div>

        <a
          href="/login"
          className="inline-block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
        >
          Go to Login →
        </a>

        <p className="text-gray-500 text-sm mt-4">
          Questions? Email support@haulverify.com
        </p>
      </div>
    </div>
  )
}
