import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white py-16 px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm font-medium mb-8 inline-block">
          ← Back to HaulVerify
        </Link>
        
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">
            Last updated: December 2025
          </p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">What We Collect</h2>
            <p>
              When you use HaulVerify, we collect basic account information (email, password) and your search history within the tool.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">How We Use Your Data</h2>
            <p>
              We use your data to provide the HaulVerify service and improve the product. Your searches may be logged to help us enhance risk detection and user experience.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">We Do Not Sell Your Data</h2>
            <p>
              HaulVerify does not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Data Sources</h2>
            <p>
              Broker and carrier information displayed in HaulVerify comes from publicly available records, including FMCSA databases.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
            <p>
              All payments are processed securely through Stripe. We do not store your credit card information on our servers.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <p>
              If you have questions about this privacy policy, you can reach us at support@haulverify.com.
            </p>
          </section>
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © 2025 HaulVerify. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}


