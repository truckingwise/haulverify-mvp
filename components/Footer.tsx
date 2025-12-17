import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-950 py-6 px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-base font-bold text-white tracking-tight">HaulVerify</span>
        </div>
        
        {/* Links */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium">
            Privacy Policy
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm font-medium">
            Terms of Service
          </Link>
        </div>
        
        {/* Divider + Copyright */}
        <div className="border-t border-gray-800 pt-4">
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-400">
              © 2025 HaulVerify. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              HaulVerify is not affiliated with FMCSA. Data is sourced from public records.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
