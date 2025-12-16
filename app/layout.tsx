export const metadata = {
  title: 'HaulVerify - Broker BS Detector',
  description: 'Verify broker MC numbers instantly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      <body style={{ margin: 0, padding: 0, width: '100%', height: '100%', overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
