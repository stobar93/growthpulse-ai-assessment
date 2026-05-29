import type { Metadata } from 'next'
import './globals.css'
import { PostHogProvider } from '@components/PostHogProvider'
import { UTMCapture } from '@components/UTMCapture'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'GrowthPulse AI — Your marketing stack, diagnosed in minutes.',
  description:
    'Connect your marketing tools and get an automated diagnostic report scoring performance across 7 growth dimensions: acquisition, activation, retention, revenue, referral, SEO health, and paid media efficiency.',
  openGraph: {
    title: 'GrowthPulse AI — Your marketing stack, diagnosed in minutes.',
    description: 'Automated marketing diagnostic across 7 growth dimensions.',
    url: 'https://growthpulse.vercel.app',
    siteName: 'GrowthPulse AI',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'GrowthPulse AI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrowthPulse AI — Your marketing stack, diagnosed in minutes.',
    description: 'Automated marketing diagnostic across 7 growth dimensions.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <Suspense>
            <UTMCapture />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
