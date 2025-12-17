'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'processing' | 'error'>('processing')
  const [errorMsg, setErrorMsg] = useState('')

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

    if (!code) {
      setStatus('error')
      setErrorMsg('No authentication code found.')
      return
    }

    const supabase = createClient()

    const handleAuth = async () => {
      try {
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!authError && data?.session) {
          window.location.href = '/tool'
          return
        }

        // If PKCE fails, show friendly message
        setStatus('error')
        setErrorMsg('This login link has expired or was opened in a different browser. Please request a new code.')
        
      } catch (err: any) {
        setStatus('error')
        setErrorMsg('This login link has expired. Please request a new code.')
      }
    }
    
    handleAuth()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {status === 'processing' && (
          <>
            <div className="w-12 h-12 border-4 border-purple-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl font-semibold">Signing you in...</p>
          </>
        )}
        
        {status === 'error' && (
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Link Expired</h1>
            <p className="text-gray-600 mb-6">{errorMsg}</p>
            <a 
              href="/login" 
              className="inline-block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700"
            >
              Get New Login Code
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
