'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCodeHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get('code')
    
    if (code) {
      // Handle auth code that landed on home page
      const handleAuth = async () => {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {
          // Successfully authenticated, redirect to tool
          router.push('/tool')
        }
      }
      
      handleAuth()
    }
  }, [searchParams, router])

  return null
}

