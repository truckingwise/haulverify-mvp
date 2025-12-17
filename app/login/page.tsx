'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Debug: Log environment on mount
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    console.log('🔧 Debug - Supabase URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET')
    console.log('🔧 Debug - Origin:', window.location.origin)
    console.log('🔧 Debug - Redirect URL will be:', `${window.location.origin}/auth/callback`)
    
    if (!supabaseUrl) {
      setDebugInfo('⚠️ NEXT_PUBLIC_SUPABASE_URL is not set!')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setDebugInfo('')

    console.log('📧 Starting magic link login for:', email)
    console.log('🔗 Redirect URL:', `${window.location.origin}/auth/callback`)

    try {
      const supabase = createClient()
      
      console.log('✅ Supabase client created')
      
      // ALWAYS use current origin - PKCE verifier is stored per-domain in sessionStorage
      // If we redirect to a different domain, the verifier won't be found!
      const redirectUrl = `${window.location.origin}/auth/callback`
      
      console.log('🔗 Using redirect URL (same origin as login):', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          // Use implicit flow to avoid PKCE verifier issues across browsers
          shouldCreateUser: false,
        },
      })

      console.log('📬 signInWithOtp response:', { data, error })

      if (error) {
        console.error('❌ Supabase error:', error)
        
        // Handle specific error types
        if (error.message?.includes('fetch') || error.name === 'AuthRetryableFetchError') {
          setMessage({ 
            type: 'error', 
            text: 'Unable to connect to authentication server' 
          })
          setDebugInfo('⚠️ Check Supabase dashboard: 1) Project is active (not paused) 2) Email auth is enabled 3) URL has no extra spaces')
        } else {
          setMessage({ type: 'error', text: error.message })
          setDebugInfo(`Error: ${error.name || 'unknown'}`)
        }
      } else {
        console.log('✅ Magic link sent successfully!')
        setMessage({ 
          type: 'success', 
          text: 'Check your email for a login link!' 
        })
        setEmail('')
      }
    } catch (err: any) {
      console.error('❌ Catch block error:', err)
      console.error('❌ Error name:', err?.name)
      console.error('❌ Error message:', err?.message)
      console.error('❌ Full error:', JSON.stringify(err, null, 2))
      
      // Check for specific error types
      if (err?.message?.includes('fetch')) {
        setMessage({ 
          type: 'error', 
          text: 'Network error connecting to Supabase' 
        })
        setDebugInfo('Check: 1) Supabase project is active (not paused) 2) No extra spaces in .env.local 3) Correct URL format')
      } else {
        setMessage({ type: 'error', text: err?.message || 'An unexpected error occurred' })
        setDebugInfo(err?.stack || '')
      }
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Back link */}
        <Link href="/" className="text-purple-300 hover:text-white text-sm font-medium mb-8 inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        
        {/* Login card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg className="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-2xl font-bold text-gray-900">HaulVerify</span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Sign in to your account
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your email to receive a magic login link
          </p>
          
          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Debug info (only shows when there's an issue) */}
          {debugInfo && (
            <div className="p-3 rounded-lg mb-4 bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs font-mono">
              {debugInfo}
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>
          
          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/checkout" className="text-purple-600 hover:text-purple-700 font-medium">
              Get HaulVerify V1
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
