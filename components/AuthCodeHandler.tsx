'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCodeHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code && !isProcessing) {
      setIsProcessing(true)
      console.log('🔐 Auth code detected, processing...')
      
      const handleAuth = async () => {
        try {
          const supabase = createClient()
          console.log('🔄 Exchanging code for session...')
          
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          console.log('📦 Exchange result:', { data, error })
          
          if (!error && data.session) {
            console.log('✅ Auth successful, redirecting to /tool')
            window.location.href = '/tool'
          } else {
            console.error('❌ Auth error:', error)
            setIsProcessing(false)
          }
        } catch (err) {
          console.error('❌ Exception:', err)
          setIsProcessing(false)
        }
      }
      
      handleAuth()
    }
  }, [searchParams, isProcessing])

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-purple-950 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Signing you in...</p>
          <p className="text-purple-300 mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  return null
}
