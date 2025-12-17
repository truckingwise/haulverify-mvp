'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  
  const faqs = [
    {
      question: 'Is this lifetime access?',
      answer: 'Yes, but only to HaulVerify V1. You pay $47 once and can use V1 forever. If we release V2, that will be sold separately (likely $97/month). This is V1 only.'
    },
    {
      question: 'Do I get future updates or V2 for free?',
      answer: 'No. You get lifetime access to V1 as it is today. Future versions (V2, V3, etc.) are separate products and will require separate payment.'
    },
    {
      question: 'What data sources does HaulVerify use?',
      answer: 'We use public FMCSA data and basic risk rules. This is a risk signal tool, not a guarantee. Always use your own judgment before accepting a load.'
    },
    {
      question: 'Is this legal?',
      answer: "Yes. All data is from public sources. We don't hack or scrape private info. This is risk research, not a background check service."
    },
    {
      question: "What if a broker is flagged but they're actually legit?",
      answer: "Our system flags patterns, not perfection. If you know a broker well and trust them, use your judgment. HaulVerify shows you what we found—you make the call."
    },
    {
      question: 'Do I need to install anything?',
      answer: 'No. HaulVerify is web-based. Works on your phone, tablet, or computer. Just log in.'
    },
    {
      question: 'Can I get a refund?',
      answer: "Yes. 7-day money-back guarantee. If you're not happy, email us within 7 days for a full refund."
    },
    {
      question: 'How fast is the lookup?',
      answer: 'About 10 seconds. Enter MC/DOT, hit search, see results.'
    },
    {
      question: 'Can I check the same broker multiple times?',
      answer: 'Yes. Fair-use limits may apply to prevent abuse.'
    },
    {
      question: 'What if I have access issues?',
      answer: "Email support@haulverify.com and we'll take care of you. We're committed to keeping V1 running."
    }
  ]

  return (
    <section className="pt-16 lg:pt-20 pb-16 lg:pb-20 px-6 lg:px-8 bg-gray-100 relative">
      {/* Top border divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gray-300" />
      
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-3 tracking-tight">
          Common Questions
        </h2>
        <p className="text-lg text-gray-600 text-center mb-10 font-normal">
          Everything you need to know before you buy.
        </p>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={index} className="px-6 py-4">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center text-left group"
              >
                <span className="text-base lg:text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 pr-6">
                  {faq.question}
                </span>
                <span className={`text-gray-400 text-xl font-light transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600 pt-3 pb-1 leading-relaxed text-sm lg:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
