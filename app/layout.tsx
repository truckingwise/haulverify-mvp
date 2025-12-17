import './globals.css'

export const metadata = {
  title: 'HaulVerify V1 - Check Brokers Before You Haul',
  description: 'Instant red/yellow/green risk signals for broker MC numbers. Lifetime access to V1.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
