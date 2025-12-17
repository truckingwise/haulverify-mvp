'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Send OTP code to email (NOT magic link)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create new users - they must pay first
        }
      })

      if (error) {
        if (error.message.includes('Signups not allowed')) {
          setError('No account found. Please purchase HaulVerify first.')
        } else {
          setError(error.message)
        }
        setLoading(false)
        return
      }

      setMessage('Check your email for a 6-digit code!')
      setStep('code')
    } catch (err: any) {
      setError('Network error. Please try again.')
    }
    
    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })

      if (error) {
        setError('Invalid or expired code. Please try again.')
        setLoading(false)
        return
      }

      if (data.session) {
        // Success! Redirect to tool
        window.location.href = '/tool'
      }
    } catch (err: any) {
      setError('Verification failed. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
            <path d="M20 4L4 12L20 20L36 12L20 4Z" fill="#7C3AED"/>
            <path d="M4 28L20 36L36 28V12L20 20L4 12V28Z" fill="#8B5CF6"/>
            <path d="M16 18L19 21L25 15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-2xl font-bold text-gray-900">HaulVerify</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {step === 'email' ? 'Welcome Back' : 'Enter Your Code'}
        </h1>
        <p className="text-gray-600 text-center mb-6">
          {step === 'email' 
            ? 'Enter your email to receive a login code' 
            : `We sent a 6-digit code to ${email}`}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {message}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Login Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              required
              maxLength={6}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
            />
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email')
                setOtp('')
                setError('')
                setMessage('')
              }}
              className="w-full mt-3 text-purple-600 hover:text-purple-700 text-sm"
            >
              ← Use different email
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Don't have access?{' '}
            <a href="/" className="text-purple-600 hover:text-purple-700 font-medium">
              Get HaulVerify
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
