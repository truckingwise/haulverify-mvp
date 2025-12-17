'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ToolPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mcNumber, setMcNumber] = useState('')
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          // Clear any stale cookies and redirect
          await supabase.auth.signOut()
          router.push('/login')
          return
        }
        
        setUser(user)
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mcNumber.trim()) return

    setChecking(true)
    setError(null)
    setResult(null)

    try {
      const cleanMC = mcNumber.replace(/^MC-?/i, '').trim()
      
      const response = await fetch(
        `https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number/${cleanMC}?webKey=c9a5e695656ae72cb482e917db8c52bd2dd83bcc`
      )

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.content || data.content.length === 0) {
        setError('No broker found with that MC number. Check the number and try again.')
        return
      }

      const carrier = data.content[0].carrier
      const brokerStatus = carrier.brokerAuthorityStatus
      const allowedToOperate = carrier.allowedToOperate

      let riskLevel: 'green' | 'yellow' | 'red' = 'yellow'
      let riskLabel = ''
      let riskDescription = ''

      if (brokerStatus === 'A' && allowedToOperate === 'Y') {
        riskLevel = 'green'
        riskLabel = 'LOW RISK'
        riskDescription = 'Active broker authority, allowed to operate'
      } else if (brokerStatus === 'N') {
        riskLevel = 'red'
        riskLabel = 'HIGH RISK'
        riskDescription = 'Not a broker - this is a carrier pretending to be a broker'
      } else if (brokerStatus === 'I') {
        riskLevel = 'red'
        riskLabel = 'HIGH RISK'
        riskDescription = 'Inactive broker authority'
      } else if (allowedToOperate === 'N') {
        riskLevel = 'red'
        riskLabel = 'HIGH RISK'
        riskDescription = 'Not authorized to operate'
      } else {
        riskLevel = 'yellow'
        riskLabel = 'VERIFY'
        riskDescription = 'Requires additional verification'
      }

      setResult({
        companyName: carrier.legalName || 'Unknown',
        dotNumber: carrier.dotNumber || 'N/A',
        mcNumber: cleanMC,
        riskLevel,
        riskLabel,
        riskDescription,
        brokerStatus: brokerStatus === 'A' ? 'Active' : brokerStatus === 'N' ? 'Not a Broker' : 'Inactive',
        allowedToOperate: allowedToOperate === 'Y' ? 'Yes' : 'No'
      })
    } catch (err) {
      console.error('Lookup error:', err)
      setError('Failed to check broker. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-lg font-bold text-gray-900">HaulVerify</span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">V1</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Broker Verification Tool</h1>
          <p className="text-gray-600">V1 Lifetime Access</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <form onSubmit={handleCheck} className="space-y-4">
            <div>
              <label htmlFor="mc" className="block text-sm font-medium text-gray-700 mb-2">
                Enter MC or DOT Number
              </label>
              <input
                id="mc"
                type="text"
                value={mcNumber}
                onChange={(e) => setMcNumber(e.target.value)}
                placeholder="e.g. 139016 or MC-139016"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={checking || !mcNumber.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                'Check Broker'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className={`p-4 text-center ${
              result.riskLevel === 'green' ? 'bg-green-500' :
              result.riskLevel === 'yellow' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}>
              <p className="text-white text-2xl font-black">{result.riskLabel}</p>
              <p className="text-white/90 text-sm">{result.riskDescription}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Company Name</p>
                  <p className="text-lg font-semibold text-gray-900">{result.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">DOT Number</p>
                  <p className="text-lg font-semibold text-gray-900">{result.dotNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">MC Number</p>
                  <p className="text-lg font-semibold text-gray-900">MC-{result.mcNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Broker Status</p>
                  <p className={`text-lg font-semibold ${
                    result.brokerStatus === 'Active' ? 'text-green-600' : 'text-red-600'
                  }`}>{result.brokerStatus}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Allowed to Operate</p>
                  <p className={`text-lg font-semibold ${
                    result.allowedToOperate === 'Yes' ? 'text-green-600' : 'text-red-600'
                  }`}>{result.allowedToOperate}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Data from public FMCSA records. This is a risk signal, not a guarantee. Always use your judgment.
              </p>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="text-center py-8 text-gray-500">
            <p>Enter an MC number above to check a broker</p>
          </div>
        )}
      </div>
    </main>
  )
}
