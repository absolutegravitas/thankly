import { Inter, League_Spartan, Raleway } from 'next/font/google'
import { Metadata } from 'next'
import { mergeOpenGraph } from '@app/_utilities/mergeOpenGraph'

import '@app/_css/app.scss'

import { GoogleAnalytics } from '@app/_components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@app/_components/Analytics/GoogleTagManager'
import { PrivacyBanner } from '@app/_components/PrivacyBanner'
import { PrivacyProvider } from '@app/_providers/Privacy'
// import { ThemeProvider } from '@app/_providers/ThemeProvider'
import { Providers } from '@app/_providers'
import { fetchSettings } from '@app/_queries'
import { TopBar } from './_components/TopBar'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'
import Script from 'next/script'
import { defaultTheme, themeLocalStorageKey } from '@app/_providers/Theme/shared'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const leaguespartan = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-leaguespartan',
})

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
})

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
  console.log('settings found', settings)

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} ${leaguespartan.variable} ${raleway.variable}`}
    >
      <PrivacyProvider>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          <GoogleAnalytics />
          <Script
            id="theme-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function () {
              function getImplicitPreference() {
                var mediaQuery = '(prefers-color-scheme: dark)'
                var mql = window.matchMedia(mediaQuery)
                var hasImplicitPreference = typeof mql.matches === 'boolean'

                if (hasImplicitPreference) {
                  return mql.matches ? 'dark' : 'light'
                }

                return null
              }

              function themeIsValid(theme) {
                return theme === 'light' || theme === 'dark'
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
        <body>
          {/* <GoogleTagManager /> */}
          <Providers>
            {settings?.topBar && Object.keys(settings.topBar).length > 0 && (
              <TopBar {...settings?.topBar} />
            )}
            {settings?.menu && <Header {...settings?.menu} />}
            {children}
            {settings?.footer && <Footer {...settings?.footer}></Footer>}
            <PrivacyBanner />
          </Providers>
        </body>
      </PrivacyProvider>
    </html>
  )
}
