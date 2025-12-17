import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white rounded-2xl p-10 text-center shadow-2xl">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to HaulVerify V1!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your payment was successful. You now have lifetime access.
        </p>
        
        {/* Next steps */}
        <div className="bg-purple-50 rounded-xl p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next:</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <span className="text-gray-700"><strong>Check your email</strong> for a magic login link (use the same email you paid with)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <span className="text-gray-700"><strong>Click the link</strong> to access the tool instantly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <span className="text-gray-700"><strong>Start checking brokers</strong> with your lifetime V1 access</span>
            </li>
          </ul>
        </div>
        
        {/* Email notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-yellow-800">
            📧 <strong>Don't see the email?</strong> Check spam/junk folder, or <a href="/login" className="text-purple-600 underline">request a new login link</a>.
          </p>
        </div>
        
        {/* CTA */}
        <Link
          href="/tool"
          className="inline-block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xl font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          Go to Tool
        </Link>
        
        {/* Support note */}
        <p className="text-sm text-gray-500 mt-6">
          Questions? Email support@haulverify.com
        </p>
      </div>
    </main>
  )
}
