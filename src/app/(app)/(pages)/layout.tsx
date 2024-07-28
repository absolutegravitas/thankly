/**
@file layout.tsx
@module RootLayout
@description This module serves as the root layout for the Next.js application and handles various aspects of the application, including providers, analytics, theme settings, and global components.
@overview
The RootLayout module is a React component that serves as the root layout for the Next.js application. It sets up the application's structure, providers, and global components. Additionally, it handles analytics tracking, theme settings, and fetches global settings from the PayloadCMS.

The component renders an HTML structure with a head and body section. The head section includes various meta tags, links, and scripts for favicon, Google Analytics, Google Tag Manager, and theme initialization. The body section wraps the application's content with the necessary providers, header, footer, and privacy banner components.

The fetchSettings function is responsible for fetching the global settings from the PayloadCMS. It utilizes the Next.js cache to improve performance and cache the settings for a specified duration.

The RootLayout component renders the application's content within the Providers component, which sets up the global state and context providers. The Header and Footer components are rendered based on the fetched settings. The PrivacyBanner component is always rendered, and the Analytics and SpeedInsights components are included for tracking and performance monitoring purposes.

The metadata export object sets the base URL, Twitter card settings, and open graph metadata for the application.
*/

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

import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

import { Header } from '@app/_components/Header'
import { Footer } from '@app/_components/Footer'
import { Menu, Setting } from '@payload-types'

const fetchSettings = (): Promise<Setting | null> => {
  const cachedSettings = unstable_cache(
    async (): Promise<Setting | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let settings = null

      // console.log('settings -- ', JSON.stringify(settings))

      try {
        settings = await payload.findGlobal({
          slug: 'settings',
          depth: 1,
        })
      } catch (error) {
        console.error(`Error fetching settings`, error)
      }
      return settings
    },
    ['settings'],
    {
      revalidate: 10, // 60 seconds

      // revalidate: 60, // 60 seconds
      tags: ['settings'],
    },
  )

  return cachedSettings()
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <PrivacyProvider>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <GoogleAnalytics />
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
          className={`${[leaguespartan.variable, inter.variable, raleway.variable].join(' ')} dark:bg-neutral-900 dark:text-dark-text`}
        >
          <Providers>
            {settings && <Header {...settings} />}
            {children}
            {settings?.footer && <Footer {...settings?.footer}></Footer>}
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
