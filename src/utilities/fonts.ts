import localFont from 'next/font/local'

export const leaguespartan = localFont({
  src: '../../public/fonts/LeagueSpartan-VariableFont_wght.woff2',
  variable: '--font-leaguespartan',
  display: 'swap',
})

export const inter = localFont({
  src: [{ path: '../../public/fonts/Inter-VariableFont.woff2' }],
  variable: '--font-inter',
  display: 'swap',
})

export const raleway = localFont({
  src: [
    { path: '../../public/fonts/Raleway-Italic-VariableFont_wght.woff2' },
    { path: '../../public/fonts/Raleway-VariableFont_wght.woff2' },
  ],
  variable: '--font-raleway',
  display: 'swap',
  preload: false,
})
