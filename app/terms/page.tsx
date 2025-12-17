import Link from 'next/link'

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white py-16 px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/" className="text-purple-600 hover:text-purple-700 text-sm font-medium mb-8 inline-block">
          ← Back to HaulVerify
        </Link>
        
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">
            Last updated: December 2025
          </p>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">What HaulVerify Is</h2>
            <p>
              HaulVerify is a risk-signal tool that helps carriers and dispatchers research brokers using publicly available data. It provides indicators to help you make informed decisions.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Not a Guarantee</h2>
            <p>
              HaulVerify is not a guarantee of broker reliability or payment. The information provided is for reference only. You are responsible for making your own business decisions. Use HaulVerify as one input in your decision-making process, not as the final word.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Your Responsibility</h2>
            <p>
              By using HaulVerify, you agree that all decisions you make based on the information provided are at your own risk. We are not liable for any losses, damages, or disputes that arise from your use of the service.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Service Provided "As-Is"</h2>
            <p>
              HaulVerify is provided "as-is" without warranties of any kind. We do our best to provide accurate and timely information, but we cannot guarantee the completeness or accuracy of public data sources.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">V1 Access Only</h2>
            <p>
              Your purchase grants you lifetime access to HaulVerify V1 only. Future versions (V2, V3, etc.) are separate products and will require separate payment. V1 features and functionality are provided as they exist at the time of your purchase.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Refunds</h2>
            <p>
              We offer a 7-day money-back guarantee. If you're not satisfied with HaulVerify, contact us within 7 days of purchase for a full refund.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of HaulVerify after changes are posted constitutes acceptance of the new terms.
            </p>
          </section>
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <p>
              If you have questions about these terms, you can reach us at support@haulverify.com.
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


