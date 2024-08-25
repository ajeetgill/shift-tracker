import { UIProviders } from '@/app/providers/NextUIProvider'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/react'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopBar from '@/components/navbar'
import SignOutBtn from '@/components/signOutButton'

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
        <Toaster position="top-right" />
        <UIProviders>
          <TopBar />
          <div className="px-4 py-8 max-w-[550px] mx-auto">
            {children}
            <Analytics />
          <SignOutBtn />
          </div>
        </UIProviders>
      </body>
    </html>
  )
}
