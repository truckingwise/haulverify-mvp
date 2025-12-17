import { Suspense } from 'react'
import Hero from '@/components/Hero'
import Problem from '@/components/Problem'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import AuthCodeHandler from '@/components/AuthCodeHandler'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <AuthCodeHandler />
      </Suspense>
      <Hero />
      <Problem />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
