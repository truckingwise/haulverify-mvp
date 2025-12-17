'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AuthCodeHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const processedRef = useRef(false)

  useEffect(() => {
    const code = searchParams.get('code')
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    // Handle error from Supabase
    if (error) {
      setStatus('error')
      setErrorMsg(errorDescription || error)
      return
    }

    // If we have tokens directly (implicit flow), set session
    if (accessToken) {
      processedRef.current = true
      setStatus('processing')
      
      const setSession = async () => {
        try {
          const { createClient } = await import('@supabase/supabase-js')
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
          
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })
          
          if (error) {
            setStatus('error')
            setErrorMsg(error.message)
            return
          }
          
          setStatus('success')
          setTimeout(() => {
            window.location.href = '/tool'
          }, 500)
        } catch (err: any) {
          setStatus('error')
          setErrorMsg(err?.message || 'Failed to set session')
        }
      }
      
      setSession()
      return
    }
    
    // Only process code once
    if (!code || processedRef.current) return
    processedRef.current = true
    
    setStatus('processing')
    
    const handleAuth = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        // First try OTP verification (works without PKCE)
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
        
        // If OTP fails, try code exchange
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!authError && data?.session) {
          setStatus('success')
          setTimeout(() => {
            window.location.href = '/tool'
          }, 500)
          return
        }
        
        // Both failed
        console.error('Auth failed:', otpError, authError)
        setStatus('error')
        setErrorMsg('Login link expired or already used. Please request a new one.')
        
      } catch (err: any) {
        console.error('Auth exception:', err)
        setStatus('error')
        setErrorMsg('Login link expired or already used. Please request a new one.')
      }
    }
    
    handleAuth()
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
