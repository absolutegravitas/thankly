import React from 'react'
import { Providers } from '@app/_providers/'
import { defaultTheme, themeLocalStorageKey } from '@app/_providers/Theme/shared'
import { Metadata } from 'next'
import Script from 'next/script'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@app/_components/Analytics/GoogleAnalytics'
// import { GoogleTagManager } from '@app/_components/Analytics/GoogleTagManager'
import { PrivacyBanner } from '@app/_components/PrivacyBanner'
import { PrivacyProvider } from '@app/_providers/Privacy'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { inter, leaguespartan, raleway } from '@/utilities/fonts'

import '@app/_css/app.scss'

import { Header } from '@app/_components/Header'
import { Footer } from '@app/_components/Footer'
import { Menu, Setting } from '@payload-types'

import FetchGlobal from '@/utilities/PayloadQueries/fetchGlobal'
import { MainMenuHeader } from '@app/_components/MainMenuHeader'
import BannerBlock, { BannerBlockProps } from '../_blocks/Banner'
import { Toaster } from '@app/_components/ui/toaster'
import { NewsletterPopupWrapper } from '@app/_blocks/NewsletterPopup/NewsletterPopupWrapper'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings: Setting = await FetchGlobal({ slug: 'settings', depth: 1 })

  const bannerFields: BannerBlockProps = {
    addCheckmark: true,
    content: settings.topBar?.content || '',
    visible: settings.topBar?.visible || false,
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <PrivacyProvider>
        <head>
          <link rel="icon" href="/favicon.svg" sizes="32x32" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          {/* <link rel="preconnect" href="https://www.google-analytics.com" />
          <GoogleAnalytics /> */}
          {/* <GoogleTagManager /> */}
          <Script
            id="theme-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function () {
             var themeToSet = 'light';
             document.documentElement.setAttribute('data-theme', themeToSet);
             document.documentElement.classList.add(themeToSet);
            })()`,
            }}
          />
        </head>
        <body
          className={`${[leaguespartan.variable, inter.variable, raleway.variable].join(' ')} dark:bg-neutral-900 dark:text-dark-text font-sans`}
        >
          <Providers>
            <div className="flex flex-col min-h-screen relative">
              <div className="sticky top-0 left-0 right-0 z-50">
                {settings && <BannerBlock bannerFields={bannerFields} />}
                {settings && <MainMenuHeader {...settings} />}
              </div>

              <main className="flex-grow mt-[var(--header-height,0px)] z-0">
                {children}
                {settings.newsletterPopup && settings.newsletterPopup !== null && (
                  <NewsletterPopupWrapper settings={settings.newsletterPopup} />
                )}
              </main>
              <Toaster />

              {settings?.footer && <Footer {...settings?.footer} />}
            </div>
            <PrivacyBanner />
            <Analytics />
            <SpeedInsights />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.thankly.co'),
  twitter: {
    card: 'summary_large_image',
    creator: '@thanklyco',
  },
  openGraph: mergeOpenGraph(),
}
