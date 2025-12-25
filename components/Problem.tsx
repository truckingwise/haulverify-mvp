export default function Problem() {
  const painPoints = [
    'You haul the load. Then they disappear.',
    "You later find out the 'broker' was actually a carrier reselling the load.",
    'You spend days chasing money you already earned.'
  ]

  return (
    <section className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 lg:py-20 px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Headline */}
        <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-10 tracking-tight">
          Here's What Happens When the Broker Isn't a Broker
        </h2>
        
        {/* Pain bullets */}
        <div className="space-y-6 mb-12">
          {painPoints.map((point, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(239,68,68,0.3)]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-lg lg:text-xl text-gray-100 font-medium leading-relaxed pt-1.5">
                {point}
              </p>
            </div>
          ))}
        </div>
        
        {/* Stat callout */}
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-8 lg:p-10 text-center shadow-[0_20px_60px_rgba(239,68,68,0.3)]">
            <p className="text-5xl lg:text-6xl font-black text-red-400 mb-2 tracking-tight">$4,800</p>
            <p className="text-lg text-red-300 font-medium">Average loss per bad broker</p>
          </div>
        </div>
      </div>
    </section>
  )
}
