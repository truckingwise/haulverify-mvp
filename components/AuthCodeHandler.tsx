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
    const code = searchParams.get('code')
    
    // Only process once
    if (!code || processedRef.current) return
    processedRef.current = true
    
    setStatus('processing')
    console.log('🔐 Auth code detected:', code.substring(0, 8) + '...')
    
    const handleAuth = async () => {
      try {
        const supabase = createClient()
        console.log('🔄 Exchanging code for session...')
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('❌ Auth error:', error.message)
          setStatus('error')
          setErrorMsg(error.message)
          return
        }
        
        if (data.session) {
          console.log('✅ Session created!')
          setStatus('success')
          
          // Small delay to ensure cookies are set
          setTimeout(() => {
            window.location.href = '/tool'
          }, 500)
        } else {
          console.error('❌ No session returned')
          setStatus('error')
          setErrorMsg('No session created')
        }
      } catch (err: any) {
        console.error('❌ Exception:', err)
        setStatus('error')
        setErrorMsg(err?.message || 'Unknown error')
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
            <p className="text-red-300 mt-2">{errorMsg}</p>
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
