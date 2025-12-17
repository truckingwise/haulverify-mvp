'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      
      if (code) {
        const supabase = createClient()
        
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('Auth error:', error)
          router.push('/login?error=auth_failed')
          return
        }
        
        // Wait a moment for cookies to be set
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Redirect to tool
        router.push('/tool')
      } else {
        router.push('/login')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  )
}

