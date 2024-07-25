import { Metadata } from 'next'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import '@app/_css/app.scss'

import { GoogleAnalytics } from '@app/_components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@app/_components/Analytics/GoogleTagManager'
import { PrivacyBanner } from '@app/_components/PrivacyBanner'
import { PrivacyProvider } from '@app/_providers/Privacy'
// import { ThemeProvider } from '@app/_providers/ThemeProvider'
import { Providers } from '@app/_providers'
import { fetchSettings } from '@app/_queries/settings'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'
import Script from 'next/script'
import { defaultTheme, themeLocalStorageKey } from '@app/_providers/Theme/shared'
import { inter, leaguespartan, raleway } from '@/utilities/fonts'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.thankly.co'),
  twitter: {
    card: 'summary_large_image',
    creator: '@thanklyco',
  },
  openGraph: mergeOpenGraph(),
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings: any = await fetchSettings()
  // console.log('settings found', settings.footer)

  return (
    <html
      lang="en"
      suppressHydrationWarning
      // className={`${interTight.className}
      // ${leaguespartan.variable}`}
    >
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
              function getImplicitPreference() {
                var mediaQuery = '(prefers-color-scheme: light)'
                var mql = window.matchMedia(mediaQuery)
                var hasImplicitPreference = typeof mql.matches === 'boolean'

                if (hasImplicitPreference) {
                  return mql.matches ? 'light' : 'light'
                }

                return null
              }

              function themeIsValid(theme) {
                return theme === 'light' || theme === 'light'
              }

              var themeToSet = '${defaultTheme}'
              var preference = window.localStorage.getItem('${themeLocalStorageKey}')

              if (themeIsValid(preference)) {
                themeToSet = preference
              } else {
                var implicitPreference = getImplicitPreference()

                if (implicitPreference) {
                  themeToSet = implicitPreference
                }
              }

              document.documentElement.setAttribute('data-theme', themeToSet)
            })()`,
            }}
          />
        </head>
        <body
          className={[
            leaguespartan.variable,
            inter.variable,
            raleway.variable,
            // untitledSans.variable,
          ].join(' ')}
        >
          <Providers>
            {/* {settings && <Header {...settings} />} */}
            {children}
            {/* {settings?.footer && <Footer {...settings?.footer}></Footer>} */}
            <PrivacyBanner />
            <Analytics />
            <SpeedInsights />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}
