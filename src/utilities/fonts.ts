// // eslint-disable-next-line camelcase
// import { Inter, League_Spartan, Raleway } from 'next/font/google'
import localFont from 'next/font/local'

// export const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// })

// export const leaguespartan = League_Spartan({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-leaguespartan',
// })

// export const raleway = Raleway({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// })

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

// export const interTight = localFont({
//   src: [
//     { path: '../../public/fonts/InterTight-Italic-VariableFont_wght.woff2' },
//     { path: '../../public/fonts/InterTight-VariableFont_wght.woff2' },
//   ],
//   variable: '--font-inter',
//   display: 'swap',
// })

export const raleway = localFont({
  src: [
    { path: '../../public/fonts/Raleway-Italic-VariableFont_wght.woff2' },
    { path: '../../public/fonts/Raleway-VariableFont_wght.woff2' },
  ],
  variable: '--font-raleway',
  display: 'swap',
})

// export const untitledSans = localFont({
//   src: [
//     {
//       path: '../../public/fonts/UntitledSans-Light.woff2',
//       style: 'normal',
//       weight: '300',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-LightItalic.woff2',
//       style: 'italic',
//       weight: '300',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-Regular.woff2',
//       style: 'normal',
//       weight: '400',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-RegularItalic.woff2',
//       style: 'italic',
//       weight: '400',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-Medium.woff2',
//       style: 'normal',
//       weight: '500',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-MediumItalic.woff2',
//       style: 'italic',
//       weight: '500',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-Bold.woff2',
//       style: 'normal',
//       weight: '700',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-BoldItalic.woff2',
//       style: 'italic',
//       weight: '700',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-Black.woff2',
//       style: 'normal',
//       weight: '800',
//     },
//     {
//       path: '../../public/fonts/UntitledSans-BlackItalic.woff2',
//       style: 'italic',
//       weight: '800',
//     },
//   ],
//   variable: '--font-inter',
// })
