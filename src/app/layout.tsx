import { UIProviders } from '@/app/providers/NextUIProvider'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopBar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shift Tracker - Chief Janitorial',
  description: 'Shift Tracker - Chief Janitorial',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <UIProviders>
          <TopBar />
          <div className="px-4 py-8">{children}</div>
        </UIProviders>
      </body>
    </html>
  )
}
