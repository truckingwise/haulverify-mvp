'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient()

      // First, check if there's already a session (implicit flow auto-detects from URL hash)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (session) {
        console.log('✅ Session found!')
        setStatus('success')
        setTimeout(() => {
          window.location.href = '/tool'
        }, 500)
        return
      }

      // Check URL hash for tokens (implicit flow puts tokens in hash)
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        console.log('🔑 Found tokens in URL hash')
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
          console.error('Failed to set session:', error)
        }
      }

      // Check for code (PKCE flow - fallback)
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const errorParam = params.get('error')
      
      if (errorParam) {
        setStatus('error')
        setErrorMsg(params.get('error_description') || errorParam)
        return
      }

      if (code) {
        console.log('🔐 Trying code exchange...')
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!authError && data?.session) {
          setStatus('success')
          setTimeout(() => {
            window.location.href = '/tool'
          }, 500)
          return
        }
        
        console.error('Code exchange failed:', authError)
        setStatus('error')
        setErrorMsg('Login link expired. Please request a new one.')
        return
      }

      // Nothing worked
      if (sessionError) {
        console.error('Session error:', sessionError)
      }
      setStatus('error')
      setErrorMsg('Unable to complete sign in. Please try again.')
    }

    // Small delay to let Supabase client initialize and detect session from URL
    setTimeout(handleAuth, 100)
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
