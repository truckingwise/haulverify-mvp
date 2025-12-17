'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCodeHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const processedRef = useRef(false)

  useEffect(() => {
    // Check if there's anything to process
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const hasTokenInHash = hash.includes('access_token')
    
    if (!code && !error && !hasTokenInHash) {
      return // Nothing to process
    }

    if (processedRef.current) return
    processedRef.current = true

    setStatus('processing')

    const handleAuth = async () => {
      const supabase = createClient()

      // Handle error from Supabase
      if (error) {
        setStatus('error')
        setErrorMsg(searchParams.get('error_description') || error)
        return
      }

      // Check for session first (implicit flow auto-detects)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setStatus('success')
        setTimeout(() => {
          window.location.href = '/tool'
        }, 500)
        return
      }

      // Try implicit flow tokens from hash
      if (hasTokenInHash) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        
        if (accessToken) {
          const { error: setError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })
          
          if (!setError) {
            setStatus('success')
            setTimeout(() => {
              window.location.href = '/tool'
            }, 500)
            return
          }
        }
      }

      // Try code exchange (PKCE fallback)
      if (code) {
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!authError && data?.session) {
          setStatus('success')
          setTimeout(() => {
            window.location.href = '/tool'
          }, 500)
          return
        }
      }

      // Nothing worked
      setStatus('error')
      setErrorMsg('Login link expired. Please request a new one.')
    }

    setTimeout(handleAuth, 100)
  }, [searchParams])

  if (status === 'idle') return null

  return (
    <div className="fixed inset-0 bg-purple-950 z-50 flex items-center justify-center">
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
              Request New Link
            </a>
          </>
        )}
      </div>
    </div>
  )
}
