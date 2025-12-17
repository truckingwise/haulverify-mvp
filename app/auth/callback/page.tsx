'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Check URL hash for tokens (implicit flow)
        const hash = window.location.hash
        if (hash) {
          const params = new URLSearchParams(hash.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          
          if (accessToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            })
            
            if (!error) {
              setStatus('success')
              setTimeout(() => {
                window.location.href = '/tool'
              }, 500)
              return
            }
          }
        }

        // Check URL params for code
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const error = params.get('error')
        
        if (error) {
          setStatus('error')
          setErrorMsg(params.get('error_description') || error)
          return
        }

        if (code) {
          // Try OTP verification first
          const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'magiclink',
          })
          
          if (!otpError && otpData.session) {
            setStatus('success')
            setTimeout(() => {
              window.location.href = '/tool'
            }, 500)
            return
          }

          // Try code exchange
          const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (!authError && data?.session) {
            setStatus('success')
            setTimeout(() => {
              window.location.href = '/tool'
            }, 500)
            return
          }

          setStatus('error')
          setErrorMsg('Login link expired or already used.')
          return
        }

        // No code or tokens found
        setStatus('error')
        setErrorMsg('Invalid login link.')

      } catch (err: any) {
        console.error('Auth error:', err)
        setStatus('error')
        setErrorMsg(err?.message || 'Authentication failed')
      }
    }

    handleAuth()
  }, [])

  return (
    <div className="min-h-screen bg-purple-950 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {status === 'processing' && (
          <>
            <div className="w-12 h-12 border-4 border-purple-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-semibold">Signing you in...</p>
            <p className="text-purple-300 mt-2">Please wait</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-xl font-semibold">Success!</p>
            <p className="text-purple-300 mt-2">Redirecting to your tool...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white text-xl font-semibold">Sign in failed</p>
            <p className="text-purple-200 mt-2 text-sm">{errorMsg}</p>
            <a 
              href="/login" 
              className="inline-block mt-6 px-6 py-3 bg-white text-purple-900 font-semibold rounded-lg hover:bg-purple-100"
            >
              Try Again
            </a>
          </>
        )}
      </div>
    </div>
  )
}
