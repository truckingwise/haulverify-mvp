'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCodeHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle')
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
    
    const supabase = createClient()
    
    const handleAuth = async () => {
      try {
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!authError && data?.session) {
          window.location.href = '/tool'
          return
        }

        // PKCE failed - redirect to login with message
        setStatus('error')
        setErrorMsg('Login link expired. Please request a new code.')
        
      } catch (err: any) {
        setStatus('error')
        setErrorMsg('Login link expired. Please request a new code.')
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
          </>
        )}
        
        {status === 'error' && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Link Expired</h2>
            <p className="text-gray-600 mb-6">{errorMsg}</p>
            <a 
              href="/login" 
              className="inline-block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold"
            >
              Get New Login Code
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
