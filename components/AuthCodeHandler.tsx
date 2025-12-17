'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default function AuthCodeHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const processedRef = useRef(false)

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    // Handle error from Supabase
    if (error) {
      setStatus('error')
      setErrorMsg(errorDescription || error)
      return
    }
    
    // Only process code once
    if (!code || processedRef.current) return
    processedRef.current = true
    
    setStatus('processing')
    
    const handleAuth = async () => {
      try {
        // Create a fresh Supabase client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseKey) {
          setStatus('error')
          setErrorMsg('Configuration error')
          return
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        
        // Try to exchange the code
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (authError) {
          // If PKCE fails, the code might be a magic link token
          // Try verifying as OTP token
          console.log('Code exchange failed, trying OTP verify...')
          
          const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'email',
          })
          
          if (otpError) {
            console.error('Both methods failed')
            setStatus('error')
            setErrorMsg('Link expired or already used. Please request a new login link.')
            return
          }
          
          if (otpData.session) {
            setStatus('success')
            setTimeout(() => {
              window.location.href = '/tool'
            }, 500)
            return
          }
        }
        
        if (data?.session) {
          setStatus('success')
          setTimeout(() => {
            window.location.href = '/tool'
          }, 500)
        } else {
          setStatus('error')
          setErrorMsg('Could not create session. Please try again.')
        }
      } catch (err: any) {
        console.error('Auth exception:', err)
        setStatus('error')
        setErrorMsg('Link expired or already used. Please request a new login link.')
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
