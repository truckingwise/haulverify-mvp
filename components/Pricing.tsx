'use client'

import Link from 'next/link'

export default function Pricing() {
  return (
    <section className="pt-16 lg:pt-20 pb-16 lg:pb-20 px-6 lg:px-8 bg-gradient-to-b from-purple-50 via-indigo-50/50 to-white relative">
      {/* Top divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
      
      <div className="max-w-md mx-auto">
        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] p-1 relative overflow-hidden">
          {/* Gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600 rounded-2xl" />
          
          <div className="relative bg-white rounded-[14px] p-8 lg:p-10">
            {/* Badge */}
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-bold uppercase tracking-wider rounded-full">
                V1 Lifetime Access
              </span>
            </div>
            
            {/* Price */}
            <div className="text-center mb-8">
              <span className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                $47
              </span>
              <p className="text-lg text-gray-600 mt-2 font-normal">One-Time Payment</p>
            </div>
            
            {/* Features list */}
            <div className="space-y-3 mb-8">
              {[
                'Unlimited broker lookups',
                'Instant risk signals',
                'Works on any device',
                'Lifetime V1 access'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <Link 
              href="/checkout"
              className="block w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-xl font-bold py-4 rounded-xl shadow-[0_15px_35px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.4)] transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 text-center"
              onClick={() => {
                // track pricing_cta_click
              }}
            >
              Get HaulVerify V1 Now
            </Link>
            
            {/* Guarantee badge */}
            <div className="mt-5 flex items-center justify-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium">7-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
