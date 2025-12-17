'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Use the SAME client as login page (critical for PKCE!)
        const supabase = createClient()

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
        const errorParam = params.get('error')
        
        if (errorParam) {
          setStatus('error')
          setErrorMsg(params.get('error_description') || errorParam)
          return
        }

        if (code) {
          console.log('🔐 Exchanging code for session...')
          
          // Use the browser client which has the PKCE verifier stored
          const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
          
          console.log('📦 Exchange result:', { hasSession: !!data?.session, error: authError?.message })
          
          if (!authError && data?.session) {
            console.log('✅ Session created!')
            setStatus('success')
            setTimeout(() => {
              window.location.href = '/tool'
            }, 500)
            return
          }

          // If PKCE exchange failed, log the error
          console.error('❌ Code exchange failed:', authError)
          setStatus('error')
          setErrorMsg(authError?.message || 'Login link expired or already used.')
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
