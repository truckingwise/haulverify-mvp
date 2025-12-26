'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasTracked = useRef(false)

  useEffect(() => {
    // Fire Meta Pixel InitiateCheckout event exactly once
    if (!hasTracked.current && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: 47.00,
        currency: 'USD'
      })
      hasTracked.current = true
    }

    // Small delay before redirecting (800-1200ms range)
    const redirectDelay = setTimeout(() => {
      createCheckout()
    }, 1000)

    const createCheckout = async () => {
      try {
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.url) {
          window.location.href = data.url
        } else {
          setError('Failed to create checkout session. Please try again.')
          setLoading(false)
        }
      } catch (err) {
        console.error('Checkout error:', err)
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    }

    return () => clearTimeout(redirectDelay)
  }, [])

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-2xl">
        {/* Loading spinner */}
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting you to secure Stripe checkout…</h1>
        <p className="text-gray-600">Please wait a moment.</p>
      </div>
    </main>
  )
}
