'use client'

import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-14 lg:py-16 px-6 lg:px-8 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
          Stop Working for Free
        </h2>
        <p className="text-lg lg:text-xl text-orange-100 mb-8 font-normal">
          Check every broker. Every time. Starting today.
        </p>
        
        <Link 
          href="/checkout"
          className="inline-block bg-white text-orange-600 text-lg lg:text-xl font-bold px-12 py-4 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
          onClick={() => {
            // track final_cta_click
          }}
        >
          Get HaulVerify V1 Now – $47
        </Link>
      </div>
    </section>
  )
}
