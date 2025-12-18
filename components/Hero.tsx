'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex flex-col px-6 lg:px-8 overflow-hidden noise-overlay">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Minimal Logo Header */}
      <div className="max-w-6xl mx-auto w-full pt-6 lg:pt-8 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg className="w-7 h-7 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-lg font-bold text-white/90 tracking-tight">HaulVerify</span>
          </div>
          
          {/* Login link */}
          <Link 
            href="/login"
            className="text-sm font-medium text-purple-200 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
          >
            Login →
          </Link>
        </div>
      </div>
      
      {/* Hero Content */}
      <div className="max-w-6xl mx-auto w-full flex-1 flex items-center py-12 lg:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 w-full">
          {/* LEFT COLUMN */}
          <div className="lg:w-[55%] text-center lg:text-left w-full">
            {/* V1 LIFETIME ACCESS badge */}
            <div className="inline-block mb-6 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-[0_10px_40px_rgba(249,115,22,0.3)] animate-pulse-slow">
              V1 LIFETIME ACCESS
            </div>
            
            {/* Headline with hierarchy */}
            <div className="mb-6 space-y-1">
              <p className="text-2xl lg:text-3xl font-semibold text-purple-200 tracking-tight">
                One Bad Broker Can Cost You
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-none tracking-tight">
                $5,000+
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-100 leading-tight tracking-tight">
                Check Them in 10 Seconds.
              </h2>
            </div>
            
            {/* Subheadline */}
            <p className="text-base lg:text-lg text-gray-300 leading-relaxed max-w-lg mb-8">
              Stop hauling blind. HaulVerify gives you instant red/yellow/green risk alerts BEFORE you book—so you never work for free again.
            </p>
            
            {/* CTA Button */}
            <div className="mb-5">
              <Link 
                href="/checkout"
                className="inline-block bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-lg lg:text-xl font-bold px-10 lg:px-12 py-4 lg:py-5 rounded-xl shadow-[0_20px_50px_rgba(249,115,22,0.4)] hover:shadow-[0_30px_60px_rgba(249,115,22,0.5)] transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                onClick={() => {
                  // track hero_cta_click
                }}
              >
                Get Instant Broker Alerts – $47
              </Link>
            </div>
            
            {/* Trust line */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-5 text-sm lg:text-base text-gray-100 font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Pay once
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Use forever
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Money-back guarantee
              </span>
            </div>
          </div>
          
          {/* RIGHT COLUMN */}
          <div className="lg:w-[42%] w-full">
            <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-2xl border border-purple-400/20 rounded-2xl shadow-[0_0_80px_rgba(124,58,237,0.3)] p-8 lg:p-10 animate-float-subtle">
              {/* Label */}
              <p className="text-base text-purple-200 font-semibold mb-5 tracking-wide">
                What You Get:
              </p>
              
              {/* Four proof points */}
              <div className="space-y-4">
                {[
                  '10-second lookups from your phone',
                  'Plain English warnings (not data dumps)',
                  'Red/yellow/green signals you actually understand',
                  'Works on iPhone, Android, laptop'
                ].map((text, i) => (
                  <div 
                    key={i}
                    className="bg-purple-800/30 hover:bg-purple-800/50 rounded-lg p-4 flex items-center gap-3 transition-all duration-300 cursor-default"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_8px_20px_rgba(34,197,94,0.3)]">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-100 text-base font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
