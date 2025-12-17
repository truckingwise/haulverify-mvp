export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: '🔓',
      title: 'Access Your Account',
      description: 'Create your account once and get instant access to HaulVerify V1.'
    },
    {
      number: 2,
      icon: '🔍',
      title: 'Enter MC or DOT',
      description: "Paste the broker's MC or DOT number and hit search."
    },
    {
      number: 3,
      icon: '🚨',
      title: 'See Risk Instantly',
      description: 'Red = walk away. Yellow = dig deeper. Green = good to go.'
    }
  ]

  return (
    <section className="bg-white py-16 lg:py-20 px-6 lg:px-8 pb-20 lg:pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-3 tracking-tight">
          How You Use HaulVerify
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 font-normal">
          Three steps. Ten seconds. Zero guesswork.
        </p>
        
        {/* Three Step Cards */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connecting lines (desktop only) */}
          <div className="hidden md:block absolute top-20 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200" />
          
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative z-10"
            >
              {/* Step number */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl text-xl font-bold text-white mx-auto mb-5 flex items-center justify-center shadow-[0_10px_30px_rgba(124,58,237,0.3)]">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="text-5xl lg:text-6xl mb-4">{step.icon}</div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-base text-gray-600 font-normal leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
