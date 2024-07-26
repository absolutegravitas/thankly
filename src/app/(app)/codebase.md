# .aidigestignore

```
# css
*.css
*.scss

# graphics
/_icons
/_graphics

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage
test/test-ignore.ts

# next.js
/.next/
/out/

# production
/build
dist
/public

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

# \_queries/token.ts

```ts
export const payloadToken = 'payload-token'
```

# \_queries/settings.ts

```ts
import { revalidatePath, unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Setting } from '@payload-types'

export const fetchSettings = unstable_cache(
  async (): Promise<Setting | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let settings = null

    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    // console.log('settings -- ', settings)
    return settings
  },
  ['settings'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['settings'],
  },
)

export const fetchHeader = unstable_cache(
  async (): Promise<Setting | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let settings = null

    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
      // set settings variable to be the menu key only
      if (settings) settings = settings.menu
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    // console.log('settings -- ', settings)
    return settings
  },
  ['fetchHeader'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['fetchHeader'],
  },
)

export const fetchFooter = unstable_cache(
  async (): Promise<Setting | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let settings = null

    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    // console.log('settings -- ', settings)
    return settings
  },
  ['fetchFooter'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['fetchFooter'],
  },
)
```

# \_queries/products.ts

```ts
// import 'server-only'

import { revalidatePath, unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Order, Product } from '@payload-types'

export const fetchProduct = async (slug: string): Promise<any | null> => {
  // let order: any | null = null
  // order = await getCart()

  const cachedFetchProduct = unstable_cache(
    async (): Promise<any | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let product: any | null = null

      try {
        // console.log('fetchPage slug //', slug) // should be 'home' if it's null

        const { docs } = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        product = docs[0]
        const inCart: boolean = false
        product = { ...product, inCart }

        // if (order && product) {
        //   product.inCart = order?.items?.some((p: any) => p.product.id === product?.id)
        //   // product = { ...product, inCart }
        //   // console.log('fetchProduct', product)
        // }
      } catch (error) {
        console.error(`Error fetching product: ${slug}`, error)
      } finally {
        // revalidatePath('/shop')
        return product || null
      }
    },
    [`fetchProduct-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      // revalidate: 300, // 5 min
      // revalidate: 3600, // 1 hour
      // revalidate: 86400, // 1 day
      // revalidate: 604800, // 1 week
      // revalidate: 2592000, // 1 month
      // revalidate: 31536000, // 1 year
      tags: [`fetchProduct-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchProduct()
}

export async function fetchProductStatic(slug: string) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
    pagination: false,
  })

  return docs[0] || null
}

export async function fetchProductSlugsStatic() {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  const { docs } = await payload.find({
    collection: 'products',
    depth: 0,
    pagination: false,
  })

  return docs.map((product: any) => ({
    slug: product.slug,
  }))
}

export const fetchShopList = async (): Promise<any[] | null> => {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let result: any[] | null = null

  try {
    const { docs } = await payload.find({
      collection: 'products',
      depth: 1,
      pagination: false,
    })

    if (docs?.length === 0) {
      // console.log('not found')
      return null
    }

    result = docs
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  return result
}

export const fetchProductSlugs = unstable_cache(
  async (): Promise<{ slug: string }[]> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let result: { slug: string }[] = []

    try {
      const { docs } = await payload.find({
        collection: 'products',
        depth: 0,
        pagination: false,
      })

      // console.log('products docs', docs)

      if (!docs || docs.length === 0) {
        // console.log('not found')
        return [] // Return an empty array instead of null
      }

      // console.log('found products list')
      result = docs.map((product: Product) => ({
        slug: product.slug,
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    // revalidatePath('/shop')
    return result // Always return an array
  },
  ['fetchProductSlugs'],
  {
    revalidate: 60, // 10 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year
    tags: ['fetchProductSlugs'],
  },
)
```

# \_queries/fetchMe.ts

```ts
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { User } from '@/payload-types'
// import { ME_QUERY } from './graphql/me'
import { payloadToken } from './token'

export const fetchMe = async (args?: {
  nullUserRedirect?: string
  userRedirect?: string
}): Promise<{
  user: User
  token?: string
}> => {
  const { nullUserRedirect, userRedirect } = args || {}
  const cookieStore = cookies()
  const token = cookieStore.get(payloadToken)?.value

  const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['user'] },
    body: JSON.stringify({
      // query: ME_QUERY,
    }),
  })

  const json = await meUserReq.json()

  const user = json?.data?.meUser?.user

  if (userRedirect && meUserReq.ok && user) {
    redirect(userRedirect)
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect)
  }

  return {
    user,
    token,
  }
}
```

# \_providers/index.tsx

```tsx
'use client'

import React from 'react'
import { CookiesProvider } from 'react-cookie'
// import { IconProps, Slide, ToastContainer } from 'react-toastify'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { MouseInfoProvider } from '@faceless-ui/mouse-info'
import { ScrollInfoProvider } from '@faceless-ui/scroll-info'
import { WindowInfoProvider } from '@faceless-ui/window-info'
import { OrderProvider } from '@app/_providers/Order'
import { HeaderIntersectionObserver } from '@app/_providers/HeaderIntersectionObserver'
import { AuthProvider } from './Auth'
import { PageTransition } from './PageTransition'
import { ThemePreferenceProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <CookiesProvider>
      <AuthProvider>
        <OrderProvider>
          <ScrollInfoProvider>
            <MouseInfoProvider>
              <WindowInfoProvider
                breakpoints={{
                  s: '(max-width: 768px)',
                  m: '(max-width: 1100px)',
                  l: '(max-width: 1600px)',
                }}
              >
                <ThemePreferenceProvider>
                  <GridProvider
                    breakpoints={{
                      s: 768,
                      m: 1024,
                      l: 1680,
                    }}
                    rowGap={{
                      s: '1rem',
                      m: '1rem',
                      l: '2rem',
                      xl: '4rem',
                    }}
                    colGap={{
                      s: '1rem',
                      m: '2rem',
                      l: '2rem',
                      xl: '3rem',
                    }}
                    cols={{
                      s: 8,
                      m: 8,
                      l: 12,
                      xl: 12,
                    }}
                  >
                    <ModalProvider transTime={0} zIndex="var(--z-modal)">
                      <PageTransition>
                        <HeaderIntersectionObserver>
                          {children}
                          <ModalContainer />
                          {/* <ToastContainer
                            position="bottom-center"
                            transition={Slide}
                            // icon={false}
                            // TODO: Redesign icons
                            icon={({ type }: IconProps) => {
                              switch (type) {
                                case 'info':
                                  return <InfoIcon />
                                case 'success':
                                  return <CheckIcon />
                                case 'warning':
                                  return <ErrorIcon />
                                case 'error':
                                  return <CloseIcon />
                                default:
                                  return null
                              }
                            }}
                          /> */}
                        </HeaderIntersectionObserver>
                      </PageTransition>
                    </ModalProvider>
                  </GridProvider>
                </ThemePreferenceProvider>
              </WindowInfoProvider>
            </MouseInfoProvider>
          </ScrollInfoProvider>
        </OrderProvider>
      </AuthProvider>
    </CookiesProvider>
  )
}
```

# \_emails/reset-password.tsx

```tsx
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

interface ResetPasswordEmailProps {
  appName?: string
  userFirstname: string
  resetPasswordLink: string
}

const baseUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL : ''

export default function Email({
  appName = 'Payload',
  userFirstname,
  resetPasswordLink,
}: ResetPasswordEmailProps) {
  return (
    <Tailwind>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{appName} reset your password</Preview>
      <Body className="bg-zinc-900 text-zinc-300">
        <Container className="rounded-lg border border-solid border-white/[0.03] bg-zinc-800 p-12">
          <Row>
            <Column className="w-[80px]">
              <Img src={`${baseUrl}/icon.png`} width="60" height="60" alt={`${appName} logo`} />
            </Column>
            <Column>
              <Heading as="h2" className="text-2xl font-bold text-white">
                Reset Passoword
              </Heading>
            </Column>
          </Row>
          <Section>
            <Text className="dark:text-zinc-300">Hi {userFirstname},</Text>
            <Text className="dark:text-zinc-300">
              Someone recently requested a password change for your {appName} account. If this was
              you, you can set a new password here:
            </Text>
            <Button
              className="cursor-pointer rounded-md border border-solid border-blue-700 bg-blue-600 px-4 py-2 text-white"
              href={resetPasswordLink}
            >
              Reset password
            </Button>
            <Text className="dark:text-zinc-300">
              If you don&apos;t want to change your password or didn&apos;t request this, just
              ignore and delete this message.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  )
}
```

# \_css/tailwindClasses.ts

```ts
import cn from '@/utilities/cn'

export const blockFormats = {
  headerMenu: `antialiased font-title font-medium no-underline tracking-tight`,
  footerMenu: `antialiased font-title font-normal no-underline tracking-tight text-sm leading-snug ml-0 pl-0`,
  blockWidth: ` mx-auto max-w-screen-xl px-5`,
  blockPadding: ` py-16 sm:py-16 #mt-10`,
  shortVerticalPadding: `py-8 sm:py-8`,
}

export const contentFormats = {
  global: `antialiased`,

  alignLeft: ``,
  alignRight: ``,
  alignCenter: ``,
  alignJustify: ``,

  // gen text
  text: `#text-justify font-body font-light tracking-tight leading-snug prose-em:font-extrabold`,
  smallText: `text-sm text-left #text-justify font-body font-light tracking-tight leading-snug prose-em:font-extrabold #prose-em:text-neutral-700`,

  h1: `font-title font-semibold text-5xl tracking-tight`,
  h2: `font-title font-semibold text-2xl tracking-tight`,
  h3: `font-title font-semibold text-xl tracking-tighter`,
  h4: `font-title font-semibold text-lg tracking-tighter`,
  h5: `font-title font-semibold text-base tracking-tighter`,
  h6: `font-title font-semibold text-base tracking-tighter`,

  p: `font-body font-light tracking-tight lg:tracking-tighter`,
  blockquote: `font-body font-light tracking-tight lg:tracking-tighter`,
  pre: `font-body font-light tracking-tight lg:tracking-tighter`,
  code: `font-body font-light tracking-tight lg:tracking-tighter`,
  a: `font-body  font-light underline underline-offset-4 decoration-dotted decoration-neutral-800 hover:font-medium`,
  strong: `font-bold text-neutral-700`,

  em: 'font-bold text-neutral-700',
  italic: `italic`,
  ul: 'font-title font-light tracking-tight lg:tracking-tighter prose-ul:list-disc marker:text-neutral-700',
  li: 'font-title font-light tracking-tight lg:tracking-tighter  marker:text-neutral-700',
  ol: 'font-title font-light tracking-tight lg:tracking-tighter prose-ol:list-decimal marker:text-neutral-700',

  error: 'rounded-sm font-medium text-white bg-red-700 px-4 py-3',
  success: 'rounded-sm font-medium text-offwhite bg-lime-600 px-4 py-3',
  warning: 'rounded-sm font-medium  bg-amber-400 px-4 py-3',

  // order status
  orderProcessing: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,

  orderCompleted: `text-green-700 bg-green-50 ring-green-600/20`,
  orderCancelled: `text-red-600 bg-neutral-50 ring-neutral-500/10`,
  orderReturned: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,

  // order line item status
  lineItemProcessing: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`, // when just created
  lineItemShipped: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`, // when fulfilled

  lineItemCompleted: `text-green-700 bg-green-50 ring-green-600/20`,
  lineItemCancelled: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,
  lineItemReturned: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,
}

export const buttonLook = {
  base: `cursor-pointer antialiased font-body font-light tracking-tight items-center animate-fade-in transition justify-between`,

  sizes: {
    extrasmall: `text-xs px-2 py-2`,
    small: `text-sm px-3 py-2`,
    medium: `text-sm px-4 py-4`,
    large: `text-lg px-5 py-5 `,
  },

  widths: {
    narrow: ``,
    normal: `w-1/2`, // half container width, make sure there's a container
    wide: `w-full md:w-3/4`,
    full: `w-full`, // full width of containing element
  },

  variants: {
    base: `no-underline hover:no-underline border border-solid border-neutral-500 rounded-sm transition hover:border-green hover:shadow-md duration-150 shadow-sm dark:hover:border-green dark:text-dark-text`,
    links: `underline underline-offset-2 decoration-neutral-800 text-neutral-800 dark:text-dark-text hover:font-medium`,

    default: ``, // default look button
    blocks: `cursor-pointer bg-transparent no-underline inline-flex hover:border-green hover:shadow-md hover:bg-neutral-950 hover:text-white dark:hover:bg-green dark:hover:text-white dark:hover:border-green dark:hover:shadow-md`,
  },

  actions: {
    submit: `cursor-pointer`,
    submitting: `cursor-wait`,
    submitted: `cursor-auto`,
    disabled: `cursor-not-allowed opacity-75`,
  },
} as const

export const tailwindColorMatch = {
  '#ffffff': 'bg-white', // white
  '#c2c0ae': 'bg-lightkhaki', // light khaki
  '#dfded9': 'bg-lighterkhaki', // lighter khaki
  '#cbd5e1': 'bg-neutral-300', // slate gray
  '#557755': 'bg-green', // thankly green (dark)
  '#374151': 'bg-neutral-700', // slate black
  '#030712': 'bg-neutral-900', // jet black
}

export const textColorVariants = {
  '#557755': 'text-green', // thankly green (dark)
  '#c2c0ae': 'text-lightkhaki', // light khaki
  '#dfded9': 'text-lighterkhaki', // lighter khaki
  '#e7ecef': 'text-offwhite', // off-white
  '#d9d9d9': 'text-slategray', // slate gray
  '#292929': 'text-slateblack', // slate black
  '#0d1317': 'text-black', // jet black
}
type PaddingBlock = {
  mobile: string
  tablet: string
  desktop: string
  description: string
}

type ContentBlockTypes =
  | 'banner'
  | 'callout'
  | 'cardGrid'
  | 'content'
  | 'contentGrid'
  | 'cta'
  | 'form'
  | 'hero'
  | 'hoverCards'
  | 'hoverHighlights'
  | 'linkGrid'
  | 'logoGrid'
  | 'mediaBlock'
  | 'mediaContent'
  | 'mediaContentAccordion'
  | 'reuse'
  | 'richText'
  | 'slider'
  | 'steps'
  | 'statement'
  | 'stickyHighlights'

type ContentBlockPadding = {
  [key in ContentBlockTypes]: PaddingBlock
}

const contentBlockPadding: ContentBlockPadding = {
  banner: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Banner sections',
  },
  callout: {
    mobile: 'px-4 py-6',
    tablet: 'sm:px-6 sm:py-8',
    desktop: 'lg:px-8 lg:py-10',
    description: 'Callout sections',
  },
  cardGrid: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Card grid sections',
  },
  content: {
    mobile: 'px-4 py-6',
    tablet: 'sm:px-6 sm:py-8',
    desktop: 'lg:px-8 lg:py-12',
    description: 'Standard content sections',
  },
  contentGrid: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Content grid sections',
  },
  cta: {
    mobile: 'px-4 py-10',
    tablet: 'sm:px-6 sm:py-14',
    desktop: 'lg:px-8 lg:py-20',
    description: 'Call-to-Action sections',
  },
  form: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Form sections',
  },
  hero: {
    mobile: 'px-4 py-12',
    tablet: 'sm:px-6 sm:py-16',
    desktop: 'lg:px-8 lg:py-24',
    description: 'Hero sections',
  },
  hoverCards: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Hover cards sections',
  },
  hoverHighlights: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Hover highlights sections',
  },
  linkGrid: {
    mobile: 'px-4 py-6',
    tablet: 'sm:px-6 sm:py-8',
    desktop: 'lg:px-8 lg:py-12',
    description: 'Link grid sections',
  },
  logoGrid: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Logo grid sections',
  },
  mediaBlock: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Media block sections',
  },
  mediaContent: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Media content sections',
  },
  mediaContentAccordion: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Media content accordion sections',
  },
  reuse: {
    mobile: 'px-4 py-6',
    tablet: 'sm:px-6 sm:py-8',
    desktop: 'lg:px-8 lg:py-12',
    description: 'Reusable sections',
  },
  richText: {
    mobile: 'px-4 py-6',
    tablet: 'sm:px-6 sm:py-8',
    desktop: 'lg:px-8 lg:py-12',
    description: 'Rich text sections',
  },
  slider: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Slider sections',
  },
  steps: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Steps sections',
  },
  statement: {
    mobile: 'px-4 py-10',
    tablet: 'sm:px-6 sm:py-14',
    desktop: 'lg:px-8 lg:py-20',
    description: 'Statement sections',
  },
  stickyHighlights: {
    mobile: 'px-4 py-8',
    tablet: 'sm:px-6 sm:py-12',
    desktop: 'lg:px-8 lg:py-16',
    description: 'Sticky highlights sections',
  },
}

const getPaddingClasses = (blockType: ContentBlockTypes): string => {
  const block = contentBlockPadding[blockType]
  return `${block.mobile} ${block.tablet} ${block.desktop}`
}

export { contentBlockPadding, getPaddingClasses }
export type { ContentBlockTypes }
```

# \_css/cssVariables.js

```js
// @app/_css/cssVariables.js
const breakpoints = {
  s: 768,
  m: 1024,
  l: 1440,
}

export { breakpoints }
```

# \_components/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

type GridLineStyles = {
  [index: number]: React.CSSProperties
}

type Props = {
  className?: string
  ignoreGutter?: boolean
  style?: React.CSSProperties
  zIndex?: number
  gridLineStyles?: GridLineStyles
  wideGrid?: boolean
}

export const BackgroundGrid: React.FC<Props> = ({
  className,
  ignoreGutter,
  style,
  zIndex = -1,
  gridLineStyles = {},
  wideGrid = false,
}: Props) => {
  return (
    <div
      aria-hidden="true"
      className={[
        classes.backgroundGrid,
        'grid',
        ignoreGutter && classes.ignoreGutter,
        className,
        wideGrid && classes.wideGrid,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, zIndex }}
    >
      {[...Array(wideGrid ? 4 : 5)].map((_, index) => (
        <div
          key={index}
          className={[classes.column, 'cols-4'].join(' ')}
          style={gridLineStyles[index] || {}}
        ></div>
      ))}
    </div>
  )
}
```

# \_components/FormWrapper.tsx

```tsx
type FormWrapperProps = React.ComponentPropsWithoutRef<'div'> & {
  outerContent?: React.ReactNode
}
import cn from '@/utilities/cn'

export default function FormWrapper({
  children,
  className,
  outerContent,
  ...props
}: FormWrapperProps) {
  return (
    <div
      className={cn(
        'w-full max-w-[440px] space-y-4 rounded-lg bg-black/5 p-1 dark:bg-zinc-800 dark:text-white',
        !!outerContent && 'pb-5',
        className,
      )}
      {...props}
    >
      <div className="bg-white px-6 py-10 dark:bg-zinc-900">{children}</div>
      {outerContent ? outerContent : null}
    </div>
  )
}
```

# \_components/Container.tsx

```tsx
import cn from '@/utilities/cn'
import type { ComponentPropsWithoutRef } from 'react'

const Container = ({ children, className }: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div className={cn('container mx-auto w-full max-w-screen-lg px-3', className)}>{children}</div>
  )
}

export default Container
```

# \_blocks/index.tsx

```tsx
'use client'

import dynamic from 'next/dynamic'
import classes from '@app/_blocks/RichText/index.module.scss'
import React from 'react'

const Banner = dynamic(() => import('./Banner'))
const Callout = dynamic(() => import('./Callout'))
const CallToAction = dynamic(() => import('./CallToAction'))
const CardGrid = dynamic(() => import('./CardGrid'))
const Content = dynamic(() => import('./Content'))
const ContentGrid = dynamic(() => import('./ContentGrid'))
const FormBlock = dynamic(() => import('./FormBlock'))
const Hero = dynamic(() => import('./Hero'))
const HoverCards = dynamic(() => import('./HoverCards'))
const HoverHighlights = dynamic(() => import('./HoverHighlights'))
const LinkGrid = dynamic(() => import('./LinkGrid'))
const LogoGrid = dynamic(() => import('./LogoGrid'))
const MediaBlock = dynamic(() => import('./MediaBlock'))
const MediaContent = dynamic(() => import('./MediaContent'))
const MediaContentAccordion = dynamic(() => import('./MediaContentAccordion'))
const Pricing = dynamic(() => import('./Pricing'))
const Reusable = dynamic(() => import('./Reusable'))
const RichText = dynamic(() => import('./RichText'))
const Slider = dynamic(() => import('./Slider'))
const Statement = dynamic(() => import('./Statement'))

const Steps = dynamic(() => import('./Steps'))
const StickyHighlights = dynamic(() => import('./StickyHighlights'))

export type AdditionalBlockProps = {
  blockIndex: number
  locale: string
}

const blockComponents = {
  // pricing: Pricing,
  banner: Banner,
  callout: Callout,
  cardGrid: CardGrid,
  content: Content,
  contentGrid: ContentGrid,
  cta: CallToAction,
  form: FormBlock,
  hero: Hero,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  linkGrid: LinkGrid,
  logoGrid: LogoGrid,
  mediaBlock: MediaBlock,
  mediaContent: MediaContent,
  mediaContentAccordion: MediaContentAccordion,
  reuse: Reusable,
  RichText: RichText,
  slider: Slider,
  steps: Steps,
  statement: Statement,
  stickyHighlights: StickyHighlights,
}

const Blocks = ({ blocks, locale }: any) => {
  return (
    <React.Fragment>
      {blocks?.map((block: any, ix: number) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <RichText
                key={ix}
                content={{ root: { ...block } }}
                className={`${classes.content} py-6`}
              />
            )
          case 'block':
            if (block.fields && block.fields.blockType) {
              // @ts-ignore
              const BlockComponent = blockComponents[block.fields.blockType] ?? null
              return BlockComponent ? (
                <BlockComponent key={ix} {...block.fields} blockIndex={ix} locale={locale} />
              ) : null
            }
            break
          default:
            break
        }
      })}
    </React.Fragment>
  )
}

export default Blocks
```

# (pages)/page.tsx

```tsx
import PageTemplate from './[...slug]/page'
import { generateMetadata } from './[...slug]/page'

export default PageTemplate

export { generateMetadata }
```

# (pages)/not-found.tsx

```tsx
'use client'

import { useTransition } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, HomeIcon, ShoppingCartIcon } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <BlockWrapper settings={{ settings: { theme: 'light' } }} className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-3/4">
          <div className="justify-center text-center">
            <h2
              className={[
                contentFormats.global,
                contentFormats.text,
                'font-normal tracking-tighter',
              ].join(' ')}
            >
              Page not found
            </h2>
          </div>
          <div className="space-y-6 flex flex-col items-end justify-end justify-items-end flex-auto px-4 md:px-0 ">
            <CMSLink
              data={{
                label: 'Thankly Shop',
                type: 'custom',
                url: '/shop',
              }}
              look={{
                theme: 'light',
                type: 'button',
                size: 'medium',
                width: 'wide',
                variant: 'blocks',
                icon: {
                  content: <ShoppingCartIcon strokeWidth={1.25} />,
                  iconPosition: 'right',
                },
              }}
              actions={{
                onClick: async () => {
                  startTransition(async () => {
                    router.push('/shop')
                  })
                },
              }}
            />

            <CMSLink
              data={{
                label: 'Thankly Home',
                type: 'custom',
                url: '/',
              }}
              look={{
                theme: 'light',
                type: 'button',
                size: 'medium',
                width: 'wide',
                variant: 'blocks',
                icon: {
                  content: <HomeIcon strokeWidth={1.25} />,
                  iconPosition: 'right',
                },
              }}
              actions={{
                onClick: async () => {
                  startTransition(async () => {
                    router.push('/')
                  })
                },
              }}
            />
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
```

# (pages)/layout.tsx

```tsx
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
import { Setting } from '@payload-types'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings: any = await unstable_cache(
    async (): Promise<Setting | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let settings = null

      try {
        settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
      // console.log('settings -- ', settings)
      return settings
    },
    ['settings'],
    {
      revalidate: 60, // 60 seconds
      tags: ['settings'],
    },
  )

  // console.log('settings found', settings.footer)

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
```

# \_providers/Theme/types.ts

```ts
export type Theme = 'light' | 'dark'

export interface ThemePreferenceContextType {
  theme?: Theme | null
  setTheme: (theme: Theme | null) => void // eslint-disable-line no-unused-vars
}

export function themeIsValid(string: string | null): string is Theme {
  return string ? ['light', 'dark'].includes(string) : false
}
```

# \_providers/Theme/shared.ts

```ts
import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme = 'light'

export const getImplicitPreference = (): Theme | null => {
  const mediaQuery = '(prefers-color-scheme: light)'
  const mql = window.matchMedia(mediaQuery)
  const hasImplicitPreference = typeof mql.matches === 'boolean'

  if (hasImplicitPreference) {
    return mql.matches ? 'light' : 'light'
  }

  return null
}
```

# \_providers/Theme/index.tsx

```tsx
'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import canUseDom from '@/utilities/can-use-dom'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { Theme, themeIsValid, ThemePreferenceContextType } from './types'

const initialContext: ThemePreferenceContextType = {
  theme: undefined,
  setTheme: () => null,
}

const ThemePreferenceContext = createContext(initialContext)

export const ThemePreferenceProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDom ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      const implicitPreference = getImplicitPreference()
      document.documentElement.setAttribute('data-theme', implicitPreference || '')
      if (implicitPreference) setThemeState(implicitPreference)
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [])

  return (
    <ThemePreferenceContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemePreferenceContext.Provider>
  )
}

export const useThemePreference = (): ThemePreferenceContextType =>
  useContext(ThemePreferenceContext)
```

# \_providers/Privacy/index.tsx

```tsx
'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import canUseDom from '@/utilities/can-use-dom'
import { locate, LocateResponse } from '@/utilities/functions-api'

type Privacy = {
  showConsent?: boolean
  cookieConsent?: boolean
  updateCookieConsent: (accepted: boolean, rejected: boolean) => void
  country?: string
}

const Context = createContext<Privacy>({
  showConsent: undefined,
  cookieConsent: undefined,
  updateCookieConsent: () => false,
  country: undefined,
})

type CookieConsent = {
  accepted: boolean
  rejected: boolean
  at: string
  country: string
}

const getLocaleStorage = (): CookieConsent =>
  canUseDom && JSON.parse(window.localStorage.getItem('cookieConsent') || 'null')
const setLocaleStorage = (accepted: boolean, rejected: boolean, country: string) => {
  const cookieConsent: CookieConsent = {
    accepted,
    rejected,
    country,
    at: new Date().toISOString(),
  }
  window.localStorage.setItem('cookieConsent', JSON.stringify(cookieConsent))
}

const getGDPR = async (): Promise<LocateResponse> => {
  const res = await locate()
  if (res.status === 200) {
    const result: LocateResponse = await res.json()
    return result
  }
  return { isGDPR: true }
}

type PrivacyProviderProps = {
  children: React.ReactNode
}

const PrivacyProvider: React.FC<PrivacyProviderProps> = (props) => {
  const { children } = props
  const [showConsent, setShowConsent] = useState<boolean | undefined>()
  const [cookieConsent, setCookieConsent] = useState<boolean | undefined>()
  const [country, setCountry] = useState<string | undefined>()

  const updateCookieConsent = useCallback(
    (accepted: boolean, rejected: boolean) => {
      setCookieConsent(accepted)
      setLocaleStorage(accepted, rejected, country || '')
    },
    [country],
  )

  useEffect(() => {
    ;(async () => {
      const consent = getLocaleStorage()
      if (consent !== null) {
        setCountry(consent?.country)
        setCookieConsent(consent.accepted)
        return
      }
      const gdpr = await getGDPR()
      if (gdpr.country) {
        setCountry(gdpr.country)
      }
      if (!gdpr.isGDPR) {
        setCookieConsent(true)
        updateCookieConsent(true, false)
      }
      setShowConsent(gdpr?.isGDPR || false)
    })()
  }, [updateCookieConsent])

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (cookieConsent) {
          ReactPixel.grantConsent()
        } else {
          ReactPixel.revokeConsent()
        }
      })
  }, [cookieConsent])

  return (
    <Context.Provider
      value={{
        showConsent,
        cookieConsent,
        updateCookieConsent,
        country,
      }}
    >
      {children}
    </Context.Provider>
  )
}

const usePrivacy = (): Privacy => useContext(Context)

export { PrivacyProvider, usePrivacy }
```

# \_providers/PageTransition/index.tsx

```tsx
'use client'

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import canUseDom from '@/utilities/can-use-dom'

export const PageTransition: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const { children } = props
  const nodeRef = useRef(null)
  const pathname = usePathname()
  const hasInitialized = useRef(false)

  // this is used to force a re-render when the hash changes to avoid race conditions
  // by ensuring the DOM is updated before we running `getElementById` and `scrollIntoView`
  const [transitionTicker, dispatchTransitionTicker] = useReducer((state: number) => state + 1, 0)

  const [hash, setHash] = useState<string>(() => {
    if (!canUseDom) return ''
    return window.location.hash
  })

  useEffect(() => {
    const fn = () => {
      setHash(window.location.hash)
    }

    window.addEventListener('hashchange', fn)

    return () => window.removeEventListener('hashchange', fn)
  }, [])

  useEffect(() => {
    if (hash) {
      const hashWithoutMark = hash.substring(1)
      const element = document.getElementById(hashWithoutMark)
      element?.scrollIntoView()
    }
  }, [hash, transitionTicker])

  useEffect(() => {
    if (hasInitialized.current) {
      window.scrollTo(0, 0)
    }
    hasInitialized.current = true
  }, [pathname, hasInitialized])

  useEffect(() => {
    if (hash) dispatchTransitionTicker()
  }, [hash])

  return <div ref={nodeRef}>{children}</div>
}
```

# \_providers/Order/reducer.ts

```ts
import type { Order, Product } from '@/payload-types'
import { shippingPrices } from '@/utilities/refData'

export type OrderItem = NonNullable<Order['items']>[number]
type OrderType = Order
type ShippingMethod =
  // | 'free'
  'standardMail' | 'registeredMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

export type OrderAction =
  | { type: 'SET_ORDER'; payload: Order }
  | { type: 'MERGE_ORDER'; payload: Order }
  | { type: 'FORCE_UPDATE' }
  | {
      type: 'ADD_PRODUCT'
      payload: {
        product: Product | number
        price: number
      }
    }
  | {
      type: 'ADD_RECEIVER'
      payload: {
        productId: number | string
        receiver: NonNullable<NonNullable<Order['items']>[number]['receivers']>[number]
      }
    }
  | {
      type: 'COPY_RECEIVER'
      payload: {
        productId: number | string
        receiverId: string
      }
    }
  | {
      type: 'UPDATE_RECEIVER'
      payload: {
        productId: number | string
        receiverId: string
        updatedFields: Partial<
          NonNullable<NonNullable<Order['items']>[number]['receivers']>[number]
        >
      }
    }
  | {
      type: 'REMOVE_RECEIVER'
      payload: {
        productId: number | string
        receiverId: string
      }
    }
  | {
      type: 'UPDATE_SHIPPING_METHOD'
      payload: {
        productId: number | string
        receiverId: string
        delivery: { shippingMethod: ShippingMethod }
      }
    }
  | {
      type: 'REMOVE_PRODUCT'
      payload: {
        productId: number | string
      }
    }
  | { type: 'CLEAR_ORDER' }

const getProductId = (product: OrderItem['product']): string | number => {
  return typeof product === 'object' ? product.id : product
}

const calculateOrderTotals = (items: OrderItem[] | undefined): Order['totals'] => {
  if (!items) return { total: 0, cost: 0, shipping: 0 }

  items.forEach((item) => {
    const product = item.product as Product

    item.receivers?.forEach((receiver) => {
      let shipping: number | null = null

      const postalCode = (() => {
        if (
          typeof receiver.delivery?.address?.json === 'object' &&
          receiver.delivery?.address.json !== null
        ) {
          return (receiver.delivery?.address.json as { [k: string]: unknown })['postalCode'] as
            | string
            | undefined
        }
        return undefined
      })()

      if (
        product.productType &&
        receiver.delivery?.shippingMethod &&
        product.shippingSize &&
        postalCode
      ) {
        if (product.productType === 'card') {
          shipping =
            shippingPrices.cards[
              receiver.delivery?.shippingMethod as keyof typeof shippingPrices.cards
            ] ?? null
        } else if (product.productType === 'gift') {
          shipping =
            shippingPrices.gifts.size[
              product.shippingSize as keyof typeof shippingPrices.gifts.size
            ] ?? null

          if (shipping !== null) {
            if (isRegionalPostcode(postalCode)) {
              shipping += shippingPrices.gifts.surcharge.regional
            } else if (isRemotePostcode(postalCode)) {
              shipping += shippingPrices.gifts.surcharge.remote
            }

            if (receiver.delivery?.shippingMethod === 'expressParcel') {
              shipping += shippingPrices.gifts.surcharge.expressParcel
            }
          }
        }
      }

      receiver.totals = {
        cost: item.price || 0,
        shipping,
        subTotal: (item.price || 0) + (shipping || 0),
      }
    })

    item.totals = {
      cost: item.receivers?.reduce((sum, receiver) => sum + receiver.totals.cost, 0) || 0,
      shipping:
        item.receivers?.reduce((sum, receiver) => sum + (receiver.totals.shipping || 0), 0) || 0,
      subTotal: item.receivers?.reduce((sum, receiver) => sum + receiver.totals.subTotal, 0) || 0,
    }
  })

  return items.reduce(
    (totals, item) => ({
      cost: totals.cost + (item.totals?.cost || 0),
      shipping: totals.shipping + (item.totals?.shipping || 0),
      discount:
        totals.total + (item.totals?.subTotal || 0) > 150
          ? -1 * (totals.shipping + (item.totals?.shipping || 0))
          : 0,
      total: totals.total + (item.totals?.subTotal || 0),
    }),
    { total: 0, cost: 0, shipping: 0, discount: 0 },
  )
}

export const orderReducer = (order: Order, action: OrderAction): Order => {
  switch (action.type) {
    case 'SET_ORDER': {
      return action.payload
    }

    case 'MERGE_ORDER': {
      const { payload: incomingOrder } = action
      const mergedItems = [...(order.items || []), ...(incomingOrder.items || [])].reduce(
        (acc: OrderItem[], item) => {
          const existingItemIndex = acc.findIndex(
            (accItem) => getProductId(accItem.product) === getProductId(item.product),
          )
          if (existingItemIndex > -1) {
            acc[existingItemIndex] = {
              ...acc[existingItemIndex],
              receivers: [...(acc[existingItemIndex].receivers || []), ...(item.receivers || [])],
              totals: {
                subTotal:
                  (acc[existingItemIndex].totals?.subTotal || 0) + (item.totals?.subTotal || 0),
                cost: (acc[existingItemIndex].totals?.cost || 0) + (item.totals?.cost || 0),
                shipping:
                  (acc[existingItemIndex].totals?.shipping || 0) + (item.totals?.shipping || 0),
              },
            }
          } else {
            acc.push(item)
          }
          return acc
        },
        [],
      )

      return {
        ...order,
        items: mergedItems,
        totals: calculateOrderTotals(mergedItems),
      }
    }

    case 'ADD_PRODUCT': {
      const { product, price } = action.payload
      const productId = typeof product === 'object' ? product.id : product

      const existingItem = order.items?.find((item) =>
        typeof item.product === 'object'
          ? item.product.id === productId
          : item.product === productId,
      )

      if (existingItem) {
        return order
      }

      const newItem: OrderItem = {
        product: product,
        price: price,
        receivers: [],
        totals: {
          subTotal: 0,
          cost: 0,
          shipping: null,
        },
        id: Date.now().toString(),
      }

      const updatedItems = [...(order.items || []), newItem]

      const updatedOrder = {
        ...order,
        items: updatedItems,
      }

      return orderReducer(updatedOrder, {
        type: 'ADD_RECEIVER',
        payload: {
          productId: productId,
          receiver: {
            id: Date.now().toString(),
            name: null,
            message: null,
            delivery: {
              address: {
                addressLine1: null,
                addressLine2: null,
                formattedAddress: null,
                json: null,
              },
              shippingMethod: null,
            },
            totals: {
              subTotal: price,
              cost: price,
              shipping: null,
            },
          },
        },
      })
    }

    case 'REMOVE_PRODUCT': {
      const { productId } = action.payload
      const updatedItems = order.items?.filter(
        (item) => getProductId(item.product) !== productId,
      ) as OrderItem[]

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'ADD_RECEIVER': {
      const { productId, receiver } = action.payload
      const updatedItems =
        order.items?.map((item) => {
          if (getProductId(item.product) === productId) {
            return {
              ...item,
              receivers: [...(item.receivers || []), receiver],
              totals: {
                subTotal: (item.totals?.subTotal || 0) + (receiver.totals?.subTotal || 0),
                cost: (item.totals?.cost || 0) + (receiver.totals?.cost || 0),
                shipping: (item.totals?.shipping || 0) + (receiver.totals?.shipping || 0),
              },
            }
          }
          return item
        }) || []

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'COPY_RECEIVER': {
      const { productId, receiverId } = action.payload

      const updatedItems =
        order.items?.map((item) => {
          // find matching product

          if (getProductId(item.product) === productId) {
            // console.log('product --', productId)
            // find matching receiver
            const receiverToCopy = item.receivers?.find((r) => r.id === receiverId)
            // console.log('copiedreceiver --', receiverToCopy)
            // receiver found
            if (receiverToCopy) {
              const newReceiver: NonNullable<OrderItem['receivers']>[number] = {
                ...receiverToCopy,
                id: Date.now().toString(),
              }

              return {
                ...item,
                receivers: [...(item.receivers || []), newReceiver],
                totals: {
                  subTotal: (item.totals?.subTotal || 0) + (newReceiver.totals?.subTotal || 0),
                  cost: (item.totals?.cost || 0) + (newReceiver.totals?.cost || 0),
                  shipping: (item.totals?.shipping || 0) + (newReceiver.totals?.shipping || 0),
                },
              }
            }
          }
          return item
        }) || []

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'UPDATE_RECEIVER': {
      const { productId, receiverId, updatedFields } = action.payload

      // console.log('payload ', action.payload)
      const updatedItems = order.items?.map((item) => {
        if (getProductId(item.product) === productId) {
          const updatedReceivers = item.receivers?.map((receiver) =>
            receiver.id === receiverId ? { ...receiver, ...updatedFields } : receiver,
          )
          return { ...item, receivers: updatedReceivers }
        }
        // console.log('item ', item)
        return item
      })
      // console.log('updatedItems - ', updatedItems)

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'REMOVE_RECEIVER': {
      const { productId, receiverId } = action.payload
      const updatedItems = order.items
        ?.map((item) => {
          if (getProductId(item.product) === productId) {
            const updatedReceivers = item.receivers?.filter(
              (receiver) => receiver.id !== receiverId,
            )
            return { ...item, receivers: updatedReceivers }
          }
          return item
        })
        .filter((item) => item.receivers && item.receivers.length > 0) as OrderItem[]

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'UPDATE_SHIPPING_METHOD': {
      const {
        productId,
        receiverId,
        delivery: { shippingMethod },
      } = action.payload
      const updatedItems = order.items?.map((item) => {
        if (getProductId(item.product) === productId) {
          const updatedReceivers = item.receivers?.map((receiver) =>
            receiver.id === receiverId
              ? {
                  ...receiver,
                  delivery: {
                    ...receiver.delivery,
                    shippingMethod,
                  },
                }
              : receiver,
          )
          return { ...item, receivers: updatedReceivers }
        }
        return item
      }) as OrderItem[]

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'CLEAR_ORDER': {
      return {
        ...order,
        items: [],
        totals: {
          total: 0,
          cost: 0,
          shipping: 0,
        },
      }
    }

    default: {
      return order
    }
  }
}

type PostcodeRange = string | [string, string]

const metroPostcodeRanges: PostcodeRange[] = [
  ['1000', '1920'],
  ['2000', '2239'],
  ['2555', '2574'],
  ['2740', '2786'],
  ['3000', '3207'],
  ['3335', '3341'],
  ['3427', '3442'],
  ['3750', '3810'],
  ['3910', '3920'],
  ['3926', '3944'],
  ['3975', '3978'],
  ['3980', '3981'],
  ['5000', '5171'],
  ['5800', '5950'],
  ['6000', '6214'],
  ['6800', '6997'],
  ['8000', '8785'],
]

const regionalPostcodeRanges: PostcodeRange[] = [
  ['2250', '2483'],
  ['2500', '2551'],
  ['2575', '2594'],
  ['2621', '2647'],
  ['2649', '2714'],
  ['2716', '2730'],
  ['2787', '2880'],
  ['2648', '2715'],
  ['2717', '2731'],
  '2739',
  ['3211', '3334'],
  ['3342', '3424'],
  ['3444', '3749'],
  ['3812', '3909'],
  ['3921', '3925'],
  ['3945', '3971'],
  '3979',
  '3994',
  '3996',
  ['4371', '4372'],
  ['4382', '4390'],
  ['4406', '4498'],
  '4581',
  '4611',
  '4613',
  ['4620', '4723'],
  ['5201', '5734'],
  ['6215', '6646'],
  ['7000', '7254'],
  ['7258', '7323'],
]

const remotePostcodeRanges: PostcodeRange[] = [
  ['4724', '4870'],
  ['4872', '4873'],
  ['4877', '4888'],
  '4871',
  '4874',
  '4876',
  ['4890', '4895'],
  ['6701', '6770'],
  ['7255', '7257'],
  ['0800', '0821'],
  ['0828', '0834'],
  ['0870', '0871'],
  '0822',
  ['0835', '0862'],
  ['0872', '0875'],
  ['0880', '0881'],
  ['0885', '0909'],
]

function isInRange(postcode: string, ranges: PostcodeRange[]): boolean {
  return ranges.some((range) => {
    if (typeof range === 'string') {
      return postcode === range
    } else {
      const [start, end] = range
      return postcode >= start && postcode <= end
    }
  })
}

function isMetroPostcode(postcode: string): boolean {
  return isInRange(postcode, metroPostcodeRanges)
}

function isRegionalPostcode(postcode: string): boolean {
  return isInRange(postcode, regionalPostcodeRanges)
}

function isRemotePostcode(postcode: string): boolean {
  return isInRange(postcode, remotePostcodeRanges)
}
```

# \_providers/Order/orderActions.ts

```ts
// 'use server'
// import { headers, cookies } from 'next/headers'
// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'
// import { Order, Order } from '@/payload-types'
// import { revalidatePath, revalidateTag } from 'next/cache'
// import { getCart } from './cartActions'

// //////////////////////////////////////////////////////////
// export async function createOrder(orderId: string): Promise<Order | null> {
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let order: Order | null = await getCart(orderId)

//   if (!order) {
//     console.error('No order found')
//     return null
//   }

//   try {
//     const order: Order = await payload.create({
//       collection: 'orders',
//       data: {
//         orderNumber: Date.now(),
//         orderedBy: order.customer,
//         status: 'pending',
//         orderSubtotal: order.totals.cost,
//         orderShipping: order.totals.shipping,
//         orderTotal: order.totals.total,
//         items: order.items?.map((item) => ({
//           product: item.product,
//           itemPrice: item.price,
//           subTotalShipping: item.totals.shipping,
//           subTotal: item.totals.subTotal,
//           receivers: item.receivers?.map((receiver) => ({
//             name: receiver.name,
//             message: receiver.message,
//             addressLine1: receiver.delivery?.addressLine1,
//             addressLine2: receiver.delivery?.addressLine2,
//             city: receiver.city,
//             state: receiver.state,
//             postcode: receiver.postcode,
//             shippingMethod: receiver.delivery?.shippingMethod,
//             receiverPrice: receiver.totals.cost,
//             shipping: receiver.totals.shipping,
//             subTotal: receiver.totals.subTotal,
//           })),
//         })),
//       },
//     })

//     revalidatePath('/shop/checkout')
//     return order
//   } catch (error: any) {
//     console.error('Error creating order:', error)
//     return null
//   }
// }

// //////////////////////////////////////////////////////////
// export async function updateOrderStatus(
//   orderId: number,
//   status: Order['status'],
//   stripePaymentIntentID: string,
// ): Promise<Order | null> {
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })

//   try {
//     const updatedOrder: Order = await payload.update({
//       collection: 'orders',
//       id: orderId,
//       data: {
//         status,
//         stripePaymentIntentID,
//       },
//     })

//     revalidatePath(`/shop/order-confirmation/${orderId}`)
//     return updatedOrder
//   } catch (error: any) {
//     console.error('Error updating order status:', error)
//     return null
//   }
// }

// //////////////////////////////////////////////////////////

// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// export async function createPaymentIntent(orderId: string) {
//   try {
//     const order = await getCart(orderId)

//     if (!order || !order.totals || order.totals.total <= 0) {
//       throw new Error('Invalid order or order total')
//     }

//     const amount = Math.round(order.totals.total * 100) // Convert to cents

//     if (amount < 50) {
//       // Stripe's minimum amount is 50 cents
//       throw new Error('Order total is below the minimum allowed amount')
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: 'aud',
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     })

//     return { client_secret: paymentIntent.client_secret }
//   } catch (err: any) {
//     console.error('Error creating PaymentIntent:', err)
//     return { error: err.message }
//   }
// }
```

# \_providers/Order/index.tsx

```tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { Order, Product } from '@/payload-types'
import { OrderItem, orderReducer, OrderAction } from './reducer'
import { debounce } from 'lodash'

type ShippingMethod = 'standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null
type Receiver = NonNullable<OrderItem['receivers']>[number]
type UpdateReceiverFields = Partial<Omit<Receiver, 'id' | 'totals' | 'delivery'>> & {
  delivery?: Partial<Receiver['delivery']>
}

export type OrderContext = {
  order: Order
  orderIsEmpty: boolean
  hasInitializedOrder: boolean
  validateOrder: () => boolean

  isProductInOrder: (productId: string | number) => boolean

  addProduct: (product: Product, price: number) => void
  removeProduct: (productId: number | string) => void
  clearOrder: () => void

  addReceiver: (
    productId: number | string,
    receiver: NonNullable<OrderItem['receivers']>[number],
  ) => void

  updateReceiver: (
    productId: number | string,
    receiverId: string,
    updatedFields: UpdateReceiverFields,
  ) => void
  removeReceiver: (productId: number | string, receiverId: string) => void
  copyReceiver: (productId: number | string, receiverId: string) => void
  updateShippingMethod: (
    productId: number | string,
    receiverId: string,
    shippingMethod: ShippingMethod,
  ) => void
}

const Context = createContext<OrderContext | undefined>(undefined)
const debouncedUpdateLocalStorage = debounce((order) => {
  localStorage.setItem('cart', JSON.stringify(order))
}, 300)

export const useOrder = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useOrder must be used within a OrderProvider')
  }
  return context
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, dispatchOrder] = useReducer<React.Reducer<Order, OrderAction>>(orderReducer, {
    id: 0,
    items: [],
    status: 'pending' as const,
    totals: {
      total: 0,
      cost: 0,
      shipping: 0,
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })

  const [total, setTotal] = useState<{ formatted: string; raw: number }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedOrder, setHasInitialized] = useState(false)

  const validateOrder = useCallback((): boolean => {
    if (!order.items || order.items.length === 0) return false

    return order.items.every(
      (item) =>
        item.receivers &&
        item.receivers.every(
          (receiver) =>
            receiver.name &&
            receiver.message &&
            receiver.delivery?.address?.formattedAddress &&
            receiver.delivery?.shippingMethod,
        ),
    )
  }, [order])

  const addProduct = useCallback((product: Product | number, price: number) => {
    dispatchOrder({
      type: 'ADD_PRODUCT',
      payload: {
        product,
        price,
      },
    })
  }, [])

  const addReceiver = useCallback(
    (productId: number | string, receiver: NonNullable<OrderItem['receivers']>[number]) => {
      dispatchOrder({
        type: 'ADD_RECEIVER',
        payload: { productId, receiver },
      })
    },
    [],
  )

  const copyReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchOrder({
      type: 'COPY_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  const updateReceiver = useCallback(
    (productId: number | string, receiverId: string, updatedFields: UpdateReceiverFields) => {
      dispatchOrder({
        type: 'UPDATE_RECEIVER',
        payload: { productId, receiverId, updatedFields },
      })
    },
    [],
  )

  const removeReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchOrder({
      type: 'REMOVE_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  const updateShippingMethod = useCallback(
    (productId: number | string, receiverId: string, shippingMethod: ShippingMethod) => {
      dispatchOrder({
        type: 'UPDATE_SHIPPING_METHOD',
        payload: { productId, receiverId, delivery: { shippingMethod } },
      })
    },
    [],
  )

  const removeProduct = useCallback((productId: number | string) => {
    dispatchOrder({
      type: 'REMOVE_PRODUCT',
      payload: { productId },
    })
  }, [])

  const clearOrder = useCallback(() => {
    dispatchOrder({
      type: 'CLEAR_ORDER',
    })
  }, [])

  const isProductInOrder = useCallback(
    (productId: string | number): boolean => {
      return (
        order.items?.some((item) =>
          typeof item.product === 'object'
            ? item.product.id === productId
            : item.product === productId,
        ) || false
      )
    },
    [order.items],
  )

  const orderIsEmpty = useMemo(() => order.items?.length === 0, [order.items])

  const contextValue = useMemo(
    () => ({
      addProduct,
      addReceiver,
      order,
      orderIsEmpty,
      total: total,
      clearOrder,
      copyReceiver,

      hasInitializedOrder,
      isProductInOrder,
      removeProduct,
      removeReceiver,
      updateReceiver,
      updateShippingMethod,
      validateOrder,
    }),
    [
      addProduct,
      addReceiver,
      order,
      orderIsEmpty,
      clearOrder,
      copyReceiver,
      hasInitializedOrder,
      isProductInOrder,
      removeProduct,
      removeReceiver,
      total,
      updateReceiver,
      updateShippingMethod,
      validateOrder,
    ],
  )

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        try {
          const localCart = localStorage.getItem('cart')
          const parsedOrder = JSON.parse(localCart || '{}')

          if (parsedOrder?.items && parsedOrder.items.length > 0) {
            dispatchOrder({
              type: 'SET_ORDER',
              payload: parsedOrder,
            })
          } else {
            // console.log('OrderProvider: No items in local storage')
          }
        } catch (error) {
          // console.error('OrderProvider: Error initializing order:', error)
        } finally {
          setHasInitialized(true)
        }
      }

      syncCartFromLocalStorage()
    }
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) return
    debouncedUpdateLocalStorage(order)
  }, [order])

  useEffect(() => {
    if (!hasInitializedOrder) return

    setTotal({
      formatted: order.totals.total.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      raw: order.totals.total,
    })
  }, [order, hasInitializedOrder])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

# \_providers/Order/cartActions.ts

```ts
// 'use server'
// import { headers, cookies } from 'next/headers'
// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'
// import { Order } from '@/payload-types'
// import { revalidatePath, revalidateTag } from 'next/cache'
// import { shippingPrices } from '@/utilities/refData'

// //////////////////////////////////////////////////////////

// // export async function createOrder(order: Order): Promise<Order | null> {
// //   const config = await configPromise
// //   const payload = await getPayloadHMR({ config })

// //   try {
// //     if (!order) {
// //       throw new Error('Order not found')
// //     }

// //     // Create the draft order
// //     const order = await payload.create({
// //       collection: 'orders',
// //       data: {
// //         // orderNumber: Date.now(), // You might want to use a more sophisticated method
// //         billing: {
// //           // orderedBy: order.customer,
// //           name: order.billing.name,
// //           address: order.billing.address,
// //           email: order.billing.email,
// //           contactNumber: order.billing.contactNumber,
// //           orgName: order.billing.orgName,
// //           orgId: order.billing.orgId,
// //           billingAddress: order.billing.billingAddress,
// //         },
// //         status: 'pending',
// //         totals: { orderThanklys: 0, orderShipping: 0, orderTotal: 0 },
// //         items: order.items,
// //       },
// //     })

// //     // Don't clear the order yet, as we're just creating a draft order

// //     return order
// //   } catch (error) {
// //     console.error('Error creating draft order:', error)
// //     return null
// //   }
// // }

// //////////////////////////////////////////////////////////
// export async function getOrderId() {
//   return cookies().get('orderId')?.value
// }

// //////////////////////////////////////////////////////////
// export async function createOrder() {
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let order: Order | null = null

//   try {
//     order = await payload.create({
//       collection: 'orders',
//       data: {
//         items: [],
//         totals: { orderValue: 0, shipping: 0, thanklys: 0 },
//       },
//     })

//     if (order) {
//       const expiryDate = new Date()
//       expiryDate.setMinutes(expiryDate.getMinutes() + 60)

//       const cookieStore = cookies()
//       cookieStore.set('orderId', order.id.toString(), { expires: expiryDate })
//       // console.log('cookie saved...orderId:', order.id)
//       revalidatePath('/shop/order')
//     }
//   } catch (error: any) {
//     console.error(`Error fetching order.`, error)
//   } finally {
//     return order || null
//   }
// }

// //////////////////////////////////////////////////////////
// export async function getOrder(orderId?: string, depth?: number) {
//   const isStaticGeneration = typeof window === 'undefined' && !cookies().has('orderId')

//   if (isStaticGeneration) return null
//   if (!orderId) orderId = await getOrderId()
//   if (!orderId) return null

//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let order = null

//   try {
//     const { docs } = await payload.find({
//       collection: 'orders',
//       where: { id: { equals: orderId } },
//       depth: depth || 2,
//       limit: 1,
//       pagination: false,
//     })

//     order = docs[0]
//     if (order && order.items.length === 0) order = null

//     revalidatePath('/shop/order')
//   } catch (error) {
//     console.error(`Error fetching order: ${orderId}`, error)
//   }

//   return order || null
// }
```

# \_providers/HeaderIntersectionObserver/index.tsx

```tsx
'use client'

import * as React from 'react'
import { useWindowInfo } from '@faceless-ui/window-info'
import { usePathname } from 'next/navigation'

import { useThemePreference } from '@app/_providers/Theme'
import { Theme } from '@app/_providers/Theme/types'

import classes from './index.module.scss'

type ContextT = {
  addObservable: (el: HTMLElement, isAttached: boolean) => void
  headerTheme?: Theme | null
  setHeaderTheme: (theme?: Theme | null) => void
  debug?: boolean
}
const Context = React.createContext<ContextT>({
  addObservable: () => {},
  headerTheme: null,
  setHeaderTheme: () => {},
  debug: false,
})
export const useHeaderObserver = (): ContextT => React.useContext(Context)

type HeaderIntersectionObserverProps = {
  children: React.ReactNode
  debug?: boolean
}
export const HeaderIntersectionObserver: React.FC<HeaderIntersectionObserverProps> = ({
  children,
  debug = false,
}) => {
  const { height: windowHeight, width: windowWidth } = useWindowInfo()
  const { theme } = useThemePreference()
  const [headerTheme, setHeaderTheme] = React.useState<Theme | null | undefined>(theme)
  const [observer, setObserver] = React.useState<IntersectionObserver | undefined>(undefined)
  const [tick, setTick] = React.useState<number | undefined>(undefined)
  const pathname = usePathname()

  const addObservable = React.useCallback(
    (el: HTMLElement) => {
      if (observer) {
        observer.observe(el)
      }
    },
    [observer],
  )

  React.useEffect(() => {
    let observerRef: IntersectionObserver | undefined

    const cssHeaderHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height'),
      10,
    )

    let tickTimeout: NodeJS.Timeout | undefined
    if (!cssHeaderHeight) {
      // workaround for styles not always being loaded in time (oddity with NextJS App folder)
      tickTimeout = setTimeout(() => {
        setTick(tick === undefined ? 1 : tick + 1)
      }, 50)

      // early return to prevent the observer from being set up incorrectly
      return
    }

    if (windowHeight) {
      const halfHeaderHeight = windowHeight - Math.ceil(cssHeaderHeight / 2)

      observerRef = new IntersectionObserver(
        (entries) => {
          const intersectingElement = entries.find((entry) => entry.isIntersecting)

          if (intersectingElement) {
            setHeaderTheme(intersectingElement.target.getAttribute('data-theme') as Theme)
          }
        },
        {
          // intersection area is top of the screen from 0px to 50% of the header height
          // when the sticky element which is offset from the top by 50% of the header height
          // is intersecting the intersection area
          rootMargin: `0px 0px -${halfHeaderHeight}px 0px`,
          threshold: 0,
        },
      )

      setObserver(observerRef)
    }

    return () => {
      if (tickTimeout) clearTimeout(tickTimeout)
      if (observerRef) {
        observerRef.disconnect()
      }
    }
  }, [windowWidth, windowHeight, theme, tick])

  React.useEffect(() => {
    setHeaderTheme(theme)
  }, [pathname])

  return (
    <Context.Provider
      value={{
        addObservable,
        headerTheme,
        debug,
        setHeaderTheme,
      }}
    >
      <React.Fragment>
        {debug && <div className={classes.intersectionObserverDebugger} />}
        {children}
      </React.Fragment>
    </Context.Provider>
  )
}
```

# \_providers/ComputedCSSValues/index.tsx

```tsx
import * as React from 'react'
import { useResize } from '@/utilities/use-resize'

interface IComputedCSSValues {
  gutterH: number
}
export const Context = React.createContext<IComputedCSSValues | undefined>(undefined)
export const useComputedCSSValues = (): IComputedCSSValues => {
  const context = React.useContext(Context)

  if (context === undefined) {
    throw new Error('useComputedCSSValues must be used within a ComputedCSSValuesProvider')
  }

  return context
}

type Props = {
  children: React.ReactNode
}
export const ComputedCSSValuesProvider: React.FC<Props> = ({ children }) => {
  const gutterRef = React.useRef(null)
  const resize = useResize(gutterRef)

  return (
    <Context.Provider
      value={{
        gutterH: resize.size?.width ?? 0,
      }}
    >
      {children}
      <div ref={gutterRef} style={{ width: `var(--gutter-h)` }} />
    </Context.Provider>
  )
}
```

# \_providers/Auth/index.tsx

```tsx
'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { User } from '@/payload-types'

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Login = (args: { email: string; password: string }) => Promise<User> // eslint-disable-line no-unused-vars

type Logout = () => Promise<void>

type AuthContext = {
  user?: User | null
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  logout: Logout
  login: Login
  create: Create
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
  status: undefined | 'loggedOut' | 'loggedIn'
}

const Context = createContext({} as AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()

  // used to track the single event of logging in or logging out
  // useful for `useEffect` hooks that should only run once
  const [status, setStatus] = useState<undefined | 'loggedOut' | 'loggedIn'>()
  const create = useCallback<Create>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: args.email,
          password: args.password,
          passwordConfirm: args.passwordConfirm,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus('loggedIn')
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const login = useCallback<Login>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
      })

      if (res.ok) {
        const { user, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(user)
        setStatus('loggedIn')
        return user
      }

      throw new Error('Invalid login')
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        setUser(null)
        setStatus('loggedOut')
      } else {
        throw new Error('An error occurred while attempting to logout.')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to logout.')
    }
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (res.ok) {
          const { user: meUser } = await res.json()
          setUser(meUser || null)
          setStatus(meUser ? 'loggedIn' : undefined)
        } else {
          throw new Error('An error occurred while fetching your account.')
        }
      } catch (e) {
        setUser(null)
        throw new Error('An error occurred while fetching your account.')
      }
    }

    fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: args.email,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: args.password,
          passwordConfirm: args.passwordConfirm,
          token: args.token,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to login.')
    }
  }, [])

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        create,
        resetPassword,
        forgotPassword,
        status,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
```

# \_emails/static/icon.png

This is a binary file of the type: Image

# \_components/forms/validations.ts

```ts
import type { Validate } from './types'

const isValidEmail = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
)

export const validateEmail: Validate = (value) => {
  const stringValue = value as string

  if (!isValidEmail.test(stringValue)) {
    return 'Please enter a valid email address.'
  }

  return true
}

export const validateDomain: Validate = (domainValue: any | string) => {
  if (!domainValue) {
    return 'Please enter a domain'
  }

  const validDomainRegex = /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{0,62}[a-zA-Z0-9]\.)+[a-zA-Z]{2,63}$)/ // source: https://www.regextester.com/103452
  if (!domainValue.match(validDomainRegex)) {
    return `"${domainValue}" is not a fully qualified domain name.`
  }

  return true
}
```

# \_components/forms/types.ts

```ts
import type React from 'react'

export type Validate = undefined | ((value: unknown) => boolean | string)

export type Value = any // eslint-disable-line @typescript-eslint/no-explicit-any

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value | Property | Property[]
}

export interface OnSubmit {
  ({
    data,
    unflattenedData,
    dispatchFields,
  }: {
    data: Property
    unflattenedData: Data
    dispatchFields: React.Dispatch<Action>
  }): void | Promise<void>
}

export interface Field {
  valid?: boolean
  initialValue?: Value
  errorMessage?: string
  value?: Value
}

export interface InitialState {
  [key: string]: Field
}

export interface Fields {
  [key: string]: Field
}

export interface SetModified {
  (modified: boolean): void
}

export interface SetProcessing {
  (processing: boolean): void
}

export interface SetSubmitted {
  (submitted: boolean): void
}

export interface RESET {
  type: 'RESET'
  payload: Fields
}

export interface REMOVE {
  type: 'REMOVE'
  path: string
}

export interface REMOVE_ROW {
  type: 'REMOVE_ROW'
  path: string
  rowIndex: number
}

export interface FieldWithPath extends Field {
  path: string
}

export interface UPDATE {
  type: 'UPDATE'
  payload: FieldWithPath | FieldWithPath[]
}

export type Action = RESET | REMOVE | REMOVE_ROW | UPDATE

export interface IFormContext {
  initialState: InitialState
  fields: Fields
  validateForm: () => boolean
  handleSubmit?: (e: React.ChangeEvent<HTMLFormElement>) => Promise<boolean> | void | false
  getFields: () => Fields
  getField: (path: string) => Field | undefined
  getFormData?: () => Data
  dispatchFields: React.Dispatch<Action>
  setIsModified: (modified: boolean) => void
  setIsProcessing: (processing: boolean) => void
  setHasSubmitted: (submitted: boolean) => void
  apiErrors?: Array<{
    field: string
    message: string
  }>
  submissionError?: string
}
```

# \_components/cards/types.ts

```ts
import type { CMSLinkType } from '@app/_components/CMSLink'
import type { Media } from '@payload-types'

export interface SharedProps {
  price?: string | null
  title?: string | null
  description?: string | null
  className?: string
}

export interface SquareCardProps extends SharedProps {
  leader?: string
  enableLink?: boolean | null
  link?: CMSLinkType
  revealDescription?: boolean | null
}

export interface ContentMediaCardProps extends SharedProps {
  media: Media | string
  href: string
  publishedOn?: string
  authors: any['authors']
  orientation?: 'horizontal' | 'vertical'
}

export interface PricingCardProps extends SharedProps {
  leader?: string
  link?: CMSLinkType
  hasPrice?: boolean | null
}

export interface DefaultCardProps extends SharedProps {
  leader?: string
  pill?: string
  media?: Media | string | null
  href?: string
  onClick?: () => void
}
```

# \_components/UniversalTruth/index.tsx

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import classes from './index.module.scss'

export const UniversalTruth = () => {
  const universalTruth = useSearchParams().get('universaltruth') === 'pls'
  const cursorRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent) => {
    const cursor = cursorRef.current
    if (cursor) {
      cursor.style.top = e.clientY + 10 + 'px'
      cursor.style.left = e.clientX + 10 + 'px'
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return universalTruth ? <div className={classes.cursor} ref={cursorRef} /> : null
}
```

# \_components/TopBar/index.tsx

```tsx
'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'

import { modalSlug } from '@app/_components/Header/MobileNav'
import { RichText } from '@app/_blocks/RichText'

import type { TopBar as TopBarType } from '@payload-types'

import classes from './index.module.scss'

export const TopBar: React.FC<TopBarType> = (props) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(modalSlug)
  const { content } = props
  return (
    <React.Fragment>
      {content && typeof content === 'object' && Object.keys(content).length > 0 && (
        <div
          className={[classes.topBar, isMobileNavOpen && classes.mobileNavOpen]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={classes.wrap}>
            <div>
              <RichText className={classes.richText} content={content} />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
```

# \_components/Tooltip/index.tsx

```tsx
import * as React from 'react'

import { TooltipContent } from '@app/_components/Tooltip/TooltipContent'

import classes from './index.module.scss'

type TooltipProps = React.HTMLAttributes<HTMLButtonElement> & {
  text: React.ReactNode
  children: React.ReactNode
} & (
    | {
        isVisible?: never
        setIsVisible?: never
      }
    | {
        /**
         * If this is set, the button will not manage its own state
         */
        isVisible: boolean
        setIsVisible: (isActive: boolean) => void // eslint-disable-line no-unused-vars
      }
  )

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  className,
  text,
  onClick,
  isVisible: isActive,
  setIsVisible: setIsActive,
}) => {
  const [isVisibleInternal, setIsVisibleInternal] = React.useState(false)
  const hoistControl = typeof setIsActive === 'function'
  const show = hoistControl ? isActive : isVisibleInternal

  const onFocusChange = React.useCallback(
    (dir: string) => {
      const nowActive = dir === 'enter'

      if (hoistControl) {
        setIsActive(nowActive)
      } else {
        setIsVisibleInternal(nowActive)
      }
    },
    [setIsActive, hoistControl],
  )

  return (
    <button
      onFocus={() => onFocusChange('enter')}
      onBlur={() => onFocusChange('leave')}
      onMouseEnter={() => {
        onFocusChange('enter')
      }}
      onMouseLeave={() => {
        onFocusChange('leave')
      }}
      className={[classes.tooltip, show && classes.show, className].filter(Boolean).join(' ')}
      type="button"
      onClick={onClick}
    >
      {children}
      <TooltipContent className={classes.tip}>{text}</TooltipContent>
    </button>
  )
}
```

# \_components/SpotlightAnimation/types.ts

```ts
export type AllowedElements = Extract<
  keyof JSX.IntrinsicElements,
  'p' | 'span' | 'h1' | 'h2' | 'h3'
>
```

# \_components/SpotlightAnimation/index.tsx

```tsx
'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { AllowedElements } from '@app/_components/SpotlightAnimation/types'
import { useResize } from '@/utilities/use-resize'

import classes from './index.module.scss'

interface Props {
  children: React.ReactNode
  as?: AllowedElements
  /**
   * Gets an array from rich text which it can loop through and get a string text
   * Required for SplitAnimate to work
   */
  richTextChildren?: any[]
}

const SpotlightAnimation: React.FC<Props> = ({ children, richTextChildren, as = 'h2' }) => {
  const containerRef = useRef<HTMLElement>(null)
  const containerSize = useResize(containerRef)

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })

  const Element = as

  useEffect(() => {
    let intersectionObserver: IntersectionObserver
    let scheduledAnimationFrame = false

    const resetPosition = () => {
      setMousePosition({
        x: 0,
        y: 0,
      })
    }

    const handleWindowResize = (e: any) => {
      if (scheduledAnimationFrame) {
        return
      }

      scheduledAnimationFrame = true
      requestAnimationFrame(function () {
        resetPosition()
      })
    }

    const updateMousePosition = (e: any) => {
      if (containerRef.current) {
        const boundingRect = containerRef.current.getBoundingClientRect()

        setMousePosition({
          x: e.clientX - boundingRect.left,
          y: e.clientY - boundingRect.top,
        })
      }
      scheduledAnimationFrame = false
    }

    const handleMouseMovement = (e: any) => {
      if (scheduledAnimationFrame) {
        return
      }

      scheduledAnimationFrame = true
      requestAnimationFrame(function (timestamp) {
        updateMousePosition(e)
      })
    }

    if (containerRef.current) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              window.addEventListener('mousemove', handleMouseMovement)
              window.addEventListener('resize', handleWindowResize)
            } else {
              window.removeEventListener('mousemove', handleMouseMovement)
              window.removeEventListener('resize', handleWindowResize)
            }
          })
        },
        {
          rootMargin: '0px',
        },
      )

      intersectionObserver.observe(containerRef.current)
    }

    return () => {
      if (intersectionObserver) intersectionObserver.disconnect()
      window.removeEventListener('mousemove', handleMouseMovement)
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [containerRef, containerSize])

  const getBackgroundOrigin = useMemo(() => {
    return `calc(${mousePosition.x}px - 100vw) calc(${mousePosition.y}px - 100vh)`
  }, [mousePosition])

  return (
    <div className={[classes.wrapper].filter(Boolean).join(' ')}>
      <Element
        style={{ backgroundPosition: getBackgroundOrigin }}
        className={[classes.container].filter(Boolean).join(' ')}
        // @ts-expect-error
        ref={containerRef}
      >
        {children}
      </Element>
    </div>
  )
}

export default SpotlightAnimation
```

# \_components/SplitAnimate/index.tsx

```tsx
'use client'
import React, { useMemo } from 'react'
import { cubicBezier, motion, stagger, useAnimate, useInView } from 'framer-motion'

import { AllowedElements } from '@app/_components/SpotlightAnimation/types'

import classes from './index.module.scss'

interface Props {
  text: string
  className?: string
  as?: AllowedElements
  callback?: () => void
}
const SplitAnimate: React.FC<Props> = ({
  text,
  className,
  as: Element = 'span',
  callback,
  ...props
}) => {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  const easing = cubicBezier(0.165, 0.84, 0.44, 1)

  const textArray = useMemo(() => {
    if (text === '') return []
    return text
      .trim()
      .replace('-', '‑')
      .replace(/&#8232;/g, ' ') // Replaces figma inserted character, see: https://forum.figma.com/t/creating-new-line-via-shift-enter-adds-a-l-sep-symbol/2856/4
      .split(' ')
  }, [text])

  const innerWorldSelector = `.${classes.innerWord}`

  React.useEffect(() => {
    if (isInView) {
      animate(
        innerWorldSelector,
        { y: '0%', rotate: 0 },
        { duration: 1.125, delay: stagger(0.075), ease: easing },
      ).then(() => {
        if (callback) callback()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, callback])

  return (
    <Element ref={scope} className={(classes.element, className)} {...props}>
      {textArray.map((text, index) => {
        const isLast = index + 1 === textArray.length
        return (
          <span className={[classes.word, 'word'].filter(Boolean).join(' ')} key={index}>
            <motion.span
              initial={{ y: '150%', rotate: 10 }}
              className={[classes.innerWord, 'inner-word'].filter(Boolean).join(' ')}
            >
              {isLast ? text : text + ' '}
            </motion.span>
          </span>
        )
      })}
    </Element>
  )
}

export default SplitAnimate
```

# \_components/RenderParams/index.tsx

```tsx
import { Suspense } from 'react'

import { Props, RenderParamsComponent } from './Component'

// Using `useSearchParams` from `next/navigation` causes the entire route to de-optimize into client-side rendering
// To fix this, we wrap the component in a `Suspense` component
// See https://nextjs.org/docs/messages/deopted-into-client-rendering for more info

export const RenderParams: React.FC<Props> = (props) => {
  return (
    <Suspense fallback={null}>
      <RenderParamsComponent {...props} />
    </Suspense>
  )
}
```

# \_components/RenderParams/Component.tsx

```tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { Message } from '../Message'

import classes from './index.module.scss'

export type Props = {
  params?: string[]
  message?: string
  className?: string
  onParams?: (paramValues: ((string | null | undefined) | string[])[]) => void
}

export const RenderParamsComponent: React.FC<Props> = ({
  params = ['error', 'warning', 'success', 'message'],
  className,
  onParams,
}) => {
  const searchParams = useSearchParams()
  const paramValues = params.map((param) => searchParams?.get(param))

  useEffect(() => {
    if (paramValues.length && onParams) {
      onParams(paramValues)
    }
  }, [paramValues, onParams])

  if (paramValues.length) {
    return (
      <div className={className}>
        {paramValues.map((paramValue, index) => {
          if (!paramValue) return null

          return (
            <Message
              className={classes.renderParams}
              key={paramValue}
              {...{
                [params[index]]: paramValue,
              }}
            />
          )
        })}
      </div>
    )
  }

  return null
}
```

# \_components/RenderBlocks/utilities.ts

```ts
import type { BlocksProp } from '@app/_components/RenderBlocks'

/**
 * Get the key of the fields from the block
 */
export function getFieldsKeyFromBlock(block: BlocksProp): string {
  if (!block) return ''

  const keys = Object.keys(block)

  const key = keys.find((value) => {
    return value.endsWith('Fields')
  })

  return key ?? ''
}
```

# \_components/RenderBlocks/index.tsx

```tsx
'use client'

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { BannerBlock } from '@app/_blocks/Banner'
import { Callout } from '@app/_blocks/Callout'
import { CallToAction } from '@app/_blocks/CallToAction'
import { CardGrid } from '@app/_blocks/CardGrid'
import { ContentBlock } from '@app/_blocks/Content'
import { ContentGrid } from '@app/_blocks/ContentGrid'
// import { FormBlock } from '@app/_blocks/FormBlock'
import { HoverCards } from '@app/_blocks/HoverCards'
import { HoverHighlights } from '@app/_blocks/HoverHighlights'
import { LinkGrid } from '@app/_blocks/LinkGrid'
import { LogoGrid } from '@app/_blocks/LogoGrid'
import { MediaBlock } from '@app/_blocks/MediaBlock'
import { MediaContent } from '@app/_blocks/MediaContent'
import { MediaContentAccordion } from '@app/_blocks/MediaContentAccordion'
import { Pricing } from '@app/_blocks/Pricing'
import { ReusableContentBlock } from '@app/_blocks/Reusable'
import { Slider } from '@app/_blocks/Slider'
import { Steps } from '@app/_blocks/Steps'
import { StickyHighlights } from '@app/_blocks/StickyHighlights'

import { toKebabCase } from '@/utilities/to-kebab-case'

import { PaddingProps, Settings } from '@app/_components/BlockWrapper'
import { getFieldsKeyFromBlock } from '@app/_components/RenderBlocks/utilities'
import { Page, Reusable } from '@payload-types'
import { useThemePreference } from '@app/_providers/Theme'
import { Theme } from '@app/_providers/Theme/types'

// type ReusableContentBlockType = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
type ReusableContentBlockType = ExtractBlockProps<'reusableContentBlock'>

export const blockComponents: any = {
  banner: BannerBlock,
  callout: Callout,
  cardGrid: CardGrid,
  content: ContentBlock,
  contentGrid: ContentGrid,
  cta: CallToAction,
  // form: FormBlock,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  linkGrid: LinkGrid,
  logoGrid: LogoGrid,
  mediaBlock: MediaBlock,
  mediaContent: MediaContent,
  mediaContentAccordion: MediaContentAccordion,
  pricing: Pricing,
  reusableContentBlock: ReusableContentBlock,
  slider: Slider,
  steps: Steps,
  stickyHighlights: StickyHighlights,
}

export type BlocksProp = ReusableContentBlockType // | Reusable['layout'][0]

type Props = {
  blocks: BlocksProp[]
  disableOuterSpacing?: true
  // hero?: Page['hero']
  disableGutter?: boolean
  disableGrid?: boolean
  // heroTheme?: Page['hero']['theme']
  layout?: 'page' | 'post'
  customId?: string | null
}

export const RenderBlocks: React.FC<Props> = (props) => {
  const {
    blocks,
    disableOuterSpacing,
    disableGutter,
    disableGrid,
    // hero,
    layout,
    customId,
  } = props
  // const heroTheme = hero?.type === 'home' ? 'dark' : hero?.theme
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()
  const [docPadding, setDocPadding] = React.useState(0)
  const docRef = React.useRef<HTMLDivElement>(null)

  // This is needed to avoid hydration errors when the theme is not yet available
  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const paddingExceptions = useMemo(
    () => [
      'banner',
      // 'blogContent',
      // 'blogMarkdown',
      // 'code',
      'reusableContentBlock',
      'caseStudyParallax',
    ],
    [],
  )

  const getPaddingProps = useCallback(
    (block: (typeof blocks)[number], index: number) => {
      const isFirst = index === 0
      const isLast = index + 1 === blocks.length

      const theme = themeState

      let topPadding: PaddingProps['top']
      let bottomPadding: PaddingProps['bottom']

      let previousBlock = !isFirst ? blocks[index - 1] : null
      let previousBlockKey, previousBlockSettings

      let nextBlock =
        index + 1 < blocks.length ? blocks[Math.min(index + 1, blocks.length - 1)] : null
      let nextBlockKey, nextBlockSettings

      let currentBlockSettings: Settings = block[getFieldsKeyFromBlock(block)]?.settings
      let currentBlockTheme

      currentBlockTheme = currentBlockSettings?.theme ?? theme

      if (previousBlock) {
        previousBlockKey = getFieldsKeyFromBlock(previousBlock)
        previousBlockSettings = previousBlock[previousBlockKey]?.settings
      }

      if (nextBlock) {
        nextBlockKey = getFieldsKeyFromBlock(nextBlock)
        nextBlockSettings = nextBlock[nextBlockKey]?.settings
      }

      // If first block in the layout, add top padding based on the hero
      if (isFirst) {
        // if (heroTheme) {
        //   topPadding = heroTheme === currentBlockTheme ? 'small' : 'large'
        // } else {
        topPadding = theme === currentBlockTheme ? 'small' : 'large'
        // }
      } else {
        if (previousBlockSettings?.theme) {
          topPadding = currentBlockTheme === previousBlockSettings?.theme ? 'small' : 'large'
        } else {
          topPadding = theme === currentBlockTheme ? 'small' : 'large'
        }
      }

      if (nextBlockSettings?.theme) {
        bottomPadding = currentBlockTheme === nextBlockSettings?.theme ? 'small' : 'large'
      } else {
        bottomPadding = theme === currentBlockTheme ? 'small' : 'large'
      }

      if (isLast) bottomPadding = 'large'

      if (paddingExceptions.includes(block.blockType)) bottomPadding = 'large'

      return {
        top: topPadding ?? undefined,
        bottom: bottomPadding ?? undefined,
      }
    },
    [
      themeState,
      // heroTheme,
      blocks,
      paddingExceptions,
    ],
  )

  React.useEffect(() => {
    if (docRef.current?.offsetWidth === undefined) return
    setDocPadding(layout === 'post' ? Math.round(docRef.current?.offsetWidth / 8) - 2 : 0)
  }, [docRef.current?.offsetWidth, layout])

  const marginAdjustment = {
    marginLeft: `${docPadding / -1}px`,
    marginRight: `${docPadding / -1}px`,
    paddingLeft: docPadding,
    paddingRight: docPadding,
  }

  if (hasBlocks) {
    return (
      <React.Fragment>
        <div ref={docRef} id={customId ?? undefined}>
          {blocks.map((block, index) => {
            const { blockName, blockType } = block

            if (blockType && blockType in blockComponents) {
              const Block = blockComponents[blockType]

              if (Block) {
                return (
                  <Block
                    key={index}
                    id={toKebabCase(blockName)}
                    {...block}
                    padding={getPaddingProps(block, index)}
                    marginAdjustment={{
                      ...marginAdjustment,
                      ...(blockType === 'banner' ? { paddingLeft: 32, paddingRight: 32 } : {}),
                    }}
                    disableGutter={disableGutter}
                    disableGrid={disableGrid}
                  />
                )
              }
            }
            return null
          })}
        </div>
      </React.Fragment>
    )
  }

  return null
}
```

# \_components/ProductCard/index.tsx

```tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRightIcon } from 'lucide-react'
import cn from '@/utilities/cn'
import { contentFormats } from '@app/_css/tailwindClasses'
import { ProductActions } from '@app/_components/ProductActions'
import { messages } from '@/utilities/refData'
import { Media } from '@/payload-types'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'

const GenericProductSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    className="w-full h-full text-gray-300"
  >
    <rect width="100" height="100" rx="10" stroke-width="2" />
    <path d="M20 80 L50 20 L80 80 Z" stroke-width="2" />
    <circle cx="50" cy="50" r="20" stroke-width="2" />
  </svg>
)

export const ProductCard: React.FC<any> = (product) => {
  const {
    slug,
    id,
    title,
    media,
    meta: { image: metaImage, description },
    price,
    salePrice,
    productType,
    stockOnHand,
    lowStockThreshold,
    className,
  } = product

  const imageUrl = media && media.length > 0 ? getImageUrl(media[0]?.mediaItem) : null
  const imageAlt = media && media.length > 0 ? getImageAlt(media[0]?.mediaItem) : 'Product image'
  const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23cccccc'%3E%3Crect width='100' height='100' rx='10' stroke-width='2' /%3E%3Cpath d='M20 80 L50 20 L80 80 Z' stroke-width='2' /%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='2' /%3E%3C/svg%3E`

  return (
    <div className={cn('relative', 'w-full', 'max-w-sm', 'mx-auto', className)}>
      <Link href={`/shop/${slug}`} className="relative no-underline hover:no-underline block">
        <div className="aspect-square relative overflow-hidden rounded-sm shadow-md">
          {(stockOnHand === 0 || stockOnHand === null || stockOnHand === undefined) && (
            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base uppercase">{messages.outOfStock}</span>
            </div>
          )}

          {stockOnHand <= lowStockThreshold && stockOnHand > 0 && (
            <div className="absolute left-0 top-0 z-10 flex w-full items-center justify-center bg-gray-900/50 p-2 font-body font-semibold uppercase tracking-wider text-white !no-underline">
              <span className="text-base">{messages.lowStock}</span>
            </div>
          )}

          <Image
            src={imageUrl || placeholderSVG}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center"
            placeholder="blur"
            blurDataURL={placeholderSVG}
          />
        </div>

        {title && (
          <div className="mt-4 flex items-center justify-between">
            <h3
              className={cn(
                contentFormats.global,
                contentFormats.h4,
                'text-lg font-semibold truncate flex-grow',
              )}
            >
              {title}
            </h3>

            <div
              className={cn(
                'flex flex-col items-end ml-2',
                contentFormats.global,
                contentFormats.h4,
              )}
            >
              <span
                className={cn('text-sm', {
                  'line-through text-gray-500': +salePrice !== 0 && +salePrice < +price,
                })}
              >
                {basePrice.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              {+salePrice !== 0 && +salePrice < +price && (
                <span className="text-black font-semibold">
                  {salePrice.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
      {description && (
        <React.Fragment>
          <div
            className={cn(
              contentFormats.global,
              contentFormats.text,
              'mt-2 text-sm text-gray-600 line-clamp-3',
            )}
          >
            {description.replace(/\s/g, ' ')}
          </div>
          <Link
            href={`/shop/${slug}`}
            className="mt-2 inline-flex items-center text-sm font-medium  hover:underline"
          >
            Details
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </React.Fragment>
      )}

      <div className="mt-4">
        <ProductActions product={product} hidePerks={true} hideRemove={true} />
      </div>
    </div>
  )
}
```

# \_components/PrivacyBanner/index.tsx

```tsx
'use client'

import * as React from 'react'
import Link from 'next/link'

import { usePrivacy } from '@app/_providers/Privacy'

import classes from './index.module.scss'
import { CMSLink } from '../CMSLink'
import { CheckCheckIcon, XIcon } from 'lucide-react'

export const PrivacyBanner: React.FC = () => {
  const [closeBanner, setCloseBanner] = React.useState(false)
  const [animateOut, setAnimateOut] = React.useState(false)

  const { showConsent, updateCookieConsent } = usePrivacy()

  const handleCloseBanner = () => {
    setAnimateOut(true)
  }

  React.useEffect(() => {
    if (animateOut) {
      setTimeout(() => {
        setCloseBanner(true)
      }, 300)
    }
  }, [animateOut])

  if (!showConsent || closeBanner) {
    return null
  }

  return (
    <React.Fragment>
      <div
        className={[classes.privacyBanner, animateOut && classes.animateOut]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.contentWrap}>
          <p className={classes.content}>
            {`We use cookies, subject to your consent, to analyze the use of our website and to ensure
            you get the best experience. Read our `}
            <Link href="/privacy" className={classes.privacyLink} prefetch={false}>
              cookie policy
            </Link>{' '}
            for more information.
          </p>

          <div className="flex flex-row py-4 sm:py-4 gap-1 dark">
            <div className="">
              <CMSLink
                data={{
                  label: 'Accept',
                  // type: 'custom',
                  // url: '/shop/cart',
                }}
                look={{
                  theme: 'light',
                  type: 'button',
                  size: 'small',
                  width: 'full',
                  variant: 'blocks',
                  icon: {
                    content: <CheckCheckIcon strokeWidth={1.25} />,
                    iconPosition: 'right',
                  },
                }}
                actions={{
                  onClick: () => {
                    updateCookieConsent(false, true)
                    handleCloseBanner()
                  },
                }}
              />
            </div>
            <div className="">
              <CMSLink
                data={{
                  label: 'Dismiss',
                  // type: 'custom',
                  // url: '/shop',
                }}
                look={{
                  theme: 'light',
                  type: 'button',
                  size: 'small',
                  width: 'full',
                  variant: 'blocks',
                  icon: {
                    content: <XIcon className="!ml-0" strokeWidth={1.25} />,
                    iconPosition: 'right',
                  },
                }}
                actions={{
                  onClick: () => {
                    updateCookieConsent(true, false)
                    handleCloseBanner()
                  },
                }}
              />{' '}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
```

# \_components/PricingCard/index.tsx

```tsx
import React from 'react'
import { PricingCardProps } from '@app/_components/cards/types'

import classes from './index.module.scss'

export const PricingCard: React.FC<PricingCardProps> = (props) => {
  const { title, price, className, leader, description, hasPrice } = props

  const link = props.link || {}
  // const hasLink = link.url || link.reference

  return (
    <div
      className={[className, classes.card, '!hasLink && classes.noLink'].filter(Boolean).join(' ')}
    >
      {leader && <span className={classes.leader}>{leader}</span>}
      <div className={classes.content}>
        {price && hasPrice && <h3 className={classes.price}>{price}</h3>}
        {title && !hasPrice && <h3 className={classes.title}>{title}</h3>}
        {description && <div className={classes.description}>{description}</div>}
      </div>
    </div>
  )
}
```

# \_components/ProductActions/index.tsx

```tsx
'use client'

import React from 'react'
import { CheckIcon, FrownIcon, MessageCircleWarningIcon, SendHorizonalIcon } from 'lucide-react'
import Link from 'next/link'
import { messages } from '@/utilities/refData'
import { AddToCartButton } from './AddToCart'
import { ViewInCartButton } from './ViewInCart'
import { RemoveFromCartButton } from './RemoveFromCart'
import { useOrder } from '@app/_providers/Order'

export function ProductActions({ product, hidePerks, hideRemove }: any) {
  const { stockOnHand } = product
  // const inCart = await isProductInOrder(product.id)

  const { isProductInOrder } = useOrder()
  const inCart = isProductInOrder(product.id)

  if (stockOnHand === 0) {
    return (
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-1 sm:py-2 flex items-center">
          <FrownIcon
            className="h-8 w-8 flex-shrink-0 text-green"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">
            {`We're Sorry! This thankly is currently out of stock. `}
            <br className="sm:block hidden" />
            <Link href="/shop">{`Back to Shop`} &#8594;</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="py-4 sm:py-4 flex gap-1">
        {!inCart ? (
          <div className="flex-auto w-full">
            <AddToCartButton product={product} />
          </div>
        ) : (
          <>
            <div className="flex-auto w-3/4">
              <ViewInCartButton />
            </div>
            <div className="flex-initial w-1/4">
              <RemoveFromCartButton orderItemId={product.id} />
            </div>
          </>
        )}
      </div>

      {inCart && !hideRemove && (
        <div className="sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-4 sm:py-4 flex items-center">
            <CheckIcon
              className="h-8 w-8 flex-shrink-0 text-green"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <div className="ml-2 text-sm text-gray-500">
              {messages.removeProductBase}
              {messages.removeProductExtra}
            </div>
          </div>
        </div>
      )}

      {inCart && !hideRemove && (
        <div className="sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-1 sm:py-2 flex items-center">
            <MessageCircleWarningIcon
              className="h-8 w-8 flex-shrink-0 text-green"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <div className="ml-2 text-sm text-gray-500">{messages.removeProductWarning}</div>
          </div>
        </div>
      )}

      {!hidePerks && (
        <div className="#hidden sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-1 sm:py-2 flex items-center">
            <SendHorizonalIcon className="h-5 w-5 flex-shrink-0 text-green" aria-hidden="true" />
            <div className="ml-2 text-sm text-gray-500">{messages.shippingFreeMessage}</div>
          </div>
          <div className="py-1 sm:py-2 flex items-center">
            <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
            <div className="ml-2 text-sm text-gray-500">{messages.inStock}</div>
          </div>
        </div>
      )}
    </>
  )
}
```

# \_components/ProductActions/ViewInCart.tsx

```tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { ChevronsRightIcon, LoaderCircleIcon } from 'lucide-react'

export function ViewInCartButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleViewInOrder = async () => {
    setIsLoading(true)
    router.push('/shop/cart')
  }

  return (
    <CMSLink
      data={{
        label: isLoading ? 'Loading...' : 'View in Cart',
        type: 'custom',
        url: '#',
      }}
      look={{
        theme: 'light',
        type: 'button',
        size: 'medium',
        width: 'full',
        variant: 'blocks',
        icon: {
          content: isLoading ? (
            <LoaderCircleIcon className="animate-spin" strokeWidth={1.25} />
          ) : (
            <ChevronsRightIcon strokeWidth={1.25} />
          ),
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleViewInOrder,
      }}
    />
  )
}
```

# \_components/ProductActions/RemoveFromCart.tsx

```tsx
'use client'

import React, { useState } from 'react'
import { CMSLink } from '@app/_components/CMSLink'
import { XIcon, LoaderCircleIcon } from 'lucide-react'
// import { removeProduct } from '@app/_providers/Cart/orderItemsActions'
import { useOrder } from '../../_providers/Order'
import { useRouter } from 'next/navigation'

export function RemoveFromCartButton({ orderItemId }: { orderItemId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { removeProduct } = useOrder()
  const router = useRouter()

  const handleRemoveFromOrder = async () => {
    setIsLoading(true)
    setError(null)
    removeProduct(orderItemId)
    // try {
    //   await
    //   window.location.reload() // Refresh the page to reflect the changes
    // } catch (e: any) {
    //   setError(e.message || 'Failed to remove product from order. Please try again.')
    setIsLoading(false)
    router.refresh()
    // }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <CMSLink
      data={{
        label: '',
        type: 'custom',
        url: '/shop',
      }}
      look={{
        theme: 'light',
        type: 'button',
        size: 'medium',
        width: 'full',
        variant: 'blocks',
        icon: {
          content: isLoading ? (
            <LoaderCircleIcon className="animate-spin" strokeWidth={1.25} />
          ) : (
            <XIcon className="!ml-0" strokeWidth={1.25} />
          ),
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleRemoveFromOrder,
      }}
    />
  )
}
```

# \_components/ProductActions/AddToCart.tsx

```tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { PlusIcon, LoaderCircleIcon } from 'lucide-react'
import { Product } from '@payload-types'
import { useOrder } from '@app/_providers/Order'

export function AddToCartButton({ product }: { product: Product }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { addProduct } = useOrder()

  const handleAddToOrder = async () => {
    setIsLoading(true)
    setError(null)
    try {
      addProduct(
        product,
        Math.max(
          0,
          Math.min(product.prices.basePrice ?? Infinity, product.prices.salePrice ?? Infinity),
        ),
      )
      router.push('/shop/cart')
    } catch (e: any) {
      setError(e.message || 'Failed to add product to order. Please try again.')
      setIsLoading(false)
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <CMSLink
      data={{
        label: isLoading ? 'Adding...' : 'Add to Cart',
        type: 'custom',
        url: '/shop/cart',
      }}
      look={{
        theme: 'light',
        type: 'button',
        size: 'medium',
        width: 'full',
        variant: 'blocks',
        icon: {
          content: isLoading ? (
            <LoaderCircleIcon className="animate-spin" strokeWidth={1.25} />
          ) : (
            <PlusIcon strokeWidth={1.25} />
          ),
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleAddToOrder,
      }}
    />
  )
}
```

# \_components/PixelBackground/index.tsx

```tsx
import * as React from 'react'

import classes from './index.module.scss'

export const PixelBackground: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  return <div className={[classes.pixelBackground, className].filter(Boolean).join(' ')} />
}
```

# \_components/Pill/index.tsx

```tsx
import * as React from 'react'

import classes from './index.module.scss'

export const Pill: React.FC<{
  className?: string
  text: string
  color?: 'default' | 'success' | 'error' | 'warning' | 'blue'
}> = ({ className, text, color }) => {
  return (
    <div
      className={[classes.pill, className, color && classes[`color--${color}`]]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={classes.text}>{text}</span>
    </div>
  )
}
```

# \_components/Pagination/index.tsx

```tsx
import * as React from 'react'

import { ChevronIcon } from '@app/_icons/ChevronIcon'

import classes from './index.module.scss'

export const Pagination: React.FC<{
  page: number
  setPage: (page: number) => void
  totalPages: number
  className?: string
}> = ({ page, setPage, totalPages, className }) => {
  const [indexToShow, setIndexToShow] = React.useState([0, 1, 2, 3, 4])
  const showFirstPage = totalPages > 5 && page >= 2
  const showLastPage = totalPages > 5 && page <= totalPages - 3

  React.useEffect(() => {
    if (showFirstPage && showLastPage) {
      setIndexToShow([1, 2, 3])
    }

    if (showFirstPage && !showLastPage) {
      setIndexToShow([2, 3, 4])
    }

    if (!showFirstPage && showLastPage) {
      setIndexToShow([0, 1, 2])
    }

    if (!showFirstPage && !showLastPage) {
      setIndexToShow([0, 1, 2, 3, 4])
    }
  }, [showFirstPage, showLastPage])

  return (
    <div className={[classes.pagination, className].filter(Boolean).join(' ')}>
      {showFirstPage && (
        <React.Fragment>
          <button
            type="button"
            className={classes.paginationButton}
            onClick={() => {
              window.scrollTo(0, 0)
              setPage(1)
            }}
          >
            1
          </button>
          <div className={classes.dash}>&mdash;</div>
        </React.Fragment>
      )}
      {[...Array(totalPages)].map((_, index) => {
        const currentPage = index + 1
        const isCurrent = page === currentPage

        if (indexToShow.includes(index))
          return (
            <div key={index}>
              <button
                type="button"
                className={[
                  classes.paginationButton,
                  isCurrent && classes.paginationButtonActive,
                  isCurrent && classes.disabled,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  window.scrollTo(0, 0)
                  setPage(currentPage)
                }}
              >
                {currentPage}
              </button>
            </div>
          )
      })}
      {showLastPage && (
        <React.Fragment>
          <div className={classes.dash}>&mdash;</div>
          <button
            type="button"
            className={classes.paginationButton}
            onClick={() => {
              setTimeout(() => {
                window.scrollTo(0, 0)
              }, 0)
              setPage(totalPages)
            }}
          >
            {totalPages}
          </button>
        </React.Fragment>
      )}
      <button
        disabled={page - 1 < 1}
        onClick={() => {
          if (page - 1 < 1) return
          window.scrollTo(0, 0)
          setPage(page > 1 ? page - 1 : 1)
        }}
        className={[classes.button, page - 1 < 1 && classes.disabled].filter(Boolean).join(' ')}
      >
        <ChevronIcon rotation={180} />
      </button>
      <button
        disabled={page + 1 > totalPages}
        onClick={() => {
          if (page + 1 > totalPages) return

          window.scrollTo(0, 0)
          setPage(page + 1)
        }}
        className={[classes.button, page + 1 > totalPages && classes.disabled]
          .filter(Boolean)
          .join(' ')}
      >
        <ChevronIcon />
      </button>
    </div>
  )
}
```

# \_components/OrderNotification/index.tsx

```tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { useOrder } from '@app/_providers/Order'
import { CMSLink } from '../CMSLink'
import { ShoppingCartIcon } from 'lucide-react'

export const OrderNotification: React.FC = () => {
  const { order } = useOrder()

  if (!order) return null

  return (
    <div className="relative group">
      <Link href="/shop/cart" className="flex items-center">
        <span className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {order.items && (
            <span className="absolute -top-2 -right-2 bg-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {order.items.length}
            </span>
          )}
        </span>
      </Link>
      <div className="absolute top-3 right-0 mt-2 w-64 bg-neutral-100 border border-solid shadow-xl rounded-sm hidden group-hover:block">
        <div className="px-4 py-6">
          <span className="text-lg font-semibold mb-2">Cart Summary</span>
          {order.items?.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{item.product.title}</span>
              <span>
                {item.totals.subTotal.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                })}
              </span>
            </div>
          ))}
          {order.items && order.items?.length > 3 && (
            <div className="text-sm text-gray-500">...and {order.items?.length - 3} more items</div>
          )}
          <div className="my-4 font-semibold">
            Total:{' '}
            {order.totals.total.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
          </div>

          <CMSLink
            data={{
              label: 'View Cart',
              type: 'custom',
              url: '/shop/cart',
            }}
            className="!bg-green !text-white"
            look={{
              theme: 'light',
              type: 'button',
              size: 'medium',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: (
                  <ShoppingCartIcon
                    className="w-4 h-4 !text-white !stroke-white"
                    strokeWidth={1.25}
                  />
                ),
                iconPosition: 'right',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
```

# \_components/Message/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

// const icons = {
//   error: () => <div>!</div>,
//   success: CheckmarkIcon,
//   warning: () => <div>!</div>,
// }

export const Message: React.FC<{
  message?: React.ReactNode
  success?: React.ReactNode
  error?: React.ReactNode
  warning?: React.ReactNode
  className?: string
  margin?: boolean
}> = ({ error, success, warning, message, className, margin }) => {
  // const type = error ? 'error' : success ? 'success' : 'warning'
  // const Icon = icons[type]

  const label = error || success || warning || message

  if (label) {
    return (
      <div
        className={[
          classes.message,
          error && classes.error,
          success && classes.success,
          warning && classes.warning,
          className,
          margin === false && classes.noMargin,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* {Icon && (
          <div className={classes.icon}>
            <Icon />
          </div>
        )} */}
        <p className={classes.label}>{label}</p>
      </div>
    )
  }
  return null
}
```

# \_components/MediaParallax/index.tsx

```tsx
import React from 'react'
import { motion, transform, useScroll } from 'framer-motion'

import { Media } from '@app/_components/Media'
import { Props as MediaProps } from '@app/_components/Media/types'
import { Media as MediaType } from '@payload-types'

import classes from './index.module.scss'

type ParallaxProps = {
  media: { image: string | MediaType }[]
  className?: string
} & {
  priority?: MediaProps['priority']
}

const MediaParallax: React.FC<ParallaxProps> = ({ media, className, ...mediaProps }) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrollValue, setScrollValue] = React.useState(0)
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['end start', 'start end'],
  })

  React.useEffect(() => {
    setScrollValue(scrollYProgress.get())

    scrollYProgress.on('change', () => {
      setScrollValue(scrollYProgress.get())
    })

    return () => {
      scrollYProgress.clearListeners()
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={[classes.parallaxMedia, className].filter(Boolean).join(' ')}
    >
      {media?.map((image, index) => {
        const MULTIPLIER = Math.min(1 + index / 5, 2)
        const transformer = transform([0, 1], [-50 * MULTIPLIER, 50 * MULTIPLIER])

        return (
          <motion.div
            key={index}
            className={classes.parallaxItem}
            initial={{ ...(index === 0 ? {} : { translateY: -50 * MULTIPLIER }) }}
            style={{
              ...(index === 0
                ? {}
                : {
                    translateY: transformer(scrollValue),
                  }),
            }}
          >
            {typeof image.image !== 'string' && (
              <React.Fragment>
                <Media resource={image.image} {...mediaProps} />
              </React.Fragment>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default MediaParallax
```

# \_components/Media/types.ts

```ts
import type { ElementType, Ref } from 'react'
import type { StaticImageData } from 'next/image'

import type { Media as MediaType } from '@payload-types'

export interface Props {
  src?: StaticImageData | string | null // for static media
  alt?: string
  resource?: MediaType // for Payload media
  sizes?: string // for NextImage only
  priority?: boolean // for NextImage only
  fill?: boolean // for NextImage only
  className?: string
  imgClassName?: string
  videoClassName?: string
  htmlElement?: ElementType | null
  onClick?: () => void
  onLoad?: () => void
  ref?: Ref<null | HTMLImageElement | HTMLVideoElement>
  width?: number | null
  height?: number | null
}
```

# \_components/Media/index.tsx

```tsx
import React, { ElementType, forwardRef, Fragment } from 'react'

import { ImageComponent } from './Image'
import { Props } from './types'
import { Video } from './Video'

export const Media = forwardRef<HTMLDivElement | HTMLImageElement | HTMLVideoElement, Props>(
  (props, ref) => {
    const { className, resource, htmlElement = 'div' } = props

    const isVideo = typeof resource !== 'string' && resource?.mimeType?.includes('video')
    const Tag = (htmlElement as ElementType) || Fragment

    return (
      <React.Fragment>
        {/* Tag breaks visibility for Images */}
        {/* <Tag ref={ref} {...(htmlElement !== null ? { className } : {})}> */}
        {isVideo ? (
          <Video {...props} />
        ) : (
          <ImageComponent {...props} /> // eslint-disable-line
        )}

        {/* </Tag> */}
      </React.Fragment>
    )
  },
)
```

# \_components/Logos/index.tsx

```tsx
import Image from 'next/image'
import styles from './styles.module.scss'

export const Logos = () => {
  return (
    <div className={styles.logos}>
      <Image
        src={`${process.env.NEXT_PUBLIC_SERVER_URL}/payload.svg`}
        alt="Payload Logo"
        width={200}
        height={100}
        className={styles.payloadLogo}
        priority
      />
      <Image src="/crosshair.svg" alt="" width={20} height={20} />
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={394}
        height={80}
        className={styles.nextLogo}
        priority
      />
    </div>
  )
}
```

# \_components/LoadingShimmer/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

export const LoadingShimmer: React.FC<{
  number?: number
  height?: number // in `base` units
}> = (props) => {
  const arrayFromNumber = Array.from(Array(props.number || 1).keys())

  return (
    <div className={classes.loading}>
      {arrayFromNumber.map((_, index) => (
        <div key={index} className={classes.shimmer} />
      ))}
    </div>
  )
}
```

# \_components/LineDraw/index.tsx

```tsx
'use client'

import React from 'react'

import classes from './index.module.scss'

export const LineDraw: React.FC<{
  className?: string
  active?: Boolean | null
  align?: 'top' | 'bottom'
  disabled?: Boolean | null
}> = ({ className, active: isHovered, align = 'top', disabled }) => {
  return (
    <div
      className={[
        classes.lineDraw,
        className,
        !disabled && isHovered && classes.isHovered,
        align && classes[align],
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
```

# \_components/LexicalContent/index.tsx

```tsx
/* eslint-disable react/no-children-prop */
import ensurePath from '@/utilities/ensurePath'
import clsx from 'clsx'
import Link from 'next/link'
import React, { CSSProperties, type FC, type ReactElement } from 'react'
import Image from 'next/image'
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './RichTextNodeFormat'

type SerializedLexicalNode = {
  children?: SerializedLexicalNode[]
  direction: string
  format: number
  indent?: string | number
  type: string
  version: number
  style?: string
  mode?: string
  text?: string
  [other: string]: any
}

type TextComponentProps = {
  children: ReactElement | string
  format: number
}

const getLinkForDocument = (doc: any, locale?: string): string => {
  let path = doc?.path
  if (!path || path.startsWith('/home') || path === '/' || path === '') path = '/'
  return ensurePath(`/${locale}${path}`)
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function calculateAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height)
  const simplifiedWidth = width / divisor
  const simplifiedHeight = height / divisor

  return `${simplifiedWidth}x${simplifiedHeight}`
}

const TextComponent: FC<TextComponentProps> = ({ children, format }) => {
  const formatFunctions: { [key: number]: (child: ReactElement | string) => ReactElement } = {
    [IS_BOLD]: (child) => <strong>{child}</strong>,
    [IS_ITALIC]: (child) => <em>{child}</em>,
    [IS_STRIKETHROUGH]: (child) => <del>{child}</del>,
    [IS_UNDERLINE]: (child) => <u>{child}</u>,
    [IS_CODE]: (child) => <code>{child}</code>,
    [IS_SUBSCRIPT]: (child) => <sub>{child}</sub>,
    [IS_SUPERSCRIPT]: (child) => <sup>{child}</sup>,
  }

  const formattedText = Object.entries(formatFunctions).reduce(
    (formattedText, [key, formatter]) => {
      return format & Number(key) ? formatter(formattedText) : formattedText
    },
    children,
  )

  return <React.Fragment>{formattedText}</React.Fragment>
}

const SerializedLink: React.FC<{
  node: SerializedLexicalNode
  locale: string
  children: JSX.Element | null
}> = ({ node, locale, children }) => {
  const { doc, url, newTab, linkType } = node.fields as any
  const document = doc?.value
  const href = linkType === 'custom' ? url : getLinkForDocument(document, locale)
  const target = newTab ? '_blank' : undefined

  return (
    <Link href={href} target={target}>
      {children}
    </Link>
  )
}

const getNodeClassNames = (node: SerializedLexicalNode) => {
  const attributes: Record<string, any> = {}
  if (!node) return attributes

  let classNames = ''
  if (String(node?.format).toString()?.includes('left') && node.direction !== 'ltr')
    classNames += 'text-left '
  if (String(node?.format).toString()?.includes('center')) classNames += 'text-center '
  if (String(node?.format).toString()?.includes('right') && node.direction !== 'rtl')
    classNames += 'text-right '

  if (classNames.length > 0) attributes.className = classNames.trim()

  const indent = parseInt(`${node?.indent || 0}`)
  if (!isNaN(indent) && indent !== 0) {
    attributes.style = { '--indent': `${indent * 10}px` } as CSSProperties
    attributes.className = `${attributes.className ?? ''} ml-[--indent]`.trim()
  }

  return attributes
}

const LexicalContent: React.FC<{
  childrenNodes: SerializedLexicalNode[]
  locale: string
  className?: string
  lazyLoadImages: boolean
}> = ({ childrenNodes, locale, lazyLoadImages = false }) => {
  if (!Array.isArray(childrenNodes)) return null

  const renderedChildren = childrenNodes.map((node, ix) => {
    if (!node) return null
    const attributes = getNodeClassNames(node || '')
    if (node.type === 'text') {
      return (
        <TextComponent key={ix} format={node.format}>
          <React.Fragment>
            {Object.keys(attributes).length > 0 && <span {...attributes}>{node?.text || ''}</span>}
            {(Object.keys(attributes).length === 0 && node?.text) || ''}
          </React.Fragment>
        </TextComponent>
      )
    }

    const serializedChildren = node.children ? (
      <LexicalContent
        key={ix}
        childrenNodes={node.children}
        locale={locale}
        lazyLoadImages={lazyLoadImages}
      />
    ) : null
    switch (node.type) {
      case 'linebreak':
        return <br key={ix} />
      case 'link':
        return <SerializedLink key={ix} node={node} locale={locale} children={serializedChildren} />
      case 'list':
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
        attributes.className = clsx(
          attributes.className,
          'mb-4 pl-8',
          ListTag === 'ol' ? 'list-decimal' : 'list-disc',
        )
        return (
          <ListTag key={ix} {...attributes}>
            {serializedChildren}
          </ListTag>
        )
      case 'listitem':
        return (
          <li key={ix} {...attributes}>
            {serializedChildren}
          </li>
        )
      case 'heading':
        const HeadingTag = node.tag as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={ix} {...attributes}>
            {serializedChildren}
          </HeadingTag>
        )
      case 'quote':
        return (
          <blockquote key={ix} {...attributes}>
            {serializedChildren}
          </blockquote>
        )
      case 'upload':
        const upload = node?.value
        if (!upload) return null
        const imageAspectRatio = calculateAspectRatio(upload.width, upload.height)
        return (
          <Image
            key={ix}
            width={upload.width}
            height={upload.height}
            src={upload?.url}
            loading={lazyLoadImages ? 'lazy' : 'eager'}
            fetchPriority={lazyLoadImages ? 'low' : 'high'}
            sizes="(max-width: 768) 65ch, 100vw"
            className="max-w-[calc(100%+40px)] translate-x-[-20px]"
            alt={upload?.alt || upload.filename}
          />
        )
      default:
        if (
          Array.isArray(serializedChildren?.props?.childrenNodes) &&
          serializedChildren?.props?.childrenNodes.length === 0
        )
          return <br key={ix} />
        return (
          <p key={ix} {...attributes}>
            {serializedChildren}
          </p>
        )
    }
  })

  return <React.Fragment>{renderedChildren.filter((node) => node !== null)}</React.Fragment>
}

export default LexicalContent
```

# \_components/LexicalContent/RichTextNodeFormat.ts

```ts
//This copy-and-pasted from somewhere in lexical here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts

// DOM
export const DOM_ELEMENT_TYPE = 1
export const DOM_TEXT_TYPE = 3

// Reconciling
export const NO_DIRTY_NODES = 0
export const HAS_DIRTY_NODES = 1
export const FULL_RECONCILE = 2

// Text node modes
export const IS_NORMAL = 0
export const IS_TOKEN = 1
export const IS_SEGMENTED = 2
// IS_INERT = 3

// Text node formatting
export const IS_BOLD = 1
export const IS_ITALIC = 1 << 1
export const IS_STRIKETHROUGH = 1 << 2
export const IS_UNDERLINE = 1 << 3
export const IS_CODE = 1 << 4
export const IS_SUBSCRIPT = 1 << 5
export const IS_SUPERSCRIPT = 1 << 6
export const IS_HIGHLIGHT = 1 << 7

export const IS_ALL_FORMATTING =
  IS_BOLD |
  IS_ITALIC |
  IS_STRIKETHROUGH |
  IS_UNDERLINE |
  IS_CODE |
  IS_SUBSCRIPT |
  IS_SUPERSCRIPT |
  IS_HIGHLIGHT

export const IS_DIRECTIONLESS = 1
export const IS_UNMERGEABLE = 1 << 1

// Element node formatting
export const IS_ALIGN_LEFT = 1
export const IS_ALIGN_CENTER = 2
export const IS_ALIGN_RIGHT = 3
export const IS_ALIGN_JUSTIFY = 4
export const IS_ALIGN_START = 5
export const IS_ALIGN_END = 6

export const TEXT_TYPE_TO_FORMAT: Record<TextFormatType | string, number> = {
  bold: IS_BOLD,
  code: IS_CODE,
  italic: IS_ITALIC,
  strikethrough: IS_STRIKETHROUGH,
  subscript: IS_SUBSCRIPT,
  superscript: IS_SUPERSCRIPT,
  underline: IS_UNDERLINE,
}

export type TextFormatType =
  | 'bold'
  | 'underline'
  | 'strikethrough'
  | 'italic'
  | 'code'
  | 'subscript'
  | 'superscript'
```

# \_components/LargeBody/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

export const LargeBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p className={classes.largeBody}>{children}</p>
}
```

# \_components/Label/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={[classes.label, className].filter(Boolean).join(' ')}>{children}</p>
}
```

# \_components/Highlight/index.tsx

```tsx
'use client'

import React, { Fragment, useRef } from 'react'
import useIntersection from '@/utilities/useIntersection'

import classes from './index.module.scss'

export const Highlight: React.FC<{
  text?: string
  bold?: boolean
  className?: string
  inlineIcon?: React.ReactElement
  highlightOnHover?: boolean
  highlight?: boolean
  reverseIcon?: boolean
  appearance?: 'success' | 'danger'
}> = (props) => {
  const {
    bold,
    className,
    text,
    inlineIcon: InlineIcon,
    reverseIcon,
    appearance = 'success',
  } = props

  const ref = useRef(null)

  const { hasIntersected } = useIntersection({
    ref,
    rootMargin: '-75px',
  })

  if (text) {
    const words = text.trim().split(' ')

    if (Array.isArray(words) && words.length > 0) {
      return (
        <span
          ref={ref}
          className={[classes.highlightWrapper, className, classes[appearance]]
            .filter(Boolean)
            .join(' ')}
        >
          {words.map((word, index) => {
            const isFirstWord = index === 0
            const isLastWord = index === words.length - 1

            return (
              <span
                key={index}
                className={[
                  classes.highlightNode,
                  hasIntersected && classes.doHighlight,
                  bold && classes.bold,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className={classes.label}>
                  {InlineIcon && reverseIcon && isFirstWord && (
                    <span className={classes.iconWrapper}>
                      {InlineIcon}
                      &nbsp;
                    </span>
                  )}
                  {!isLastWord && (
                    <React.Fragment>
                      {word}
                      &nbsp;
                    </React.Fragment>
                  )}
                  {isLastWord && (!InlineIcon || reverseIcon) && word}
                  {isLastWord &&
                    InlineIcon &&
                    !reverseIcon && ( // the icon and the last word need to render together, to prevent the icon from widowing
                      <span className={classes.iconWrapper}>
                        {word}
                        &nbsp;
                        {InlineIcon}
                      </span>
                    )}
                </span>
              </span>
            )
          })}
        </span>
      )
    }
  }

  return null
}
```

# \_components/Heading/index.tsx

```tsx
import React from 'react'
import Link from 'next/link'

import classes from './index.module.scss'

export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Props = {
  element?: HeadingType | 'p'
  as?: HeadingType
  margin?: boolean
  marginTop?: boolean
  marginBottom?: boolean
  children?: React.ReactNode
  id?: string
  href?: string
  className?: string
}

const HeadingElement: React.FC<Partial<Props>> = (props) => {
  const { element: Element = 'h1', children, id, className = [], margin } = props

  return (
    <Element
      className={[className, margin === false ? classes.noMargin : ''].filter(Boolean).join(' ')}
    >
      <span id={id} className={classes.headingScrollTo} />
      {children}
    </Element>
  )
}

export const Heading: React.FC<Props> = (props) => {
  const { element: el = 'h1', as = el, margin, marginTop, marginBottom, className } = props

  const classList = [
    className,
    as && classes[as],
    margin === false && classes.noMargin,
    marginTop === false && classes.noMarginTop,
    marginBottom === false && classes.noMarginBottom,
  ]
    .filter(Boolean)
    .join(' ')

  if (!props.href) {
    return <HeadingElement {...props} className={classList} />
  }

  return (
    <Link href={props.href} className={classList} prefetch={false}>
      <HeadingElement {...props} className={undefined} margin={false} />
    </Link>
  )
}
```

# \_components/Header/index.tsx

```tsx
'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useSearchParams } from 'next/navigation'
import { TopBar } from '@app/_components/TopBar'
import { UniversalTruth } from '@app/_components/UniversalTruth'
import { Menu } from '@payload-types'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { DesktopNav } from './DesktopNav'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav'

import classes from './index.module.scss'

export const Header: React.FC<Menu> = ({ menu, topBar }: any) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerTheme } = useHeaderObserver()
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(true)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  React.useEffect(() => {
    if (isHydrated) {
      if (isMobileNavOpen) {
        setHideBackground(false)
      } else {
        setHideBackground(y < 30)
      }
    }
  }, [y, isMobileNavOpen, isHydrated])

  if (!isHydrated) {
    return null
  }

  return (
    <div data-theme={headerTheme}>
      <header
        className={[
          classes.header,
          classes.headerSpacing,
          hideBackground && classes.hideBackground,
          isMobileNavOpen && classes.mobileNavOpen,
          headerTheme && classes.themeIsSet,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {topBar && <TopBar {...topBar} />}

        <DesktopNav tabs={menu?.tabs} hideBackground={hideBackground} />
        <MobileNav tabs={menu?.tabs} />
        <React.Suspense>
          <UniversalTruth />
        </React.Suspense>
      </header>
    </div>
  )
}
```

# \_components/Gutter/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
  dataTheme?: string
  disableMobile?: boolean
  leftGutter?: boolean
  rightGutter?: boolean
  ref?: React.MutableRefObject<any>
}
export const Gutter: React.FC<Props> = ({
  children,
  className,
  dataTheme,
  disableMobile,
  leftGutter = true,
  rightGutter = true,
  ref: refFromProps,
}) => {
  return (
    <div
      className={[
        className,
        leftGutter && classes.leftGutter,
        rightGutter && classes.rightGutter,
        disableMobile && classes.disableMobile,
      ]
        .filter(Boolean)
        .join(' ')}
      data-theme={dataTheme}
      ref={refFromProps || null}
    >
      {children}
    </div>
  )
}
```

# \_components/GoogleMapsScriptLoader/index.tsx

```tsx
// components/GoogleMapsScriptLoader.tsx
import React, { useEffect } from 'react'

interface GoogleMapsScriptLoaderProps {
  onLoad: () => void
}

const GoogleMapsScriptLoader: React.FC<GoogleMapsScriptLoaderProps> = ({ onLoad }) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = onLoad
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [onLoad])

  return null
}

export default GoogleMapsScriptLoader
```

# \_components/Footer/index.tsx

```tsx
'use client'

import React, { useId } from 'react'
import { Text } from '@app/_components/forms/fields/Text'
import FormComponent from '@app/_components/forms/Form'
import { validateEmail } from '@app/_components/forms/validations'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { Footer as FooterType } from '@payload-types'
import { usePathname, useRouter } from 'next/navigation'

// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
// import { useThemePreference } from '@app/_providers/Theme'
// import { getImplicitPreference, themeLocalStorageKey } from '@app/_providers/Theme/shared'
// import { Theme } from '@app/_providers/Theme/types'
import { getCookie } from '@/utilities/get-cookie'

import classes from './index.module.scss'
import { SubFooter } from './SubFooter'
import { blockFormats, contentFormats } from '../../_css/tailwindClasses'
import Link from 'next/link'

export const Footer: React.FC<FooterType> = (props) => {
  // console.log('footer props --', props)
  const { columns } = props
  // const { setTheme } = useThemePreference()
  // const { setHeaderTheme } = useHeaderObserver()

  const wrapperRef = React.useRef<HTMLElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)
  const [buttonClicked, setButtonClicked] = React.useState(false)
  const submitButtonRef = React.useRef<HTMLButtonElement>(null)

  const handleButtonClick = () => {
    setButtonClicked(true)
  }

  React.useEffect(() => {
    const buttonElement = submitButtonRef.current

    if (buttonElement) {
      buttonElement.addEventListener('click', handleButtonClick)
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('click', handleButtonClick)
      }
    }
  }, [])

  const [formData, setFormData] = React.useState({ firstName: '', email: '' })

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target?.name]: e.target?.value })
  }

  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

  // const onThemeChange = (themeToSet: Theme & 'auto') => {
  //   if (themeToSet === 'auto') {
  //     const implicitPreference = getImplicitPreference() ?? 'light'
  //     setHeaderTheme(implicitPreference)
  //     setTheme(implicitPreference)
  //     if (selectRef.current) selectRef.current.value = 'auto'
  //   } else {
  //     setTheme(themeToSet)
  //     setHeaderTheme(themeToSet)
  //   }
  // }

  // React.useEffect(() => {
  //   const preference = window.localStorage.getItem(themeLocalStorageKey)
  //   if (selectRef.current) {
  //     selectRef.current.value = preference ?? 'auto'
  //   }
  // }, [])

  const router = useRouter()
  const pathname = usePathname()
  const newsletterId = useId()

  const onSubmit = React.useCallback(() => {
    setButtonClicked(false)
    const submitForm = async () => {
      setError(undefined)

      try {
        const formID = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ID
        const hubspotCookie = getCookie('hubspotutk')
        const pageUri = `${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`
        const slugParts = pathname?.split('/')
        const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form: formID,
            submissionData: { field: 'email', value: formData.email },
            hubspotCookie,
            pageUri,
            pageName,
          }),
        })

        const res = await req.json()

        if (req.status >= 400) {
          setError({
            status: res.status,
            message: res.errors?.[0]?.message || 'Internal Server Error',
          })

          return
        }

        const url = '/thanks-for-subscribing'
        const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SERVER_URL)

        try {
          if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SERVER_URL) {
            router.push(redirectUrl.href)
          } else {
            window.location.assign(url)
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setError({
            message: 'Something went wrong. Did not redirect.',
          })
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setError({
          message: 'Newsletter form submission failed.',
        })
      }
    }
    submitForm()
  }, [pathname, formData, router])

  return (
    <React.Fragment>
      <footer ref={wrapperRef} className={classes.footer}>
        <Gutter className={classes.container}>
          <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')}>
            {columns?.map(({ label: column, items }, i) => {
              return (
                <div
                  key={`col-${i}`}
                  className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}
                >
                  <h3
                    className={[
                      contentFormats.global,
                      `font-title text-lg font-semibold tracking-tighter`,
                    ].join(' ')}
                  >
                    {column}
                  </h3>
                  <ul role="list" className={`mt-4 list-none space-y-4 pl-0 leading-none`}>
                    {items?.map(({ link }, j) => (
                      <li key={`link-${i}-${j}`}>
                        <CMSLink {...link} className={blockFormats.footerMenu} />
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}

            <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
              <h3
                className={[
                  contentFormats.global,
                  `font-title text-lg font-semibold tracking-tighter`,
                ].join(' ')}
              >
                Stay Connected
              </h3>
              <div>
                <FormComponent onSubmit={onSubmit}>
                  <label className="visually-hidden" htmlFor={newsletterId}>
                    Your Name
                  </label>
                  <Text
                    type="text"
                    path={newsletterId}
                    name="firstName"
                    value={formData.firstName}
                    customOnChange={handleChange}
                    required
                    // validate={}
                    className={`classes.emailInput`}
                    placeholder="Enter your name"
                  />
                  <div className={classes.inputWrap}>
                    <label className="visually-hidden" htmlFor={newsletterId}>
                      {/* // Subscribe to our newsletter */}
                    </label>
                    <Text
                      type="text"
                      path={newsletterId}
                      name="email"
                      value={formData.email}
                      customOnChange={handleChange}
                      required
                      validate={validateEmail}
                      className={`classes.emailInput`}
                      placeholder="Enter your email"
                    />
                    <button ref={submitButtonRef} className={classes.submitButton} type="submit">
                      <ArrowIcon className={[classes.inputArrow].filter(Boolean).join(' ')} />
                      <span className="visually-hidden">Submit</span>
                    </button>
                  </div>

                  <div className={classes.subscribeAction}>
                    <p
                      className={[contentFormats.global, contentFormats.text].join(' ')}
                      // className={classes.subscribeDesc}
                    >
                      Sign up to receive periodic updates to your email.
                    </p>
                  </div>
                  {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
                </FormComponent>
              </div>

              <div className="grid space-x-3 justify-start">
                <Link
                  href="https://www.instagram.com/thankly.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-gray-400 hover:text-gray-900"
                  aria-label="Thankly's Instagram page"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" {...props}>
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                <Link
                  href="https://www.facebook.com/thankly.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  // className={classes.socialIconLink}
                  className="flex-1 text-gray-400 hover:text-gray-900"
                  aria-label="Thankly's Facebook page"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" {...props}>
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                <Link
                  href="https://www.linkedin.com/company/thankly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-gray-400 hover:text-gray-900"
                  aria-label="Thankly's LinkedIn page"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 12"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMinYMin"
                    className="jam jam-linkedin"
                    width="28"
                    height="28"
                    {...props}
                  >
                    <path d="M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792zM2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254v12.869z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </Gutter>
      </footer>
      <SubFooter />
    </React.Fragment>
  )
}
```

# \_components/ErrorMessage/index.tsx

```tsx
'use client'

import React from 'react'
import { CallToAction } from '@app/_blocks/CallToAction'

// import BreadcrumbsBar from '@app/_blocks/Hero/BreadcrumbsBar'
// import { DefaultHero } from '@app/_blocks/Hero/Default'

export const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
  return (
    <React.Fragment>
      {/* <BreadcrumbsBar breadcrumbs={undefined} links={undefined} /> */}
      <CallToAction
        blockType="cta"
        padding={{ top: 'large', bottom: 'large' }}
        ctaFields={{
          links: [
            {
              id: '6654071db8f61fc8c2b5b72b',

              link: {
                type: 'reference',
                label: 'Home',

                reference: {
                  value: {
                    id: 1,
                    title: 'Home',
                    slug: 'home',
                    theme: 'light',

                    layout: {
                      root: {
                        type: 'root',
                        format: '',
                        indent: 0,
                        version: 1,

                        children: [
                          {
                            type: 'paragraph',
                            format: '',
                            indent: 0,
                            version: 1,
                            children: [],
                            direction: null,
                            textFormat: 0,
                          },
                          {
                            type: 'block',

                            fields: {
                              id: '6654061801542698a8558f7a',
                              blockName: '',
                              blockType: 'cta',

                              ctaFields: {
                                links: [
                                  {
                                    id: '6654071db8f61fc8c2b5b72b',

                                    link: {
                                      type: 'reference',
                                      label: 'Home',

                                      reference: {
                                        value: 1,
                                        relationTo: 'pages',
                                      },
                                    },
                                  },
                                  {
                                    id: '66540722b8f61fc8c2b5b72e',

                                    link: {
                                      url: '/shop',
                                      type: 'custom',
                                      label: 'Shop',
                                    },
                                  },
                                ],
                                content: {
                                  root: {
                                    type: 'root',
                                    format: '',
                                    indent: 0,
                                    version: 1,

                                    children: [
                                      {
                                        tag: 'h2',
                                        type: 'heading',
                                        format: '',
                                        indent: 0,
                                        version: 1,

                                        children: [
                                          {
                                            mode: 'normal',
                                            text: 'Page not found',
                                            type: 'text',
                                            style: '',
                                            detail: 0,
                                            format: 0,
                                            version: 1,
                                          },
                                        ],
                                        direction: 'ltr',
                                      },
                                    ],
                                    direction: 'ltr',
                                  },
                                },

                                settings: {
                                  theme: 'light',
                                },
                              },
                            },
                            format: '',
                            version: 2,
                          },
                        ],
                        direction: null,
                      },
                    },
                    meta: {
                      title: null,
                      description: null,
                    },
                    breadcrumbs: [
                      {
                        id: '6654072bb8f61fc8c2b5b72f',
                        url: '/home',
                        label: 'Home',
                        doc: 1,
                      },
                    ],
                    updatedAt: '2024-05-27T04:08:11.215Z',
                    createdAt: '2024-05-27T04:04:15.032Z',
                    _status: 'published',
                  },
                  relationTo: 'pages',
                },
              },
            },
            {
              id: '66540722b8f61fc8c2b5b72e',

              link: {
                url: '/shop',
                type: 'custom',
                label: 'Shop',
              },
            },
          ],
          content: {
            root: {
              type: 'root',
              format: '',
              indent: 0,
              version: 1,

              children: [
                {
                  tag: 'h2',
                  type: 'heading',
                  format: '',
                  indent: 0,
                  version: 1,

                  children: [
                    {
                      mode: 'normal',
                      text: 'Page not found',
                      type: 'text',
                      style: '',
                      detail: 0,
                      format: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                },
              ],
              direction: 'ltr',
            },
          },
          settings: {
            theme: 'light',
          },
        }}
      />
    </React.Fragment>
  )
}
```

# \_components/CopyToClipboard/index.tsx

```tsx
import * as React from 'react'

import { Tooltip } from '@app/_components/Tooltip'
import { CopyIcon } from '@app/_icons/CopyIcon'

import classes from './index.module.scss'

type CopyToClipboardProps = {
  value: (() => Promise<string | null>) | string | null
  className?: string
  hoverText?: string
}
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  className,
  hoverText,
}) => {
  const [copied, setCopied] = React.useState(false)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const ref = React.useRef<any>(null)

  const copy = React.useCallback(async () => {
    if (ref && ref.current && value) {
      const copyValue = typeof value === 'string' ? value : await value()
      if (!copyValue) return

      ref.current.value = copyValue
      ref.current.select()
      ref.current.setSelectionRange(0, copyValue.length + 1)
      document.execCommand('copy')

      setCopied(true)
    }
  }, [value])

  React.useEffect(() => {
    if (copied && !showTooltip) {
      setTimeout(() => {
        setCopied(false)
      }, 500)
    }
  }, [copied, showTooltip])

  return (
    <Tooltip
      onClick={copy}
      text={copied ? 'Copied!' : hoverText || 'Copy'}
      setIsVisible={setShowTooltip}
      isVisible={showTooltip || copied}
      className={className}
    >
      <CopyIcon size="large" />
      <textarea className={classes.copyTextarea} tabIndex={-1} readOnly ref={ref} />
    </Tooltip>
  )
}
```

# \_components/CircleIconButton/index.tsx

```tsx
import React from 'react'
import { CloseIcon } from '@app/_icons/CloseIcon'
import { PlusIcon } from '@app/_icons/PlusIcon'

import classes from './index.module.scss'

interface Icons {
  add: React.ElementType
  close: React.ElementType
}

const icons: Icons = {
  add: PlusIcon,
  close: CloseIcon,
}

export const CircleIconButton: React.FC<{
  className?: string
  onClick: () => void
  label: string
  icon?: keyof Icons
}> = ({ className, onClick, label, icon = 'add' }) => {
  const Icon = icons[icon]

  return (
    <button
      className={[classes.button, className].filter(Boolean).join(' ')}
      type="button"
      onClick={onClick}
    >
      <div className={classes.iconWrapper}>{Icon && <Icon size="full" />}</div>
      <span className={classes.label}>{label}</span>
    </button>
  )
}
```

# \_components/CMSLink/index.tsx

```tsx
import React from 'react'
import Link from 'next/link'
import { Page, Product } from '@/payload-types'

import cn from '@/utilities/cn'
import { generateHref } from '@/utilities/generateHref'

import { buttonLook } from '@app/_css/tailwindClasses'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import classes from './index.module.scss'

export type CMSLinkType = {
  data?: {
    label?: string
    type?: 'custom' | 'reference' | string | null
    reference?: {
      value: string | Page | Product
      relationTo: 'pages' | 'products'
    }
    url?: string
    newTab?: boolean
  }
  children?: React.ReactNode

  className?: string
  look?: {
    theme?: 'dark' | 'light'
    type?: 'button' | 'link' | 'submit'
    size?: keyof (typeof buttonLook)['sizes']
    width?: keyof (typeof buttonLook)['widths']
    variant?: keyof (typeof buttonLook)['variants']
    icon?: {
      content: React.ReactNode
      iconPosition?: 'left' | 'right'
    }
  }

  actions?: {
    onClick?: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
  }
}

export const CMSLink: React.FC<CMSLinkType & { pending?: boolean }> = ({
  data,
  children,
  className,
  look,
  actions,
  pending,
}) => {
  // validate inputs
  if (!data) return null // Handle case where data is undefined

  const { label, type, reference, url, newTab } = data
  const href = generateHref({ type, url, reference })
  if (!href && data.type) return null

  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  let classNames = [
    className, // classes passed in
    buttonLook.base,
    cn(
      look?.theme === 'dark' ? 'dark:text-neutral-100' : 'text-neutral-800',
      look?.size && look.type !== 'link' && buttonLook.sizes[look.size],
      look?.width && look.type !== 'link' && buttonLook.widths[look.width],
      look?.type !== 'link' && buttonLook.variants['base'],
      look?.variant && buttonLook.variants[look.variant],
    ),
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
  ) => {
    if (actions?.onClick) {
      actions.onClick(event as React.MouseEvent<HTMLAnchorElement, MouseEvent>)
    }
  }

  const renderContent = () => (
    <>
      {look?.icon?.content && look.icon.iconPosition === 'left' && (
        <span className="mr-2">{look.icon.content}</span>
      )}
      {children || label}
      {look?.icon?.content && look.icon.iconPosition === 'right' && (
        <span className={data.label === '' || !data?.label ? `sm:ml-0 ml-2` : `ml-2`}>
          {look.icon.content}
        </span>
      )}
      {!look?.icon && <span className="mr-2">{<ChevronRightIcon strokeWidth={1.25} />}</span>}
    </>
  )

  if ((look?.type === 'button' || look?.type === 'submit') && actions?.onClick) {
    return (
      <button className={classNames} onClick={handleClick} disabled={pending} {...newTabProps}>
        {/* {renderContent()} */}
        {pending ? 'processing...' : renderContent()}
      </button>
    )
  } else {
    return (
      <Link href={href} className={classNames} {...newTabProps}>
        {renderContent()}
      </Link>
    )
  }
}
```

# \_components/ChangeHeaderTheme/index.tsx

```tsx
import * as React from 'react'

import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { Theme } from '@app/_providers/Theme/types'

import classes from './index.module.scss'

type ThemeHeaderProps = {
  children?: React.ReactNode
  theme: Theme
}
export const ChangeHeaderTheme: React.FC<ThemeHeaderProps> = ({ children, theme }) => {
  const observableRef = React.useRef<HTMLDivElement>(null)
  const { addObservable, debug } = useHeaderObserver()

  React.useEffect(() => {
    const observableElement = observableRef?.current
    if (observableElement) {
      addObservable(observableElement, true)
    }
  }, [addObservable])

  return (
    <div className={[classes.headerObserver, debug && classes.debug].filter(Boolean).join(' ')}>
      {children && children}

      <div className={[classes.observerContainer].filter(Boolean).join(' ')}>
        <div ref={observableRef} className={classes.stickyObserver} data-theme={theme} />
      </div>
    </div>
  )
}
```

# \_components/CMSForm/index.tsx

```tsx
'use client'

import * as React from 'react'
import Form from '@app/_components/forms/Form'
import { usePathname, useRouter } from 'next/navigation'

import { RichText } from '@app/_blocks/RichText'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Form as FormType } from '@payload-types'
import { getCookie } from '@/utilities/get-cookie'
import { fields } from './fields'
import Submit from './Submit'

import classes from './index.module.scss'

const buildInitialState = (fields: any) => {
  const state: any = {}

  fields.forEach((field: any) => {
    state[field.name] = {
      value: '',
      valid: !field.required,
      initialValue: undefined,
      errorMessage: 'This field is required.',
    }
  })

  return state
}

const RenderForm = ({ form }: { form: FormType }) => {
  const {
    id: formID,
    submitButtonLabel,
    confirmationType,
    redirect: formRedirect,
    confirmationMessage,
  } = form

  const [isLoading, setIsLoading] = React.useState(false)

  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>()

  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

  const initialState = buildInitialState(form.fields)

  const router = useRouter()

  const pathname = usePathname()

  const onSubmit = React.useCallback(
    ({ data }: any) => {
      let loadingTimerID: ReturnType<typeof setTimeout>

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const hubspotCookie = getCookie('hubspotutk')
          const pageUri = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`
          const slugParts = pathname?.split('/')
          const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)
          const req = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/form-submissions`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
              hubspotCookie,
              pageUri,
              pageName,
            }),
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              status: res.status,
              message: res.errors?.[0]?.message || 'Internal Server Error',
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && formRedirect) {
            const { url } = formRedirect

            if (!url) return

            const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SITE_URL)

            try {
              if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SITE_URL) {
                router.push(redirectUrl.href)
              } else {
                window.location.assign(url)
              }
            } catch (err) {
              console.warn(err) // eslint-disable-line no-console
              setError({
                message: 'Something went wrong. Did not redirect.',
              })
            }
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      submitForm()
    },
    [router, formID, formRedirect, confirmationType, pathname],
  )

  if (!form?.id) return null

  return (
    <div className={classes.cmsForm}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText content={confirmationMessage} />
      )}
      {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
      {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
      {!hasSubmitted && (
        <React.Fragment>
          <Form
            onSubmit={onSubmit}
            initialState={initialState}
            formId={formID.toString()}
            // formId={formID}
          >
            <div className={classes.formFieldsWrap}>
              {form.fields?.map((field, index) => {
                const Field: React.FC<any> = fields?.[field.blockType]
                const isLastField = index === (form.fields?.length ?? 0) - 1
                if (Field) {
                  return (
                    <div
                      key={index}
                      className={[classes.fieldWrap, !isLastField ? classes.hideBottomBorder : '']
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <Field
                        path={'name' in field ? field.name : undefined}
                        form={form}
                        {...field}
                      />
                    </div>
                  )
                }
                return null
              })}
              <CrosshairIcon className={[classes.crosshair, classes.crosshairLeft].join(' ')} />
            </div>
            <Submit
              className={[classes.submitButton, classes.hideTopBorder].filter(Boolean).join(' ')}
              processing={isLoading}
              label={submitButtonLabel}
              // iconRotation={45}
            />
          </Form>
        </React.Fragment>
      )}
    </div>
  )
}

export const CMSForm: React.FC<{
  form?: string | FormType | null
}> = (props) => {
  const { form } = props

  if (!form || typeof form === 'string') return null

  return <RenderForm form={form} />
}
```

# \_components/CMSForm/fields.tsx

```tsx
import { NumberInput } from '@app/_components/forms/fields/Number'

// import { RichText } from '@app/_components/RichText'
import { ChevronDownIcon } from '@app/_icons/ChevronDownIcon'
import { Checkbox } from './fields/Checkbox'
import { Select } from './fields/Select'
import { Text } from './fields/Text'
import { Textarea } from './fields/Textarea'
import { RichText } from '@app/_blocks/RichText'

import classes from './fields.module.scss'

export const fields = {
  text: Text,
  textarea: Textarea,
  select: (props: any) => {
    return <Select components={{ DropdownIndicator: ChevronDownIcon }} {...props} />
  },
  checkbox: Checkbox,
  email: (props: any) => {
    return <Text {...props} />
  },
  country: (props: any) => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="country" {...props} />
    )
  },
  state: (props: any) => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="state" {...props} />
    )
  },
  message: (props: any) => {
    return <RichText className={classes.message} content={props.message} />
  },
  number: NumberInput,
}
```

# \_components/Breadcrumbs/index.tsx

```tsx
import * as React from 'react'
import Link from 'next/link'

// import { EdgeScroll } from '@app/_components/EdgeScroll'

import classes from './index.module.scss'

export type Breadcrumb = {
  label?: string | null
  url?: string | null
}

export type Props = {
  items?: Array<Breadcrumb> | null
  ellipsis?: boolean
  className?: string
}

export const Breadcrumbs: React.FC<Props> = ({ items, ellipsis = true, className }) => {
  return (
    <nav
      aria-label="Breadcrumbs navigation"
      className={[classes.breadcrumbs, className].filter(Boolean).join(' ')}
    >
      {items?.map((item, index) => {
        const isLast = index === items.length - 1
        const doEllipsis = ellipsis && (item?.label || '')?.length > 8 && !isLast

        if (item?.url && typeof item.url === 'string') {
          return (
            <React.Fragment key={index}>
              <div
                className={[classes.label, doEllipsis && classes.ellipsis]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Link href={item.url} prefetch={false} className={classes.labelContent}>
                  {item.label}
                </Link>
              </div>
              {!isLast && <p className={classes.divider}>&nbsp;&#47;&nbsp;</p>}
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={index}>
            <div
              className={[classes.label, doEllipsis && classes.ellipsis].filter(Boolean).join(' ')}
            >
              <div className={classes.labelContent}>{item.label}</div>
            </div>
            {!isLast && <p className={classes.divider}>&nbsp;/&nbsp;</p>}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
```

# \_components/BlockWrapper/index.tsx

```tsx
'use client'

import React, { useEffect, useState } from 'react'
import { ChangeHeaderTheme } from '@app/_components/ChangeHeaderTheme'
import { Page } from '@payload-types'
import { useThemePreference } from '@app/_providers/Theme'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import classes from './index.module.scss'

export type Settings = ExtractBlockProps<'cardGrid'>['cardGridFields']['settings']

export type PaddingProps = {
  top?: 'large' | 'medium' | 'small' | 'hero'
  bottom?: 'large' | 'medium' | 'small'
}

type Props = {
  settings?: any // Settings
  className?: string
  children: React.ReactNode
  padding?: PaddingProps
  /**
   * Controls whether or not to set the padding or just provide the css variables
   *
   * Useful for complex components that need to set padding on a child element
   */
  setPadding?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const defaultPadding: PaddingProps = {
  top: 'medium',
  bottom: 'medium',
}

export const BlockWrapper: React.FC<Props> = ({
  settings,
  className,
  children,
  padding,
  setPadding = true,
  ...rest
}) => {
  const [themeState, setThemeState] = useState<Page['theme']>(settings?.theme)
  const { theme: themeFromContext } = useThemePreference()
  const theme = settings?.theme

  useEffect(() => {
    if (settings?.theme) setThemeState(settings.theme)
    else {
      if (themeFromContext) setThemeState(themeFromContext)
    }
  }, [settings, themeFromContext])

  const appliedPadding = {
    top: padding?.top || defaultPadding.top,
    bottom: padding?.bottom || defaultPadding.bottom,
  }

  const paddingClasses = [`py-content-${appliedPadding.top}`, `pb-content-${appliedPadding.bottom}`]

  return (
    <ChangeHeaderTheme theme={themeState ?? 'light'}>
      <div
        className={[
          classes.blockWrapper,
          theme && classes[`theme-${theme}`],
          ...paddingClasses,
          setPadding && classes.setPadding,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {children}
      </div>
    </ChangeHeaderTheme>
  )
}
```

# \_components/BlockSpacing/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

type Props = {
  top?: boolean
  bottom?: boolean
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const BlockSpacing: React.FC<Props> = ({
  top = true,
  bottom = true,
  className,
  children,
  style,
}) => {
  return (
    <div
      className={[className, top && classes.top, bottom && classes.bottom]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  )
}
```

# \_components/BigThree/index.tsx

```tsx
import classes from './index.module.scss'

interface BigThreeProps {
  className?: string
}

const BigThree: React.FC<BigThreeProps> = (props) => {
  const { className } = props

  return (
    <div className={[className, classes.container].filter(Boolean).join(' ')} data-theme="dark">
      <svg
        width="1200"
        viewBox="0 0 1601 855"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        className={classes.three}
      >
        <path d="M628.256 616.221C628.256 744.592 518.389 854.458 322.942 854.458C134.433 854.458 14.1582 750.374 0.280273 594.248H147.155C154.094 680.984 221.17 737.653 322.942 737.653C424.713 737.653 486.007 686.767 486.007 605.813C486.007 522.545 422.4 482.068 328.724 482.068H243.144V368.731H326.411C403.896 368.731 466.347 334.037 466.347 246.143C466.347 174.441 417.774 117.773 326.411 117.773C229.266 117.773 172.598 182.536 166.815 265.804H25.7231C34.9751 122.398 139.059 0.966716 327.568 0.966716C513.763 0.966716 609.752 114.303 609.752 241.517C609.752 338.663 544.988 408.052 461.721 423.087C561.179 439.278 628.256 514.45 628.256 616.221Z" />
        <path d="M691.655 840.581V668.263H863.973V840.581H691.655Z" />
        <path d="M898.289 427.706C898.289 180.216 1034.76 0.959961 1249.86 0.959961C1464.97 0.959961 1600.28 180.216 1600.28 427.706C1600.28 675.195 1464.97 854.452 1249.86 854.452C1034.76 854.452 898.289 675.195 898.289 427.706ZM1053.26 427.706C1053.26 615.058 1118.02 734.176 1249.86 734.176C1380.55 734.176 1445.31 615.058 1445.31 427.706C1445.31 240.354 1380.55 121.235 1249.86 121.235C1118.02 121.235 1053.26 240.354 1053.26 427.706Z" />
      </svg>
    </div>
  )
}

export default BigThree
```

# \_components/Banner/index.tsx

```tsx
import * as React from 'react'

import { CheckIcon } from '@app/_icons/CheckIcon'
import { Reusable } from '@payload-types'
// import { RichText } from '../RichText'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'

export type Props = {
  // type?: Extract<Reusable['layout'][0], { blockType: 'banner' }>['bannerFields']['type']
  type?: ExtractBlockProps<'banner'>['bannerFields']['type']

  // content?: Extract<Reusable['layout'][0], { blockType: 'banner' }>['bannerFields']['content']
  content?: ExtractBlockProps<'banner'>['bannerFields']['content']

  children?: React.ReactNode
  checkmark?: boolean
  icon?: 'checkmark'
  margin?: boolean
  marginAdjustment?: any
}

const Icons = {
  checkmark: CheckIcon,
}

export const Banner: React.FC<Props> = ({
  content,
  children,
  icon,
  type = 'default',
  checkmark,
  margin = true,
  marginAdjustment = {},
}) => {
  let Icon = icon && Icons[icon]
  if (!Icon && checkmark) Icon = Icons.checkmark

  return (
    <div
      className={[classes.banner, 'banner', type && classes[type], !margin && classes.noMargin]
        .filter(Boolean)
        .join(' ')}
      style={marginAdjustment}
    >
      {Icon && <Icon className={classes.icon} />}

      {content && <RichText content={content} />}
      {children && <div className={classes.children}>{children}</div>}
    </div>
  )
}
```

# \_components/BackgroundScanline/index.tsx

```tsx
import React from 'react'

import { CrosshairIcon } from '@app/_icons/CrosshairIcon'

import classes from './index.module.scss'

const crosshairPositions = ['top-left', 'bottom-left', 'top-right', 'bottom-right'] as const

interface Props {
  /**
   * Adds top and bottom borders to the scanline
   */
  enableBorders?: boolean
  className?: string
  crosshairs?: 'all' | (typeof crosshairPositions)[number][]
  style?: React.CSSProperties
}
export const BackgroundScanline: React.FC<Props> = ({
  className,
  enableBorders,
  crosshairs,
  style,
}: Props) => {
  return (
    <div
      aria-hidden="true"
      className={[classes.wrapper, className, enableBorders && classes.enableBorders]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {/* <div className={[classes.backgroundScanline].filter(Boolean).join(' ')}></div>
      {crosshairs && (
        <React.Fragment>
          {(crosshairs === 'all' || crosshairs.includes('top-left')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairTopLeft, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {(crosshairs === 'all' || crosshairs.includes('bottom-left')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairBottomLeft, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {(crosshairs === 'all' || crosshairs.includes('top-right')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairTopRight, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {(crosshairs === 'all' || crosshairs.includes('bottom-right')) && (
            <CrosshairIcon
              className={[classes.crosshair, classes.crosshairBottomRight, 'crosshair']
                .filter(Boolean)
                .join(' ')}
            />
          )}
        </React.Fragment>
      )} */}
    </div>
  )
}
```

# \_components/BackgroundGrid/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

type GridLineStyles = {
  [index: number]: React.CSSProperties
}

type Props = {
  className?: string
  ignoreGutter?: boolean
  style?: React.CSSProperties
  zIndex?: number
  gridLineStyles?: GridLineStyles
  wideGrid?: boolean
}

export const BackgroundGrid: React.FC<Props> = ({
  className,
  ignoreGutter,
  style,
  zIndex = -1,
  gridLineStyles = {},
  wideGrid = false,
}: Props) => {
  return (
    <div
      aria-hidden="true"
      className={[
        classes.backgroundGrid,
        'grid',
        ignoreGutter && classes.ignoreGutter,
        className,
        wideGrid && classes.wideGrid,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, zIndex }}
    >
      {[...Array(wideGrid ? 4 : 5)].map((_, index) => (
        <div
          key={index}
          className={[classes.column, 'cols-4'].join(' ')}
          style={gridLineStyles[index] || {}}
        ></div>
      ))}
    </div>
  )
}
```

# \_components/Background/index.tsx

```tsx
import styles from './styles.module.scss'

export const Background = () => {
  return (
    <div className={styles.background}>
      <div className={styles.gridlineContainer}>
        <div className={styles.hideMed} />
        <div className={styles.hideMed} />
        <div className={styles.hideSmall} />
        <div />
      </div>
      <div className={styles.blur} />
      <div className={styles.gradient} />
    </div>
  )
}
```

# \_components/Avatar/index.tsx

```tsx
import * as React from 'react'
// import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'

// import { useAuth } from '@app/_providers/Auth'

// import { DropdownMenu } from './DropdownMenu'
import classes from './index.module.scss'

export const Avatar: React.FC<{ className?: string }> = ({ className }) => {
  // const { user } = useAuth()

  // const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={[classes.avatar, className].filter(Boolean).join(' ')}>
      {/* <button
        type="button"
        className={classes.button}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className={classes.primaryUser}>
          <div className={classes.userInitial}>{user.email.charAt(0).toUpperCase()}</div>
        </div>
      </button>
      <DropdownMenu isOpen={isOpen} onChange={setIsOpen} /> */}
      <Link href={`/account`} prefetch={false}>
        <div className={classes.primaryUser}>
          {/* <div className={classes.userInitial}>{user?.email?.charAt(0).toUpperCase()}</div> */}
        </div>
      </Link>
    </div>
  )
}
```

# \_components/Analytics/analytics.ts

```ts
const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const pixelID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

export function analyticsEvent(event: string, value?: unknown): void {
  const Window = window as any // eslint-disable-line @typescript-eslint/no-explicit-any

  if (gaMeasurementID && typeof Window.gtag === 'function') {
    Window.gtag('event', event, value)
  }

  if (pixelID) {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        if (event === 'page_view') {
          ReactPixel.pageView()
        } else {
          ReactPixel.track(event, value)
        }
      })
  }
}
```

# \_components/Accordion/index.tsx

```tsx
'use client'

import * as React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleToggler,
  useCollapsible,
} from '@faceless-ui/collapsibles'

import { ChevronIcon } from '@app/_graphics/ChevronIcon'
import { EyeIcon } from '@app/_icons/EyeIcon'

import classes from './index.module.scss'

const Icons = {
  eye: EyeIcon,
  chevron: ChevronIcon,
}

const IconToRender: React.FC<{ icon: 'eye' | 'chevron' }> = ({ icon }) => {
  const { isOpen } = useCollapsible()

  if (icon === 'eye') {
    return <EyeIcon closed={isOpen} size="large" />
  }

  const Icon = Icons[icon]
  return <Icon />
}

type HeaderProps = {
  label: React.ReactNode
  toggleIcon?: 'eye' | 'chevron'
}

const Header: React.FC<HeaderProps> = ({ label, toggleIcon = 'chevron' }) => {
  return (
    <CollapsibleToggler className={classes.toggler}>
      <div className={classes.labelContent}>{label}</div>
      <div className={[classes.icon, classes[`icon--${toggleIcon}`]].filter(Boolean).join(' ')}>
        <IconToRender icon={toggleIcon} />
      </div>
    </CollapsibleToggler>
  )
}

type ContentProps = {
  children: React.ReactNode
}
const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <CollapsibleContent>
      <div className={classes.collapsibleContent} data-accordion-content>
        {children}
      </div>
    </CollapsibleContent>
  )
}

type AccordionProps = HeaderProps &
  ContentProps & {
    className?: string
    openOnInit?: boolean
    onToggle?: () => void
  }

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  openOnInit,
  onToggle,
  ...rest
}) => {
  return (
    <Collapsible
      openOnInit={openOnInit}
      transTime={250}
      transCurve="ease"
      onToggle={() => {
        if (typeof onToggle === 'function') {
          onToggle()
        }
      }}
    >
      <div className={[classes.accordion, className].filter(Boolean).join(' ')}>
        <Header {...rest} />
        <Content>{children}</Content>
      </div>
    </Collapsible>
  )
}
```

# \_blocks/StickyHighlights/index.tsx

```tsx
import React, { useId } from 'react'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useWindowInfo } from '@faceless-ui/window-info'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Page } from '@payload-types'
import { StickyHighlight } from './Highlight'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }> & {
//   className?: string
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'stickyHighlights'> & {
  className?: string
  padding: PaddingProps
}

export const StickyHighlights: React.FC<Props> = ({
  stickyHighlightsFields,
  className,
  padding,
}) => {
  const { highlights, settings } = stickyHighlightsFields || {}
  const { yDirection } = useScrollInfo()
  const {
    breakpoints: { m },
  } = useWindowInfo()

  const id = useId()

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('standard'), classes.stickyHighlights, className]
        .filter(Boolean)
        .join(' ')}
      id={id}
    >
      <Gutter>
        {/* <BackgroundGrid zIndex={0} /> */}
        {highlights?.map((highlight: any, i: any) => {
          return <StickyHighlight yDirection={yDirection} midBreak={m} key={i} {...highlight} />
        })}
      </Gutter>
    </BlockWrapper>
  )
}

export default StickyHighlights
```

# \_blocks/Steps/index.tsx

```tsx
import React from 'react'

import { Page } from '@payload-types'
import { Step } from './Step'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'steps' }>

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type Props = ExtractBlockProps<'steps'>

export const Steps: React.FC<Props> = ({ stepsFields }) => {
  const { steps } = stepsFields

  return (
    <ul className={classes.steps}>
      {steps.map((step: any, i: any) => {
        return <Step key={i} i={i} {...step} />
      })}
    </ul>
  )
}

export default Steps
```

# \_blocks/Statement/index.tsx

```tsx
'use client'
import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
// import Code from '@app/_components/Code'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import SplitAnimate from '@app/_components/SplitAnimate'
import { Page } from '@payload-types'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

// export type StatementProps = Extract<Page['layout'][0], { blockType: 'statement' }> & {
//   padding?: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type StatementProps = ExtractBlockProps<'statement'> & { padding: PaddingProps }

export const Statement: React.FC<StatementProps> = (props) => {
  const {
    statementFields: {
      content,
      links,
      assetType,
      media,
      code,
      mediaWidth,
      backgroundGlow,
      settings,
    },
    // padding,
  } = props

  const hasLinks = links && links.length > 0

  const mediaWidthClass =
    mediaWidth === 'small'
      ? 'cols-8 start-5 cols-m-8 start-m-1'
      : mediaWidth === 'large'
        ? 'cols-16 cols-m-8'
        : 'cols-12 start-3 cols-m-8 start-m-1'

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter className={classes.statementWrap}>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.statement, 'cols-8 start-5 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <RichText content={content} className={classes.content} />
            {hasLinks && (
              <div className={[classes.links].filter(Boolean).join(' ')}>
                {links.map(({ link }: any, i: any) => {
                  return (
                    <CMSLink
                      key={i}
                      data={{ ...link }}
                      look={{
                        theme: 'light',
                        type: 'button',
                        size: 'medium',
                        width: 'wide',
                        variant: 'blocks',
                      }}
                    />
                    // <CMSLink
                    //   {...link}
                    //   key={i}
                    //   appearance="default"
                    //   fullWidth
                    //   buttonProps={{
                    //     icon: 'arrow',
                    //     hideHorizontalBorders: false,
                    //     hideBottomBorderExceptLast: true,
                    //   }}
                    // />
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div className={[classes.assetWrap, 'grid'].join(' ')}>
          {assetType === 'media'
            ? media &&
              typeof media !== 'string' && (
                <div className={mediaWidthClass}>
                  <Media
                    resource={media}
                    className={[mediaWidthClass, backgroundGlow && classes[backgroundGlow]]
                      .filter(Boolean)
                      .join(' ')}
                  />
                </div>
              )
            : code && (
                <div
                  className={[
                    backgroundGlow && classes[backgroundGlow],
                    'cols-10 start-4 cols-m-8 start-m-1',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {/* <Code className={classes.codeBlock}>{code}</Code> */}
                </div>
              )}
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

export default Statement
```

# \_blocks/Slider/index.tsx

```tsx
import * as React from 'react'
import {
  Slide,
  SliderNav,
  SliderProgress,
  SliderProvider,
  SliderTrack,
  useSlider,
} from '@faceless-ui/slider'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Page } from '@payload-types'
import { ArrowIcon } from '../../_icons/ArrowIcon'
import { useComputedCSSValues } from '../../_providers/ComputedCSSValues'
import { QuoteCard } from './QuoteCard'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'slider' }> & {
//   padding?: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'slider'> & { padding: PaddingProps }

export const SliderBlock: React.FC<Props> = (props) => {
  const { sliderFields } = props
  const { settings } = sliderFields
  const { currentSlideIndex } = useSlider()

  const slides = sliderFields.quoteSlides

  if (!slides || slides.length === 0) return null

  const isFirst = currentSlideIndex === 0
  const isLast = currentSlideIndex + 1 === slides.length

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('standard'), classes.slider].filter(Boolean).join(' ')}
    >
      {/* <BackgroundGrid zIndex={0} /> */}

      <div className={classes.trackWrap}>
        <BackgroundGrid
          zIndex={5}
          ignoreGutter
          gridLineStyles={{
            1: {
              display: 'none',
            },
            2: {
              display: 'none',
            },
            3: {
              display: 'none',
            },
          }}
        />
        <SliderTrack className={classes.sliderTrack}>
          {slides.map((slide: any, index: any) => {
            const isActive = currentSlideIndex === index
            return (
              <Slide
                key={index}
                index={index}
                className={[classes.slide, classes.quoteSlide].filter(Boolean).join(' ')}
              >
                <BackgroundGrid
                  zIndex={1}
                  ignoreGutter
                  gridLineStyles={{
                    0: { display: 'none' },
                    1: { display: 'none' },
                    2: { display: 'none' },
                    3: { display: 'none' },
                  }}
                />
                <QuoteCard isActive={isActive} {...slide} />
              </Slide>
            )
          })}
          <div className={classes.fakeSlide} />
        </SliderTrack>
        <div className={classes.progressBarBackground} />
      </div>

      <Gutter>
        <SliderNav
          className={classes.sliderNav}
          prevButtonProps={{
            className: [classes.navButton, classes.prevButton, isFirst && classes.disabled]
              .filter(Boolean)
              .join(' '),
            children: <ArrowIcon rotation={225} />,
            disabled: isFirst,
          }}
          nextButtonProps={{
            className: [classes.navButton, isLast && classes.disabled].filter(Boolean).join(' '),
            children: <ArrowIcon rotation={45} />,
            disabled: isLast,
          }}
        />
      </Gutter>
      <SliderProgress />
    </BlockWrapper>
  )
}

export const Slider: React.FC<any> = (props) => {
  const { gutterH } = useComputedCSSValues()

  return (
    <SliderProvider scrollSnap={true} slideOnSelect={true} slidesToShow={1} scrollOffset={gutterH}>
      <SliderBlock {...props} />
    </SliderProvider>
  )
}

export default Slider
```

# \_blocks/RichText/index.tsx

```tsx
import type { AdditionalBlockProps } from '@app/_blocks'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import LexicalContent from '@app/_components/LexicalContent'
// import type { RichTextBlock } from '@payload-types'
import classes from './index.module.scss'

export function RichText({ content, locale, className }: any & AdditionalBlockProps) {
  if (content?.root?.children?.length === 0) return null
  // console.log('richtext content to show // ', content.root)

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {/* <BlockWrapper> */}
      {/* <div className="prose dark:prose-invert md:prose-lg"> */}
      {/* @ts-ignore */}
      <LexicalContent
        childrenNodes={content?.root?.children}
        locale={locale}
        lazyLoadImages={false}
      />
      {/* </div> */}
      {/* </BlockWrapper> */}
    </div>
  )
}

export default RichText
```

# \_blocks/Reusable/index.tsx

```tsx
import React from 'react'
import Blocks from '@app/_blocks'

// import { RenderBlocks } from '@app/_components/RenderBlocks'
import { Page } from '@payload-types'

// export type Props = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type Props = ExtractBlockProps<'reuse'>

export const ReusableContentBlock: React.FC<Props> = ({ reuseBlockFields }) => {
  // console.log('reusable ', reuseBlockFields)
  const { reusable, customId } = reuseBlockFields

  if (typeof reusable === 'object' && reusable !== null) {
    return <Blocks blocks={reusable?.layout?.root?.children} />

    // <RenderBlocks blocks={reusableContent.layout} disableGutter customId={customId} />
  }

  return null
}

export default ReusableContentBlock
```

# \_blocks/ProductGrid/index.tsx

```tsx
import React, { CSSProperties } from 'react'

import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Product } from '@payload-types'

import classes from './index.module.scss'
import { ProductCard } from '@app/_components/ProductCard'

export type ProductGridProps = {
  products: Product[]
  padding?: PaddingProps
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  // console.log('productGrid', products)

  const productLength = products?.length ?? 0
  const hasProducts = Array.isArray(products) && productLength > 0
  const excessLength = productLength > 4 ? 8 - productLength : 4 - productLength

  const wrapperStyle: CSSProperties = {
    '--excess-length-large': excessLength,
    '--excess-length-mid': productLength % 2 === 0 ? 0 : 1,
  } as CSSProperties

  return (
    <React.Fragment>
      {/* <BlockWrapper
        settings={{ settings: { theme: 'light' } }}
        className={[getPaddingClasses('hero'), 'py-16', classes.ProductGrid]
          .filter(Boolean)
          .join(' ')}
      >
        <Gutter> */}
      {hasProducts && (
        <div className={classes.cards}>
          <div
            className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}
            style={wrapperStyle}
          >
            {products?.map((product, index) => {
              return (
                <div key={index} className={'cols-4 cols-s-8'}>
                  <ProductCard className={classes.card} {...product} />
                </div>
              )
            })}
          </div>
        </div>
      )}
      {/* </Gutter>
      </BlockWrapper> */}
    </React.Fragment>
  )
}
export default ProductGrid
```

# \_blocks/ProductBlock/index.tsx

```tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { ProductActions } from '@app/_components/ProductActions'
import { Product, Media } from '@payload-types'
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'

interface ProductBlockContentProps {
  product: Product
  selectedImageIndex?: number
}

const ProductBlockContent: React.FC<ProductBlockContentProps> = ({
  product,
  selectedImageIndex = 0,
}) => {
  const {
    title,
    prices: { basePrice, salePrice },
    meta,
    media,
  } = product

  const formatPrice = (amount: number | null | undefined) => {
    if (amount == null) return 'Price not available'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const displayPrice = basePrice ?? 0
  const displaysalePrice = salePrice ?? 0

  return (
    <Gutter>
      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:py-16 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-start align-top">
          <div className="mt-3 sm:flex items-start justify-between align-top">
            <h1
              className={cn(
                contentFormats.global,
                `text-3xl mb-2 mt-0 sm:mt-6 sm:mb-6 font-title font-semibold tracking-tight text-gray-900 sm:text-4xl`,
              )}
            >
              {title}
            </h1>

            <div
              className={cn(
                `flex`,
                contentFormats.global,
                `text-xl mb-2 mt-0 sm:mt-6 sm:mb-6 font-title font-semibold tracking-tight text-gray-900 sm:text-4xl`,
              )}
            >
              <span
                className={`${displaysalePrice !== 0 && displaysalePrice < displayPrice ? 'line-through text-gray-500' : ''}`}
              >
                {formatPrice(displayPrice)}
              </span>
              {displaysalePrice !== 0 && displaysalePrice < displayPrice && (
                <span className="text-black ml-2 ">{formatPrice(displaysalePrice)}</span>
              )}
            </div>
          </div>

          <section aria-labelledby="information-heading" className="mt-4">
            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{meta?.description || ''}</p>
            </div>
          </section>
        </div>

        {/* Product images */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
          {media && media.length > 0 && (
            <>
              {/* Main image */}
              <div className="aspect-square overflow-hidden rounded-md mb-4">
                <Image
                  src={getImageUrl(media[selectedImageIndex]?.mediaItem)}
                  alt={getImageAlt(media[selectedImageIndex]?.mediaItem)}
                  priority
                  width={800}
                  height={800}
                  className="object-cover object-center w-full h-full"
                />
              </div>

              {/* Thumbnail images */}
              <div className="grid grid-cols-4 gap-4">
                {media.map((image, index) => (
                  <Link
                    key={image.id || index}
                    href={`/shop/${product.slug}?image=${index}`}
                    className={`aspect-square overflow-hidden rounded-md ${index === selectedImageIndex ? 'ring-2 ring-green' : ''}`}
                  >
                    <Image
                      src={getImageUrl(image.mediaItem)}
                      alt={getImageAlt(image.mediaItem)}
                      width={200}
                      height={200}
                      className="object-cover object-center w-full h-full"
                    />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <section aria-labelledby="options-heading">
            <ProductActions product={product} hidePerks={false} hideRemove={false} />
          </section>
        </div>
      </div>
    </Gutter>
  )
}

interface ProductBlockProps {
  product: Product
  selectedImageIndex?: number
}

export const ProductBlock: React.FC<ProductBlockProps> = ({ product, selectedImageIndex = 0 }) => {
  return (
    <BlockWrapper settings={{ theme: 'light' }} className={getPaddingClasses('hero')}>
      <ProductBlockContent product={product} selectedImageIndex={selectedImageIndex} />
    </BlockWrapper>
  )
}

export default ProductBlock
```

# \_blocks/Pricing/index.tsx

```tsx
import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { PricingCard } from '@app/_components/PricingCard'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { ChevronIcon } from '@app/_graphics/ChevronIcon'
import { CheckIcon } from '@app/_icons/CheckIcon'
import { CloseIcon } from '@app/_icons/CloseIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type Props = Extract<Page['layout'][0], { blockType: 'pricing' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'pricing'> & { padding: PaddingProps }

export const Pricing: React.FC<Props> = (props) => {
  const { pricingFields } = props
  const { plans, disclaimer, settings } = pricingFields || {}

  const [toggledPlan, setToggledPlan] = React.useState('')
  const hasPlans = Array.isArray(plans) && plans.length > 0

  const featureList = (features: any) => {
    return (
      <ul className={classes.features}>
        {features.map((item: any, index: any) => {
          const { feature, icon } = item
          return (
            <li className={classes.feature} key={index}>
              <div className={icon && classes[icon]}>
                {icon === 'check' && <CheckIcon size="large" />}
                {icon === 'x' && <CloseIcon />}
              </div>
              {feature}
            </li>
          )
        })}
      </ul>
    )
  }

  const colsStart: any = {
    0: 'start-1 start-m-1',
    1: 'start-5 start-m-1',
    2: 'start-9 start-m-1',
    3: 'start-13 start-m-1',
  }

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('standard'), classes.pricingBlock].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={1} />
      <Gutter className={classes.gutter}>
        {/* <BackgroundScanline className={classes.scanline} enableBorders /> */}
        {hasPlans && (
          <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
            {plans.map((plan, i) => {
              const {
                name,
                title,
                price,
                hasPrice,
                description,
                link,
                enableLink,
                features,
                enableCreatePayload,
              } = plan
              const isToggled = toggledPlan === name
              const isLast = i + 1 === plans.length

              return (
                <div
                  key={i}
                  className={[classes.plan, 'cols-4 cols-m-8', colsStart[i]]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {/* <CrosshairIcon className={classes.crosshairTopLeft} /> */}

                  {/* {isLast && <CrosshairIcon className={classes.crosshairTopRight} />} */}

                  <PricingCard
                    leader={name}
                    className={classes.card}
                    price={price}
                    hasPrice={hasPrice}
                    title={title}
                    description={description}
                    link={link}
                  />

                  <div className={classes.collapsibleList}>
                    <Collapsible
                      initialHeight={0}
                      transTime={250}
                      transCurve="ease-in"
                      onToggle={() => {
                        setToggledPlan(toggledPlan === name ? '' : name)
                      }}
                      open={isToggled}
                    >
                      <CollapsibleToggler className={classes.toggler}>
                        {`What's included`}
                        <ChevronIcon
                          className={[classes.chevron, isToggled && classes.open]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      </CollapsibleToggler>
                      <CollapsibleContent>{featureList(features)}</CollapsibleContent>
                    </Collapsible>
                  </div>

                  {(enableLink || enableCreatePayload) && (
                    <div className={classes.ctaWrapper}>
                      {enableLink && (
                        <CMSLink
                          data={{ ...link }}
                          look={{
                            theme: 'light',
                            type: 'button',
                            size: 'medium',
                            width: 'wide',
                            variant: 'blocks',
                          }}
                        />

                        // <CMSLink
                        //   appearance={'default'}
                        //   className={classes.link}
                        //   {...link}
                        //   buttonProps={{
                        //     hideBorders: true,
                        //   }}
                        // />
                      )}

                      {/* {enableCreatePayload && (
                        <CreatePayloadApp background={false} className={classes.createPayloadApp} />
                      )} */}
                    </div>
                  )}

                  <div className={classes.list}>{featureList(features)}</div>
                </div>
              )
            })}
            {disclaimer && (
              <div className={[].filter(Boolean).join(' ')}>
                <div className={classes.disclaimer}>
                  <i>{disclaimer}</i>
                </div>
              </div>
            )}
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default Pricing
```

# \_blocks/MediaContentAccordion/index.tsx

```tsx
import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Page } from '@payload-types'
import { DesktopMediaContentAccordion } from './Desktop'
import { MobileMediaContentAccordion } from './Mobile'

import classes from './index.module.scss'

// export type MediaContentAccordionProps = Extract<
//   Page['layout'][0],
//   { blockType: 'mediaContentAccordion' }
// > & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type MediaContentAccordionProps = ExtractBlockProps<'mediaContentAccordion'> & {
  padding: PaddingProps
}

export const MediaContentAccordion: React.FC<MediaContentAccordionProps> = (props) => {
  const { mediaContentAccordionFields } = props
  const { settings } = mediaContentAccordionFields || {}

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('standard'), classes.mediaContentAccordion]
        .filter(Boolean)
        .join(' ')}
    >
      <Gutter>
        {/* <BackgroundGrid zIndex={0} /> */}
        <DesktopMediaContentAccordion
          className={classes.desktop}
          blockType="mediaContentAccordion"
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
        <MobileMediaContentAccordion
          className={classes.mobile}
          blockType="mediaContentAccordion"
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
      </Gutter>
    </BlockWrapper>
  )
}
export default MediaContentAccordion
```

# \_blocks/MediaContent/index.tsx

```tsx
import * as React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
// import { Button } from '@app/_components/Button'
import { CMSLink } from '@app/_components/CMSLink'

import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type MediaContentProps = Extract<Page['layout'][0], { blockType: 'mediaContent' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type MediaContentProps = ExtractBlockProps<'mediaContent'> & { padding: PaddingProps }

export const MediaContentBlock: React.FC<MediaContentProps> = (props) => {
  const {
    mediaContentFields: { link, images, content, alignment, enableLink, settings },
  } = props

  return (
    <Gutter>
      <div className={['grid'].filter(Boolean).join(' ')}>
        {alignment === 'mediaContent' ? (
          // media-content
          <React.Fragment>
            <div
              className={[classes.media, classes.left, 'cols-8 cols-m-8 start-1']
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
            <div
              className={[classes.content, classes.right, 'cols-6 start-11 start-m-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={content} />

              {enableLink && link && (
                <div className="block mt-8 w-2/3 md:w-full">
                  <CMSLink
                    data={{ ...link }}
                    look={{
                      theme: 'light',
                      type: 'button',
                      size: 'medium',
                      width: 'normal',
                      variant: 'blocks',
                      icon: {
                        content: <ChevronRightIcon strokeWidth={1.25} />,
                        iconPosition: 'right',
                      },
                    }}
                  />
                  {/* <Button
                    {...link}
                    appearance={'default'}
                    labelStyle="mono"
                    hideHorizontalBorders
                    icon="arrow"
                    el="link"
                  /> */}
                </div>
              )}
            </div>
          </React.Fragment>
        ) : (
          // content-media
          <React.Fragment>
            <div
              className={[classes.content, classes.left, 'cols-6 start-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={content} />
              {enableLink && link && (
                <div className={classes.button}>
                  {/* <Button
                    {...link}
                    appearance={'default'}
                    hideHorizontalBorders
                    labelStyle="mono"
                    icon="arrow"
                    el="link"
                  /> */}
                </div>
              )}
            </div>
            <div
              className={[classes.media, classes.right, 'cols-8 start-9 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
          </React.Fragment>
        )}
      </div>
    </Gutter>
  )
}

export const MediaContent: React.FC<MediaContentProps> = (props) => {
  const { settings } = props.mediaContentFields

  return (
    <BlockWrapper className={getPaddingClasses('hero')} settings={settings}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <div className={classes.wrapper}>
        <MediaContentBlock {...props} />
      </div>
      {/* <div className={classes.background} /> */}
    </BlockWrapper>
  )
}
export default MediaContent
```

# \_blocks/MediaBlock/index.tsx

```tsx
import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import { Reusable } from '@payload-types'

import classes from './index.module.scss'
import { getPaddingClasses } from '../../_css/tailwindClasses'

// type Props = Extract<Reusable['layout'][0], { blockType: 'mediaBlock' }> & {
//   padding: PaddingProps
//   disableGrid?: boolean
// }

export const MediaBlock: React.FC<any & { disableGutter?: boolean; marginAdjustment?: any }> = (
  props,
) => {
  const { mediaBlockFields, disableGutter, marginAdjustment = {}, disableGrid = false } = props
  const { media, caption, position, settings } = mediaBlockFields

  if (typeof media === 'string') return null

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('standard')}>
      <div
        className={classes.mediaBlock}
        style={{
          marginRight: marginAdjustment.marginRight,
          marginLeft: marginAdjustment.marginLeft,
        }}
      >
        {disableGutter ? (
          <Media
            resource={media}
            className={[classes.mediaResource, classes[`position--${position}`]]
              .filter(Boolean)
              .join(' ')}
          />
        ) : (
          <Gutter className={classes.mediaWrapper}>
            <Media
              resource={media}
              className={[classes.mediaResource, classes[`position--${position}`]]
                .filter(Boolean)
                .join(' ')}
            />

            {caption && (
              <div className={['grid'].filter(Boolean).join(' ')}>
                <div
                  className={[classes.caption, 'cols-8 start-5 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <small>
                    <RichText content={caption} />
                  </small>
                </div>
              </div>
            )}
          </Gutter>
        )}
      </div>
    </BlockWrapper>
  )
}
export default MediaBlock
```

# \_blocks/LogoGrid/index.tsx

```tsx
'use client'

import React, { useEffect, useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Media as MediaType, Page } from '@payload-types'

import classes from './index.module.scss'

type LogoItem = {
  logoMedia: string | MediaType
  id?: string | null
}

type PositionedLogo = {
  logo: LogoItem
  position: number
  isVisible: boolean
}

// export type LogoGridProps = Extract<Page['layout'][0], { blockType: 'logoGrid' }> & {
//   padding?: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type LogoGridProps = ExtractBlockProps<'logoGrid'> & { padding: PaddingProps }

const TOTAL_CELLS = 8
const ANIMATION_DURATION = 650 // Duration for fade-out and fade-in in milliseconds
const ANIMATION_DELAY = 650 // Delay between animations in milliseconds

const getRandomPosition = (excludePositions: number[]) => {
  let newPos
  do {
    newPos = Math.floor(Math.random() * TOTAL_CELLS)
  } while (excludePositions.includes(newPos))
  return newPos
}

export const LogoGrid: React.FC<LogoGridProps> = (props) => {
  const {
    logoGridFields: { content, enableLink, link, logos, settings },
  } = props

  const [logoPositions, setLogoPositions] = useState<PositionedLogo[]>([])
  const [currentAnimatingIndex, setCurrentAnimatingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (logos) {
      let occupiedPositions: number[] = []
      const initialPositions = logos.map((logo: any) => {
        const position = getRandomPosition(occupiedPositions)
        occupiedPositions.push(position)
        return { logo, position, isVisible: true }
      })
      setLogoPositions(initialPositions)
    }
  }, [logos])

  // useEffect(() => {
  //   if (!logos || logos.length === 0 || logos.length > TOTAL_CELLS) return

  //   /* eslint-disable function-paren-newline */
  //   const animateLogo = () => {
  //     const logoIndex =
  //       currentAnimatingIndex !== null ? (currentAnimatingIndex + 1) % logos.length : 0
  //     setCurrentAnimatingIndex(logoIndex)

  //     setLogoPositions((prevPositions) =>
  //       prevPositions.map((pos, idx) => (idx === logoIndex ? { ...pos, isVisible: false } : pos)),
  //     )

  //     setTimeout(() => {
  //       setLogoPositions((prevPositions) => {
  //         const occupiedPositions = prevPositions.map((p) => p.position)
  //         let newPosition
  //         do {
  //           newPosition = getRandomPosition(occupiedPositions)
  //         } while (newPosition === prevPositions[logoIndex].position)

  //         return prevPositions.map((pos, idx) =>
  //           idx === logoIndex ? { ...pos, position: newPosition, isVisible: false } : pos,
  //         )
  //       })

  //       setTimeout(() => {
  //         setLogoPositions((prevPositions) =>
  //           prevPositions.map((pos, idx) =>
  //             idx === logoIndex ? { ...pos, isVisible: true } : pos,
  //           ),
  //         )
  //       }, 100)
  //     }, ANIMATION_DURATION + 500)
  //   }
  //   /* eslint-enable function-paren-newline */

  //   const interval = setInterval(animateLogo, ANIMATION_DELAY + ANIMATION_DURATION)
  //   return () => clearInterval(interval)
  // }, [logoPositions, currentAnimatingIndex, logos])

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('standard'), classes.logoGrid].filter(Boolean).join(' ')}
    >
      <Gutter>
        <BackgroundGrid className={classes.backgroundGrid} zIndex={0} />
        <div className={[classes.logoGridContentWrapper, 'grid'].filter(Boolean).join(' ')}>
          <div className={[classes.richTextWrapper, 'cols-8 start-1'].filter(Boolean).join(' ')}>
            <RichText className={classes.richText} content={content} />
            {enableLink && link && (
              <div className={classes.link}>
                <CMSLink
                  data={{ ...link }}
                  look={{
                    theme: 'light',
                    type: 'button',
                    size: 'medium',
                    width: 'normal',
                    variant: 'blocks',
                    icon: {
                      content: <ChevronRightIcon strokeWidth={1.25} />,
                      iconPosition: 'right',
                    },
                  }}
                />
                {/* <CMSLink
                  {...link}
                  appearance="default"
                  fullWidth
                  buttonProps={{
                    icon: 'arrow',
                    hideHorizontalBorders: false,
                  }}
                /> */}
              </div>
            )}
          </div>
          <div
            className={[classes.logoWrapper, 'cols-8 start-9 start-m-1'].filter(Boolean).join(' ')}
          >
            <div className={classes.logoShowcase}>
              <div className={[classes.horizontalLine, classes.topHorizontalLine].join(' ')} />
              <div className={classes.horizontalLine} style={{ top: '50%' }} />
              {[...Array(3)].map((_, idx) => {
                if (idx === 1) return null
                return (
                  <div
                    key={`v-line-${idx}`}
                    className={classes.verticalLine}
                    style={{ left: `${(idx + 1) * 25}%` }}
                  />
                )
              })}
              <div className={[classes.horizontalLine, classes.bottomHorizontalLine].join(' ')} />
              {/* boring positioning */}
              {logos &&
                logos.map((logo: any, index: any) => (
                  <div
                    className={[classes.logoShowcaseItem, classes.logoPresent]
                      .filter(Boolean)
                      .join(' ')}
                    key={index}
                  >
                    <div className={classes.contentWrapper}>
                      {typeof logo.logoMedia === 'object' && logo.logoMedia !== null && (
                        <Media resource={logo.logoMedia} />
                      )}
                    </div>
                  </div>
                ))}
              {/* animation and placement funkiness not nedeed */}
              {/* {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
                const hasLogo = logoPositions.some(
                  (item) => item.position === index && item.isVisible,
                )
                return (
                  <div
                    className={[classes.logoShowcaseItem, hasLogo ? classes.logoPresent : '']
                      .filter(Boolean)
                      .join(' ')}
                    key={index}
                  >
                    <div className={classes.contentWrapper}>
                      {logoPositions
                        .filter((item) => item.position === index)
                        .map(({ logo, isVisible }, idx) => (
                          <div
                            key={idx}
                            style={{
                              opacity: isVisible ? 1 : 0,
                              transition: `opacity ${ANIMATION_DURATION}ms ease, filter ${ANIMATION_DURATION}ms ease`,
                              filter: isVisible ? 'blur(0px)' : 'blur(8px)',
                            }}
                          >
                            {typeof logo.logoMedia === 'object' && logo.logoMedia !== null && (
                              <Media resource={logo.logoMedia} />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )
              })} */}
              <CrosshairIcon className={[classes.crosshair, classes.crosshairLeft].join(' ')} />
              <CrosshairIcon className={[classes.crosshair, classes.crosshairRight].join(' ')} />
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
export default LogoGrid
```

# \_blocks/LinkGrid/index.tsx

```tsx
'use client'

import React, { useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockSpacing } from '@app/_components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { LineDraw } from '@app/_components/LineDraw'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '../../_css/tailwindClasses'

// export type LinkGridProps = Extract<Page['layout'][0], { blockType: 'linkGrid' }> & {
//   padding?: PaddingProps
// }

type Fields = Exclude<any['linkGridFields'], undefined>

type Props = Exclude<Fields['links'], undefined | null>[number]['link']

const LinkGridItem: React.FC<Props> = (props) => {
  // console.log('lnkGrid', props)
  return (
    <React.Fragment>
      <CMSLink
        data={{ ...props }}
        look={{
          theme: 'light',
          type: 'button',
          size: 'medium',
          width: 'normal',
          variant: 'blocks',
          icon: {
            content: <ChevronRightIcon strokeWidth={1.25} />,
            iconPosition: 'right',
          },
        }}
      />
      {/* <CMSLink {...props} className={classes.link}>
        <ArrowIcon size="large" className={classes.arrow} />
      </CMSLink> */}
    </React.Fragment>
  )
}

export const LinkGrid: React.FC<
  any & {
    // LinkGridProps & {
    className?: string
  }
> = (props) => {
  const { className, linkGridFields } = props
  const { settings } = linkGridFields
  const links = linkGridFields?.links
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockWrapper
      className={[getPaddingClasses('standard'), className, classes.linkGrid]
        .filter(Boolean)
        .join(' ')}
      settings={linkGridFields?.settings}
    >
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter>
        {hasLinks && (
          <div className={classes.links}>
            {links.map((link, index) => {
              return (
                <LinkGridItem
                  key={index}
                  {...(link?.link || {
                    label: 'Untitled',
                  })}
                />
              )
            })}
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default LinkGrid
```

# \_blocks/HoverHighlights/index.tsx

```tsx
import React from 'react'

import { Gutter } from '@app/_components/Gutter'
import { PixelBackground } from '@app/_components/PixelBackground'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'
import { HoverHighlight } from './HoverHighlight'

import classes from './index.module.scss'

// export type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type HoverHighlightProps = ExtractBlockProps<'hoverHighlights'>

export const HoverHighlights: React.FC<HoverHighlightProps> = (props) => {
  const {
    hoverHighlightsFields: { content, addRowNumbers, highlights, settings },
  } = props
  // console.log('hoverhighlightfields', props)
  const hasHighlights = highlights && highlights.length > 0

  return (
    <Gutter className={classes.hoverHighlights}>
      <div className={[classes.richTextGrid, 'grid'].filter(Boolean).join(' ')}>
        <div className={['cols-12'].filter(Boolean).join(' ')}>
          <RichText content={content} />
        </div>
      </div>
      <div className={classes.content}>
        {/* <div className={classes.pixelBG}>
          <PixelBackground />
        </div> */}
        {hasHighlights &&
          highlights.map((highlight: any, index: any) => {
            return (
              <HoverHighlight
                key={index}
                index={index}
                addRowNumbers={addRowNumbers}
                isLast={index < highlights.length - 1}
                {...highlight}
              />
            )
          })}
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              `cols-${addRowNumbers ? 16 : 15}`,
              `start-${addRowNumbers ? 2 : 1}`,
              'cols-m-8 start-m-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <hr className={classes.hr} />
          </div>
        </div>
      </div>
    </Gutter>
  )
}

export default HoverHighlights
```

# \_blocks/HoverCards/index.tsx

```tsx
'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type HoverCardsProps = Extract<Page['layout'][0], { blockType: 'hoverCards' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type HoverCardsProps = ExtractBlockProps<'hoverCards'> & { padding: PaddingProps }

const Card: React.FC<{
  leader: number
  card: NonNullable<HoverCardsProps['hoverCardsFields']['cards']>[number]
  setHover: Dispatch<SetStateAction<number>>
}> = ({ card, leader, setHover }) => {
  // console.log('hovercards //', card)

  return (
    <div
      className={classes.cardWrapper}
      onMouseEnter={() => setHover(++leader)}
      onMouseLeave={() => setHover(1)}
    >
      <CMSLink
        className={classes.card}
        data={{ ...card.link }}
        // {...card.link}
      >
        <p className={classes.leader}>0{leader}</p>
        <div className={classes.cardContent}>
          <h3 className={classes.cardTitle}>{card.title}</h3>
          <p className={classes.description}>{card.description}</p>
        </div>
        <ArrowIcon className={classes.arrow} />
      </CMSLink>
    </div>
  )
}

export const HoverCards: React.FC<HoverCardsProps> = (props) => {
  const {
    hoverCardsFields: { richText, cards, settings },
  } = props
  // console.log('hovercardsfoelds //', props)

  const [activeGradient, setActiveGradient] = useState(1)

  const gradients = [1, 2, 3, 4]

  const hasCards = Array.isArray(cards) && cards.length > 0

  return (
    <BlockWrapper
      settings={{ theme: 'light' }}
      className={[getPaddingClasses('standard'), classes.wrapper].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={1} />
      {/* <div className={classes.noiseWrapper}>
        {gradients.map((gradient) => {
          return (
            <Image
              key={gradient}
              alt=""
              className={[classes.bg, activeGradient === gradient && classes.activeBg]
                .filter(Boolean)
                .join(' ')}
              width={1920}
              height={946}
              src={`/images/gradients/${gradient}.jpg`}
            />
          )
        })}
      </div> */}
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {richText && (
            <RichText
              className={[classes.richText, 'cols-12 cols-m-8'].filter(Boolean).join(' ')}
              content={richText}
            />
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}>
              <BackgroundGrid className={classes.backgroundGrid} ignoreGutter />
              {cards.map((card, index) => {
                return (
                  <div key={index} className={'cols-4 cols-s-8'}>
                    <Card card={card} leader={++index} setHover={setActiveGradient} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default HoverCards
```

# \_blocks/Hero/index.tsx

```tsx
import React from 'react'
import { CenteredContent } from './CenteredContent'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'
// import { FormHero } from './FormHero'
import { GradientHero } from './Gradient'
import { HomeHero } from './Home'
import { ThreeHero } from './Three'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'

type HeroType =
  | 'default'
  | 'contentMedia'
  | 'home'
  // | 'form'
  | 'centeredContent'
  | 'gradient'
  | 'three'

export type HeroProps = ExtractBlockProps<'hero'>

const heroes: Record<HeroType, React.FC<any>> = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  // form: FormHero,
  centeredContent: CenteredContent,
  gradient: GradientHero,
  three: ThreeHero,
}

export const Hero: React.FC<HeroProps> = (props) => {
  // console.log('hero block', props)

  // Type assertion to ensure fields.type is HeroType
  const HeroToRender = heroes[props.type as HeroType]

  return <React.Fragment>{HeroToRender && <HeroToRender {...props} />}</React.Fragment>
}

export default Hero

// export const Hero: React.FC<{
//   page: Page
//   // firstContentBlock?: BlocksProp
// }> = (props) => {
//    // console.log('hero //', props)
//   const {
//     page: {
//       // hero,
//       breadcrumbs,
//       // hero: { type },
//     },
//     firstContentBlock,
//   } = props

//   const HeroToRender = heroes[type] as any

//   if (HeroToRender) {
//     return (
//       <React.Fragment>
//         {/* <BreadcrumbsBar hero={hero} breadcrumbs={breadcrumbs} /> */}

//         <HeroToRender
//           {...hero}
//           firstContentBlock={firstContentBlock}
//           // breadcrumbs={breadcrumbs}
//         />
//       </React.Fragment>
//     )
//   }

//   return null
// }
```

# \_blocks/FormBlock/index.tsx

```tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSForm } from '@app/_components/CMSForm'
import { Gutter } from '@app/_components/Gutter'
// import { RichText } from '@app/_components/RichText'
import { Page } from '@payload-types'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

// export type FormBlockProps = Extract<Page['layout'][0], { blockType: 'form' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type FormBlockProps = ExtractBlockProps<'form'> & { padding: PaddingProps }

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const {
    formFields: { content, form, settings },
  } = props
  const [imageLoaded, setImageLoaded] = useState(false)

  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [outerBackgroundStyle, setOuterBackgroundStyle] = useState({})

  useEffect(() => {
    const updateOuterBackgroundWidth = () => {
      const newOuterBackgroundWidth = sectionRef.current ? sectionRef.current.offsetWidth : 0

      const largeScreenMatch = window.matchMedia('(min-width: 2390px)')

      if (largeScreenMatch.matches) {
        setOuterBackgroundStyle({
          width: 'var(--gutter-h)',
        })
      } else {
        setOuterBackgroundStyle({
          width: `${newOuterBackgroundWidth}px`,
        })
      }
    }

    updateOuterBackgroundWidth()
    window.addEventListener('resize', updateOuterBackgroundWidth)

    return () => window.removeEventListener('resize', updateOuterBackgroundWidth)
  }, [])

  if (typeof form === 'string') return null

  return (
    <BlockWrapper
      data-theme="dark"
      settings={settings}
      className={[getPaddingClasses('hero'), classes.formBlock].join(' ')}
    >
      {/* <BackgroundGrid zIndex={0} /> */}
      <div
        className={classes.gradientWrap}
        style={{ visibility: imageLoaded ? 'visible' : 'hidden' }}
      >
        <div className={classes.leftGradientOverlay} />
        <div className={classes.rightGradientOverlay} />
      </div>
      <div
        className={[classes.backgroundSectionWrap, 'cols-12 start-5 cols-m-8 start-m-1']
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.section} ref={sectionRef}>
          <Image
            src="/images/stripe-overlay.png"
            fill
            alt="Stripe Overlay"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className={classes.section}>
          <Image
            src="/images/stripe-overlay.png"
            fill
            alt="Stripe Overlay"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className={classes.section}>
          <Image
            src="/images/stripe-overlay.png"
            fill
            alt="Stripe Overlay"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
      <Gutter className={classes.gutter}>
        <div className={[classes.formBlockGrid, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.richTextCell, 'cols-4 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            {content && <RichText content={content} />}
          </div>
          <div
            className={[classes.formCell, 'cols-8 start-9 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <CMSForm form={form} />
          </div>
        </div>
      </Gutter>
      <div className={classes.outerBackgroundSectionWrap}>
        <div className={classes.outerBackgroundSection} style={outerBackgroundStyle}>
          <Image
            src="/images/stripe-overlay.png"
            fill
            alt="Stripe Overlay"
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      </div>
    </BlockWrapper>
  )
}

export default FormBlock
```

# \_blocks/ContentGrid/index.tsx

```tsx
import * as React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type ContentGridProps = ExtractBlockProps<'contentGrid'> & { padding: PaddingProps }

type CellsProps = ContentGridProps['contentGridFields'] & {
  className?: string
}

const Cells: React.FC<CellsProps> = ({ cells, className, showNumbers, style: styleFromProps }) => {
  const style = styleFromProps ?? 'gridBelow'

  return (
    <div
      className={[classes.cellGrid, 'grid', style === 'gridBelow' ? 'cols-16 cols-m-8' : 'cols-8']
        .filter(Boolean)
        .join(' ')}
    >
      {cells?.map((cell: any, i: any) => {
        return (
          <div
            className={[classes.cell, style === 'sideBySide' ? 'cols-8' : 'cols-4 cols-s-8']
              .filter(Boolean)
              .join(' ')}
            key={i}
          >
            {showNumbers && <p className={classes.leader}>0{++i}</p>}
            <RichText className={classes.cellRichText} content={cell.content} />
          </div>
        )
      })}
    </div>
  )
}

export const ContentGrid: React.FC<ContentGridProps> = (props) => {
  const {
    contentGridFields: { settings, style: styleFromProps, content, links },
  } = props || {}

  const hasLinks = Array.isArray(links) && links.length > 0
  const style = styleFromProps ?? 'gridBelow'

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter className={[classes.wrapper, classes[style], 'grid'].filter(Boolean).join(' ')}>
        <div
          className={[
            classes.topContent,
            classes[style],
            'grid',
            style === 'sideBySide' ? 'cols-8 ' : 'cols-16 cols-m-8',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content && (
            <RichText
              className={[
                classes.richText,
                style === 'sideBySide' ? 'cols-12 flex flex-col' : 'cols-8',
              ]
                .filter(Boolean)
                .join(' ')}
              content={content}
            />
          )}

          {hasLinks && (
            <div
              className={[
                classes.linksWrapper,
                style === 'sideBySide'
                  ? 'flex flex-row gap-3 cols-8'
                  : 'flex flex-row gap-3 px-4 md:px-8 #cols-4 items-end justify-end justify-items-end md:col-span-7 #start-12 #cols-l-4 cols-m-8 #start-m-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {links.map(({ link }, index) => {
                return (
                  <CMSLink
                    key={index}
                    data={{ ...link }}
                    look={{
                      theme: 'light',
                      type: 'button',
                      size: 'medium',
                      width: 'normal',
                      variant: 'blocks',
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>

        <Cells {...props.contentGridFields} />
      </Gutter>
    </BlockWrapper>
  )
}
export default ContentGrid
```

# \_blocks/Content/index.tsx

```tsx
import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'content' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'content'> & { padding: PaddingProps }

const Columns: React.FC<Props> = (props) => {
  const { contentFields } = props
  const { layout, columnOne, columnTwo, columnThree, settings } = contentFields

  switch (layout) {
    case 'oneColumn': {
      return (
        <div className={'cols-12 cols-m-8'}>
          <RichText content={columnOne} />
        </div>
      )
    }

    case 'twoColumns':
    case 'halfAndHalf':
    case 'twoThirdsOneThird': {
      let col1Cols = 6
      let col2Cols = 6

      if (layout === 'halfAndHalf') {
        col1Cols = 8
        col2Cols = 8
      }

      if (layout === 'twoThirdsOneThird') {
        col1Cols = 11
        col2Cols = 5
      }

      return (
        <React.Fragment>
          <div className={`cols-${col1Cols} cols-m-8`}>
            <RichText content={columnOne} />
          </div>
          <div className={`cols-${col2Cols} cols-m-8`}>
            <RichText content={columnTwo} />
          </div>
        </React.Fragment>
      )
    }

    case 'threeColumns': {
      return (
        <React.Fragment>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnOne} />
          </div>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnTwo} />
          </div>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnThree} />
          </div>
        </React.Fragment>
      )
    }

    default: {
      return null
    }
  }
}

export const ContentBlock: React.FC<Props> = (props) => {
  // console.log('content props', props)
  const {
    contentFields: { useLeadingHeader, leadingHeader, settings },
    padding,
  } = props

  // console.log(props)
  // return <React.Fragment></React.Fragment>
  return (
    <BlockWrapper className={getPaddingClasses('standard')} settings={settings}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter className={classes.contentBlock}>
        {useLeadingHeader && <RichText className={classes.leadingHeader} content={leadingHeader} />}
        <div className={'grid'}>
          <Columns {...props} />
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
export default ContentBlock
```

# \_blocks/CardGrid/index.tsx

```tsx
'use client'

import React, { CSSProperties, useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { SquareCard } from '@app/_components/cards/SquareCard'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type CardGridProps = Extract<Page['layout'][0], { blockType: 'cardGrid' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type CardGridProps = ExtractBlockProps<'cardGrid'> & { padding: PaddingProps }

export const CardGrid: React.FC<CardGridProps> = (props) => {
  const {
    cardGridFields: { content, cards, links, settings, revealDescription },
  } = props

  const [index, setIndex] = useState(0)

  const cardLength = cards?.length ?? 0
  const hasCards = Array.isArray(cards) && cardLength > 0
  const hasLinks = Array.isArray(links) && links.length > 0
  const excessLength = cardLength > 4 ? 8 - cardLength : 4 - cardLength

  const wrapperStyle: CSSProperties = {
    '--excess-length-large': excessLength,
    '--excess-length-mid': cardLength % 2 === 0 ? 0 : 1,
  } as CSSProperties

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('standard'), classes.cardGrid].filter(Boolean).join(' ')}
    >
      {/* <BackgroundGrid zIndex={1} /> */}
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {content && (
            <div
              className={[classes.richTextWrapper, 'grid grid-cols-1 md:grid-cols-2 gap-4']
                .filter(Boolean)
                .join(' ')}
            >
              <div className={[classes.richText, ''].filter(Boolean).join(' ')}>
                <RichText content={content} />
              </div>

              <div
                className={
                  'space-y-6 flex flex-col items-end justify-end justify-items-end flex-auto px-4 md:px-8'
                }
              >
                {hasLinks &&
                  links.map(({ link }: any, index: any) => {
                    return (
                      <React.Fragment>
                        <CMSLink
                          key={index}
                          data={{ ...link }}
                          look={{
                            theme: 'light',
                            type: 'button',
                            size: 'medium',
                            width: 'wide',
                            variant: 'blocks',
                          }}
                          // className="grow"
                        />
                      </React.Fragment>
                    )
                  })}
              </div>

              {/* {hasLinks && (
                <div
                  className={[classes.linksWrapper, 'cols-4 start-13 cols-l-4 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {links.map(({ link }, index) => {
                    return (
                      <CMSLink
                        {...link}
                        key={index}
                        appearance="default"
                        fullWidth
                        buttonProps={{
                          icon: 'arrow',
                          hideHorizontalBorders: false,
                          hideBottomBorderExceptLast: true,
                        }}
                      />
                    )
                  })}
                </div>
              )} */}
            </div>
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            {/* <div className={classes.margins}>
              <BackgroundScanline enableBorders={true} className={classes.marginLeft} />
              <BackgroundScanline enableBorders={true} className={classes.marginRight} />
            </div> */}
            <div
              className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}
              style={wrapperStyle}
            >
              {cards.map((card, index) => {
                const { title, description, enableLink, link } = card
                return (
                  <div
                    key={index}
                    className={'cols-4 cols-s-8'}
                    onMouseEnter={() => setIndex(index + 1)}
                    onMouseLeave={() => setIndex(0)}
                  >
                    <SquareCard
                      leader={(index + 1).toString().padStart(2, '0')}
                      className={classes.card}
                      title={title}
                      description={description}
                      enableLink={enableLink}
                      link={link}
                      revealDescription={revealDescription}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default CardGrid
```

# \_blocks/Callout/index.tsx

```tsx
import React, { Fragment } from 'react'
import { ArrowIcon } from '@app/_icons/ArrowIcon'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { BlockSpacing } from '@app/_components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import { QuoteIconAlt } from '@app/_icons/QuoteIconAlt'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type CalloutProps = Extract<Page['layout'][0], { blockType: 'callout' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type CalloutProps = ExtractBlockProps<'callout'> & { padding?: PaddingProps }

export const Callout: React.FC<CalloutProps> = (props) => {
  const {
    calloutFields: { content, role, author, logo, images, settings },
  } = props

  const hasImages = images?.length && images.length > 0

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid className={classes.backgroundGrid} zIndex={0} /> */}
      <div className={classes.wrapper}>
        <Gutter>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            {/* <BackgroundScanline className={classes.scanline} enableBorders crosshairs={'all'} /> */}
            <div
              className={[
                classes.contentWrapper,
                hasImages
                  ? 'cols-7 start-2 cols-m-8 start-m-1'
                  : 'cols-14 start-2 cols-m-8 start-m-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <QuoteIconAlt className={classes.quoteIcon} />
              <RichText content={content} className={[classes.content].filter(Boolean).join(' ')} />
              <div className={[classes.authorWrapper, 'cols-12'].filter(Boolean).join(' ')}>
                <div className={classes.logo}>
                  {logo && typeof logo !== 'string' && <Media resource={logo} />}
                </div>
                <div className={classes.author}>
                  <span className={classes.name}>{author}</span>
                  {role ? <span className={classes.role}>{', ' + role}</span> : ''}
                </div>
              </div>
            </div>

            <div
              className={[classes.media, 'cols-6 start-11 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {hasImages ? <MediaParallax media={images} /> : null}
            </div>
          </div>
        </Gutter>
      </div>
    </BlockWrapper>
  )
}
export default Callout
```

# \_blocks/CallToAction/index.tsx

```tsx
'use client'
import React from 'react'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type CallToActionProps = ExtractBlockProps<'cta'> // & { padding: PaddingProps }

export const CallToAction: React.FC<CallToActionProps> = (props) => {
  // console.log('cta block data //', JSON.stringify(props))
  const {
    ctaFields: { content, links, settings },
  } = props

  const hasLinks = links && links.length > 0

  // console.log('content for richText // ', JSON.stringify(content))
  return (
    <BlockWrapper settings={settings} className={`${getPaddingClasses('cta')}`}>
      <Gutter className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <RichText content={content} className="prose dark:prose-invert" />
          </div>
          {hasLinks && (
            <div className="space-y-4 flex flex-col items-start md:items-end">
              {links.map(({ link, type: ctaType }: any, index: any) => (
                <CMSLink
                  key={index}
                  data={{ ...link }}
                  look={{
                    theme: 'light',
                    type: 'button',
                    size: 'medium',
                    width: 'wide',
                    variant: 'blocks',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
export default CallToAction
```

# \_blocks/Banner/index.tsx

```tsx
import React from 'react'

import { Banner, Props as BannerProps } from '@app/_components/Banner'
import { Gutter } from '@app/_components/Gutter'
import { Reusable } from '@payload-types'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'

// export type BannerBlockProps = Extract<Reusable['layout'][0], { blockType: 'banner' }>

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type BannerBlockProps = ExtractBlockProps<'banner'>

export const BannerBlock: React.FC<{
  bannerFields: BannerBlockProps['bannerFields']
  marginAdjustment?: boolean
  disableGutter?: boolean
}> = ({ bannerFields, disableGutter, marginAdjustment }) => {
  // console.log('banner block', bannerFields)
  const bannerProps: BannerProps = {
    type: bannerFields.type,
    content: bannerFields.content,
    icon: bannerFields.addCheckmark ? 'checkmark' : undefined,
    marginAdjustment: marginAdjustment,
  }

  return (
    <React.Fragment>
      {disableGutter ? (
        <Banner {...bannerProps} />
      ) : (
        <Gutter>
          <div className={'grid'}>
            <div className={'cols-8 start-5 cols-m-6 start-m-2 cols-s-8 start-s-1'}>
              <Banner {...bannerProps} />
            </div>
          </div>
        </Gutter>
      )}
    </React.Fragment>
  )
}

export default BannerBlock
```

# (pages)/shop/page.tsx

```tsx
import React from 'react'
import { draftMode } from 'next/headers'
import { fetchShopList } from '@app/_queries/products'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductGrid from '@app/_blocks/ProductGrid'
import { BlockWrapper } from '../../_components/BlockWrapper'
import { contentFormats, getPaddingClasses } from '../../_css/tailwindClasses'
import { Gutter } from '../../_components/Gutter'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const { isEnabled: isDraftMode } = draftMode()
  let products = null

  try {
    products = await fetchShopList()
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return notFound()
  }

  if (!products || products.length === 0) {
    return (
      <BlockWrapper className={getPaddingClasses('hero')}>
        <Gutter>
          <div className="flex flex-col md:flex-row">
            <div className="sm:basis-3/6 md:basis-3/6 lg:basis-4/6 flex align-middle items-center justify-middle pb-3 pt-6 sm:pt-0">
              <span
                className={[
                  contentFormats.global,
                  contentFormats.p,
                  'tracking-tighter sm:tracking-tight text-2xl sm:text-3xl font-medium',
                ].join(' ')}
              >
                Thankly Shop
              </span>
            </div>
            <div className="sm:basis-1/2 md:basis-1/2 lg:basis-2/6 flex items-center justify-end pb-3 gap-4">
              {/* <CartButtons /> */}
            </div>
          </div>
          <p className="mt-4 text-gray-500">There are no products in the shop.</p>
        </Gutter>
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="flex flex-col md:flex-row">
          <div className="sm:basis-3/6 md:basis-3/6 lg:basis-4/6 flex align-middle items-center justify-middle pb-6 pt-6 sm:pt-0">
            <span
              className={[
                contentFormats.global,
                contentFormats.p,
                'tracking-tighter sm:tracking-tight text-2xl sm:text-3xl font-medium',
              ].join(' ')}
            >
              Thankly Shop
            </span>
          </div>
          <div className="sm:basis-1/2 md:basis-1/2 lg:basis-2/6 flex items-center justify-end pb-3 gap-4">
            {/* <CartButtons /> */}
          </div>
        </div>
        <ProductGrid products={products} />
      </Gutter>
    </BlockWrapper>
  )
}
```

# (pages)/shop/loading.tsx

```tsx
import React from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { getPaddingClasses } from '../../_css/tailwindClasses'

const ProductCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="bg-gray-300 h-48 w-full mb-4"></div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-300 h-6 w-2/3 rounded"></div>
        <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
      </div>
      <div className="bg-gray-300 h-4 w-3/4 mb-4 rounded"></div>
      <div className="bg-gray-300 h-10 w-full rounded"></div>
      <div className="mt-2 bg-gray-300 h-4 w-1/2 rounded"></div>
    </div>
  </div>
)

export default function LoadingShop() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="bg-gray-300 h-8 w-1/4 mb-8 rounded"></div>
        <BlockWrapper
          settings={{ settings: { theme: 'light' } }}
          className={getPaddingClasses('hero')}
        >
          <Gutter>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </Gutter>
        </BlockWrapper>
      </div>
    </div>
  )
}
```

# (pages)/[...slug]/page.tsx

```tsx
import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Page } from '@payload-types'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
// import { fetchPage } from '@app/_queries/pages'
import { generateMeta } from '@/utilities/generateMeta'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Blocks from '@app/_blocks'

const fetchPage = (slug: string): Promise<Page | null> => {
  const cachedFetchPage = unstable_cache(
    async (): Promise<Page | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let page = null
      try {
        const { docs } = await payload.find({
          collection: 'pages',
          where: { slug: { equals: slug || 'home' } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        page = docs[0]
      } catch (error) {
        console.error(`Error fetching page: ${slug}`, error)
      } finally {
        return page || null
      }
    },
    [`fetchPage-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      tags: [`fetchPage-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchPage()
}

const Page = async ({ params: { slug = 'home' } }) => {
  const { isEnabled: isDraftMode } = draftMode()

  const page: Page | null = await fetchPage(slug || 'home') //, isDraftMode)

  if (!page) return notFound()

  return <Blocks blocks={page?.layout?.root?.children} />
}

export default Page

// Multiple versions of this page will be statically generated using the `params` returned by `generateStaticParams`
export async function generateStaticParams() {
  const fetchPageSlugs = unstable_cache(
    async (): Promise<{ slug: string }[]> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })

      try {
        const { docs } = await payload.find({
          collection: 'pages',
          depth: 0,
          pagination: false,
          context: {
            /**
             * Selects:
             * top level id, title fields
             * text field from "nestedGroup" group field
             * all fields from "nestedArray" field
             * "title" field from populated relationship document
             **/
            //     select: ['id', 'title', 'nestedGroup.text', 'nestedArray', 'relationship.title
            select: ['slug', 'title', 'meta'],
            // sort: {
            //   field:'slug',
            //   order: 'asc',
            // },
          },
        })

        // console.log('Found pages list')
        // console.log('fetchPageSlugs', docs)

        if (!docs || docs.length === 0) {
          // console.log('No pages found')
          return []
        }

        return docs
          .map((page: Page) => ({
            slug: page.slug || '',
          }))
          .filter((item: any) => item.slug !== '') // Filter out any empty slugs
      } catch (error) {
        console.error('Error fetching pages:', error)
        return []
      }
    },
    ['fetchPageSlugs'],
    {
      revalidate: 60, // 10 seconds
      tags: ['fetchPageSlugs'],
    },
  )

  const pages = await fetchPageSlugs()
  // console.log('pages', pages)

  return pages.map(({ slug }) => ({
    slug: slug.split('/').filter(Boolean),
  }))
}

export async function generateMetadata({
  params: { slug = 'home' },
}: {
  params: { slug?: string | string[] }
}): Promise<Metadata> {
  const slugString = Array.isArray(slug) ? slug.join('/') : slug
  const page = await fetchPage(slugString)

  const ogImage =
    typeof page?.meta?.image === 'object' &&
    page?.meta?.image !== null &&
    'url' in page?.meta?.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${page.meta.image.url}`

  return {
    title: page?.meta?.title || 'thankly',
    description: page?.meta?.description,
    openGraph: mergeOpenGraph({
      title: page?.meta?.title || 'thankly',
      description: page?.meta?.description ?? undefined,
      url: Array.isArray(slug) ? slug.join('/') : '/',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
  }
}
```

# \_components/forms/useFormField/types.ts

```ts
import type { Validate, Value } from '../types'

export interface Options {
  path?: string // make optional so fields outside of a form can be used (no path)
  validate?: Validate
}

export type SetValue = (e: Value) => void

export interface FormField<FieldValue> {
  showError: boolean
  errorMessage?: string
  value: FieldValue
  debouncedValue: FieldValue
  formSubmitted: boolean
  formProcessing: boolean
  setValue: SetValue
}
```

# \_components/forms/useFormField/index.tsx

```tsx
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useDebounce from '@/utilities/use-debounce'

import { useForm, useFormModified, useFormProcessing, useFormSubmitted } from '../Form/context'
import { FieldWithPath, Value } from '../types'
import { FormField, SetValue } from './types'

// this hook:
// 1. reports that the form has been modified
// 2. debounces its value and sends it to the form context
// 3. runs field-level validation
// 4. returns form state and field-level errors
export const useFormField = <T extends Value>(options: any): FormField<T> => {
  const { path, validate, initialValue: initialValueFromProps, required } = options

  const formContext = useForm()
  const submitted = useFormSubmitted()
  const processing = useFormProcessing()
  const modified = useFormModified()
  const wasSubmittedRef = useRef(false)

  const { dispatchFields, getField, setIsModified, apiErrors } = formContext

  // Get field by path
  const field = getField(path)

  const fieldExists = Boolean(field)

  const initialValue = field?.initialValue || initialValueFromProps

  const [internalValue, setInternalValue] = useState<Value>(initialValue)

  // Debounce internal values to update form state only every 60ms
  const debouncedValue = useDebounce(internalValue, 120)

  // Valid could be a string equal to an error message

  const validFromContext = field && typeof field.valid === 'boolean' ? field.valid : true
  const apiError = Array.isArray(apiErrors)
    ? apiErrors?.find((error) => error.field === path)
    : undefined
  const validFromAPI = apiError === undefined
  const showError = (validFromContext === false || validFromAPI === false) && submitted

  // Method to send update field values from field component(s)
  // Should only be used internally
  const sendField = useCallback(
    async (valueToSend?: Value) => {
      if (valueToSend === undefined) {
        return
      }

      const fieldToDispatch: FieldWithPath = {
        path,
        value: valueToSend,
        valid: true,
      }

      const validationResult = typeof validate === 'function' ? await validate(valueToSend) : true

      if (typeof validationResult === 'string' || validationResult === false) {
        fieldToDispatch.errorMessage = validationResult
        fieldToDispatch.valid = false
      }

      fieldToDispatch.initialValue = initialValue

      dispatchFields({
        type: 'UPDATE',
        payload: fieldToDispatch,
      })
    },
    [path, dispatchFields, validate, initialValue],
  )

  // NOTE: 'internalValue' is NOT debounced
  const setValue = useCallback<SetValue>(
    (val) => {
      if (!modified) {
        setIsModified(true)
      }

      setInternalValue(val)
    },
    [setIsModified, modified],
  )

  useEffect(() => {
    if (initialValue !== undefined) {
      setInternalValue(initialValue)
    }
  }, [initialValue])

  // re-sync state with field.value after submission (field could have been reset)
  useEffect(() => {
    if (submitted) {
      wasSubmittedRef.current = true
    } else if (!submitted && wasSubmittedRef.current) {
      wasSubmittedRef.current = false
      setInternalValue(field?.value)
    }
  }, [submitted, field?.value])

  useEffect(() => {
    if (path && (debouncedValue !== undefined || !fieldExists)) {
      sendField(debouncedValue)
    }
  }, [debouncedValue, sendField, fieldExists, path])

  useEffect(
    () => () => {
      dispatchFields({
        type: 'REMOVE',
        path,
      })
    },
    [dispatchFields, path],
  )

  return {
    ...options,
    showError,
    errorMessage: field?.errorMessage || apiError?.message,
    value: internalValue,
    debouncedValue: field?.value,
    formSubmitted: submitted,
    formProcessing: processing,
    setValue,
  }
}
```

# \_components/forms/fields/types.ts

```ts
import type { Validate } from '../types'

export interface FieldProps<T> {
  path?: string
  name?: string
  required?: boolean
  validate?: Validate
  label?: string | React.ReactNode
  placeholder?: string
  onChange?: (value: T) => void // eslint-disable-line no-unused-vars
  initialValue?: T
  className?: string
  disabled?: boolean
  description?: string
  showError?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  onClick?: () => void
}
```

# \_components/forms/Submit/index.tsx

```tsx
// 'use client'

// import React, { forwardRef } from 'react'

// import { Button, ButtonProps } from '@app/_components/Button'
// import { useFormProcessing } from '../Form/context'

// type SubmitProps = ButtonProps & {
//   label?: string | null
//   processing?: boolean
// }

// const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
//   const {
//     label,
//     processing: processingFromProps,
//     className,
//     appearance = 'primary',
//     size = 'default',
//     icon = 'arrow',
//     disabled,
//   } = props

//   const processing = useFormProcessing()
//   const isProcessing = processing || processingFromProps

//   return (
//     <Button
//       ref={ref}
//       htmlButtonType="submit"
//       appearance={appearance}
//       size={size}
//       icon={icon && !isProcessing ? icon : undefined}
//       label={isProcessing ? 'Processing...' : label || 'Submit'}
//       className={className}
//       disabled={isProcessing || disabled}
//     />
//   )
// })

// export default Submit

'use client'

import React, { forwardRef } from 'react'
import { useFormProcessing } from '@app/_components/forms/Form/context'
import { CMSLink, CMSLinkType } from '@app/_components/CMSLink'
import { ArrowRightIcon } from 'lucide-react'

type SubmitProps = Omit<CMSLinkType, 'data'> & {
  label?: string | null
  processing?: boolean
}

const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
  const {
    label,
    processing: processingFromProps,
    className,
    look = {
      type: 'submit',
      size: 'medium',
      width: 'full',
      variant: 'blocks',
      icon: {
        content: <ArrowRightIcon />,
        iconPosition: 'right',
      },
    },
    actions,
    children,
  } = props

  const formProcessing = useFormProcessing()
  const isProcessing = formProcessing || processingFromProps

  return (
    <CMSLink
      data={{
        label: isProcessing ? 'Processing...' : label || 'Submit',
        type: 'custom',
        url: '#',
      }}
      className={className}
      look={{
        ...look,
        type: 'submit',
      }}
      actions={{
        ...actions,
        onClick: (e) => {
          if (e) e.preventDefault()
          if (actions?.onClick) actions.onClick(e)
        },
      }}
      pending={isProcessing}
    >
      {children}
    </CMSLink>
  )
})

export default Submit
```

# \_components/forms/Label/types.ts

```ts
import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLLabelElement> {
  label?: string | React.ReactNode
  required?: boolean
  actionsSlot?: React.ReactNode
  htmlFor?: string
  margin?: boolean
}
```

# \_components/forms/Label/index.tsx

```tsx
import React from 'react'

import { Props } from './types'

import classes from './index.module.scss'

const LabelOnly: React.FC<Props> = (props) => {
  const { htmlFor, required, label, className, margin } = props

  return (
    <label htmlFor={htmlFor} className={[classes.label, className].filter(Boolean).join(' ')}>
      {label}
      {required && <span className={classes.required}>*</span>}
    </label>
  )
}

const Label: React.FC<Props> = (props) => {
  const { label, actionsSlot, margin } = props

  if (label) {
    if (actionsSlot) {
      return (
        <div
          className={[classes.labelWithActions, margin === false && classes.noMargin]
            .filter(Boolean)
            .join(' ')}
        >
          <LabelOnly {...props} />
          <div className={classes.actions}>{actionsSlot}</div>
        </div>
      )
    }

    return <LabelOnly {...props} />
  }

  return null
}

export default Label
```

# \_components/forms/FormSubmissionError/index.tsx

```tsx
import React from 'react'
import { useForm, useFormProcessing, useFormSubmitted } from '@app/_components/forms/Form/context'

import { Message } from '@app/_components/Message'

const FormSubmissionError: React.FC<{
  className?: string
  message?: string
}> = (props) => {
  const { className, message } = props

  const { submissionError } = useForm()
  const hasSubmitted = useFormSubmitted()
  const isProcessing = useFormProcessing()

  const messageToUse = message || submissionError

  if (hasSubmitted && submissionError && !isProcessing) {
    return <Message className={className} error={messageToUse} />
  }

  return null
}

export default FormSubmissionError
```

# \_components/forms/FormProcessing/index.tsx

```tsx
import React from 'react'
import { useFormProcessing } from '@app/_components/forms/Form/context'

import useDebounce from '@/utilities/use-debounce'

const FormProcessing: React.FC<{
  className?: string
  message?: string
  delay?: number
}> = (props) => {
  const { className, message = 'Processing...', delay = 250 } = props

  const isProcessing = useFormProcessing()
  const debouncedIsProcessing = useDebounce(isProcessing, delay || 0)

  if (debouncedIsProcessing) {
    return <p className={[className].filter(Boolean).join(' ')}>{message}</p>
  }

  return null
}

export default FormProcessing
```

# \_components/forms/Form/reducer.ts

```ts
import type { Action, Field, Fields } from '../types'

// no declaration file for flatley, and no @types either, so require instead of import
// eslint-disable-next-line
const flatley = require('flatley')

const { flatten, unflatten } = flatley

const flattenFilters = [
  {
    test: (_: Fields, value: Field) => {
      const hasValidProperty = Object.prototype.hasOwnProperty.call(value, 'valid')
      const hasValueProperty = Object.prototype.hasOwnProperty.call(value, 'value')

      return hasValidProperty && hasValueProperty
    },
  },
]

const unflattenRowsFromState = (
  state: Fields,
  path: string,
): {
  unflattenedRows: Fields[]
  remainingFlattenedState: Fields
} => {
  // Take a copy of state
  const remainingFlattenedState = { ...state }

  const rowsFromStateObject: Fields = {}

  const pathPrefixToRemove = path.substring(0, path.lastIndexOf('.') + 1)

  // Loop over all keys from state
  // If the key begins with the name of the parent field,
  // Add value to rowsFromStateObject and delete it from remaining state
  Object.keys(state).forEach((key) => {
    if (key.indexOf(`${path}.`) === 0) {
      const name = key.replace(pathPrefixToRemove, '')
      rowsFromStateObject[name] = state[key]
      rowsFromStateObject[name].initialValue = rowsFromStateObject[name].value

      delete remainingFlattenedState[key] // eslint-disable-line @typescript-eslint/no-dynamic-delete
    }
  })

  const unflattenedRows = unflatten(rowsFromStateObject)

  return {
    unflattenedRows: unflattenedRows[path.replace(pathPrefixToRemove, '')] || [],
    remainingFlattenedState,
  }
}

function fieldReducer(state: Fields, action: Action): Fields {
  switch (action.type) {
    case 'RESET': {
      return action.payload || {}
    }

    case 'REMOVE': {
      const newState = { ...state }
      delete newState[action.path] // eslint-disable-line @typescript-eslint/no-dynamic-delete
      return newState
    }

    case 'REMOVE_ROW': {
      const { rowIndex, path } = action
      const { unflattenedRows, remainingFlattenedState } = unflattenRowsFromState(state, path)

      unflattenedRows.splice(rowIndex, 1)

      const flattenedRowState =
        unflattenedRows.length > 0
          ? flatten({ [path]: unflattenedRows }, { filters: flattenFilters })
          : {}

      return {
        ...remainingFlattenedState,
        ...flattenedRowState,
      }
    }

    // send either a single `Field` or an array of `Field[]` to have it/them either added or replaced in `state`
    case 'UPDATE': {
      const { payload } = action
      const fields = Array.isArray(payload) ? payload : [payload]

      const newState = { ...state }

      fields.forEach((field) => {
        newState[field.path] = {
          ...(newState[field.path] || {}),
          initialValue: field.initialValue,
          value: field.value,
          valid: field.valid,
          errorMessage: field.errorMessage,
        }
      })

      return newState
    }

    default: {
      return state
    }
  }
}

export default fieldReducer
```

# \_components/forms/Form/reduceFieldsToValues.ts

```ts
// no declaration file for flatley, and no @types either, so require instead of import
// import flatley from 'flatley'

// export const reduceFieldsToValues = (fields: Fields, unflatten: boolean): Property => {
//   const data: Property = {}

//   Object.keys(fields).forEach((key) => {
//     if (fields[key].value !== undefined) {
//       data[key] = typeof fields[key] === 'object' ? fields[key]?.value : fields[key]
//     }
//   })

//   if (unflatten) {
//     return flatley.unflatten(data, { safe: true })
//   }

//   return data
// }
import type { Fields, Property } from '../types'

export const reduceFieldsToValues = (fields: Fields, unflattenFlag: boolean): Property => {
  const data: Property = {}

  Object.keys(fields).forEach((key) => {
    if (fields[key].value !== undefined) {
      data[key] = typeof fields[key] === 'object' ? fields[key]?.value : fields[key]
    }
  })

  if (unflattenFlag) {
    return unflatten(data)
  }

  return data
}

// Flatten function
const flatten = (
  obj: Record<string, any>,
  parentKey: string = '',
  result: Record<string, any> = {},
): Record<string, any> => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flatten(obj[key], newKey, result)
      } else {
        result[newKey] = obj[key]
      }
    }
  }
  return result
}

// Unflatten function
const unflatten = (data: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {}
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const keys = key.split('.')
      keys.reduce((acc, cur, idx) => {
        return (
          acc[cur] ||
          (acc[cur] = isNaN(Number(keys[idx + 1]))
            ? keys.length - 1 === idx
              ? data[key]
              : {}
            : [])
        )
      }, result)
    }
  }
  return result
}
```

# \_components/forms/Form/initialContext.ts

```ts
import type { IFormContext } from '../types'

const initialContext: IFormContext = {
  initialState: {},
  fields: {},
  validateForm: () => false,
  setIsModified: () => false,
  setIsProcessing: () => false,
  setHasSubmitted: () => false,
  dispatchFields: () => false,
  getFields: () => ({}),
  getField: () => undefined,
}

export default initialContext
```

# \_components/forms/Form/index.tsx

```tsx
'use client'

import React, {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'

import { Data, Field, IFormContext, InitialState, OnSubmit } from '../types'
import {
  FieldContext,
  FormContext,
  FormSubmittedContext,
  ModifiedContext,
  ProcessingContext,
} from './context'
import initialContext from './initialContext'
import { reduceFieldsToValues } from './reduceFieldsToValues'
import reducer from './reducer'

const defaultInitialState = {}

export type FormProps = {
  onSubmit?: OnSubmit
  children: React.ReactNode | ((context: IFormContext) => React.ReactNode)
  initialState?: InitialState
  method?: 'GET' | 'POST'
  action?: string
  className?: string
  errors?: {
    field: string
    message: string
  }[]
  formId?: string
}

const Form = forwardRef<HTMLFormElement, FormProps>((props, ref) => {
  const {
    onSubmit,
    children,
    initialState = defaultInitialState,
    method,
    action,
    className,
    errors: errorsFromProps,
    formId,
  } = props

  const [fields, dispatchFields] = useReducer(reducer, initialState)
  const [isModified, setIsModified] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [errorFromSubmit, setErrorFromSubmit] = useState<string>()

  const contextRef = useRef<IFormContext>(initialContext)

  contextRef.current.initialState = initialState
  contextRef.current.fields = fields

  const handleSubmit = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setHasSubmitted(true)
      setErrorFromSubmit(undefined)

      const formIsValid = contextRef.current.validateForm()

      if (formIsValid) {
        setIsProcessing(true)
      }

      if (!formIsValid) {
        e.preventDefault()
        setIsProcessing(false)
        setErrorFromSubmit('Please fix the errors below and try again.')
        return false
      }

      if (typeof onSubmit === 'function') {
        try {
          await onSubmit({
            data: reduceFieldsToValues(fields, false),
            unflattenedData: reduceFieldsToValues(fields, true),
            dispatchFields: contextRef.current.dispatchFields,
          })

          setHasSubmitted(false)
          setIsModified(false)
          setIsProcessing(false)
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          console.error(message) // eslint-disable-line no-console
          setIsProcessing(false)
          setErrorFromSubmit(message)
        }
      }

      return false
    },
    [onSubmit, setHasSubmitted, setIsProcessing, setIsModified, fields],
  )

  const getFields = useCallback(() => contextRef.current.fields, [contextRef])

  const getField = useCallback(
    (path: string): Field | undefined => {
      return path ? contextRef.current.fields[path] : undefined
    },
    [contextRef],
  )

  const getFormData = useCallback((): Data => {
    return reduceFieldsToValues(contextRef.current.fields, true)
  }, [contextRef])

  const validateForm = useCallback((): boolean => {
    return !Object.values(contextRef.current.fields).some((field): boolean => field.valid === false)
  }, [contextRef])

  contextRef.current.dispatchFields = dispatchFields
  contextRef.current.handleSubmit = handleSubmit
  contextRef.current.getFields = getFields
  contextRef.current.getField = getField
  contextRef.current.getFormData = getFormData
  contextRef.current.validateForm = validateForm
  contextRef.current.setIsModified = setIsModified
  contextRef.current.setIsProcessing = setIsProcessing
  contextRef.current.setHasSubmitted = setHasSubmitted

  useEffect(() => {
    contextRef.current = { ...initialContext }
    dispatchFields({
      type: 'RESET',
      payload: initialState,
    })
  }, [initialState])

  return (
    <form
      method={method}
      action={action}
      noValidate
      onSubmit={contextRef.current.handleSubmit}
      className={className}
      ref={ref}
      id={formId}
    >
      <FormContext.Provider
        value={{
          ...contextRef.current,
          apiErrors: errorsFromProps,
          submissionError: errorFromSubmit,
        }}
      >
        <FieldContext.Provider value={contextRef.current}>
          <FormSubmittedContext.Provider value={hasSubmitted}>
            <ProcessingContext.Provider value={isProcessing}>
              <ModifiedContext.Provider value={isModified}>
                {typeof children === 'function' ? children(contextRef.current) : children}
              </ModifiedContext.Provider>
            </ProcessingContext.Provider>
          </FormSubmittedContext.Provider>
        </FieldContext.Provider>
      </FormContext.Provider>
    </form>
  )
})

export default Form
```

# \_components/forms/Form/context.ts

```ts
'use client'

import { createContext, useContext } from 'react'

import type { IFormContext } from '../types'
import initialContext from './initialContext'

const FormContext = createContext(initialContext)
const FieldContext = createContext(initialContext)
const FormSubmittedContext = createContext(false)
const ProcessingContext = createContext(false)
const ModifiedContext = createContext(false)

const useForm = (): IFormContext => useContext(FormContext)
const useFormFields = (): IFormContext => useContext(FieldContext)
const useFormSubmitted = (): boolean => useContext(FormSubmittedContext)
const useFormProcessing = (): boolean => useContext(ProcessingContext)
const useFormModified = (): boolean => useContext(ModifiedContext)

export {
  FieldContext,
  FormContext,
  FormSubmittedContext,
  ModifiedContext,
  ProcessingContext,
  useForm,
  useFormFields,
  useFormModified,
  useFormProcessing,
  useFormSubmitted,
}
```

# \_components/forms/Error/types.ts

```ts
import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLParagraphElement> {
  showError: boolean
  message: string | undefined
}
```

# \_components/forms/Error/index.tsx

```tsx
import React from 'react'

import { Props } from './types'

import classes from './index.module.scss'

const Error: React.FC<Props> = (props) => {
  const { showError, message, className } = props

  if (showError) {
    return <p className={[classes.error, className].filter(Boolean).join(' ')}>{message}</p>
  }

  return null
}

export default Error
```

# \_components/cards/SquareCard/index.tsx

```tsx
import React from 'react'
import { ArrowIcon } from '@app/_icons/ArrowIcon'

import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { CMSLink, CMSLinkType } from '@app/_components/CMSLink'
import { SquareCardProps } from '../types'

import classes from './index.module.scss'

export const SquareCard: React.FC<SquareCardProps> = (props) => {
  const { title, className, leader, description, revealDescription, enableLink } = props
  const link = props.link || {}
  const hasLink = enableLink

  return hasLink ? (
    <CMSLink
      className={[
        className,
        enableLink && classes.link,
        classes.card,
        revealDescription ? classes.revealCard : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data={props.link as CMSLinkType['data']}
    >
      <div className={classes.leader}>
        <h6 className={classes.leaderText}>{leader}</h6>
        <ArrowIcon className={classes.icon} />
      </div>
      <div className={classes.titleWrapper}>
        <h4 className={classes.title}>{title}</h4>
      </div>
      <div
        className={
          revealDescription ? classes.revealDescriptionWrapper : classes.descriptionWrapper
        }
      >
        <p className={classes.description}>{description}</p>
      </div>
      {/* <BackgroundScanline className={classes.scanlines} /> */}
    </CMSLink>
  ) : (
    <div
      className={[className, classes.card, revealDescription ? classes.revealCard : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.leader}>
        <h6 className={classes.leaderText}>{leader}</h6>
      </div>
      <div className={classes.titleWrapper}>
        <h4
          className={[classes.title, description ? '' : classes.noDescription]
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h4>
      </div>
      {description && (
        <div
          className={
            revealDescription ? classes.revealDescriptionWrapper : classes.descriptionWrapper
          }
        >
          <p className={classes.description}>{description}</p>
        </div>
      )}
      {/* <BackgroundScanline className={classes.scanlines} /> */}
    </div>
  )
}
```

# \_components/cards/DefaultCard/index.tsx

```tsx
import * as React from 'react'
import Link from 'next/link'

import { Heading } from '@app/_components/Heading'
import { Media } from '@app/_components/Media'
import { Pill } from '@app/_components/Pill'
import { PlusIcon } from '@app/_icons/PlusIcon'
import { DefaultCardProps } from '../types'

import classes from './index.module.scss'

export const DefaultCard: React.FC<DefaultCardProps> = (props) => {
  const { pill, description, href, media, title, className, leader } = props

  return (
    <Link
      href={href || ''}
      prefetch={false}
      className={[classes.defaultCard, className && className].filter(Boolean).join(' ')}
    >
      <div className={classes.content}>
        <div className={classes.leaderWrapper}>
          {leader && <div className={classes.leader}>{leader}</div>}
          {pill && (
            <span className={classes.pill}>
              <Pill color="warning" text={pill} />
            </span>
          )}
        </div>
        <Heading element="h2" as="h4" marginTop={false}>
          {title}
        </Heading>
        <div className={classes.plusIcon}>
          <PlusIcon size="full" />
        </div>
        <p className={classes.description}>{description}</p>
      </div>
      {media && typeof media !== 'string' && (
        <Media
          className={classes.media}
          sizes="(max-width: 768px) 100vw, 20vw"
          src={media.url}
          width={media.width}
          height={media.height}
          alt={media.alt}
        />
      )}
    </Link>
  )
}
```

# \_components/cards/ContentMediaCard/index.tsx

```tsx
import * as React from 'react'
import Link from 'next/link'

import { Media } from '@app/_components/Media'
import { formatDate } from '@/utilities/format-date-time'
import { ContentMediaCardProps } from '../types'

import classes from './index.module.scss'

export const ContentMediaCard: React.FC<ContentMediaCardProps> = (props) => {
  const { publishedOn, href, media, title, className, authors } = props

  const author = authors?.[0]
    ? typeof authors?.[0] === 'string'
      ? authors[0]
      : authors[0].firstName + ' ' + authors[0].lastName
    : null

  return (
    <Link
      href={href}
      prefetch={false}
      className={[classes.blogCard, className && className].filter(Boolean).join(' ')}
    >
      <div className={[classes.contentWrapper, className && className].filter(Boolean).join(' ')}>
        {typeof media !== 'string' && (
          <Media
            resource={media}
            className={classes.media}
            sizes="(max-width: 768px) 100vw, 20vw"
          />
        )}
        <div className={classes.content}>
          <div className={classes.meta}>
            {publishedOn && (
              <time dateTime={publishedOn} className={classes.date}>
                {formatDate({ date: publishedOn })}
              </time>
            )}
            {author && <p className={classes.author}>{author}</p>}
          </div>

          <h2 className={classes.title}>{title}</h2>
        </div>
      </div>
    </Link>
  )
}
```

# \_components/Tooltip/TooltipContent/index.tsx

```tsx
import React from 'react'

import classes from './index.module.scss'

export type Props = {
  children: React.ReactNode
  className?: string
}

export const TooltipContent: React.FC<Props> = ({ children, className }) => {
  const tooltipClasses = [classes.tooltip, className].filter(Boolean).join(' ')

  return (
    <aside className={tooltipClasses}>
      {children}
      <span className={classes.caret} />
    </aside>
  )
}
```

# \_components/Media/Video/index.tsx

```tsx
'use client'

import React, { useEffect, useRef } from 'react'

import { Props } from '../types'

import classes from './index.module.scss'

export const Video: React.FC<Props> = (props) => {
  const { videoClassName, resource, onClick } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource !== 'string') {
    return (
      <video
        playsInline
        autoPlay
        muted
        loop
        controls={false}
        className={[classes.video, videoClassName].filter(Boolean).join(' ')}
        onClick={onClick}
        ref={videoRef}
      >
        <source src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${resource.filename}`} />
      </video>
    )
  }

  return null
}
```

# \_components/Media/Image/index.tsx

```tsx
'use client'

import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image'

import { breakpoints } from '@app/_css/cssVariables'
import { Props } from '../types'

import classes from './index.module.scss'

export const ImageComponent: React.FC<Props> = (props) => {
  const {
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    sizes: sizesFromProps,
    resource,
    priority,
    fill,
    src: srcFromProps,
    alt: altFromProps,
    width: widthFromProps,
    height: heightFromProps,
  } = props

  const [isLoading, setIsLoading] = useState(true)

  let width: number | undefined | null = widthFromProps
  let height: number | undefined | null = heightFromProps
  let alt = altFromProps
  let src: StaticImageData | string | undefined | null = srcFromProps

  const hasDarkModeFallback =
    resource?.darkModeFallback &&
    typeof resource.darkModeFallback === 'object' &&
    resource.darkModeFallback !== null &&
    typeof resource.darkModeFallback.filename === 'string'

  if (!src && resource && typeof resource !== 'string') {
    width = resource.width
    height = resource.height
    alt = resource.alt
    src = `${process.env.NEXT_PUBLIC_SERVER_URL}${resource.url}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes =
    sizesFromProps ||
    Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')

  const baseClasses = [
    isLoading && classes.placeholder,
    classes.image,
    imgClassName,
    hasDarkModeFallback && classes.hasDarkModeFallback,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <React.Fragment>
      <Image
        className={`${baseClasses} ${classes.themeLight}`}
        src={src || ''}
        alt={alt || ''}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false)
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        fill={fill}
        width={!fill ? width ?? undefined : undefined}
        height={!fill ? height ?? undefined : undefined}
        sizes={sizes}
        priority={priority}
      />
      {hasDarkModeFallback &&
        typeof resource.darkModeFallback === 'object' &&
        resource.darkModeFallback !== null && (
          <Image
            className={`${baseClasses} ${classes.themeDark}`}
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${resource.darkModeFallback.filename}`}
            alt={alt || ''}
            onClick={onClick}
            onLoad={() => {
              setIsLoading(false)
              if (typeof onLoadFromProps === 'function') {
                onLoadFromProps()
              }
            }}
            fill={fill}
            width={!fill ? width ?? undefined : undefined}
            height={!fill ? height ?? undefined : undefined}
            sizes={sizes}
            priority={priority}
          />
        )}
    </React.Fragment>
  )
}
```

# \_components/Header/MobileNav/index.tsx

```tsx
import * as React from 'react'
import { Modal, useModal } from '@faceless-ui/modal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar } from '@app/_components/Avatar'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Menu } from '@payload-types'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { Theme } from '@app/_providers/Theme/types'
import { FullLogo } from '@app/_graphics/FullLogo'
import { MenuIcon } from '@app/_graphics/MenuIcon'
import { CMSLink } from '../../CMSLink'
import classes from './index.module.scss'
import { OrderNotification } from '../../OrderNotification'

export const modalSlug = 'mobile-nav'
export const subMenuSlug = 'mobile-sub-menu'

type NavItems = Pick<Menu, 'tabs'>

const MobileNavItems = ({ tabs, setActiveTab }: any) => {
  // const { user } = useAuth()
  const { openModal } = useModal()
  const handleOnClick = (index: any) => {
    openModal(subMenuSlug)
    setActiveTab(index)
  }

  return (
    <ul className={classes.mobileMenuItems}>
      {(tabs || []).map((tab: any, index: any) => {
        const { link, label, enableDirectLink, enableDropdown } = tab

        if (!enableDropdown)
          return <CMSLink {...link} className={classes.mobileMenuItem} key={index} label={label} />

        if (enableDirectLink)
          return (
            <button
              onClick={() => handleOnClick(index)}
              className={classes.mobileMenuItem}
              key={index}
            >
              <CMSLink
                className={classes.directLink}
                {...link}
                label={label}
                onClick={(e: any) => {
                  e.stopPropagation()
                }}
              />
              <ArrowIcon size="medium" rotation={45} />
            </button>
          )
        else
          return (
            <CMSLink
              {...link}
              className={classes.mobileMenuItem}
              key={index}
              label={label}
              onClick={() => handleOnClick(index)}
            >
              <ArrowIcon size="medium" rotation={45} />
            </CMSLink>
          )
      })}

      {/* {!user && (
        <Link className={classes.mobileMenuItem} href="/login" prefetch={false}>
          Login
        </Link>
      )} */}
      {/* <CrosshairIcon
        className={[classes.crosshair, classes.crosshairTopLeft].filter(Boolean).join(' ')}
        size="large"
      />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairBottomLeft].filter(Boolean).join(' ')}
        size="large"
      /> */}
    </ul>
  )
}

const MobileMenuModal: React.FC<
  NavItems & {
    setActiveTab: (index: number) => void
    theme?: Theme | null
  }
> = ({ tabs, setActiveTab, theme }) => {
  return (
    <Modal slug={modalSlug} className={classes.mobileMenuModal} trapFocus={false}>
      <Gutter className={classes.mobileMenuWrap} rightGutter={false} dataTheme={`${theme}`}>
        <MobileNavItems tabs={tabs} setActiveTab={setActiveTab} />
        {/* <BackgroundGrid zIndex={0} /> */}
        {/* <BackgroundScanline /> */}
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

const SubMenuModal: React.FC<
  NavItems & {
    activeTab: number | undefined
    theme?: Theme | null
  }
> = ({ tabs, activeTab, theme }) => {
  const { closeModal, closeAllModals } = useModal()

  return (
    <Modal
      slug={subMenuSlug}
      className={[classes.mobileMenuModal, classes.mobileSubMenu].join(' ')}
      trapFocus={false}
      onClick={closeAllModals}
    >
      <Gutter className={classes.subMenuWrap} dataTheme={`${theme}`}>
        {(tabs || []).map((tab: any, tabIndex: any) => {
          if (tabIndex !== activeTab) return null
          return (
            <div className={classes.subMenuItems} key={tabIndex}>
              <button
                className={classes.backButton}
                onClick={(e) => {
                  closeModal(subMenuSlug)
                  e.stopPropagation()
                }}
              >
                <ArrowIcon size="medium" rotation={225} />
                Back
                <CrosshairIcon
                  className={[classes.crosshair, classes.crosshairTopLeft]
                    .filter(Boolean)
                    .join(' ')}
                  size="large"
                />
              </button>
              {tab.descriptionLinks && tab.descriptionLinks.length > 0 && (
                <div className={classes.descriptionLinks}>
                  {tab.descriptionLinks.map((link: any, linkIndex: any) => (
                    <CMSLink className={classes.descriptionLink} key={linkIndex} {...link.link}>
                      <ArrowIcon className={classes.linkArrow} />
                    </CMSLink>
                  ))}
                </div>
              )}
              {(tab.items || []).map((item: any, index: any) => {
                return (
                  <div className={classes.linkWrap} key={index}>
                    {item.style === 'default' && item.defaultLink && (
                      <CMSLink className={classes.defaultLink} {...item.defaultLink.link} label="">
                        <div className={classes.listLabelWrap}>
                          <div className={classes.listLabel}>
                            {item.defaultLink.link.label}
                            <ArrowIcon size="medium" rotation={0} />
                          </div>
                          <div className={classes.itemDescription}>
                            {item.defaultLink.description}
                          </div>
                        </div>
                      </CMSLink>
                    )}
                    {item.style === 'list' && item.listLinks && (
                      <div className={classes.linkList}>
                        <div className={classes.tag}>{item.listLinks.tag}</div>
                        <div className={classes.listWrap}>
                          {item.listLinks.links &&
                            item.listLinks.links.map((link: any, linkIndex: any) => (
                              <CMSLink className={classes.link} key={linkIndex} {...link.link}>
                                {link.link?.newTab && link.link?.type === 'custom' && (
                                  <ArrowIcon className={classes.linkArrow} />
                                )}
                              </CMSLink>
                            ))}
                        </div>
                      </div>
                    )}
                    {item.style === 'featured' && item.featuredLink && (
                      <div className={classes.featuredLink}>
                        <div className={classes.tag}>{item.featuredLink.tag}</div>
                        {item.featuredLink?.label && (
                          <RichText
                            className={classes.featuredLinkLabel}
                            content={item.featuredLink.label}
                          />
                        )}
                        <div className={classes.featuredLinkWrap}>
                          {item.featuredLink.links &&
                            item.featuredLink.links.map((link: any, linkIndex: any) => (
                              <CMSLink
                                className={classes.featuredLinks}
                                key={linkIndex}
                                {...link.link}
                              >
                                <ArrowIcon />
                              </CMSLink>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <CrosshairIcon
                className={[classes.crosshair, classes.crosshairBottomLeft]
                  .filter(Boolean)
                  .join(' ')}
                size="large"
              />
            </div>
          )
        })}
        {/* <BackgroundScanline /> */}
        {/* <BackgroundGrid zIndex={0} /> */}
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

export const MobileNav: React.FC<NavItems> = (props) => {
  const { isModalOpen, openModal, closeAllModals } = useModal()
  const { headerTheme } = useHeaderObserver()
  // const { user } = useAuth()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = React.useState<number | undefined>()

  const isMenuOpen = isModalOpen(modalSlug)

  React.useEffect(() => {
    closeAllModals()
  }, [pathname, closeAllModals])

  const toggleModal = React.useCallback(() => {
    if (isMenuOpen) {
      closeAllModals()
    } else {
      openModal(modalSlug)
    }
  }, [isMenuOpen, closeAllModals, openModal])

  return (
    <div className={classes.mobileNav}>
      <div className={classes.menuBar}>
        <Gutter>
          <div className={'grid'}>
            <div
              className={[classes.menuBarContainer, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
            >
              <Link
                href="/"
                className={[classes.logo, 'no-underline'].join(' ')}
                prefetch={false}
                aria-label="Full Payload Logo"
              >
                <FullLogo />
              </Link>
              <div className={classes.icons}>
                <div className={classes.shoppingBag}>
                  <OrderNotification />
                  {/* <ShoppingBagIcon /> */}
                </div>
                {/* <div className={classes.cloudNewProject}>
                  {!user && (
                    <Link href="/login" prefetch={false}>
                      Login
                    </Link>
                  )}
                </div>
                {user && <Avatar className={classes.mobileAvatar} />} */}

                <div
                  className={[classes.modalToggler, isMenuOpen ? classes.hamburgerOpen : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={toggleModal}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <MenuIcon />
                </div>
              </div>
            </div>
          </div>
        </Gutter>
      </div>
      <MobileMenuModal {...props} setActiveTab={setActiveTab} theme={headerTheme} />
      <SubMenuModal {...props} activeTab={activeTab} theme={headerTheme} />
    </div>
  )
}
```

# \_components/Header/DesktopNav/index.tsx

```tsx
import * as React from 'react'
import Link from 'next/link'

import { Avatar } from '@app/_components/Avatar'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { Menu } from '@payload-types'
// import { useAuth } from '@app/_providers/Auth'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { FullLogo } from '@app/_graphics/FullLogo'
import { CMSLink } from '../../CMSLink'

import classes from './index.module.scss'
import { OrderNotification } from '../../OrderNotification'

type DesktopNavType = Pick<Menu, 'tabs'> & { hideBackground?: boolean }
export const DesktopNav: React.FC<DesktopNavType> = ({ tabs, hideBackground }) => {
  // const { user } = useAuth()
  const [activeTab, setActiveTab] = React.useState<number | undefined>()
  const [activeDropdown, setActiveDropdown] = React.useState<boolean | undefined>(false)
  const [backgroundStyles, setBackgroundStyles] = React.useState<any>({
    height: '0px',
  })
  const bgHeight = hideBackground ? { top: '0px' } : ''
  const [underlineStyles, setUnderlineStyles] = React.useState<any>({})
  const { headerTheme } = useHeaderObserver()
  const [activeDropdownItem, setActiveDropdownItem] = React.useState<number | undefined>(undefined)

  const menuItemRefs = [] as (HTMLButtonElement | null)[]
  const dropdownMenuRefs = [] as (HTMLDivElement | null)[]

  // const starCount = useStarCount()

  React.useEffect(() => {
    if (activeTab !== undefined) {
      const hoveredDropdownMenu = dropdownMenuRefs[activeTab]
      const bgHeight = hoveredDropdownMenu?.clientHeight || 0
      if (bgHeight === 0) {
        setBackgroundStyles({ height: '0px' })
        setActiveDropdown(undefined)
      } else {
        setBackgroundStyles({
          height: hideBackground ? `${bgHeight + 90}px` : `${bgHeight}px`,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideBackground])

  const handleHoverEnter = (index: any) => {
    setActiveTab(index)
    setActiveDropdown(true)

    const hoveredMenuItem = menuItemRefs[index]
    const hoveredDropdownMenu = dropdownMenuRefs[index]
    const bgHeight = hoveredDropdownMenu?.clientHeight || 0

    if (hoveredMenuItem) {
      setUnderlineStyles({
        width: `${hoveredMenuItem.clientWidth}px`,
        left: hoveredMenuItem.offsetLeft,
      })
    }

    if (bgHeight === 0) {
      setBackgroundStyles({ height: '0px' })
      setActiveDropdown(undefined)
    } else {
      setBackgroundStyles({
        height: hideBackground ? `${bgHeight + 90}px` : `${bgHeight}px`,
      })
    }

    setActiveDropdownItem(undefined)
  }

  const resetHoverStyles = () => {
    setActiveDropdown(false)
    setActiveTab(undefined)
    setBackgroundStyles({ height: '0px' })
  }

  return (
    <div
      className={[classes.desktopNav, headerTheme && classes[headerTheme]]
        .filter(Boolean)
        .join(' ')}
      style={{ width: '100%' }}
    >
      <Gutter
        className={[classes.desktopNav, activeDropdown && classes.active].filter(Boolean).join(' ')}
      >
        <div className={[classes.grid, 'grid'].join(' ')}>
          <div className={[classes.logo, 'cols-4'].join(' ')}>
            <Link href="/" className={classes.logo} prefetch={false} aria-label="Full Payload Logo">
              <FullLogo />
            </Link>
          </div>
          <div className={[classes.content, 'cols-8'].join(' ')}>
            <div className={classes.tabs} onMouseLeave={resetHoverStyles}>
              {(tabs || []).map((tab: any, tabIndex: any) => {
                const { enableDirectLink = false, enableDropdown = false } = tab
                return (
                  <div key={tabIndex} onMouseEnter={() => handleHoverEnter(tabIndex)}>
                    <button
                      className={classes.tab}
                      ref={(ref: HTMLButtonElement | null) => {
                        if (ref) menuItemRefs[tabIndex] = ref
                      }}
                    >
                      {enableDirectLink ? (
                        <CMSLink className={classes.directLink} {...tab.link} label={tab.label}>
                          {tab.link?.newTab && tab.link.type === 'custom' && (
                            <ArrowIcon className={classes.tabArrow} />
                          )}
                        </CMSLink>
                      ) : (
                        <React.Fragment>{tab.label}</React.Fragment>
                      )}
                    </button>

                    {enableDropdown && (
                      <div
                        className={[
                          'grid',
                          classes.dropdown,
                          tabIndex === activeTab && classes.activeTab,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        ref={(ref: HTMLDivElement | null) => {
                          if (ref) dropdownMenuRefs[tabIndex] = ref
                        }}
                        onClick={resetHoverStyles}
                      >
                        <div className={[classes.description, 'cols-4'].join(' ')}>
                          {tab.description}
                          {tab.descriptionLinks && (
                            <div className={classes.descriptionLinks}>
                              {tab.descriptionLinks.map((link: any, linkIndex: any) => (
                                <CMSLink
                                  className={classes.descriptionLink}
                                  key={linkIndex}
                                  {...link.link}
                                >
                                  <ArrowIcon className={classes.linkArrow} />
                                </CMSLink>
                              ))}
                            </div>
                          )}
                        </div>
                        {tab.items &&
                          tab.items?.map((item: any, index: any) => {
                            const isActive = activeDropdownItem === index
                            let columnSpan = 12 / (tab.items?.length || 1)
                            const containsFeatured = tab.items?.some(
                              (navItem: any) => navItem.style === 'featured',
                            )
                            const showUnderline = isActive && item.style === 'default'

                            if (containsFeatured) {
                              columnSpan = item.style === 'featured' ? 6 : 3
                            }

                            // console.log('item //', JSON.stringify(item))
                            return (
                              <div
                                className={[
                                  `cols-${columnSpan}`,
                                  classes.dropdownItem,
                                  showUnderline && classes.showUnderline,
                                ].join(' ')}
                                onMouseEnter={() => setActiveDropdownItem(index)}
                                key={index}
                              >
                                {item.style === 'default' && item.defaultLink && (
                                  <CMSLink
                                    className={classes.defaultLink}
                                    {...item.defaultLink.link}
                                    label=""
                                  >
                                    <div className={classes.defaultLinkLabel}>
                                      {item.defaultLink.link.label}
                                    </div>
                                    <div className={classes.defaultLinkDescription}>
                                      {item.defaultLink.description}
                                      <ArrowIcon size="medium" />
                                    </div>
                                  </CMSLink>
                                )}
                                {item.style === 'list' && item.listLinks && (
                                  <div className={classes.linkList}>
                                    <div className={classes.listLabel}>{item.listLinks.tag}</div>
                                    {item.listLinks.links &&
                                      item.listLinks.links.map((link: any, linkIndex: any) => (
                                        <CMSLink
                                          className={classes.link}
                                          key={linkIndex}
                                          {...link.link}
                                        >
                                          {link.link?.newTab && link.link?.type === 'custom' && (
                                            <ArrowIcon className={classes.linkArrow} />
                                          )}
                                        </CMSLink>
                                      ))}
                                  </div>
                                )}
                                {item.style === 'featured' && item.featuredLink && (
                                  <div className={classes.featuredLink}>
                                    <div className={classes.listLabel}>{item.featuredLink.tag}</div>
                                    {item.featuredLink?.label && (
                                      <RichText
                                        className={classes.featuredLinkLabel}
                                        content={item.featuredLink.label}
                                      />
                                    )}
                                    <div className={classes.featuredLinkWrap}>
                                      {item.featuredLink.links &&
                                        item.featuredLink.links.map((link: any, linkIndex: any) => (
                                          <CMSLink
                                            className={classes.featuredLinks}
                                            key={linkIndex}
                                            {...link.link}
                                          >
                                            <ArrowIcon className={classes.linkArrow} />
                                          </CMSLink>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )
              })}
              <div
                className={classes.underline}
                style={{ ...underlineStyles, opacity: activeDropdown || activeTab ? 1 : 0 }}
                aria-hidden="true"
              >
                <div className={classes.underlineFill} />
              </div>
            </div>
          </div>
          <div className={'cols-4'}>
            <div className={[classes.secondaryNavItems, classes.show].join(' ')}>
              <OrderNotification />
              {/* <ShoppingBagIcon /> */}
            </div>
          </div>

          {/* <div className={'cols-4'}>
            <div
              className={[classes.secondaryNavItems, user !== undefined && classes.show].join(' ')}
            >
              <Link href="/account" prefetch={false}>
                Account
              </Link>
              {user ? (
                <Avatar className={classes.avatar} />
              ) : (
                <Link prefetch={false} href="/login">
                  Login
                </Link>
              )}
              
            </div>
          </div> */}
        </div>
        <div className={classes.background} style={{ ...backgroundStyles, ...bgHeight }} />
      </Gutter>
    </div>
  )
}
```

# \_components/Footer/SubFooter/index.tsx

```tsx
'use client'

import React, { useId } from 'react'
import Link from 'next/link'

import { Gutter } from '@app/_components/Gutter'
// import { ThemeAutoIcon } from '@app/_graphics/ThemeAutoIcon'
// import { ThemeDarkIcon } from '@app/_graphics/ThemeDarkIcon'
// import { ThemeLightIcon } from '@app/_graphics/ThemeLightIcon'
import { ChevronUpDownIcon } from '@app/_icons/ChevronUpDownIcon'
// import { useAuth } from '@app/_providers/Auth'
// import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
// import { useThemePreference } from '@app/_providers/Theme'
// import { getImplicitPreference, themeLocalStorageKey } from '@app/_providers/Theme/shared'
// import { Theme } from '@app/_providers/Theme/types'

import classes from './classes.module.scss'
import { blockFormats } from '@app/_css/tailwindClasses'

export const SubFooter = () => {
  // const { user } = useAuth()

  // const selectRef = React.useRef<HTMLSelectElement>(null)
  // const themeId = useId()
  // const { setTheme } = useThemePreference()
  // const { setHeaderTheme } = useHeaderObserver()

  // const onThemeChange = (themeToSet: Theme & 'auto') => {
  //   if (themeToSet === 'auto') {
  //     const implicitPreference = getImplicitPreference() ?? 'light'
  //     setHeaderTheme(implicitPreference)
  //     setTheme(implicitPreference)
  //     if (selectRef.current) selectRef.current.value = 'auto'
  //   } else {
  //     setTheme(themeToSet)
  //     setHeaderTheme(themeToSet)
  //   }
  // }

  return (
    <Gutter className={classes.footerWrap}>
      <footer className={['grid', classes.footer].join(' ')}>
        <nav className={['cols-12 cols-m-6', classes.footerLinks].join(' ')}>
          <div
          // className={`border-t border-gray-900 bg-green px-3  py-4 font-body text-white sm:py-3 md:flex md:items-center md:justify-between`}
          >
            <div
            // className={[blockFormats.blockWidth, ` mt-0 align-middle #text-white md:order-1`]
            //   .filter(Boolean)
            //   .join(' ')}
            >
              <span className="font-logo text-lg font-bold tracking-[-.055em] #text-white">{`thankly `}</span>
              <span className="text-xs uppercase">
                {' | ABN 84 662 101 859 | '} &copy; {new Date().getFullYear()}{' '}
                {` All Rights Reserved`}
              </span>
            </div>
          </div>
          {/* <Link href={'/terms'}>Terms</Link>
          <Link href={'/privacy'}>Privacy</Link>
          {user ? <Link href={'/logout'}>Logout</Link> : <Link href={'/login'}>Login</Link>} */}
        </nav>
        {/* <div className={[classes.selectContainer, 'cols-4 cols-m-2'].join(' ')}>
          <label className="visually-hidden" htmlFor={themeId}>
            Switch themes
          </label>
          {selectRef?.current && (
            <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
              {selectRef.current.value === 'auto' && <ThemeAutoIcon />}
              {selectRef.current.value === 'light' && <ThemeLightIcon />}
              {selectRef.current.value === 'dark' && <ThemeDarkIcon />}
            </div>
          )}

          <select
            id={themeId}
            onChange={(e) => onThemeChange(e.target.value as Theme & 'auto')}
            ref={selectRef}
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <ChevronUpDownIcon className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`} />
        </div> */}
      </footer>
    </Gutter>
  )
}
```

# \_components/CMSForm/Submit/index.tsx

```tsx
// 'use client'

// import React, { forwardRef } from 'react'
// import { useFormProcessing } from '@app/_components/forms/Form/context'

// import { Button, ButtonProps } from '@app/_components/Button'

// type SubmitProps = ButtonProps & {
//   label?: string | null
//   processing?: boolean
// }

// const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
//   const {
//     label,
//     processing: processingFromProps,
//     className,
//     appearance = 'default',
//     size = 'default',
//     icon = 'arrow',
//     disabled,
//     iconRotation,
//   } = props

//   const processing = useFormProcessing()
//   const isProcessing = processing || processingFromProps

//   return (
//     <React.Fragment>
//       {/* <Button
//         ref={ref}
//         htmlButtonType="submit"
//         appearance={appearance}
//         size={size}
//         icon={icon && !isProcessing ? icon : undefined}
//         iconRotation={iconRotation}
//         label={isProcessing ? 'Processing...' : label || 'Submit'}
//         className={className}
//         disabled={isProcessing || disabled}
//         fullWidth
//         hideHorizontalBorders
//         isCMSFormSubmitButton
//       /> */}
//     </React.Fragment>
//   )
// })

// export default Submit

'use client'

import React, { forwardRef } from 'react'
import { useFormProcessing } from '@app/_components/forms/Form/context'
import { CMSLink, CMSLinkType } from '@app/_components/CMSLink'
import { ArrowRightIcon } from 'lucide-react'

type SubmitProps = Omit<CMSLinkType, 'data'> & {
  label?: string | null
  processing?: boolean
}

const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
  const {
    label,
    processing: processingFromProps,
    className,
    look = {
      type: 'submit',
      size: 'medium',
      width: 'full',
      variant: 'blocks',
      icon: {
        content: <ArrowRightIcon />,
        iconPosition: 'right',
      },
    },
    actions,
    children,
  } = props

  const formProcessing = useFormProcessing()
  const isProcessing = formProcessing || processingFromProps

  return (
    <CMSLink
      data={{
        label: isProcessing ? 'Processing...' : label || 'Submit',
        type: 'custom',
        url: '#',
      }}
      className={className}
      look={{
        ...look,
        type: 'submit',
      }}
      actions={{
        ...actions,
        onClick: (e) => {
          if (e) e.preventDefault()
          if (actions?.onClick) actions.onClick(e)
        },
      }}
      pending={isProcessing}
    >
      {children}
    </CMSLink>
  )
})

export default Submit
```

# \_components/CMSForm/Width/index.tsx

```tsx
import * as React from 'react'

import classes from './index.module.scss'

export const Width: React.FC<{ width?: number | null; children: React.ReactNode }> = ({
  width,
  children,
}) => {
  return (
    <div className={classes.width} style={{ width: width ? `${width}%` : undefined }}>
      {children}
    </div>
  )
}
```

# \_components/CMSForm/Label/types.ts

```ts
import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLLabelElement> {
  actionsClassName?: string
  label?: string | React.ReactNode
  required?: boolean
  actionsSlot?: React.ReactNode
  htmlFor?: string
  margin?: boolean
}
```

# \_components/CMSForm/Label/index.tsx

```tsx
import React from 'react'

import { Props } from './types'

import classes from './index.module.scss'

const LabelOnly: React.FC<Props> = (props) => {
  const { htmlFor, required, label, className } = props

  return (
    <label htmlFor={htmlFor} className={[classes.label, className].filter(Boolean).join(' ')}>
      {label}
      {required && <span className={classes.required}>*</span>}
    </label>
  )
}

const Label: React.FC<Props> = (props) => {
  const { actionsClassName, label, actionsSlot, margin } = props

  if (label) {
    if (actionsSlot) {
      return (
        <div
          className={[
            classes.labelWithActions,
            margin === false && classes.noMargin,
            actionsClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <LabelOnly {...props} />
          <div className={classes.actions}>{actionsSlot}</div>
        </div>
      )
    }

    return <LabelOnly {...props} />
  }

  return null
}

export default Label
```

# \_components/Avatar/DropdownMenu/index.tsx

```tsx
import * as React from 'react'
// import { cloudSlug } from '@cloud/slug'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// import { useAuth } from '@app/_providers/Auth'
import useClickAway from '@/utilities/use-click-away'

import classes from './index.module.scss'

export const DropdownMenu: React.FC<{
  isOpen: boolean
  onChange: (isOpen: boolean) => void // eslint-disable-line no-unused-vars
}> = ({ isOpen: isOpenFromProps, onChange }) => {
  // const { user } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(isOpenFromProps)

  React.useEffect(() => {
    setIsOpen(isOpenFromProps)
  }, [isOpenFromProps])

  React.useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(isOpen)
    }
  }, [isOpen, onChange])

  const ref = React.useRef<HTMLDivElement>(null)

  const handleClickAway = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useClickAway(ref, handleClickAway)

  if (isOpen) {
    return (
      <div className={classes.dropdown} ref={ref}>
        <div>
          <p className={classes.dropdownLabel}>Personal account</p>
          {/* <Link href={`/${cloudSlug}`} className={classes.profileLink} prefetch={false}>
            <div className={classes.profileAvatar}>
              <div className={classes.userInitial}>{user?.email?.charAt(0).toUpperCase()}</div>
            </div>
            <p className={classes.profileName}>{user?.email}</p>
          </Link> */}
        </div>
        <div>
          <p className={classes.dropdownLabel}>Teams</p>
          {/* <Link href={`/${cloudSlug}`} className={classes.profileLink} prefetch={false}>
            <div className={classes.profileAvatar}>
              <div className={classes.userInitial}>T</div>
            </div>
            <p className={classes.profileName}>TRBL</p>
          </Link> */}
        </div>
      </div>
    )
  }

  return null
}
```

# \_components/Analytics/GoogleTagManager/index.tsx

```tsx
'use client'

import React, { Fragment } from 'react'
import Script from 'next/script'

import { usePrivacy } from '@app/_providers/Privacy'

const gtmMeasurementID = process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID

export const GoogleTagManager: React.FC = () => {
  const { cookieConsent } = usePrivacy()

  if (!cookieConsent || !gtmMeasurementID) return null

  return (
    <React.Fragment>
      <Script
        id="google-tag-manager"
        defer
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmMeasurementID}');`,
        }}
      />

      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmMeasurementID}`}
          height="0"
          width="0"
          style={{
            display: 'none',
            visibility: 'hidden',
          }}
        ></iframe>
      </noscript>
    </React.Fragment>
  )
}
```

# \_components/Analytics/GoogleAnalytics/index.tsx

```tsx
'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'

import { usePrivacy } from '@app/_providers/Privacy'
import { analyticsEvent } from '@app/_components/Analytics/analytics'

const gaMeasurementID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const GoogleAnalytics: React.FC = () => {
  const pathname = usePathname()

  const { cookieConsent } = usePrivacy()

  React.useEffect(() => {
    if (!gaMeasurementID || !window?.location?.href) return

    analyticsEvent('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pathname,
    })
  }, [pathname])

  if (!cookieConsent || !gaMeasurementID) return null

  return (
    <React.Fragment>
      <Script defer src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementID}`} />
      <Script
        defer
        id="google-analytics"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaMeasurementID}', { send_page_view: false });`,
        }}
      />
    </React.Fragment>
  )
}
```

# \_blocks/StickyHighlights/Highlight/index.tsx

```tsx
import React, { Fragment, useEffect, useRef, useState } from 'react'
// import { CSSTransition } from 'react-transition-group'

import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type StickyHighlightsProps = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }>

type Fields = Exclude<any['stickyHighlightsFields'], undefined>

type Props = Exclude<Fields['highlights'], undefined | null>[number] & {
  yDirection?: 'up' | 'down'
  midBreak: boolean
}

export const StickyHighlightComponent: React.FC<Props> = ({
  content,
  enableLink,
  link,
  type,
  code,
  media,
  yDirection,
  midBreak,
  codeBlips,
}) => {
  const [visible, setVisible] = useState(false)
  const [centerCodeMedia, setCenterCodeMedia] = useState(false)
  const [init, setInit] = useState(false)
  const ref = useRef(null)
  const codeMediaWrapRef = useRef(null)
  const codeMediaInnerRef = useRef(null)
  // const { data, isOpen } = CodeBlip.useCodeBlip()

  const codeMediaClasses = [
    classes.codeMedia,
    centerCodeMedia && classes.centerCodeMedia,
    visible && classes.visible,
    'group-active',
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    if (!midBreak) {
      const refCopy = ref?.current
      const codeWrapRefCopy = codeMediaWrapRef?.current
      let intersectionObserver: IntersectionObserver
      let resizeObserver: ResizeObserver

      if (refCopy) {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setVisible(entry.isIntersecting)
            })
          },
          {
            rootMargin: '0px',
            threshold: 0.5,
          },
        )

        intersectionObserver.observe(refCopy)
      }

      if (codeWrapRefCopy && codeMediaInnerRef?.current) {
        resizeObserver = new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            setCenterCodeMedia(
              // @ts-expect-error
              entry.contentRect.height > (codeMediaInnerRef?.current?.clientHeight || 0),
            )
          })
        })

        resizeObserver.observe(codeWrapRefCopy)
      }

      return () => {
        if (refCopy) {
          intersectionObserver.unobserve(refCopy)
        }

        if (codeWrapRefCopy) {
          resizeObserver.unobserve(codeWrapRefCopy)
        }
      }
    }

    return () => null
  }, [ref, midBreak])

  useEffect(() => {
    setInit(true)
  }, [])

  return (
    <div
      ref={ref}
      className={[
        classes.stickyHighlight,
        classes[`scroll-direction--${init ? yDirection : 'down'}`],
      ].join(' ')}
    >
      <div className={[classes.minHeight, 'grid'].filter(Boolean).join(' ')}>
        <div className={[classes.leftContentWrapper, 'cols-4 cols-m-8'].filter(Boolean).join(' ')}>
          <RichText content={content} className={classes.richText} />
          {enableLink && (
            <CMSLink
              data={{ ...link }}
              look={{
                theme: 'light',
                type: 'button',
                size: 'medium',
                width: 'wide',
                variant: 'blocks',
              }}
            />
            //           <CMSLink
            //   {...link}
            //   appearance="default"
            //   fullWidth
            //   buttonProps={{
            //     icon: 'arrow',
            //     hideHorizontalBorders: false,
            //   }}
            // />
          )}
        </div>
      </div>
      {/* <CSSTransition in={visible} timeout={750} classNames="animate"> */}
      <Gutter className={[classes.codeMediaPosition, 'grid'].filter(Boolean).join(' ')}>
        {/* {type === 'code' && (
            <React.Fragment>
              <div
                className={[classes.scanlineWrapper, 'start-9 cols-8'].filter(Boolean).join(' ')}
              >
                <BackgroundScanline
                  className={[classes.scanlineDesktop].filter(Boolean).join(' ')}
                  crosshairs={['top-left', 'bottom-left']}
                />

                <CrosshairIcon className={[classes.crosshairTopRight].filter(Boolean).join(' ')} />

                <CrosshairIcon
                  className={[classes.crosshairBottomRight].filter(Boolean).join(' ')}
                />
              </div>
              <div
                className={[classes.rightContentWrapper, 'cols-10 start-7 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                <BackgroundScanline
                  className={[classes.scanlineMobile, ''].filter(Boolean).join(' ')}
                />
                <div className={codeMediaClasses} ref={codeMediaWrapRef}>
                  <div className={classes.codeMediaInner} ref={codeMediaInnerRef}>
                    <div className={classes.codeWrapper}>
                      <CodeBlip.Modal />
                      <Code
                        parentClassName={classes.code}
                        codeBlips={codeBlips}
                        className={classes.innerCode}
                        disableMinHeight
                      >{`${code}
                          `}</Code>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )} */}
        {type === 'media' && typeof media === 'object' && media !== null && (
          <div className={'cols-10 start-7 cols-m-8 start-m-1'}>
            <div className={codeMediaClasses} ref={codeMediaWrapRef}>
              <div className={classes.mediaInner} ref={codeMediaInnerRef}>
                <div className={classes.media}>
                  <Media resource={media} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Gutter>
      {/* </CSSTransition> */}
    </div>
  )
}

export const StickyHighlight: React.FC<Props> = React.memo((props) => {
  return (
    // <CodeBlip.Provider>
    <StickyHighlightComponent {...props} />
    // </CodeBlip.Provider>
  )
})
```

# \_blocks/Steps/Step/index.tsx

```tsx
import React, { useEffect, useRef, useState } from 'react'
import useIntersection from '@/utilities/useIntersection'

import { Gutter } from '@app/_components/Gutter'
import { Label } from '@app/_components/Label'
import { RenderBlocks } from '@app/_components/RenderBlocks'
import { Page } from '@payload-types'

import classes from './index.module.scss'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'

// type Props = Extract<Page['layout'][0], { blockType: 'steps' }>['stepsFields']['steps'][0] & {
//   i: number
// }

export type Props = ExtractBlockProps<'steps'>['stepsFields']['steps'][0] & { i: number }

export const Step: React.FC<Props> = ({ layout, i }) => {
  const ref = useRef(null)
  const { isIntersecting } = useIntersection({ ref, rootMargin: '0% 0% -25% 0%' })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isIntersecting && !hasAnimated) setHasAnimated(true)
  }, [isIntersecting, hasAnimated])

  if (layout) {
    return (
      <li
        className={[classes.step, hasAnimated && classes.animate].filter(Boolean).join(' ')}
        key={i}
        ref={ref}
      >
        <Gutter>
          <Label className={classes.label}>Step 0{i + 1}</Label>
        </Gutter>
        <RenderBlocks disableOuterSpacing blocks={layout} />
      </li>
    )
  }

  return null
}
```

# \_blocks/Slider/QuoteCard/index.tsx

```tsx
import * as React from 'react'
import { QuoteIcon } from '@app/_icons/QuoteIcon'
import { formatDate } from '@/utilities/format-date-time'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// type Props = NonNullable<
//   Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['quoteSlides']
// >[0] & {
//   isActive: boolean
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type Props = ExtractBlockProps<'slider'>['sliderFields']['quoteSlides'] & {
  isActive: boolean
}

export const QuoteCard: React.FC<Props> = ({ quote, leader, author, role, isActive }) => {
  if (!quote) return null
  return (
    <div className={[classes.quoteCard, isActive && classes.isActive].filter(Boolean).join(' ')}>
      <div className={classes.leader}>{leader}</div>
      <h3 className={classes.quote}>
        {quote}
        <span className={classes.closingQuote}>”</span>
      </h3>
      <div className={classes.meta}>
        <p className={classes.author}>{author}</p>
        <p className={classes.role}>{role}</p>
      </div>
    </div>
  )
}
```

# \_blocks/MediaContentAccordion/Mobile/index.tsx

```tsx
import React, { createRef, Fragment, useEffect, useRef, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleToggler,
} from '@faceless-ui/collapsibles'
import Image from 'next/image'

import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { CMSLink } from '@app/_components/CMSLink'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import SplitAnimate from '@app/_components/SplitAnimate'
import { ArrowRightIcon } from '@app/_icons/ArrowRightIcon'
import { ChevronDownIcon } from '@app/_icons/ChevronDownIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type MediaContentAccordionProps = Extract<
//   Page['layout'][0],
//   { blockType: 'mediaContentAccordion' }
// > & {
//   className?: string
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
export type MediaContentAccordionProps = ExtractBlockProps<'form'> & { className?: string }

export const MobileMediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  mediaContentAccordionFields,
  className,
}) => {
  const { leader, heading, accordion } = mediaContentAccordionFields || {}

  const mediaRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([])
  const [containerHeight, setContainerHeight] = useState(0)
  const hasAccordion = Array.isArray(accordion) && accordion.length > 0
  const [activeAccordion, setActiveAccordion] = useState<number>(0)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(index)
  }

  if (accordion && accordion.length > 0 && mediaRefs.current.length !== accordion.length) {
    mediaRefs.current = accordion.map((_: any, i: any) => mediaRefs.current[i] || createRef())
  }

  useEffect(() => {
    const updateContainerHeight = () => {
      const activeMediaRef = mediaRefs.current[activeAccordion]
      if (activeMediaRef && activeMediaRef.current) {
        const activeMediaHeight = activeMediaRef.current.offsetHeight
        setContainerHeight(activeMediaHeight)
      }
    }

    updateContainerHeight()

    const resizeObserver = new ResizeObserver((entries) => {
      updateContainerHeight()
    })

    const activeMediaRef = mediaRefs.current[activeAccordion]
    if (activeMediaRef && activeMediaRef.current) {
      resizeObserver.observe(activeMediaRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [activeAccordion])

  return (
    <div
      className={[classes.mobileAccordionWrapper, 'grid', className && className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['start-1 cols-8 start-m-1 cols-m-8'].filter(Boolean).join(' ')}>
        <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
          {leader && <div className={classes.leader}>{leader}</div>}
          {heading && (
            <h3 className={classes.heading}>
              <SplitAnimate text={heading} />
            </h3>
          )}
        </div>
        <div
          className={classes.mediaBackgroundWrapper}
          style={{ height: `calc(${containerHeight}px + 6rem)` }}
        >
          {hasAccordion &&
            accordion.map((item: any, index: any) => (
              <React.Fragment key={item.id || index}>
                {index === activeAccordion && (
                  <React.Fragment>
                    {item.background === 'gradient' && (
                      <React.Fragment>
                        <Image
                          alt=""
                          className={classes.gradientBg}
                          width={1920}
                          height={946}
                          src={`/images/gradients/1.jpg`}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </React.Fragment>
                    )}
                    {item.background === 'scanlines' && (
                      <React.Fragment>
                        {/* <BackgroundScanline
                          className={[classes.scanlineMobile].filter(Boolean).join(' ')}
                        /> */}
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </React.Fragment>
                    )}
                    {item.background === 'none' && <div className={classes.transparentBg} />}
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          <div className={classes.mediaMobileContainer}>
            {hasAccordion &&
              accordion.map((item: any, index: any) => (
                <div
                  ref={mediaRefs.current[index]}
                  key={item.id || index}
                  className={classes.media}
                  style={{ opacity: index === activeAccordion ? 1 : 0 }}
                >
                  {typeof item.media === 'object' && item.media !== null && (
                    <Media resource={item.media} />
                  )}
                </div>
              ))}
          </div>
        </div>
        <div>
          <CollapsibleGroup allowMultiple={false} transTime={500} transCurve="ease-in-out">
            {hasAccordion &&
              accordion.map((item: any, index: any) => (
                <div
                  key={item.id || index}
                  className={[
                    classes.collapsibleWrapper,
                    activeAccordion === index ? classes.activeLeftBorder : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <Collapsible
                    onToggle={() => toggleAccordion(index)}
                    open={activeAccordion === index}
                  >
                    <CollapsibleToggler
                      className={[
                        classes.collapsibleToggler,
                        activeAccordion === index ? classes.activeItem : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className={classes.togglerTitle}>{item.mediaLabel}</div>
                      <ChevronDownIcon
                        className={[
                          classes.chevronDownIcon,
                          activeAccordion === index ? classes.rotateChevron : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      />
                    </CollapsibleToggler>
                    <CollapsibleContent className={classes.collapsibleContent}>
                      <div className={classes.contentWrapper}>
                        <RichText
                          className={classes.mediaDescription}
                          content={item.mediaDescription}
                        />
                        {item.enableLink && item.link && (
                          <CMSLink
                            data={{ ...item.link }}
                            look={{
                              theme: 'light',
                              type: 'button',
                              size: 'medium',
                              width: 'normal',
                              variant: 'blocks',
                              icon: {
                                content: <ChevronRightIcon strokeWidth={1.25} />,
                                iconPosition: 'right',
                              },
                            }}
                          />

                          // <CMSLink className={classes.link} {...item.link}>
                          //   <ArrowRightIcon className={classes.arrowIcon} />
                          // </CMSLink>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))}
          </CollapsibleGroup>
        </div>
      </div>
    </div>
  )
}
```

# \_blocks/MediaContentAccordion/Desktop/index.tsx

```tsx
import React, { createRef, Fragment, useEffect, useRef, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleToggler,
} from '@faceless-ui/collapsibles'
import Image from 'next/image'

import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { CMSLink } from '@app/_components/CMSLink'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import SplitAnimate from '@app/_components/SplitAnimate'
import { ArrowRightIcon } from '@app/_icons/ArrowRightIcon'
import { ChevronDownIcon } from '@app/_icons/ChevronDownIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type MediaContentAccordionProps = Extract<
//   Page['layout'][0],
//   { blockType: 'mediaContentAccordion' }
// > & {
//   className?: string
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
export type MediaContentAccordionProps = ExtractBlockProps<'mediaContentAccordion'> & {
  className?: string
}

export const DesktopMediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  mediaContentAccordionFields,
  className,
}) => {
  const { alignment, leader, heading, accordion } = mediaContentAccordionFields || {}

  const mediaRefs = useRef<Array<React.RefObject<HTMLDivElement>>>([])
  const [containerHeight, setContainerHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const hasAccordion = Array.isArray(accordion) && accordion.length > 0
  const [activeAccordion, setActiveAccordion] = useState<number>(0)

  const toggleAccordion = (index: number) => {
    setActiveAccordion(index)
  }

  if (accordion && accordion.length > 0 && mediaRefs.current.length !== accordion.length) {
    mediaRefs.current = accordion.map((_: any, i: any) => mediaRefs.current[i] || createRef())
  }

  useEffect(() => {
    const updateContainerHeight = () => {
      const activeMediaRef = mediaRefs.current[activeAccordion]
      if (activeMediaRef && activeMediaRef.current) {
        const activeMediaHeight = activeMediaRef.current.offsetHeight
        setContainerHeight(activeMediaHeight)
      }
    }

    const updateContentWidth = () => {
      const newContentWidth = contentRef.current ? contentRef.current.offsetWidth : 0
      setContentWidth(newContentWidth)
    }

    updateContainerHeight()
    updateContentWidth()

    const resizeObserver = new ResizeObserver((entries) => {
      updateContainerHeight()
      updateContentWidth()
    })

    const activeMediaRef = mediaRefs.current[activeAccordion]
    if (activeMediaRef && activeMediaRef.current) {
      resizeObserver.observe(activeMediaRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [activeAccordion])

  const rightPositionClassMap = {
    normal: 'start-9 cols-8 start-m-1 cols-m-8',
    inset: 'start-10 cols-6 start-m-1 cols-m-8',
    wide: 'start-7 cols-12 start-m-1 cols-m-8',
  }

  const leftPositionClassMap = {
    normal: 'start-1 cols-8 start-m-1 cols-m-8',
    inset: 'start-2 cols-6 start-m-1 cols-m-8',
    wide: 'start-1 cols-12 start-m-1 cols-m-8',
  }

  return (
    <div
      className={[classes.desktopAccordionWrapper, 'grid', className && className]
        .filter(Boolean)
        .join(' ')}
    >
      {alignment === 'mediaContent' ? (
        <React.Fragment>
          {hasAccordion &&
            accordion.map((item: any, index: any) => (
              <React.Fragment key={item.id || index}>
                {index === activeAccordion && (
                  <React.Fragment>
                    {item.background === 'gradient' && (
                      <div
                        className={[
                          classes.gradientDesktopWrapper,
                          'start-1 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <Image
                          alt=""
                          className={classes.gradientBg}
                          width={1920}
                          height={946}
                          src={`/images/gradients/1.jpg`}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </div>
                    )}
                    {item.background === 'scanlines' && (
                      <div
                        className={[
                          classes.scanlineDesktopWrapper,
                          'start-1 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        {/* <BackgroundScanline
                          className={[classes.scanlineDesktop].filter(Boolean).join(' ')}
                        /> */}
                        <CrosshairIcon
                          className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                        />
                        <CrosshairIcon
                          className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                        />
                      </div>
                    )}
                    {item.background === 'none' && (
                      <div
                        className={[
                          classes.transparentDesktopWrapper,
                          'start-1 cols-8 start-m-1 cols-m-8',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{ height: `calc(${containerHeight}px + 8rem)` }}
                      >
                        <div className={classes.transparentBg} />
                      </div>
                    )}
                  </React.Fragment>
                )}
                <div
                  ref={mediaRefs.current[index]}
                  className={[
                    classes.mediaDesktopContainer,
                    leftPositionClassMap[item.position as keyof typeof leftPositionClassMap],
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    opacity: index === activeAccordion ? 1 : 0,
                    width: '100%',
                    left: item.position === 'wide' ? `calc(-1 * ${contentWidth}px / 2)` : '0px',
                  }}
                >
                  {typeof item.media === 'object' && item.media !== null && (
                    <Media resource={item.media} />
                  )}
                </div>
              </React.Fragment>
            ))}
          <div ref={contentRef} className={['cols-4 start-13 cols-m-8'].filter(Boolean).join(' ')}>
            <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
              {leader && <div className={classes.leader}>{leader}</div>}
              {heading && (
                <h3 className={classes.heading}>
                  <SplitAnimate text={heading} />
                </h3>
              )}
            </div>
            <div>
              <CollapsibleGroup allowMultiple={false} transTime={500} transCurve="ease-in-out">
                {hasAccordion &&
                  accordion.map((item: any, index: any) => (
                    <div
                      key={item.id || index}
                      className={[
                        classes.collapsibleWrapper,
                        activeAccordion === index ? classes.activeLeftBorder : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <Collapsible
                        onToggle={() => toggleAccordion(index)}
                        open={activeAccordion === index}
                      >
                        <CollapsibleToggler
                          className={[
                            classes.collapsibleToggler,
                            activeAccordion === index ? classes.activeItem : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => toggleAccordion(index)}
                        >
                          <div className={classes.togglerTitle}>{item.mediaLabel}</div>
                          <ChevronDownIcon
                            className={[
                              classes.chevronDownIcon,
                              activeAccordion === index ? classes.rotateChevron : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </CollapsibleToggler>
                        <CollapsibleContent className={classes.collapsibleContent}>
                          <div className={classes.contentWrapper}>
                            <RichText
                              className={classes.mediaDescription}
                              content={item.mediaDescription}
                            />
                            {item.enableLink && item.link && (
                              <CMSLink
                                data={{ ...item.link }}
                                look={{
                                  theme: 'light',
                                  type: 'button',
                                  size: 'medium',
                                  width: 'normal',
                                  variant: 'blocks',
                                  icon: {
                                    content: <ChevronRightIcon strokeWidth={1.25} />,
                                    iconPosition: 'right',
                                  },
                                }}
                              />
                              // <CMSLink className={classes.link} {...item.link}>
                              //   <ArrowRightIcon className={classes.arrowIcon} />
                              // </CMSLink>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
              </CollapsibleGroup>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div ref={contentRef} className={['cols-4 start-1 cols-m-8'].filter(Boolean).join(' ')}>
            <div className={[classes.introWrapper].filter(Boolean).join(' ')}>
              {leader && <div className={classes.leader}>{leader}</div>}
              {heading && (
                <h3 className={classes.heading}>
                  <SplitAnimate text={heading} />
                </h3>
              )}
            </div>
            <div>
              <CollapsibleGroup allowMultiple={false} transTime={500} transCurve="ease-in-out">
                {hasAccordion &&
                  accordion.map((item: any, index: any) => (
                    <div
                      key={item.id || index}
                      className={[
                        classes.collapsibleWrapper,
                        activeAccordion === index ? classes.activeLeftBorder : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <Collapsible
                        onToggle={() => toggleAccordion(index)}
                        open={activeAccordion === index}
                      >
                        <CollapsibleToggler
                          className={[
                            classes.collapsibleToggler,
                            activeAccordion === index ? classes.activeItem : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => toggleAccordion(index)}
                        >
                          <div className={classes.togglerTitle}>{item.mediaLabel}</div>
                          <ChevronDownIcon
                            className={[
                              classes.chevronDownIcon,
                              activeAccordion === index ? classes.rotateChevron : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </CollapsibleToggler>
                        <CollapsibleContent className={classes.collapsibleContent}>
                          <div className={classes.contentWrapper}>
                            <RichText
                              className={classes.mediaDescription}
                              content={item.mediaDescription}
                            />
                            {item.enableLink && item.link && (
                              <CMSLink
                                data={{ ...item.link }}
                                look={{
                                  theme: 'light',
                                  type: 'button',
                                  size: 'medium',
                                  width: 'normal',
                                  variant: 'blocks',
                                  icon: {
                                    content: <ChevronRightIcon strokeWidth={1.25} />,
                                    iconPosition: 'right',
                                  },
                                }}
                              />

                              // <CMSLink className={classes.link} {...item.link}>
                              //   <ArrowRightIcon className={classes.arrowIcon} />
                              // </CMSLink>
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
              </CollapsibleGroup>
            </div>
          </div>
          {hasAccordion &&
            accordion.map((item: any, index: any) => {
              // console.log('accordion --', accordion)
              return (
                <React.Fragment key={item.id || index}>
                  {index === activeAccordion && (
                    <React.Fragment>
                      {item.background === 'gradient' && (
                        <div
                          className={[
                            classes.gradientDesktopWrapper,
                            'start-9 cols-8 start-m-1 cols-m-8',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{ height: `calc(${containerHeight}px + 8rem)` }}
                        >
                          <Image
                            alt=""
                            className={classes.gradientBg}
                            width={1920}
                            height={946}
                            src={`/images/gradients/1.jpg`}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                          />
                        </div>
                      )}
                      {item.background === 'scanlines' && (
                        <div
                          className={[
                            classes.scanlineDesktopWrapper,
                            'start-9 cols-8 start-m-1 cols-m-8',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{ height: `calc(${containerHeight}px + 8rem)` }}
                        >
                          <BackgroundScanline
                            className={[classes.scanlineDesktop].filter(Boolean).join(' ')}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairTopOne].filter(Boolean).join(' ')}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairTopTwo].filter(Boolean).join(' ')}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairBottomOne].filter(Boolean).join(' ')}
                          />
                          <CrosshairIcon
                            className={[classes.crosshairBottomTwo].filter(Boolean).join(' ')}
                          />
                        </div>
                      )}
                      {item.background === 'none' && (
                        <div
                          className={[
                            classes.transparentDesktopWrapper,
                            'start-9 cols-8 start-m-1 cols-m-8',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{ height: `calc(${containerHeight}px + 8rem)` }}
                        >
                          <div className={classes.transparentBg} />
                        </div>
                      )}
                    </React.Fragment>
                  )}
                  <div
                    ref={mediaRefs.current[index]}
                    className={[
                      classes.mediaDesktopContainer,
                      rightPositionClassMap[item.position as keyof typeof rightPositionClassMap],
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{
                      opacity: index === activeAccordion ? 1 : 0,
                      width:
                        item.position === 'wide' ? `calc(100% + ${contentWidth}px / 2)` : '100%',
                    }}
                  >
                    {typeof item.media === 'object' && item.media !== null && (
                      <Media resource={item.media} />
                    )}
                  </div>
                </React.Fragment>
              )
            })}
        </React.Fragment>
      )}
    </div>
  )
}
```

# \_blocks/Order/ReceiversGrid/index.tsx

```tsx
'use client'

import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useOrder } from '@app/_providers/Order'
import { MapPinIcon, MessageSquareTextIcon, SendIcon, UserIcon, UsersIcon } from 'lucide-react'
import { AddReceiverButton, CopyReceiverIcon, RemoveReceiverIcon } from './ReceiverActions'
import { addressAutocomplete } from './addressAutocomplete'
import { debounce, update } from 'lodash'
import { Order, Product } from '@/payload-types'
import { Field, Label, Switch } from '@headlessui/react'
import { Radio, RadioGroup } from '@headlessui/react'
import cn from '@/utilities/cn'

const shippingOptions = [
  { name: 'Standard Mail', value: 'standardMail', productType: 'card', cost: true },
  { name: 'Express Mail', value: 'expressMail', productType: 'card', cost: true },
  { name: 'Standard Parcel', value: 'standardParcel', productType: 'gift', cost: true },
  { name: 'Express Parcel', value: 'expressParcel', productType: 'gift', cost: true },
]

interface Receiver {
  id: string
  message: string
  name: string
  delivery: {
    address?: {
      formattedAddress?: string | null
      addressLine1?: string | null
      addressLine2?: string | null
      json?:
        | {
            [k: string]: unknown
          }
        | unknown[]
        | string
        | number
        | boolean
        | null
    }
    shippingMethod: ShippingMethod
  }
  totals: {
    cost: number
    shipping: number
    subTotal: number
  }
  errors: JSON
}

interface OrderItem {
  id: string
  product: Product
  receivers: Receiver[]
}

interface ValidationErrors {
  name?: string
  message?: string
  formattedAddress?: string
  addressLine1?: string
  shippingMethod?: string
}

type ShippingMethod = 'standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

export const ReceiversGrid: React.FC<{ item: OrderItem }> = ({ item }) => {
  const { order, updateReceiver, removeReceiver } = useOrder()

  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<{ [key: string]: JSON }>({})
  const [names, setNames] = useState<{ [key: string]: string }>({})
  const [messages, setMessages] = useState<{ [key: string]: string }>({})
  const [poBoxFlags, setPoBoxFlags] = useState<{ [key: string]: boolean }>({})
  const [addressesLine1, setLine1Addresses] = useState<{ [key: string]: string }>({})
  const [formattedAddresses, setFormattedAddresses] = useState<{ [key: string]: string }>({})
  const [addressSuggestions, setAddressSuggestions] = useState<{ [key: string]: any[] }>({})
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: ValidationErrors }>({})

  const [selectedShipping, setSelectedShipping] = useState<{
    [key: string]: (typeof shippingOptions)[0]
  }>(() => {
    const initialShipping: { [key: string]: (typeof shippingOptions)[0] } = {}
    item.receivers?.forEach((receiver) => {
      let selectedOption: (typeof shippingOptions)[0]
      if (receiver.delivery?.shippingMethod) {
        selectedOption =
          shippingOptions.find((option) => option.value === receiver.delivery?.shippingMethod) ||
          shippingOptions[0]
      } else {
        selectedOption =
          item.product.productType === 'gift'
            ? shippingOptions.find((option) => option.value === 'standardParcel') ||
              shippingOptions[2]
            : shippingOptions.find((option) => option.value === 'standardMail') ||
              shippingOptions[0]
      }
      initialShipping[receiver.id] = selectedOption
    })
    return initialShipping
  })

  const validateReceiver = useCallback(
    (receiver: Receiver, poBoxFlag: boolean): ValidationErrors => {
      const errors: ValidationErrors = {}

      if (!receiver.name) {
        errors.name = 'Name is required'
      } else if (receiver.name.length < 2) {
        errors.name = 'Name must be at least 2 characters long'
      } else if (receiver.name.length > 100) {
        errors.name = 'Name must be at most 100 characters long'
      } else if (!/^[a-zA-Z\s'-]+$/.test(receiver.name)) {
        errors.name = 'Name contains invalid characters'
      }

      if (!receiver.message) {
        errors.message = 'Message is required'
      }
      //  else if (receiver.message.split(/\s+/).length < 60) {
      //   errors.message = 'Message must be at least 60 words'
      // }
      else if (!/^[a-zA-Z0-9\s.,!?'-]+$/.test(receiver.message)) {
        errors.message = 'Message contains invalid characters'
      }

      if (!receiver.delivery?.address?.formattedAddress) {
        errors.formattedAddress = 'Address is required'
      } else if (!receiver.delivery?.address?.json) {
        errors.formattedAddress = 'Please select an address from the suggestions'
      }

      if (poBoxFlag && !receiver.delivery?.address?.addressLine1) {
        errors.addressLine1 = 'PO Box / Parcel Collect details are required'
      }

      if (!receiver.delivery?.shippingMethod) {
        errors.shippingMethod = 'Shipping method is required'
      }

      return errors
    },
    [],
  )

  useEffect(() => {
    const newValidationErrors: { [key: string]: ValidationErrors } = {}
    item.receivers?.forEach((receiver) => {
      newValidationErrors[receiver.id] = validateReceiver(
        receiver,
        poBoxFlags[receiver.id] || false,
      )
    })
    setValidationErrors(newValidationErrors)
  }, [item.receivers, poBoxFlags, validateReceiver])

  useEffect(() => {
    const currentItem = order.items?.find((orderItem) => orderItem.id === item.id)
    // console.log('Current Item in Cart:', currentItem)
  }, [order, item.id])

  useEffect(() => {
    const initialErrors: { [key: string]: JSON } = {}
    const initialNames: { [key: string]: string } = {}
    const initialMessages: { [key: string]: string } = {}

    const initialPoBoxFlags: { [key: string]: boolean } = {}
    const initialLine1Addresses: { [key: string]: string } = {}
    const initialFormattedAddresses: { [key: string]: string } = {}

    const initialShipping: { [key: string]: (typeof shippingOptions)[0] } = {}

    item.receivers?.forEach((receiver) => {
      initialErrors[receiver.id] = receiver.errors || {}
      initialNames[receiver.id] = receiver.name || ''
      initialMessages[receiver.id] = receiver.message || ''
      initialLine1Addresses[receiver.id] = receiver.delivery?.address?.addressLine1 || ''
      initialFormattedAddresses[receiver.id] = receiver.delivery?.address?.formattedAddress || ''

      let selectedOption: (typeof shippingOptions)[0]
      if (receiver.delivery?.shippingMethod) {
        selectedOption =
          shippingOptions.find((option) => option.value === receiver.delivery?.shippingMethod) ||
          shippingOptions[0]
      } else {
        selectedOption =
          item.product.productType === 'gift'
            ? shippingOptions.find((option) => option.value === 'standardParcel') ||
              shippingOptions[2]
            : shippingOptions.find((option) => option.value === 'standardMail') ||
              shippingOptions[0]
      }
      initialShipping[receiver.id] = selectedOption
    })

    setErrors(initialErrors)
    setNames(initialNames)
    setMessages(initialMessages)
    setLine1Addresses(initialLine1Addresses)
    setFormattedAddresses(initialFormattedAddresses)
    setSelectedShipping(initialShipping)

    // Initialize poBoxFlags only if it's empty
    setPoBoxFlags((prev) => {
      if (Object.keys(prev).length === 0) {
        const initialPoBoxFlags: { [key: string]: boolean } = {}
        item.receivers?.forEach((receiver) => {
          initialPoBoxFlags[receiver.id] = !!receiver.delivery?.address?.addressLine1
        })
        return initialPoBoxFlags
      }
      return prev
    })
  }, [item.receivers, item.product.productType])

  const debouncedAddressInput = useCallback(
    debounce(async (receiverId: string, value: string) => {
      try {
        const suggestions = await addressAutocomplete(value)
        setAddressSuggestions((prev) => ({ ...prev, [receiverId]: suggestions }))
      } catch (error) {
        console.error('Error fetching address suggestions:', error)
        setAddressSuggestions((prev) => ({ ...prev, [receiverId]: [] }))
      }
    }, 300),
    [],
  )

  const handleNameChange = (receiverId: string, value: string) => {
    setNames((prev) => ({ ...prev, [receiverId]: value }))
    updateReceiver(item.product.id, receiverId, { name: value })
  }

  const handleMessageChange = (receiverId: string, value: string) => {
    setMessages((prev) => ({ ...prev, [receiverId]: value }))
    updateReceiver(item.product.id, receiverId, { message: value })
  }

  const handleFormattedAddressChange = (receiverId: string, value: string) => {
    setFormattedAddresses((prev) => ({
      ...prev,
      [receiverId]: value,
    }))
    debouncedAddressInput(receiverId, value)
  }

  const clearSuggestionsForReceiver = (receiverId: string) => {
    setAddressSuggestions((prev) => ({
      ...prev,
      [receiverId]: [],
    }))
  }

  if (!item) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 px-3 pt-6 sm:px-6 md:px-6">
      {item.receivers?.map((receiver: Receiver, index: number) => (
        <div
          key={receiver.id}
          className="relative flex flex-col justify-between rounded-sm border border-solid hover:shadow-xl hover:delay-75 duration-150 p-6 aspect-square"
        >
          <div className="space-y-8 sm:space-y-10">
            {/* heading / title / actions */}
            <div className="flex flex-row justify-between items-center">
              <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
                {`#${(index + 1).toString().padStart(2, '0')}`}
              </span>
              <div className="flex justify-end items-center gap-x-4 sm:gap-x-3">
                <CopyReceiverIcon
                  orderItemId={item.product.id}
                  receiverId={receiver.id}
                  // className="h-8 w-8 sm:h-6 sm:w-6"
                />
                <RemoveReceiverIcon
                  orderItemId={item.product.id}
                  receiverId={receiver.id}
                  removeReceiver={removeReceiver}
                  // className="h-8 w-8 sm:h-6 sm:w-6"
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* receiver */}
              <div>
                <label
                  htmlFor={`name-${receiver.id}`}
                  className="block text-sm font-medium text-gray-900"
                >
                  <UserIcon className="inline-block mr-1 h-5 w-5 text-gray-400" strokeWidth={1.2} />
                  Name
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`A full name and any business name helps with delivery`}
                </span>
                <input
                  id={`name-${receiver.id}`}
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={names[receiver.id] || ''}
                  className={cn(
                    'mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                    validationErrors[receiver.id]?.name && 'border-red-500',
                  )}
                  onChange={(e) => handleNameChange(receiver.id, e.target.value)}
                  aria-invalid={!!validationErrors[receiver.id]?.name}
                  aria-describedby={
                    validationErrors[receiver.id]?.name ? `name-error-${receiver.id}` : undefined
                  }
                />
                {validationErrors[receiver.id]?.name && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`name-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].name}
                  </span>
                )}
              </div>

              {/* message */}
              <div>
                <label
                  htmlFor={`message-${receiver.id}`}
                  className="block text-sm font-medium text-gray-900"
                >
                  <MessageSquareTextIcon
                    className="inline-block mr-1 h-5 w-5 text-gray-400"
                    strokeWidth={1.2}
                  />
                  Message
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`Write a personal message for the recipient (60-100 words)`}
                </span>
                <textarea
                  id={`message-${receiver.id}`}
                  name="message"
                  value={messages[receiver.id] || ''}
                  maxLength={400}
                  rows={5}
                  placeholder="Add a message with your thankly here..."
                  className={cn(
                    'font-body mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                    validationErrors[receiver.id]?.message && 'border-red-500',
                  )}
                  onChange={(e) => handleMessageChange(receiver.id, e.target.value)}
                  aria-invalid={!!validationErrors[receiver.id]?.message}
                  aria-describedby={
                    validationErrors[receiver.id]?.message
                      ? `message-error-${receiver.id}`
                      : undefined
                  }
                />
                {validationErrors[receiver.id]?.message && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`message-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].message}
                  </span>
                )}
              </div>

              {/* address */}
              <div>
                <label
                  htmlFor={`address-${receiver.id}`}
                  className="block text-sm font-medium text-gray-900"
                >
                  <MapPinIcon
                    className="inline-block mr-1 h-5 w-5 text-gray-400"
                    strokeWidth={1.2}
                  />
                  Address
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`Provide the complete shipping address. `}
                </span>

                <Field className="flex items-center py-2">
                  <Switch
                    checked={poBoxFlags[receiver.id] ?? false}
                    onChange={() => {
                      setPoBoxFlags((prev) => {
                        const newState = { ...prev, [receiver.id]: !prev[receiver.id] }
                        updateReceiver(item.product.id, receiver.id, {
                          delivery: {
                            address: {
                              ...receiver.delivery?.address,
                              addressLine1: newState[receiver.id] ? '' : null,
                            },
                          },
                        })
                        return newState
                      })
                    }}
                    className="group relative inline-flex h-5 w-10 sm:h-5 sm:w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 data-[checked]:bg-green"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-4.5 w-4 sm:h-4.5 sm:w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4 sm:group-data-[checked]:translate-x-3.5"
                    />
                  </Switch>
                  <Label as="span" className="ml-3 text-xs">
                    <span className="font-semibold text-gray-500">{` Sending to AusPost Parcel Collect / Locker / PO Box?`}</span>{' '}
                  </Label>
                </Field>

                {(poBoxFlags[receiver.id] || addressesLine1[receiver.id]) && (
                  <>
                    <input
                      id={`addressLine1-${receiver.id}`}
                      name="addressLine1"
                      type="text"
                      placeholder="Parcel Collect / Locker / PO Box"
                      value={addressesLine1[receiver.id] || ''}
                      onChange={(e) => {
                        const newAddressLine1 = e.target.value
                        setLine1Addresses((prev) => ({
                          ...prev,
                          [receiver.id]: newAddressLine1,
                        }))
                        updateReceiver(item.product.id, receiver.id, {
                          delivery: {
                            address: {
                              ...receiver.delivery?.address,
                              addressLine1: newAddressLine1,
                            },
                          },
                        })
                      }}
                      className={cn(
                        'block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                        validationErrors[receiver.id]?.addressLine1 && 'border-red-500',
                      )}
                      aria-invalid={!!validationErrors[receiver.id]?.addressLine1}
                      aria-describedby={
                        validationErrors[receiver.id]?.addressLine1
                          ? `addressLine1-error-${receiver.id}`
                          : undefined
                      }
                    />
                    {validationErrors[receiver.id]?.addressLine1 && (
                      <span
                        className="block mt-1 text-sm text-red-600"
                        id={`addressLine1-error-${receiver.id}`}
                      >
                        {validationErrors[receiver.id].addressLine1}
                      </span>
                    )}
                  </>
                )}
                <input
                  id={`address-${receiver.id}`}
                  name="formattedAddress"
                  type="text"
                  value={formattedAddresses[receiver.id] || ''}
                  placeholder="Enter street address"
                  onChange={(e) => handleFormattedAddressChange(receiver.id, e.target.value)}
                  className={cn(
                    'mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                    validationErrors[receiver.id]?.formattedAddress && 'border-red-500',
                  )}
                  aria-invalid={!!validationErrors[receiver.id]?.formattedAddress}
                  aria-describedby={
                    validationErrors[receiver.id]?.formattedAddress
                      ? `address-error-${receiver.id}`
                      : undefined
                  }
                />
                {validationErrors[receiver.id]?.formattedAddress && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`address-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].formattedAddress}
                  </span>
                )}
                {addressSuggestions[receiver.id]?.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {addressSuggestions[receiver.id].map((suggestion, index) => (
                      <div
                        key={index}
                        className="relative cursor-default select-none py-3 sm:py-2 px-4 sm:px-3 text-gray-900 hover:bg-green/75 hover:text-white"
                        onClick={debounce(() => {
                          // console.log('addressLine2 updated -- ', suggestion.formattedAddress)
                          startTransition(() => {
                            try {
                              updateReceiver(item.product.id, receiver.id, {
                                delivery: {
                                  address: {
                                    ...receiver.delivery?.address,
                                    addressLine2: suggestion.formattedAddress,
                                    formattedAddress: suggestion.formattedAddress,
                                    json: suggestion,
                                  },
                                },
                              })
                              setFormattedAddresses((prev) => ({
                                ...prev,
                                [receiver.id]: suggestion.formattedAddress,
                              }))
                              clearSuggestionsForReceiver(receiver.id)
                            } catch (error) {
                              console.error('Error saving address:', error)
                            }
                          })
                        }, 200)}
                      >
                        <MapPinIcon className="inline-block h-5 w-5 text-gray-400 mr-2" />
                        {suggestion.addressLabel}, {suggestion.city}, {suggestion.state}{' '}
                        {suggestion.postalCode}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* shipping method */}
              <div>
                <label
                  htmlFor="shipping-method"
                  className="block text-sm font-medium text-gray-900"
                >
                  <SendIcon className="inline-block mr-1 h-5 w-5 text-gray-400" strokeWidth={1.2} />
                  Shipping
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`Choose your preferred shipping method. FREE shipping for orders over $150.
        Discount applied at checkout.`}
                </span>

                <RadioGroup
                  value={selectedShipping[receiver.id] || shippingOptions[0]}
                  onChange={(selected) => {
                    setSelectedShipping((prev) => ({
                      ...prev,
                      [receiver.id]: selected,
                    }))
                    updateReceiver(item.product.id, receiver.id, {
                      delivery: {
                        shippingMethod: selected.value as ShippingMethod,
                      },
                    })
                  }}
                  className={cn(
                    'mt-2 grid grid-cols-2 gap-3 sm:grid-cols-2 leading-tighter',
                    validationErrors[receiver.id]?.shippingMethod && 'border-red-500',
                  )}
                >
                  {shippingOptions
                    .filter((option) => option.productType === item.product.productType)
                    .map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        className={cn(
                          'cursor-pointer focus:outline-none leading-tighter',
                          'flex items-center justify-center rounded-md bg-white px-3 py-3 text-sm  text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 data-[checked]:bg-green data-[checked]:text-white data-[checked]:ring-0 data-[focus]:data-[checked]:ring-2 data-[focus]:ring-2 data-[focus]:ring-green data-[focus]:ring-offset-2 data-[checked]:hover:bg-green sm:flex-1 [&:not([data-focus],[data-checked])]:ring-inset',
                        )}
                      >
                        {option.name}
                      </Radio>
                    ))}
                </RadioGroup>
                {validationErrors[receiver.id]?.shippingMethod && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`shipping-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].shippingMethod}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 text-right">
            <div>
              <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                {`Cost: ${
                  receiver.totals.cost.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }) || 0
                }`}
              </span>
            </div>
            <div>
              <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                {`Shipping: ${
                  receiver.totals.shipping
                    ? receiver.totals.shipping?.toLocaleString('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                    : '(needs address)'
                }`}
              </span>
            </div>
            <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
              {`Subtotal: ${
                receiver.totals.subTotal.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }) || 0
              }`}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

# \_blocks/Order/ReceiversGrid/addressAutocomplete.ts

```ts
'use server'

import { revalidatePath } from 'next/cache'

export async function addressAutocomplete(query: string, countryCode: string = 'AU') {
  if (!query || query.length < 2) {
    return []
  }

  try {
    const response = await fetch(
      `https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(query)}&country=${countryCode}`,
      {
        headers: { Authorization: process.env.RADAR_LIVE_SECRET as string },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Radar API')
    }

    const data = await response.json()
    revalidatePath('/shop/cart') // Adjust this path as needed
    return data.addresses || []
  } catch (error) {
    console.error('Error fetching address suggestions:', error)
    return []
  }
}
```

# \_blocks/Order/ReceiversGrid/ReceiverActions.tsx

```tsx
'use client'

import React, { useState, useTransition } from 'react'

import { CMSLink } from '@app/_components/CMSLink'
import { CopyIcon, TrashIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { useOrder } from '@app/_providers/Order'
import { OrderItem } from '@app/_providers/Order/reducer'
import { useRouter } from 'next/navigation'

interface AddReceiverButtonProps {
  productId: number | string
}

export const AddReceiverButton: React.FC<AddReceiverButtonProps> = ({ productId }) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { addReceiver, order } = useOrder()

  const handleClick = () => {
    startTransition(() => {
      const orderItem = order.items?.find(
        (item) => typeof item.product === 'object' && item.product.id === productId,
      )
      const productType =
        typeof orderItem?.product === 'object' ? orderItem.product.productType : null

      const defaultShippingMethod =
        productType === 'gift' ? 'standardParcel' : productType === 'card' ? 'standardMail' : null

      const newReceiver: NonNullable<OrderItem['receivers']>[number] = {
        id: `${Date.now()}`,
        name: null,
        message: null,
        delivery: {
          address: { addressLine1: null },
          shippingMethod: defaultShippingMethod,
        },
        totals: { subTotal: 0, cost: 0, shipping: 0 },
      }

      try {
        addReceiver(productId, newReceiver)
        setError(null)
      } catch (error) {
        console.error('Error adding receiver:', error)
        setError('Failed to add receiver. Please try again.')
      }
    })
  }

  return (
    <>
      <CMSLink
        data={{
          label: 'Add Receiver',
        }}
        look={{
          theme: 'light',
          type: 'button',
          size: 'small',
          width: 'narrow',
          variant: 'blocks',
          icon: {
            content: <UserPlusIcon strokeWidth={1.25} />,
            iconPosition: 'right',
          },
        }}
        actions={{
          onClick: handleClick,
        }}
        pending={isPending}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </>
  )
}

interface CopyReceiverIconProps {
  orderItemId: string | number
  receiverId: string
}
export const CopyReceiverIcon: React.FC<CopyReceiverIconProps> = ({ orderItemId, receiverId }) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { copyReceiver } = useOrder()

  const handleClick = () => {
    startTransition(() => {
      try {
        copyReceiver(orderItemId, receiverId)
        setError(null)
      } catch (error) {
        console.error('Error copying receiver:', error)
        setError('Failed to copy receiver. Please try again.')
      }
    })
  }

  return (
    <div className="relative">
      <CopyIcon
        className={`h-5 w-5 sm:h-5 sm:w-5 cursor-pointer hover:text-green transition-colors duration-200 ${
          isPending ? 'opacity-50' : ''
        }`}
        aria-hidden="true"
        strokeWidth={1.4}
        onClick={handleClick}
      />
    </div>
  )
}

interface RemoveReceiverIconProps {
  orderItemId: string | number // Changed from just string to string | number
  receiverId: string
  removeReceiver: (productId: string | number, receiverId: string) => void // Matches OrderContext
}

export const RemoveReceiverIcon: React.FC<RemoveReceiverIconProps> = ({
  orderItemId,
  receiverId,
  removeReceiver,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      removeReceiver(orderItemId, receiverId)
    })
  }

  return (
    <XIcon
      className={`h-5 w-5 sm:h-5 sm:w-5  cursor-pointer hover:text-green hover:animate-pulse ${
        isPending ? 'opacity-50' : ''
      }`}
      aria-hidden="true"
      strokeWidth={1.4}
      onClick={handleClick}
    />
  )
}

interface RemoveProductButtonProps {
  orderItemId: string | number
}

export const RemoveProductButton: React.FC<RemoveProductButtonProps> = ({ orderItemId }) => {
  const [isPending, startTransition] = useTransition()
  const { removeProduct } = useOrder()
  const router = useRouter()

  const handleClick = () => {
    startTransition(() => {
      removeProduct(orderItemId)
      router.refresh()
      // router.push('/shop/cart')
    })
  }

  return (
    <CMSLink
      data={{
        label: 'Remove Thankly',
      }}
      look={{
        theme: 'light',
        type: 'button',
        size: 'small',
        width: 'narrow',
        variant: 'blocks',
        icon: {
          content: <TrashIcon strokeWidth={1.25} />,
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleClick,
      }}
      pending={isPending}
    />
  )
}
```

# \_blocks/Order/OrderSummary/index.tsx

```tsx
import React, { useEffect, useState, useTransition } from 'react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import {
  DollarSignIcon,
  ChevronUpIcon,
  MailWarningIcon,
  SmileIcon,
  XIcon,
  ArrowLeftIcon,
} from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Order } from '@/payload-types'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { useRouter } from 'next/navigation'
import { useOrder } from '@app/_providers/Order'
import { LoaderCircleIcon } from 'lucide-react'
import { FullLogo } from '@app/_graphics/FullLogo'
import { orderText } from '@/utilities/refData'

export const OrderSummary: React.FC<{ order: Order }> = ({ order }) => {
  if (!order || !order.totals) {
    return null // or return a loading state or placeholder
  }

  const router = useRouter()
  const { validateOrder } = useOrder()
  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const { clearOrder } = useOrder()

  const [billingAddress, setBillingAddress] = useState({
    formattedAddress: '',
    addressLine1: '',
    addressLine2: '',
  })

  useEffect(() => {
    const orderValidity = validateOrder()
    setIsValid(orderValidity)
    setValidationMessage(
      orderValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [order, validateOrder])

  const handleCheckout = async (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (event) {
      event.preventDefault()
    }

    if (isValid) {
      setIsProcessing(true)
      // console.log(`Cart is valid, let's create a draft order...`)

      try {
        // Simulate API call or any async operation
        // await new Promise((resolve) => setTimeout(resolve, 2000))
        router.push(`/shop/checkout`)
      } catch (error) {
        console.error('Error during checkout:', error)
        setIsProcessing(false)
        alert('An error occurred during checkout. Please try again.')
      }
    } else {
      // console.log('Cart is invalid, errors should be displayed')
      alert(validationMessage)
    }
  }

  return (
    <div id="summary-heading" className="scroll-py-28 scroll-mt-24 basis-1/2">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} mb-6`}>Order Summary</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {`Total (inc. taxes)`}
          </dt>
          <dd className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {(order.totals.total + (order.totals.discount || 0)).toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text].join(' ')}>Thanklys</dt>
          <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
            {order.totals.cost.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text].join(' ')}>{`+ Shipping`}</dt>
          <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
            {order.totals.shipping?.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        {(order.totals.discount || 0) < 0 && (
          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>
              <SmileIcon />
              {` Your order is over $150 so Shipping is on us!`}
            </dt>
            <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
              {`(${order.totals.discount?.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })})`}
            </dd>
          </div>
        )}
      </div>

      <div className="mt-4 lg:mt-8 p-4 lg:p-0">
        {!isValid && <div className="text-red-500 mt-2 text-sm">{validationMessage}</div>}

        {/* Notices */}
        <div className={cn(contentFormats.global, contentFormats.text, `!mt-0 text-sm py-4`)}>
          <React.Fragment>
            <MailWarningIcon className="mr-2" />
            <span className="font-semibold">{`Thankly Cards: `}</span>
            <span className={[contentFormats.text, `text-sm`].join(' ')}>
              {orderText.shippingMessage}
              <Link
                className={[contentFormats.global, contentFormats.a, `!text-sm`].join(' ')}
                href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                target="_blank"
              >
                Learn More
              </Link>
            </span>
          </React.Fragment>
        </div>
        <CMSLink
          className={`block #py-6 w-full ${isValid ? '!bg-green' : '!bg-gray-400'} !text-white`}
          data={{
            label: 'Checkout',
            type: 'custom',
            url: `/shop/checkout`,
          }}
          look={{
            theme: 'dark',
            type: 'button',
            size: 'medium',
            width: 'narrow',
            variant: 'blocks',
            icon: {
              content: <DollarSignIcon strokeWidth={1.25} />,
              iconPosition: 'right',
            },
          }}
          actions={{ onClick: handleCheckout }}
          pending={isProcessing}
        />

        <div className="flex flex-row gap-4 py-3">
          <CMSLink
            data={{
              label: !isPending ? 'Clear Cart' : 'Clearing Cart... please wait',
              // type: 'custom',
              // url: '/shop',
            }}
            look={{
              theme: 'light',
              type: 'button',
              size: 'small',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: <XIcon strokeWidth={1.25} />,
                iconPosition: 'right',
              },
            }}
            actions={{
              onClick: async () => {
                startTransition(async () => {
                  clearOrder()
                  // revalidateCache({ path: '/shop' })
                  router.push('/shop')
                })
              },
            }}
          />

          <CMSLink
            data={{
              label: 'Continue Shopping',
              type: 'custom',
              url: '/shop',
            }}
            look={{
              theme: 'light',
              type: 'button',
              size: 'small',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: <ArrowLeftIcon strokeWidth={1.25} />,
                iconPosition: 'right',
              },
            }}
          />
        </div>
      </div>
      <div className="sm:hidden flex flex-row z-50 fixed bottom-0 left-0 w-full outline-green">
        <Link
          href="#summary-heading"
          scroll={true}
          className="basis-1/2 hover:no-underline no-underline  bg-white py-2  flex flex-col items-center cursor-pointer"
        >
          <span
            className={cn(
              contentFormats.global,
              contentFormats.text,
              buttonLook.variants.blocks,
              'mt-1 text-sm',
            )}
          >
            {` Order Total: `}
            {order.totals.total.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className={cn(contentFormats.global, contentFormats.h5, 'mt-1')}>
            {`View Summary `}
            &rarr;
          </span>
        </Link>

        <CMSLink
          className={`block w-1/2 ${isValid ? '!bg-green' : '!bg-gray-400'} !text-white`}
          data={{
            label: 'Checkout',
            type: 'custom',
            url: `/shop/checkout?orderId=${order.id}`,
          }}
          look={{
            theme: 'dark',
            type: 'button',
            size: 'small',
            width: 'narrow',
            variant: 'blocks',
            icon: {
              content: <DollarSignIcon strokeWidth={1.25} />,
              iconPosition: 'right',
            },
          }}
          actions={{ onClick: handleCheckout }}
          pending={isProcessing}
        />
      </div>

      {isProcessing && <CheckoutProcessing />}
    </div>
  )
}

const CheckoutProcessing: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/75 bg-opacity-50">
      <div className="flex flex-col  bg-white p-8 rounded-sm shadow-xl text-center">
        <FullLogo className="h-12 w-12 mx-auto mb-4" />

        <LoaderCircleIcon
          className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4"
          strokeWidth={1.25}
          aria-hidden="true"
        />
        <h2 className="text-2xl font-semibold mb-2">Preparing Checkout</h2>
        <p className="text-gray-600 mb-4">
          Please do not close this window or click the back button.
        </p>
        <div className="text-sm text-gray-500">This may take a few moments...</div>
      </div>
    </div>
  )
}
```

# \_blocks/Order/OrderItems/index.tsx

```tsx
'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import { ReceiversGrid } from '../ReceiversGrid'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'
import { AddReceiverButton, RemoveProductButton } from '../ReceiversGrid/ReceiverActions'
import { useOrder } from '@app/_providers/Order'

export const OrderItems: React.FC = () => {
  const { order } = useOrder()
  const { items: orderItems } = order

  return (
    <div className="py-8 divide-y">
      {orderItems?.map((item: any, index: any) => {
        const { product } = item
        const imageUrl =
          product.media && product.media.length > 0
            ? getImageUrl(product.media[0]?.mediaItem)
            : null
        const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23cccccc'%3E%3Crect width='100' height='100' rx='10' stroke-width='2' /%3E%3Cpath d='M20 80 L50 20 L80 80 Z' stroke-width='2' /%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='2' /%3E%3C/svg%3E`
        return (
          <div key={index} className="">
            <div className="space-y-4 md:border md:border-solid md:border-neutral-300 pb-6">
              <div className="flex items-start sm:items-center sm:space-x-4 p-3 sm:p-0 space-x-3 bg-neutral-200">
                <Image
                  src={imageUrl || placeholderSVG}
                  // src={getImageUrl(product.media[0]?.mediaItem)}
                  alt={''}
                  priority
                  width={100}
                  height={100}
                  className="rounded-sm object-cover object-center aspect-square shadow-md"
                />
                <div className="flex-1">
                  <span className={cn(contentFormats.global, contentFormats.h4, `no-underline`)}>
                    {product.title}
                  </span>
                  <div
                    className={cn(
                      'mt-2 !text-left !leading-snug !font-normal !tracking-tighter !antialiased line-clamp-2 sm:line-clamp-1 sm:pr-10',
                      contentFormats.global,
                      contentFormats.text,
                    )}
                  >
                    {product.meta.description}
                  </div>
                </div>
                <div className="hidden sm:flex flex-row justify-end items-center py-3 gap-3 pr-3">
                  <AddReceiverButton productId={item.product.id} />
                  <RemoveProductButton orderItemId={item.product.id} />
                </div>
              </div>
              <div className="sm:hidden flex flex-row justify-center items-center gap-3">
                <AddReceiverButton productId={item.product.id} />
                <RemoveProductButton orderItemId={item.product.id} />
              </div>
              <ReceiversGrid item={item} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

# \_blocks/Order/OrderEmpty/index.tsx

```tsx
'use client'

import React from 'react'
import { useTransition } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, HomeIcon, ShoppingCartIcon } from 'lucide-react'

export const OrderEmpty: React.FC<any> = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <BlockWrapper settings={{ settings: { theme: 'light' } }} className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-3/4">
          <div className="justify-center text-center">
            <h2
              className={[
                contentFormats.global,
                contentFormats.text,
                'font-normal tracking-tighter !text-left',
              ].join(' ')}
            >
              Your order is empty
            </h2>
          </div>
          <div className="space-y-6 flex flex-col items-end justify-end justify-items-end flex-auto px-4 md:px-0 ">
            <CMSLink
              data={{
                label: 'Thankly Shop',
                type: 'custom',
                url: '/shop',
              }}
              look={{
                theme: 'light',
                type: 'button',
                size: 'medium',
                width: 'wide',
                variant: 'blocks',
                icon: {
                  content: <ShoppingCartIcon strokeWidth={1.25} />,
                  iconPosition: 'right',
                },
              }}
              actions={{
                onClick: async () => {
                  startTransition(async () => {
                    router.push('/shop')
                  })
                },
              }}
            />

            <CMSLink
              data={{
                label: 'Thankly Home',
                type: 'custom',
                url: '/',
              }}
              look={{
                theme: 'light',
                type: 'button',
                size: 'medium',
                width: 'wide',
                variant: 'blocks',
                icon: {
                  content: <HomeIcon strokeWidth={1.25} />,
                  iconPosition: 'right',
                },
              }}
              actions={{
                onClick: async () => {
                  startTransition(async () => {
                    router.push('/')
                  })
                },
              }}
            />
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
```

# \_blocks/HoverHighlights/HoverHighlight/index.tsx

```tsx
'use client'

import React, { CSSProperties, Fragment } from 'react'
import { useMouseInfo } from '@faceless-ui/mouse-info'

import { CMSLink } from '@app/_components/CMSLink'
import { LineDraw } from '@app/_components/LineDraw'
import { Media } from '@app/_components/Media'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type HoverHighlightProps = ExtractBlockProps<'hoverHighlights'>

type Highlight = Exclude<
  HoverHighlightProps['hoverHighlightsFields']['highlights'],
  undefined | null
>[number]

export const HoverHighlight: React.FC<
  Highlight & {
    index: number
    addRowNumbers?: boolean | null
    isLast?: boolean
  }
> = (props) => {
  const { index, addRowNumbers, description, title, link, media } = props
  const [init, setInit] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState<boolean | null>(null)
  const { xPercentage, yPercentage } = useMouseInfo()

  React.useEffect(() => {
    setInit(true)
  }, [])

  const mediaStyle: CSSProperties = {}

  if (init && yPercentage > 0 && xPercentage > 0) {
    mediaStyle.left = `${xPercentage}%`
    mediaStyle.top = `${yPercentage}%`
  }

  return (
    <React.Fragment>
      <CMSLink
        data={{ ...link }}
        // {...link}
        className={classes.highlightLink}
        actions={{
          onMouseEnter: () => {
            setIsHovered(true)
          },
          onMouseLeave: () => {
            setIsHovered(false)
          },
        }}
        look={{
          theme: 'light',
          type: 'button',
          // size: 'medium',
          // width: 'normal',
          // variant: 'blocks',
          // icon: {
          //   content: <ChevronRightIcon strokeWidth={1.25} />,
          //   iconPosition: 'right',
          // },
        }}
      >
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              classes.blipCell,
              `cols-${addRowNumbers ? 16 : 15}`,
              `start-${addRowNumbers ? 2 : 1}`,
              'cols-m-8 start-m-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <LineDraw active={isHovered} />
          </div>
        </div>
        <div className={[classes.highlight, 'grid'].filter(Boolean).join(' ')}>
          {addRowNumbers && (
            <div className={[classes.rowNumber, 'cols-1'].filter(Boolean).join(' ')}>
              {(index + 1).toString().padStart(2, '0')}
            </div>
          )}
          <div className={['cols-5 cols-m-8'].filter(Boolean).join(' ')}>
            <h3 className={classes.title}>{title}</h3>
          </div>
          <div className={[`cols-${addRowNumbers ? 7 : 8}`, 'cols-m-8'].filter(Boolean).join(' ')}>
            <p className={classes.description}>{description}</p>
          </div>
        </div>
      </CMSLink>
      {typeof media === 'object' && media !== null && (
        <div
          className={[classes.mediaWrapper, isHovered && classes.wrapperHovered]
            .filter(Boolean)
            .join(' ')}
          style={mediaStyle}
        >
          <div className={classes.revealBox}>
            <Media resource={media} className={classes.media} />
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
```

# \_blocks/Hero/Three/index.tsx

```tsx
import React from 'react'

// import BackgroundGradient from '@app/_components/BackgroundGradient'
import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import BigThree from '@app/_components/BigThree'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { BlocksProp } from '@app/_components/RenderBlocks'
// import { RichText } from '@app/_components/RichText'
import { Page } from '@payload-types'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
export type HeroFields = ExtractBlockProps<'fields'>

export const ThreeHero: React.FC<{ fields: HeroFields }> = ({ fields }) => {
  const { description, primaryButtons, buttons } = fields

  return (
    <React.Fragment>
      <BlockWrapper
        settings={{ theme: fields.theme }}
        className={[classes.blockWrapper, ''].join(' ')}
      >
        {/* <BackgroundGrid zIndex={1} /> */}
        <Gutter>
          <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.sidebar, 'cols-4 cols-m-8 start-1'].filter(Boolean).join(' ')}>
              <RichText
                content={description.root.children.map((child: any) => child.text).join(' ')}
                className={[classes.richText].filter(Boolean).join(' ')}
              />

              <div className={classes.linksWrapper}>
                {primaryButtons.map((button: any, i: any) => {
                  return (
                    <CMSLink
                      key={i}
                      data={{ ...button }}
                      look={{
                        theme: 'light',
                        type: 'button',
                        size: 'medium',
                        width: 'normal',
                        variant: 'blocks',
                        icon: {
                          content: <ChevronRightIcon strokeWidth={1.25} />,
                          iconPosition: 'right',
                        },
                      }}
                    />

                    // <CMSLink
                    //   key={i}
                    //   {...button}
                    //   className={classes.link}
                    //   appearance="default"
                    //   buttonProps={{
                    //     hideBorders: true,
                    //   }}
                    // />
                  )
                })}
                {buttons.map((button: any, i: any) => {
                  return (
                    <CMSLink
                      key={i}
                      data={{ ...button }}
                      look={{
                        theme: 'light',
                        type: 'button',
                        size: 'medium',
                        width: 'normal',
                        variant: 'blocks',
                        icon: {
                          content: <ChevronRightIcon strokeWidth={1.25} />,
                          iconPosition: 'right',
                        },
                      }}
                    />

                    // <CMSLink
                    //   key={i}
                    //   {...button}
                    //   className={classes.link}
                    //   appearance="default"
                    //   buttonProps={{
                    //     hideBorders: true,
                    //   }}
                    // />
                  )
                })}
              </div>
            </div>
            <div className={[classes.graphicWrapper, 'cols-8 start-8'].join(' ')}>
              <BigThree />
            </div>
          </div>
        </Gutter>
      </BlockWrapper>
      {/* <BackgroundGradient className={classes.backgroundGradient} /> */}
    </React.Fragment>
  )
}

// // import BackgroundGradient from '@app/_components/BackgroundGradient'
// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
// import BigThree from '@app/_components/BigThree'
// import { BlockWrapper } from '@app/_components/BlockWrapper'
// import { CMSLink } from '@app/_components/CMSLink'
// import { Gutter } from '@app/_components/Gutter'
// import { BlocksProp } from '@app/_components/RenderBlocks'
// // import { RichText } from '@app/_components/RichText'
// import { Page } from '@payload-types'
// import { RichText } from '@app/_blocks/RichText'

// import classes from './index.module.scss'

// export const ThreeHero: React.FC<
//   Pick<Page['hero'], 'richText' | 'media' | 'buttons' | 'description' | 'theme'> & {
//     breadcrumbs?: Page['breadcrumbs']
//     firstContentBlock?: BlocksProp
//   }
// > = ({ richText, buttons, theme, breadcrumbs }) => {
//   const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0
//   return (
//     <React.Fragment>
//       <BlockWrapper
//         settings={{ theme }}
//         className={[classes.blockWrapper, hasBreadcrumbs ? classes.hasBreadcrumbs : ''].join(' ')}
//       >
//         <BackgroundGrid zIndex={1} />
//         <Gutter>
//           <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
//             <div className={[classes.sidebar, 'cols-4 cols-m-8 start-1'].filter(Boolean).join(' ')}>
//               <RichText
//                 content={richText}
//                 className={[classes.richText].filter(Boolean).join(' ')}
//               />

//               <div className={classes.linksWrapper}>
//                 {Array.isArray(buttons) &&
//                   buttons.map((button, i) => {
//                     // if (button.blockType === 'command') {
//                     //   return (
//                     //     <CreatePayloadApp
//                     //       key={i + button.command}
//                     //       label={button.command}
//                     //       background={false}
//                     //       className={classes.createPayloadApp}
//                     //     />
//                     //   )
//                     // }
//                     if (button.blockType === 'link' && button.link) {
//                       return (
//                         <CMSLink
//                           key={i + button.link.label}
//                           {...button.link}
//                           className={classes.link}
//                           appearance="default"
//                           buttonProps={{
//                             hideBorders: true,
//                           }}
//                         />
//                       )
//                     }
//                   })}
//               </div>
//             </div>
//             <div className={[classes.graphicWrapper, 'cols-8 start-8'].join(' ')}>
//               <BigThree />
//             </div>
//           </div>
//         </Gutter>
//       </BlockWrapper>
//       {/* <BackgroundGradient className={classes.backgroundGradient} /> */}
//     </React.Fragment>
//   )
// }
```

# \_blocks/Hero/Home/index.tsx

```tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { ChangeHeaderTheme } from '@app/_components/ChangeHeaderTheme'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { LogoShowcase } from '@app/_blocks/Hero/Home/LogoShowcase'

import { Media } from '@app/_components/Media'
import { BlocksProp } from '@app/_components/RenderBlocks'
// import { RichText } from '@app/_components/RichText'
import { Page } from '@payload-types'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type FormFieldsProps = ExtractBlockProps<'fields'>

export const HomeHero: React.FC<
  FormFieldsProps & {
    firstContentBlock?: BlocksProp
  }
> = ({
  theme,
  enableAnnouncement,
  announcementLink,
  content,
  description,
  primaryButtons,
  secondaryHeading,
  secondaryDescription,
  secondaryButtons,
  media,
  secondaryMedia,
  featureVideo,
  logos,
  firstContentBlock,
  ...fields
}) => {
  const laptopMediaRef = useRef<HTMLDivElement | null>(null)
  const mobileLaptopMediaRef = useRef<HTMLDivElement | null>(null)
  const [laptopMediaHeight, setLaptopMediaHeight] = useState(0)
  const [mobileMediaWrapperHeight, setMobileMediaWrapperHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  useEffect(() => {
    const updateElementHeights = () => {
      const renderedLaptopMediaHeight = laptopMediaRef.current
        ? laptopMediaRef.current.offsetHeight
        : 0
      setLaptopMediaHeight(renderedLaptopMediaHeight)
    }
    updateElementHeights()
    window.addEventListener('resize', updateElementHeights)

    return () => window.removeEventListener('resize', updateElementHeights)
  }, [])

  useEffect(() => {
    const updateMobileMediaWrapperHeight = () => {
      const newMobileHeight = mobileLaptopMediaRef.current
        ? mobileLaptopMediaRef.current.offsetHeight
        : 0
      setMobileMediaWrapperHeight(newMobileHeight)
    }
    updateMobileMediaWrapperHeight()
    window.addEventListener('resize', updateMobileMediaWrapperHeight)

    return () => window.removeEventListener('resize', updateMobileMediaWrapperHeight)
  }, [])

  const aspectRatio = 2560 / 1971
  const dynamicHeight = windowWidth / aspectRatio

  const getContentWrapperHeight = () => {
    if (windowWidth >= 1024) {
      return {
        height: `${dynamicHeight}px`,
      }
    } else if (windowWidth < 1024) {
      return {
        height: '100%',
      }
    } else {
      return {
        height: 'unset',
      }
    }
  }

  const contentWrapperHeight = getContentWrapperHeight()

  // const getGridLineStyles = () => {
  //   if (windowWidth >= 1024) {
  //     // For desktop
  //     return {
  //       0: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 65%, rgba(0, 0, 0, 0) 80%)',
  //       },
  //       1: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 65%, rgba(0, 0, 0, 0) 80%)',
  //       },
  //       2: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 75%, rgba(0, 0, 0, 0) 95%)',
  //       },
  //       3: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 20%, rgba(0, 0, 0, 0) 60%)',
  //       },
  //       4: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 60%, rgba(0, 0, 0, 0) 90%)',
  //       },
  //     }
  //   } else {
  //     // For mobile
  //     return {
  //       0: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 70%, rgba(0, 0, 0, 0) 100%)',
  //       },
  //       1: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 80%, rgba(0, 0, 0, 0) 90%)',
  //       },
  //       2: {
  //         background: 'var(--grid-line-dark)',
  //       },
  //       3: {
  //         background: 'var(--grid-line-dark)',
  //       },
  //       4: {
  //         background:
  //           'linear-gradient(to top, var(--grid-line-dark) 0%, var(--grid-line-dark) 80%, rgba(0, 0, 0, 0) 100%)',
  //       },
  //     }
  //   }
  // }

  // const gridLineStyles = getGridLineStyles()

  return (
    <ChangeHeaderTheme theme={theme}>
      <BlockWrapper
        setPadding={false}
        settings={{ theme: theme }}
        className={getPaddingClasses('hero')}
      >
        <div className={classes.homeHero}>
          <div className={classes.background}>
            <div className={classes.imagesContainerWrapper}>
              {typeof media === 'object' && media !== null && (
                <Media
                  ref={laptopMediaRef}
                  resource={media}
                  className={classes.laptopMedia}
                  priority
                  width={2560}
                  height={1971}
                />
              )}
            </div>
          </div>
          <div className={classes.contentWrapper} style={contentWrapperHeight}>
            <Gutter className={classes.content}>
              <div className={classes.primaryContentWrap} data-theme={theme}>
                <div className={[classes.primaryContent, 'grid'].filter(Boolean).join(' ')}>
                  <div className={['cols-8 start-1'].filter(Boolean).join(' ')}>
                    {enableAnnouncement && (
                      <div className={classes.announcementLink}>
                        <CMSLink {...announcementLink} />
                      </div>
                    )}
                    <RichText className={classes.richTextHeading} content={content} />
                    <RichText className={classes.richTextDescription} content={description} />
                    {Array.isArray(primaryButtons) && (
                      <ul className={[classes.primaryButtons].filter(Boolean).join(' ')}>
                        {primaryButtons.map(({ link }, i) => {
                          return (
                            <li key={i}>
                              <CMSLink
                                {...link}
                                appearance="default"
                                fullWidth
                                buttonProps={{
                                  icon: 'arrow',
                                  hideHorizontalBorders: false,
                                }}
                              />
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    {/* Mobile media - only rendered starting at mid-break */}
                    <div
                      className={classes.mobileMediaWrapper}
                      style={{ height: mobileMediaWrapperHeight }}
                    >
                      {typeof media === 'object' && media !== null && (
                        <Media
                          ref={mobileLaptopMediaRef}
                          resource={media}
                          className={classes.laptopMedia}
                        />
                      )}
                      {/* {typeof secondaryMedia === 'object' && secondaryMedia !== null && (
                        <div className={classes.pedestalMaskedImage}>
                          <BackgroundGrid
                            className={classes.mobilePedestalBackgroundGrid}
                            gridLineStyles={{
                              0: {
                                background: 'var(--grid-line-dark)',
                              },
                              1: {
                                background: 'var(--grid-line-dark)',
                              },
                              2: {
                                background: 'var(--grid-line-dark)',
                              },
                              3: {
                                background: 'var(--grid-line-dark)',
                              },
                              4: {
                                background: 'var(--grid-line-dark)',
                              },
                            }}
                            zIndex={1}
                          />
                          <Media resource={secondaryMedia} className={classes.pedestalImage} />
                        </div>
                      )} */}
                      {/* {typeof featureVideo === 'object' && featureVideo !== null && (
                        <div
                          className={classes.featureVideoMask}
                          style={{ height: mobileMediaWrapperHeight }}
                        >
                          <Media
                            resource={featureVideo}
                            className={classes.featureVideo}
                            priority
                          />
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </Gutter>
          </div>
        </div>
      </BlockWrapper>
    </ChangeHeaderTheme>
  )
}
```

# \_blocks/Hero/Gradient/index.tsx

```tsx
'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'

import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type GradientHeroProps = ExtractBlockProps<'fields'>

export const GradientHero: React.FC<GradientHeroProps> = ({
  content,
  images,
  fullBackground,
  links,
  description,
  theme: themeFromProps,
  enableBreadcrumbsBar,
  firstContentBlock,
}) => {
  const theme = fullBackground ? 'dark' : themeFromProps

  return (
    <BlockWrapper settings={{ theme }} className={getPaddingClasses('standard')}>
      {Boolean(fullBackground) && (
        <Media
          className={[classes.bgFull, enableBreadcrumbsBar ? classes.hasBreadcrumbsEnabled : '']
            .filter(Boolean)
            .join(' ')}
          src="/images/background-shapes.webp"
          alt=""
          width={1920}
          height={1080}
          priority
        />
      )}
      {/* <BackgroundGrid className={classes.backgroundGrid} zIndex={0} /> */}
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              classes.sidebar,
              fullBackground && classes.hasFullBackground,
              `cols-6`,
              'cols-m-8 start-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <RichText content={content} className={[classes.richText].filter(Boolean).join(' ')} />
            <div className={classes.contentWrapper}>
              <RichText
                content={description}
                className={[classes.description].filter(Boolean).join(' ')}
              />

              <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
                {Array.isArray(links) &&
                  links.map(({ link }, i) => {
                    return (
                      <CMSLink
                        key={i}
                        data={{ ...link }}
                        look={{
                          theme: 'light',
                          type: 'button',
                          size: 'medium',
                          width: 'normal',
                          variant: 'blocks',
                          icon: {
                            content: <ChevronRightIcon strokeWidth={1.25} />,
                            iconPosition: 'right',
                          },
                        }}
                      />
                      // <CMSLink
                      //   key={i}
                      //   {...link}
                      //   buttonProps={{
                      //     hideHorizontalBorders: false,
                      //   }}
                      //   className={[classes.link, 'cols-12 start-1'].filter(Boolean).join(' ')}
                      // />
                    )
                  })}
              </div>
            </div>
          </div>
          {!Boolean(fullBackground) && (
            <Media
              className={[classes.bgSquare, 'cols-8 start-9 start-m-1'].filter(Boolean).join(' ')}
              src="/images/gradient-square.jpg"
              alt=""
              width={800}
              height={800}
              priority
            />
          )}
          <div
            className={[classes.media, 'cols-9 start-8 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            {images && Array.isArray(images) && <MediaParallax media={images} priority />}
          </div>
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}

export default GradientHero
```

# \_blocks/Hero/Default/index.tsx

```tsx
'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type DefaultHeroProps = ExtractBlockProps<'fields'>

export const DefaultHero: React.FC<DefaultHeroProps> = ({ description, theme }) => {
  return (
    <BlockWrapper settings={{ theme: theme }} className={getPaddingClasses('hero')}>
      <Gutter>
        {/* <BackgroundGrid zIndex={0} /> */}
        <div className={classes.defaultHero}>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <div className={[`cols-8 start-1`, `cols-m-8`, 'cols-s-8'].filter(Boolean).join(' ')}>
              <RichText className={classes.richText} content={description} />
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
```

# \_blocks/Hero/ContentMedia/index.tsx

```tsx
'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'

import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type ContentMediaHeroProps = ExtractBlockProps<'fields'>

export const ContentMediaHero: React.FC<ContentMediaHeroProps> = ({
  content,
  media,
  links,
  description,
  theme,
  firstContentBlock,
}) => {
  return (
    <BlockWrapper settings={{ theme }} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.sidebar, `cols-4`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}
          >
            <RichText content={content} className={[classes.richText].filter(Boolean).join(' ')} />

            <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
              <RichText
                content={description}
                className={[classes.description].filter(Boolean).join(' ')}
              />

              {Array.isArray(links) &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      data={{ ...link }}
                      look={{
                        theme: 'light',
                        type: 'button',
                        size: 'medium',
                        width: 'normal',
                        variant: 'blocks',
                        icon: {
                          content: <ChevronRightIcon strokeWidth={1.25} />,
                          iconPosition: 'right',
                        },
                      }}
                    />

                    // <CMSLink
                    //   key={i}
                    //   {...link}
                    //   buttonProps={{
                    //     hideHorizontalBorders: false,
                    //   }}
                    //   className={[classes.link, 'cols-12 start-1'].filter(Boolean).join(' ')}
                    // />
                  )
                })}
            </div>
          </div>
          {typeof media === 'object' && media !== null && (
            <div
              className={[classes.mediaWrapper, `start-7`, `cols-10`, 'cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              <div className={classes.media}>
                <Media
                  resource={media}
                  sizes={`100vw, (max-width: 1920px) 75vw, (max-width: 1024px) 100vw`}
                />
              </div>
            </div>
          )}
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}

export default ContentMediaHero
```

# \_blocks/Hero/CenteredContent/index.tsx

```tsx
'use client'

import React from 'react'
import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Breadcrumbs } from '@app/_components/Breadcrumbs'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'

import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type CenteredContentProps = ExtractBlockProps<'fields'>

export const CenteredContent: React.FC<CenteredContentProps> = ({
  content,
  links,
  breadcrumbs,
  theme,
  firstContentBlock,
}) => {
  return (
    <BlockWrapper settings={{ theme }} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter>
        <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.content, 'cols-8 start-5 start-m-1 cols-m-8']
              .filter(Boolean)
              .join(' ')}
          >
            <div className={classes.richText}>
              <RichText content={content} />
            </div>

            <div className={[classes.links].filter(Boolean).join(' ')}>
              {Array.isArray(links) &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      key={i}
                      data={{ ...link }}
                      look={{
                        theme: 'light',
                        type: 'button',
                        size: 'medium',
                        width: 'normal',
                        variant: 'blocks',
                        icon: {
                          content: <ChevronRightIcon strokeWidth={1.25} />,
                          iconPosition: 'right',
                        },
                      }}
                    />
                    // <CMSLink
                    //   key={i}
                    //   {...link}
                    //   buttonProps={{
                    //     hideHorizontalBorders: false,
                    //     hideBottomBorderExceptLast: true,
                    //   }}
                    // />
                  )
                })}
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

export default CenteredContent
```

# \_blocks/Checkout/Summary/index.tsx

```tsx
import React, { useEffect, useState, useTransition } from 'react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import {
  DollarSignIcon,
  ChevronUpIcon,
  MailWarningIcon,
  SmileIcon,
  ChevronDownIcon,
} from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Order } from '@/payload-types'
import { orderText } from '@/utilities/refData'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { useRouter } from 'next/navigation'
import { useOrder } from '@app/_providers/Order'
import { LoaderCircleIcon } from 'lucide-react'
import { FullLogo } from '@app/_graphics/FullLogo'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Image from 'next/image'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export const CheckoutSummary: React.FC<{ order: Order }> = ({ order }) => {
  if (!order || !order.totals) {
    return null // or return a loading state or placeholder
  }
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const router = useRouter()
  const { validateOrder } = useOrder()
  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()

  const [billingAddress, setBillingAddress] = useState({
    formattedAddress: '',
    addressLine1: '',
    addressLine2: '',
  })

  const { items: orderItems } = order

  useEffect(() => {
    const orderValidity = validateOrder()
    setIsValid(orderValidity)
    setValidationMessage(
      orderValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [order, validateOrder])

  const handleCheckout = async (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (event) {
      event.preventDefault()
    }

    if (isValid) {
      setIsProcessing(true)
      // console.log(`Cart is valid, let's create a draft order...`)

      try {
        // Simulate API call or any async operation
        // await new Promise((resolve) => setTimeout(resolve, 2000))
        router.push(`/shop/checkout`)
      } catch (error) {
        console.error('Error during checkout:', error)
        setIsProcessing(false)
        alert('An error occurred during checkout. Please try again.')
      }
    } else {
      // console.log('Cart is invalid, errors should be displayed')
      alert(validationMessage)
    }
  }

  return (
    <div id="summary-heading" className="sm:basis-1/2 #order-first sm:order-last">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} !my-0 pb-6`}>Order Summary</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {`Total (inc. taxes)`}
          </dt>
          <dd className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {(order.totals.total + (order.totals.discount || 0)).toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text].join(' ')}>Thanklys</dt>
          <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
            {order.totals.cost.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text].join(' ')}>{`+ Shipping`}</dt>
          <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
            {order.totals.shipping?.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        {(order.totals.discount || 0) < 0 && (
          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>
              <SmileIcon />
              {` Your order is over $150 so Shipping is on us!`}
            </dt>
            <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
              {`(${order.totals.discount?.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })})`}
            </dd>
          </div>
        )}

        {/* <h2 className={`${contentFormats.global} ${contentFormats.h3} py-6 hidden sm:block`}>
          Thanklys Ordered
        </h2> */}

        <div className="mt-6">
          <React.Fragment>
            <MailWarningIcon className="mr-2" />
            <span className="font-semibold">{`Thankly Cards: `}</span>
            <span className={[contentFormats.text, `text-sm`].join(' ')}>
              {orderText.shippingMessage}
              <Link
                className={[contentFormats.global, contentFormats.a, `!text-sm`].join(' ')}
                href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                target="_blank"
              >
                Learn More
              </Link>
            </span>
          </React.Fragment>
        </div>

        <div className={`space-y-4 #sm:block`}>
          {orderItems?.map((item: any, index: any) => {
            const { product } = item
            const imageUrl =
              product.media && product.media.length > 0
                ? getImageUrl(product.media[0]?.mediaItem)
                : null
            const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23cccccc'%3E%3Crect width='100' height='100' rx='10' stroke-width='2' /%3E%3Cpath d='M20 80 L50 20 L80 80 Z' stroke-width='2' /%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='2' /%3E%3C/svg%3E`
            const receiverCount = item.receivers?.length || 0
            return (
              <div key={index} className="">
                <div className="space-y-4 pb-6">
                  <div className="flex items-start sm:items-center sm:space-x-4 p-3 sm:p-0 space-x-3">
                    <Image
                      src={imageUrl || placeholderSVG}
                      alt={''}
                      priority
                      width={100}
                      height={100}
                      className="rounded-sm object-cover object-center aspect-square shadow-md"
                    />
                    <div className="flex-1 flex flex-col">
                      <span
                        className={cn(contentFormats.global, contentFormats.h4, `no-underline`)}
                      >
                        {product.title}
                      </span>
                      <span
                        className={cn(
                          contentFormats.global,
                          contentFormats.text,
                          'text-sm italic  mt-1',
                        )}
                      >
                        {`Sending this thankly to ${receiverCount} `}
                        {receiverCount === 1 ? 'person' : 'people'}
                      </span>
                      <div className="flex justify-between items-start mt-2">
                        <div className="flex-row text-left">
                          <div>
                            <span
                              className={[contentFormats.global, contentFormats.text].join(' ')}
                            >
                              {`Cost: ${
                                item.totals.cost.toLocaleString('en-AU', {
                                  style: 'currency',
                                  currency: 'AUD',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }) || 0
                              }`}
                            </span>
                          </div>
                          <div>
                            <span
                              className={[contentFormats.global, contentFormats.text].join(' ')}
                            >
                              {`Shipping: ${
                                item.totals.shipping
                                  ? item.totals.shipping?.toLocaleString('en-AU', {
                                      style: 'currency',
                                      currency: 'AUD',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                    })
                                  : '(needs address)'
                              }`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* <div className="pt-6 flex items-center space-x-4">
        <label
          htmlFor={`discount-code`}
          className="flex items-center text-sm font-medium text-gray-900"
        >
          <TagIcon className="h-5 w-5 text-gray-900" strokeWidth={1.25} />
        </label>
        <input
          id={`discount-code`}
          name="discount-code"
          type="text"
          placeholder="DISCOUNT CODE"
          className={cn(
            'peer block w-full border-0 border-b border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-700 focus:border-b-2 focus:border-green/75 focus:outline-none focus:ring-0 text-base sm:text-sm',
          )}
        />
      </div> */}
    </div>
  )
}
```

# \_blocks/Checkout/CheckoutForm/index.tsx

```tsx
'use client'

import React, { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  ExpressCheckoutElement,
} from '@stripe/react-stripe-js'
import { useOrder } from '@app/_providers/Order'
import { Lock } from 'lucide-react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'

export const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()
  const { order } = useOrder()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const paymentElementOptions = {
    layout: 'accordion' as const,

    spacedAccordionItems: false,
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setErrorMessage('Stripe has not been initialized.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop/order/confirmation`,
      },
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setErrorMessage(error.message ?? 'An unknown error occurred')
    } else {
      setErrorMessage('An unexpected error occured.')
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="#space-y-6 sm:basis-1/2">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} !my-0 pb-6`}>Payment</h2>

      <PaymentElement options={paymentElementOptions} />
      {/* <AddressElement options={{ mode: 'billing' }} /> */}

      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={cn(
          'w-full mt-6 py-3 cursor-pointer border border-transparent bg-green px-4 text-sm font-medium text-white shadow-sm hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50',
          // contentFormats.global,
          // contentFormats.p,
          // buttonLook.base,
          buttonLook.sizes.medium,
          buttonLook.widths.full,
          // buttonLook.variants.blocks,
        )}
      >
        {isLoading ? 'Processing...' : `Pay ${order.totals.total.toFixed(2)} AUD`}
      </button>

      <p
        className={cn(
          'mt-6 flex justify-center text-sm font-medium text-gray-500',
          contentFormats.global,
          contentFormats.p,
        )}
      >
        <Lock className="mr-1.5 h-5 w-5 text-gray-400" />
        Payment details secured by Stripe
      </p>
    </form>
  )
}
```

# \_blocks/Checkout/CheckoutForm/createPaymentIntent.ts

```ts
'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function createPaymentIntent(
  amount: number,
): Promise<{ clientSecret: string | null }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: 'aud',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { clientSecret: paymentIntent.client_secret }
  } catch (err: any) {
    console.error('Error creating PaymentIntent:', err)
    return { clientSecret: null }
  }
}
```

# (pages)/shop/checkout/page.tsx

```tsx
'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { OrderEmpty } from '@app/_blocks/Order/OrderEmpty'
import { buttonLook, contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useOrder } from '@app/_providers/Order'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { CheckoutSummary } from '../../../_blocks/Checkout/Summary'
import { CheckoutForm } from '../../../_blocks/Checkout/CheckoutForm'
import { Elements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createPaymentIntent } from '../../../_blocks/Checkout/CheckoutForm/createPaymentIntent'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const { order, orderIsEmpty, hasInitializedOrder } = useOrder()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    if (order && order.totals && order.totals.total > 0) {
      createPaymentIntent(order.totals.total)
        .then((result) => {
          if (result.clientSecret) {
            setClientSecret(result.clientSecret)
          }
        })
        .catch((error) => console.error('Error creating PaymentIntent:', error))
    }
  }, [order])

  if (order && order.items && order.items.length > 0) {
    return renderCartContent(order, orderIsEmpty, clientSecret)
  }

  if (!hasInitializedOrder) {
    return <CheckoutLoadingSkeleton />
  }

  return <OrderEmpty />
}

function renderCartContent(order: any, orderIsEmpty: any, clientSecret: string | null) {
  if (!clientSecret) {
    return <CheckoutLoadingSkeleton />
  }

  const appearance = {
    theme: 'flat' as const,
    variables: {
      colorPrimary: '#557755',
      colorBackground: '#f9fafb', // Matches bg-gray-50
      colorText: '#111827', // Matches text-gray-900
      colorDanger: '#dc2626', // Matches text-red-600
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      spacingUnit: '4px',
      borderRadius: '0px',
    },
    rules: {
      '.Input': {
        border: 'none',
        borderBottom: '1px solid #d1d5db', // Matches border-gray-300
        boxShadow: 'none',
        fontSize: '14px', // Matches text-sm
        padding: '8px 4px', // Adjusted to match your input padding
      },
      '.Input:focus': {
        border: 'none',
        borderBottom: '2px solid #557755', // Matches focus:border-green/75
        boxShadow: 'none',
      },
      '.Input::placeholder': {
        color: '#9ca3af', // Matches placeholder-gray-400
      },
      '.Label': {
        fontSize: '14px', // Matches text-sm
        fontWeight: '500', // Matches font-medium
        color: '#111827', // Matches text-gray-900
      },
      '.Error': {
        color: '#dc2626', // Matches text-red-600
        fontSize: '14px', // Matches text-sm
      },
    },
  }

  const options = {
    // clientSecret,
    appearance,
    mode: 'payment' as const,
    currency: 'aud',
    amount: order.totals.total * 100, // amount in cents
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        {orderIsEmpty ? (
          <OrderEmpty />
        ) : (
          <React.Fragment>
            <div className="flex flex-row justify-between pb-6">
              <h1
                className={cn(
                  contentFormats.global,
                  contentFormats.h3,
                  'tracking-tighter text-3xl sm:text-2xl font-medium my-2',
                )}
              >
                {'Checkout'}
              </h1>
              <div className="hidden sm:flex w-1/6">
                <Link
                  href="/shop/cart"
                  scroll={true}
                  className={cn(
                    buttonLook.variants.base,
                    buttonLook.sizes.medium,
                    buttonLook.widths.full,
                    'flex flex-row justify-between no-underline',
                  )}
                >
                  <span> &larr; </span>
                  <span className={cn(contentFormats.global, contentFormats.p)}>
                    {`Back to Cart`}
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col sm:flex-row md:shrink-0  gap-6 px-0 #max-w-6xl justify-center justify-items-center">
                <Suspense fallback={<StripeElementsSkeleton />}>
                  {order && clientSecret ? (
                    <Elements stripe={stripePromise} options={options}>
                      {/* <ExpressCheckoutElement onConfirm={} /> */}
                      <CheckoutForm />
                    </Elements>
                  ) : (
                    <StripeElementsSkeleton />
                  )}
                </Suspense>
                <Suspense fallback={<OrderSummarySkeleton />}>
                  {order && <CheckoutSummary order={order} />}
                </Suspense>
              </div>
            </div>
          </React.Fragment>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

// ... rest of the file remains the same

const CheckoutLoadingSkeleton = () => (
  <BlockWrapper className={getPaddingClasses('hero')}>
    <Gutter>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 w-3/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:basis-3/4">
            <OrderItemsSkeleton />
          </div>
          <div className="lg:basis-1/4">
            <OrderSummarySkeleton />
          </div>
        </div>
      </div>
    </Gutter>
  </BlockWrapper>
)

const OrderItemsSkeleton: React.FC = () => {
  return (
    <div className="border border-solid border-gray-200/90 animate-pulse">
      <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
        <div className="flex min-w-0 gap-x-4">
          <div className="h-20 w-20 flex-none bg-gray-200"></div>
          <div className="flex flex-col gap-x-3 sm:items-start">
            <div className="w-32 h-6 bg-gray-200 mb-2"></div>
            <div className="w-48 h-4 bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-none items-end gap-x-4 align-top">
          <div className="w-24 h-8 bg-gray-200"></div>
          <div className="w-24 h-8 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

const OrderSummarySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="relative flex justify-between gap-4">
        <h2 className="bg-gray-200 rounded h-6 w-32"></h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-48"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>
      </div>
    </div>
  )
}

const StripeElementsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 basis-2/3">
      <div className="h-12 bg-gray-200 rounded"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  )
}
```

# (pages)/shop/checkout/loading.tsx

```tsx
import React from 'react'
import { LoaderCircleIcon } from 'lucide-react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-4 sm:py-4 flex items-center">
          <LoaderCircleIcon
            className="animate-spin h-8 w-8 flex-shrink-0 text-green-500"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">Loading checkout...please wait</div>
        </div>
      </div>
    </div>
  )
}

export default Loading
```

# (pages)/shop/[slug]/page.tsx

```tsx
import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import ProductBlock from '@app/_blocks/ProductBlock'
import type { Product } from '@payload-types'
import Blocks from '../../../_blocks'
import { fetchProduct } from '../../../_queries/products'

export default async function ProductPage({
  params: { slug },
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { isEnabled: isDraftMode } = draftMode()
  const selectedImageIndex =
    typeof searchParams.image === 'string' ? parseInt(searchParams.image, 10) : 0

  let product: Product | null = null
  try {
    product = await fetchProduct(slug)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return notFound()
  }

  if (
    !product ||
    typeof product !== 'object' ||
    (Object.keys(product).length === 0 && product.constructor === Object)
  ) {
    return notFound()
  }

  // Use the isProductInOrder function from the order provider

  return (
    <React.Fragment>
      <ProductBlock product={product} selectedImageIndex={selectedImageIndex} />
      <Blocks blocks={product?.layout?.root?.children} />
    </React.Fragment>
  )
}
```

# (pages)/shop/[slug]/loading.tsx

```tsx
import React from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { getPaddingClasses } from '../../../_css/tailwindClasses'

const ProductPageSkeleton = () => (
  <div className="flex space-x-4 animate-pulse">
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 bg-gray-200 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-gray-200 rounded col-span-2"></div>
          <div className="h-2 bg-gray-200 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div className="w-48 h-48 bg-gray-200 rounded"></div>
  </div>
)

export default function LoadingShop() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="bg-gray-300 h-8 w-1/4 mb-8 rounded"></div>
        <BlockWrapper
          settings={{ settings: { theme: 'light' } }}
          className={getPaddingClasses('hero')}
        >
          <Gutter>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {[...Array(8)].map((_, index) => (
                <ProductPageSkeleton key={index} />
              ))}
            </div>
          </Gutter>
        </BlockWrapper>
      </div>
    </div>
  )
}
```

# (pages)/shop/cart/page.tsx

```tsx
'use client'
import React, { Suspense, useEffect } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { OrderEmpty } from '@app/_blocks/Order/OrderEmpty'
import { orderText } from '@/utilities/refData'
import { buttonLook, contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useOrder } from '@app/_providers/Order'
import { OrderItems } from '@app/_blocks/Order/OrderItems'
import { OrderSummary } from '@app/_blocks/Order/OrderSummary'
import { CMSLink } from '../../../_components/CMSLink'
import { DollarSignIcon } from 'lucide-react'
import Link from 'next/link'
import cn from '@/utilities/cn'

export default function CartPage() {
  const { order, orderIsEmpty, hasInitializedOrder } = useOrder()

  // If we have order data, render the content regardless of hasInitializedOrder
  if (order && order.items && order.items.length > 0) {
    return renderCartContent(order, orderIsEmpty)
  }

  // If we don't have order data and hasInitializedOrder is false, show loading
  if (!hasInitializedOrder) {
    return <CartLoadingSkeleton />
  }

  // If we have initialized but the order is empty, show empty order
  return <OrderEmpty />
}

function renderCartContent(order: any, orderIsEmpty: any) {
  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        {orderIsEmpty ? (
          <OrderEmpty />
        ) : (
          <>
            <div className="flex flex-row justify-between #gap-6">
              <h1
                className={[
                  contentFormats.global,
                  contentFormats.h3,
                  'tracking-tighter text-3xl sm:text-2xl font-medium my-2',
                ].join(' ')}
              >
                {'Your Cart'}
              </h1>

              {/* <div className="hidden sm:flex w-1/6">
                <Link
                  href="#summary-heading"
                  scroll={true}
                  className={[
                    buttonLook.variants.base,
                    buttonLook.sizes.medium,
                    buttonLook.widths.full,
                    `flex flex-row justify-between no-underline`,
                  ].join(' ')}
                >
                  <span className={cn(contentFormats.global, contentFormats.p, '')}>
                    {`Order Summary `}
                  </span>
                  <span> &darr; </span>
                </Link>
              </div> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Suspense fallback={<OrderItemsSkeleton />}>{order && <OrderItems />}</Suspense>

              <Suspense fallback={<OrderSummarySkeleton />}>
                {order && <OrderSummary order={order} />}
              </Suspense>
            </div>
          </>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

const CartLoadingSkeleton = () => (
  <BlockWrapper className={getPaddingClasses('hero')}>
    <Gutter>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 w-3/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:basis-3/4">
            <OrderItemsSkeleton />
          </div>
          <div className="lg:basis-1/4">
            <OrderSummarySkeleton />
          </div>
        </div>
      </div>
    </Gutter>
  </BlockWrapper>
)

const OrderItemsSkeleton: React.FC = () => {
  return (
    <div className="border border-solid border-gray-200/90 animate-pulse">
      <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
        <div className="flex min-w-0 gap-x-4">
          <div className="h-20 w-20 flex-none bg-gray-200"></div>
          <div className="flex flex-col gap-x-3 sm:items-start">
            <div className="w-32 h-6 bg-gray-200 mb-2"></div>
            <div className="w-48 h-4 bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-none items-end gap-x-4 align-top">
          <div className="w-24 h-8 bg-gray-200"></div>
          <div className="w-24 h-8 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

const OrderSummarySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="relative flex justify-between gap-4">
        <h2 className="bg-gray-200 rounded h-6 w-32"></h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-48"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>
      </div>
    </div>
  )
}
```

# (pages)/shop/cart/loading.tsx

```tsx
import React from 'react'
import { LoaderCircleIcon } from 'lucide-react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-4 sm:py-4 flex items-center">
          <LoaderCircleIcon
            className="animate-spin h-8 w-8 flex-shrink-0 text-green-500"
            strokeWidth={1.25}
            aria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">Loading your order...please wait</div>
        </div>
      </div>
    </div>
  )
}

export default Loading
```

# \_components/forms/fields/useField/index.tsx

```tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { Validate, Value } from '@app/_components/forms/types'
import { useFormField } from '@app/_components/forms/useFormField'

// the purpose of this hook is to provide a way to:
// 1. allow the field to update its own value without debounce
// 2. conditionally report the updated value to the form
// 3. allow the field be controlled externally either through props or form context
// 4. standardize repetitive logic across all fields
export const useField = <T extends Value>(props: {
  path?: string
  initialValue?: T
  onChange?: (value: T) => void // eslint-disable-line no-unused-vars
  validate?: Validate
  required?: boolean
}): {
  onChange: (value: T) => void // eslint-disable-line no-unused-vars
  value: T | null
  showError: boolean
  errorMessage?: string
} => {
  const { path, onChange: onChangeFromProps, validate, initialValue, required } = props
  const hasInitialized = useRef(false)

  const {
    value: valueFromContext,
    debouncedValue: debouncedValueFromContext,
    showError,
    setValue: setValueInContext,
    errorMessage,
  } = useFormField<T>({
    path,
    validate,
    initialValue,
    required,
  })

  const valueFromContextOrProps = valueFromContext !== undefined ? valueFromContext : initialValue

  const [internalState, setInternalState] = useState<T | null>(
    valueFromContext || initialValue || null,
  ) // not debounced

  useEffect(() => {
    if (valueFromContextOrProps !== undefined && valueFromContextOrProps !== internalState)
      setInternalState(valueFromContextOrProps)
  }, [valueFromContextOrProps, internalState])

  const onChange = useCallback(
    (incomingValue: T) => {
      hasInitialized.current = true
      setInternalState(incomingValue)

      if (typeof setValueInContext === 'function') {
        setValueInContext(incomingValue)
      }

      // if the field is not controlled by the form context, we need to report the change immediately
      // however, if the field is controlled by the form context (`path`), we need to wait for the debounced value
      // this is because the form context will not have updated the value here yet, see note below
      if (!path && typeof onChangeFromProps === 'function') {
        onChangeFromProps(incomingValue)
      }
    },
    [setValueInContext, onChangeFromProps, path],
  )

  // this effect is dependent on the `debouncedValue` because we only want to report the `onChange` event _after_
  // the value has been fully updated in the form context (if applicable, see note above)
  useEffect(() => {
    if (hasInitialized.current && path && typeof onChangeFromProps === 'function') {
      onChangeFromProps(debouncedValueFromContext)
    }
  }, [debouncedValueFromContext, onChangeFromProps, path])

  return {
    onChange,
    value: internalState,
    showError,
    errorMessage,
  }
}
```

# \_components/forms/fields/Text/index.tsx

```tsx
'use client'

import React, { Fragment, useEffect } from 'react'
import Label from '@app/_components/forms/Label'

import { CopyToClipboard } from '@app/_components/CopyToClipboard'
import { Tooltip } from '@app/_components/Tooltip'
import { EyeIcon } from '@app/_icons/EyeIcon'
import Error from '../../Error'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

export const Text: React.FC<
  FieldProps<string> & {
    type?: 'text' | 'password' | 'hidden'
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    value?: string
    customOnChange?: (e: any) => void
    suffix?: React.ReactNode
    readOnly?: boolean
  }
> = (props) => {
  const {
    path,
    name,
    required = false,
    validate,
    label,
    placeholder,
    type = 'text',
    onChange: onChangeFromProps,
    customOnChange,
    initialValue,
    className,
    copy = false,
    disabled,
    readOnly,
    elementAttributes = {
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'none',
    },
    description,
    value: valueFromProps,
    showError: showErrorFromProps,
    icon,
    fullWidth = true,
    suffix,
  } = props

  const prevValueFromProps = React.useRef(valueFromProps)

  const [isHidden, setIsHidden] = React.useState(type === 'password')

  const defaultValidateFunction = React.useCallback(
    (fieldValue: any | boolean): string | true => {
      if (required && !fieldValue) {
        return 'Please enter a value.'
      }

      if (fieldValue && typeof fieldValue !== 'string') {
        return 'This field can only be a string.'
      }

      return true
    },
    [required],
  )

  const {
    onChange,
    value: valueFromContext,
    showError,
    errorMessage,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  const value = valueFromProps || valueFromContext

  useEffect(() => {
    if (
      valueFromProps !== undefined &&
      valueFromProps !== prevValueFromProps.current &&
      valueFromProps !== valueFromContext
    ) {
      prevValueFromProps.current = valueFromProps
      onChange(valueFromProps)
    }
  }, [valueFromProps, onChange, valueFromContext])

  return (
    <div
      className={[
        className,
        classes.component,
        (showError || showErrorFromProps) && classes.showError,
        classes[`type--${type}`],
        fullWidth && classes.fullWidth,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/*
        This field is display flex in column-reverse, so the html structure is opposite of other fields
        This is so tabs go to the input before the label actions slot
      */}
      {description && <p className={classes.description}>{description}</p>}
      <div className={classes.inputWrap}>
        <input
          {...elementAttributes}
          disabled={disabled}
          className={classes.input}
          value={value || ''}
          onChange={
            customOnChange
              ? customOnChange
              : (e) => {
                  onChange(e.target.value)
                }
          }
          placeholder={placeholder}
          type={type === 'password' && !isHidden ? 'text' : type}
          id={path}
          name={name ?? path}
          readOnly={readOnly}
        />
        {(icon || suffix) && (
          <div className={classes.iconWrapper}>
            {suffix && <div className={classes.suffix}>{suffix}</div>}
            {icon && <div className={classes.icon}>{icon}</div>}
          </div>
        )}
      </div>
      {type !== 'hidden' && (
        <React.Fragment>
          <Error
            showError={Boolean((showError || showErrorFromProps) && errorMessage)}
            message={errorMessage}
          />
          <Label
            htmlFor={path}
            label={label}
            required={required}
            margin={false}
            actionsSlot={
              <React.Fragment>
                {copy && <CopyToClipboard value={value} />}
                {type === 'password' && (
                  <Tooltip
                    text={isHidden ? 'show' : 'hide'}
                    onClick={() => setIsHidden((h) => !h)}
                    className={classes.tooltipButton}
                  >
                    <EyeIcon closed={isHidden} size="large" />
                  </Tooltip>
                )}
              </React.Fragment>
            }
          />
        </React.Fragment>
      )}
    </div>
  )
}
```

# \_components/forms/fields/Textarea/index.tsx

```tsx
'use client'

import React from 'react'

import { CopyToClipboard } from '@app/_components/CopyToClipboard'
import Error from '../../Error'
import Label from '../../Label'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

export const Textarea: React.FC<
  FieldProps<string> & {
    rows?: number
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLTextAreaElement>
  }
> = (props) => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    rows = 3,
    initialValue,
    className,
    copy,
    elementAttributes = {
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'none',
    },
  } = props

  const defaultValidateFunction = React.useCallback(
    (fieldValue: any | string): string | true => {
      if (required && !fieldValue) {
        return 'Please enter a value.'
      }

      if (fieldValue && typeof fieldValue !== 'string') {
        return 'This field can only be a string.'
      }

      return true
    },
    [required],
  )

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  return (
    <div className={[className, classes.wrap].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <Label
        htmlFor={path}
        label={label}
        required={required}
        actionsSlot={copy && <CopyToClipboard value={value} />}
      />
      <textarea
        {...elementAttributes}
        rows={rows}
        className={classes.textarea}
        value={value || ''}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        id={path}
        name={path}
      />
    </div>
  )
}
```

# \_components/forms/fields/Select/index.tsx

```tsx
'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import ReactSelect from 'react-select'

import Error from '../../Error'
import Label from '../../Label'
import { useFormField } from '../../useFormField'
import { FieldProps } from '../types'

import classes from './index.module.scss'

type Option = {
  label: string
  value: any
}

type SelectProps = FieldProps<string | string[]> & {
  options: Option[]
  isMulti?: boolean
  isClearable?: boolean
  components?: {
    [key: string]: React.FC<any>
  }
  selectProps?: any
  value?: string | string[]
  onMenuScrollToBottom?: () => void
}

export const Select: React.FC<SelectProps> = (props) => {
  const {
    path,
    required,
    validate,
    label,
    options,
    onChange,
    className,
    initialValue: initialValueFromProps, // allow external control
    isMulti,
    isClearable,
    components,
    selectProps,
    value: valueFromProps, // allow external control
    description,
    disabled,
    onMenuScrollToBottom,
  } = props

  const id = useId()
  const ref = useRef<any>(null)
  const prevValueFromProps = useRef<string | string[] | undefined>(valueFromProps)

  const defaultValidateFunction = React.useCallback(
    (fieldValue: any | Option | Option[]): string | true => {
      // need to check all types of values here, strings, arrays, and objects
      if (
        required &&
        (!fieldValue ||
          (Array.isArray(fieldValue)
            ? !fieldValue.length
            : !(typeof fieldValue === 'string' ? fieldValue : fieldValue?.value)))
      ) {
        return 'This field is required.'
      }

      const isValid = Array.isArray(fieldValue)
        ? fieldValue.every((v) =>
            options.find((item) => item.value === (typeof v === 'string' ? v : v?.value)),
          ) // eslint-disable-line function-paren-newline
        : options.find(
            (item) =>
              item.value === (typeof fieldValue === 'string' ? fieldValue : fieldValue?.value),
          )

      if (!isValid) {
        return 'Selected value is not valid option.'
      }

      return true
    },
    [options, required],
  )

  const fieldFromContext = useFormField<string | string[]>({
    path,
    validate: validate || defaultValidateFunction,
    initialValue: initialValueFromProps,
  })

  const { value: valueFromContext, showError, setValue, errorMessage } = fieldFromContext

  const [internalState, setInternalState] = useState<Option | Option[] | undefined>(() => {
    const initialValue = valueFromContext || initialValueFromProps

    if (initialValue && Array.isArray(initialValue)) {
      const matchedOption =
        options?.filter((item) => {
          // `item.value` could be string or array, i.e. `isMulti`
          if (Array.isArray(item.value)) {
            return item.value.find((x) => initialValue.find((y) => y === x))
          }

          return initialValue.find((x) => x === item.value)
        }) || []

      return matchedOption
    }

    return options?.find((item) => item.value === initialValue) || undefined
  })

  const setFormattedValue = useCallback(
    (incomingSelection?: string | string[]) => {
      let isDifferent = false
      let differences

      if (incomingSelection && !internalState) {
        isDifferent = true
      }

      if (incomingSelection && internalState) {
        if (Array.isArray(incomingSelection) && Array.isArray(internalState)) {
          const internalValues = internalState.map((item) => item.value)
          differences = incomingSelection.filter((x) => internalValues.includes(x))
          isDifferent = differences.length > 0
        }

        if (typeof incomingSelection === 'string' && typeof internalState === 'string') {
          isDifferent = incomingSelection !== internalState
        }

        if (
          typeof incomingSelection === 'string' &&
          typeof internalState === 'object' &&
          internalState !== null &&
          'value' in internalState
        ) {
          isDifferent = incomingSelection !== internalState.value
        }
      }

      if (incomingSelection !== undefined && isDifferent) {
        let newValue: Option | Option[] | undefined = undefined

        if (Array.isArray(incomingSelection)) {
          newValue =
            options?.filter((item) => incomingSelection.find((x) => x === item.value)) || []
        }

        if (typeof incomingSelection === 'string') {
          newValue = options?.find((item) => item.value === incomingSelection) || undefined
        }

        setInternalState(newValue)
      }
    },
    [internalState, options],
  )

  // allow external control
  useEffect(() => {
    // compare prevValueFromProps.current to valueFromProps
    // this is bc components which are externally control the value AND rendered inside the form context
    // will throw an infinite loop after the form state is updated-even if the value is the same, it is a new instance
    if (valueFromProps !== prevValueFromProps.current) {
      setFormattedValue(valueFromProps)
      prevValueFromProps.current = valueFromProps
    }
  }, [valueFromProps, setFormattedValue, prevValueFromProps])

  const handleChange = useCallback(
    (incomingSelection: any | Option | Option[]) => {
      let selectedOption

      if (Array.isArray(incomingSelection)) {
        selectedOption = incomingSelection.map((item) => item.value)
      } else {
        selectedOption = incomingSelection.value
      }
      setInternalState(incomingSelection)

      if (typeof setValue === 'function') {
        setValue(selectedOption)
      }

      if (typeof onChange === 'function') {
        onChange(selectedOption)
      }
    },
    [onChange, setValue],
  )

  return (
    <div
      className={[className, classes.select, showError && classes.error].filter(Boolean).join(' ')}
    >
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <ReactSelect
        ref={ref}
        isMulti={isMulti}
        isClearable={isClearable}
        instanceId={id}
        onChange={handleChange}
        options={options}
        value={internalState}
        className={classes.reactSelect}
        classNamePrefix="rs"
        components={components}
        //  @ts-expect-error
        selectProps={selectProps}
        isDisabled={disabled}
        onMenuScrollToBottom={onMenuScrollToBottom}
        noOptionsMessage={() => 'No options'}
      />
      {description && <div className={classes.description}>{description}</div>}
    </div>
  )
}
```

# \_components/forms/fields/Secret/index.tsx

```tsx
'use client'

import React, { Fragment } from 'react'
import Label from '@app/_components/forms/Label'

import { CopyToClipboard } from '@app/_components/CopyToClipboard'
import { Tooltip } from '@app/_components/Tooltip'
import { EyeIcon } from '@app/_icons/EyeIcon'
import Error from '../../Error'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

type SecretProps = FieldProps<string> & {
  loadSecret: () => Promise<string>
  largeLabel?: boolean
  readOnly?: boolean
}

export const Secret: React.FC<SecretProps> = (props) => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    initialValue,
    className,
    loadSecret: loadValue,
    description,
    largeLabel,
    readOnly,
  } = props

  const [isValueLoaded, setIsValueLoaded] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(true)

  const defaultValidateFunction = React.useCallback(
    (fieldValue: any | boolean): string | true => {
      if (required && !fieldValue) {
        return 'Please enter a value.'
      }

      if (fieldValue && typeof fieldValue !== 'string') {
        return 'This field can only be a string.'
      }

      return true
    },
    [required],
  )

  const {
    onChange,
    value = '',
    showError,
    errorMessage,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  const loadExternalValue = React.useCallback(async (): Promise<string | null> => {
    try {
      const loadedValue = await loadValue()
      onChange(loadedValue)
      setIsValueLoaded(true)
      return loadedValue
    } catch (e) {
      console.error('Error loading external field value', e) // eslint-disable-line no-console
      return null
    }
  }, [loadValue, onChange])

  const toggleVisibility = React.useCallback(async () => {
    if (!isValueLoaded) await loadExternalValue()

    setIsHidden(!isHidden)
  }, [isHidden, isValueLoaded, loadExternalValue])

  return (
    <div
      className={[className, classes.wrap, isHidden ? classes.isHidden : '']
        .filter(Boolean)
        .join(' ')}
    >
      {/*
        This field is display flex in column-reverse, so the html structure is opposite of other fields
        This is so tabs go to the input before the label actions slot
      */}
      {description && <p className={classes.description}>{description}</p>}
      <input
        className={classes.input}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        id={path}
        name={path}
        required={required}
        type="text"
        value={isHidden ? '••••••••••••••••••••••••••••••' : value || ''}
        tabIndex={isHidden ? -1 : 0}
        readOnly={readOnly}
      />
      <Error showError={showError} message={errorMessage} />
      <Label
        htmlFor={path}
        label={label}
        required={required}
        className={largeLabel ? classes.largeLabel : ''}
        actionsSlot={
          <React.Fragment>
            <Tooltip
              text={isHidden ? 'show' : 'hide'}
              onClick={toggleVisibility}
              className={classes.tooltipButton}
            >
              <EyeIcon closed={isHidden} size="large" />
            </Tooltip>
            <CopyToClipboard value={isValueLoaded ? value : loadExternalValue} />
          </React.Fragment>
        }
      />
    </div>
  )
}
```

# \_components/forms/fields/RadioGroup/index.tsx

```tsx
'use client'

import React, { useId } from 'react'

import Error from '../../Error'
import Label from '../../Label'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

export type Option = {
  label: string | React.ReactElement
  value: string
}

const RadioGroup: React.FC<
  FieldProps<string> & {
    options: Option[]
    layout?: 'vertical' | 'horizontal'
    hidden?: boolean
  }
> = (props) => {
  const {
    path,
    required = false,
    validate,
    label,
    options,
    onChange: onChangeFromProps,
    initialValue,
    layout,
    hidden,
    onClick,
    className,
  } = props

  const id = useId()

  const defaultValidateFunction = React.useCallback(
    (fieldValue: any | string): string | true => {
      if (required && !fieldValue) {
        return 'Please make a selection.'
      }

      if (fieldValue && !options.find((option) => option && option.value === fieldValue)) {
        return 'This field has an invalid selection'
      }

      return true
    },
    [required, options],
  )

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  return (
    <div
      className={[className, classes.wrap, layout && classes[`layout--${layout}`]]
        .filter(Boolean)
        .join(' ')}
    >
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <ul className={classes.ul}>
        {options.map((option, index) => {
          const isSelected = String(option.value) === String(value)
          const optionId = `${id}-${index}`

          return (
            <li key={index} className={classes.li}>
              <label htmlFor={optionId} className={classes.radioWrap} onClick={onClick}>
                <input
                  id={optionId}
                  type="radio"
                  checked={isSelected}
                  onChange={() => {
                    onChange(option.value)
                  }}
                />
                <span
                  className={[
                    classes.radio,
                    isSelected && classes.selected,
                    hidden && classes.hidden,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                <span className={classes.label}>{option.label}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RadioGroup
```

# \_components/forms/fields/Number/index.tsx

```tsx
'use client'

import React from 'react'

import { isNumber } from '@/utilities/isNumber'
import Error from '../../Error'
import Label from '../../Label'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

export const NumberInput: React.FC<FieldProps<number>> = (props) => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    className,
    initialValue,
  } = props

  const defaultValidateFunction = React.useCallback(
    (fieldValue: any | number | string): string | true => {
      const stringVal = fieldValue as string
      if (required && (!fieldValue || stringVal.length === 0)) {
        return 'Please enter a value.'
      }

      if (fieldValue && !isNumber(fieldValue)) {
        return 'This field can only be a number.'
      }

      return true
    },
    [required],
  )

  const { onChange, value, showError, errorMessage } = useField<number>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  return (
    <div className={[classes.wrap, className].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <input
        className={classes.input}
        value={value || ''}
        onChange={(e) => {
          onChange(Number(e.target.value))
        }}
        placeholder={placeholder}
        type="number"
        id={path}
        name={path}
      />
    </div>
  )
}
```

# \_components/forms/fields/Checkbox/index.tsx

```tsx
'use client'

import React, { useEffect } from 'react'
import Label from '@app/_components/forms/Label'

import { CheckIcon } from '@app/_icons/CheckIcon'
import Error from '../../Error'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

export const Checkbox: React.FC<
  FieldProps<boolean> & {
    checked?: boolean
  }
> = (props) => {
  const {
    path,
    required,
    label,
    onChange: onChangeFromProps,
    initialValue,
    validate,
    className,
    checked: checkedFromProps,
    disabled,
  } = props

  const [checked, setChecked] = React.useState<boolean | undefined | null>(initialValue || false)
  const prevChecked = React.useRef<boolean | undefined | null>(checked)
  const prevContextValue = React.useRef<boolean | undefined | null>(initialValue)

  const defaultValidateFunction = React.useCallback(
    (fieldValue: any): string | true => {
      if (required && !fieldValue) {
        return 'This field is required.'
      }

      if (typeof fieldValue !== 'boolean') {
        return 'This field can only be equal to true or false.'
      }

      return true
    },
    [required],
  )

  const {
    onChange,
    value: valueFromContext,
    showError,
    errorMessage,
  } = useField<boolean>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  // allow external control
  useEffect(() => {
    if (
      checkedFromProps !== undefined &&
      checkedFromProps !== prevChecked.current &&
      checkedFromProps !== checked
    ) {
      setChecked(checkedFromProps)
    }

    prevChecked.current = checkedFromProps
  }, [checkedFromProps, checked])

  // allow context control
  useEffect(() => {
    if (
      valueFromContext !== undefined &&
      valueFromContext !== prevContextValue.current &&
      valueFromContext !== checked
    ) {
      setChecked(valueFromContext)
    }

    prevContextValue.current = valueFromContext
  }, [valueFromContext, checked])

  return (
    <div
      className={[
        className,
        classes.checkbox,
        showError && classes.error,
        checked && classes.checked,
        disabled && classes.disabled,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.errorWrap}>
        <Error showError={showError} message={errorMessage} />
      </div>
      <input
        className={classes.htmlInput}
        type="checkbox"
        name={path}
        id={path}
        checked={Boolean(checked)}
        readOnly
        disabled={disabled}
        tabIndex={-1}
      />
      <button
        type="button"
        className={classes.button}
        onClick={() => {
          if (!disabled) onChange(!checked)
        }}
        disabled={disabled}
      >
        <span className={classes.input}>
          <CheckIcon className={classes.icon} size="medium" bold />
        </span>
        <Label className={classes.label} htmlFor={path} label={label} required={required} />
      </button>
    </div>
  )
}
```

# \_components/forms/fields/Array/index.tsx

```tsx
import * as React from 'react'

import { CircleIconButton } from '@app/_components/CircleIconButton'
import { TrashIcon } from '@app/_icons/TrashIcon'
import { useArray } from './context'

import classes from './index.module.scss'

type ArrayRowProps = {
  children: React.ReactNode
  className?: string
  index: number
  allowRemove: boolean
}
export const ArrayRow: React.FC<ArrayRowProps> = (props) => {
  const { removeRow } = useArray()
  const { children, allowRemove, index, className } = props

  return (
    <div className={[className, classes.row].filter(Boolean).join(' ')}>
      <div className={classes.children}>{children}</div>

      {allowRemove && (
        <button
          type="button"
          onClick={() => {
            removeRow(index)
          }}
          className={classes.trashButton}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  )
}

type AddRowProps = {
  className?: string
  label?: string
  singularLabel?: string
  pluralLabel?: string
  baseLabel?: string
}

export const AddArrayRow: React.FC<AddRowProps> = ({
  className,
  label: labelFromProps,
  baseLabel = 'Add',
  singularLabel = 'one',
  pluralLabel = 'another',
}) => {
  const { addRow, uuids } = useArray()

  const label =
    labelFromProps ||
    (!uuids?.length ? `${baseLabel} ${pluralLabel}` : `${baseLabel} ${singularLabel}`)

  return <CircleIconButton className={className} onClick={addRow} label={label} />
}
```

# \_components/forms/fields/Array/context.tsx

```tsx
import * as React from 'react'

import { uuid } from '@/utilities/uuid'

const ArrayContext = React.createContext<{
  addRow: () => void
  removeRow: (index: number) => void // eslint-disable-line no-unused-vars
  clearRows: () => void
  uuids: string[]
}>({
  addRow: () => {},
  removeRow: () => {},
  clearRows: () => {},
  uuids: [],
})

export const useArray = () => React.useContext(ArrayContext)

export const ArrayProvider: React.FC<{
  children: React.ReactNode
  instantiateEmpty?: boolean
  clearCount?: number // increment this to clear the array
}> = (props) => {
  const { children, instantiateEmpty, clearCount } = props

  const [uuids, setUUIDs] = React.useState<string[]>(instantiateEmpty ? [] : [uuid()])

  const addRow = React.useCallback(() => {
    setUUIDs((prev) => [...prev, uuid()])
  }, [])

  const removeRow = React.useCallback(
    (index: number) => {
      setUUIDs((prev) => {
        const initialRows = (instantiateEmpty ? [] : [uuid()]) as string[]
        const remainingRows = prev.filter((_, i) => i !== index)
        return remainingRows.length > 0 ? remainingRows : initialRows
      })
    },
    [instantiateEmpty],
  )

  const clearRows = React.useCallback(() => {
    setUUIDs(instantiateEmpty ? [] : [uuid()])
  }, [instantiateEmpty])

  React.useEffect(() => {
    if (typeof clearCount === 'number' && clearCount > 0) {
      clearRows()
    }
  }, [clearCount, clearRows])

  return (
    <ArrayContext.Provider
      value={{
        addRow,
        removeRow,
        clearRows,
        uuids,
      }}
    >
      {children}
    </ArrayContext.Provider>
  )
}
```

# \_components/CMSForm/fields/Textarea/index.tsx

```tsx
'use client'

import React, { useEffect, useRef } from 'react'
import Error from '@app/_components/forms/Error'
import { FieldProps } from '@app/_components/forms/fields/types'
import { useField } from '@app/_components/forms/fields/useField'

import Label from '@app/_components/CMSForm/Label'
import { CopyToClipboard } from '@app/_components/CopyToClipboard'

import classes from './index.module.scss'

export const Textarea: React.FC<
  FieldProps<string> & {
    rows?: number
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLTextAreaElement>
  }
> = (props) => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    rows = 3,
    initialValue,
    className,
    copy,
    elementAttributes = {
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'none',
    },
    showError: showErrorFromProps,
  } = props
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = React.useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    setIsFocused(value ? true : false)
  }

  const defaultValidateFunction = React.useCallback(
    (fieldValue: unknown): string | true => {
      if (required && !fieldValue) {
        return 'Please enter a value.'
      }

      if (fieldValue && typeof fieldValue !== 'string') {
        return 'This field can only be a string.'
      }

      return true
    },
    [required],
  )

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  useEffect(() => {
    if (inputRef.current) {
      if (value && value !== '') {
        inputRef.current.style.setProperty(
          '--intrinsic-height',
          String(inputRef.current.scrollHeight ?? 100),
        )
      } else {
        inputRef.current.style.setProperty('--intrinsic-height', String(100))
      }
    }
  }, [inputRef, value])

  return (
    <div
      className={[
        className,
        classes.wrap,
        (showError || showErrorFromProps) && classes.showError,
        isFocused && classes.focused,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={[classes.errorAndLabel].filter(Boolean).join(' ')}>
        <Label
          htmlFor={path}
          label={label}
          required={required}
          actionsSlot={copy && <CopyToClipboard value={value} />}
          className={[classes.textareaLabel].filter(Boolean).join(' ')}
        />
        <Error
          className={classes.errorLabel}
          showError={Boolean((showError || showErrorFromProps) && errorMessage)}
          message={errorMessage}
        />
      </div>
      <textarea
        {...elementAttributes}
        ref={inputRef}
        rows={rows}
        className={[classes.textarea].filter(Boolean).join(' ')}
        value={value || ''}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        id={path}
        name={path}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}
```

# \_components/CMSForm/fields/Text/index.tsx

```tsx
'use client'

import React, { Fragment, useEffect } from 'react'
import Error from '@app/_components/forms/Error'
import { FieldProps } from '@app/_components/forms/fields/types'
import { useField } from '@app/_components/forms/fields/useField'

import Label from '@app/_components/CMSForm/Label'
import { CopyToClipboard } from '@app/_components/CopyToClipboard'
import { Tooltip } from '@app/_components/Tooltip'
import { EyeIcon } from '@app/_icons/EyeIcon'

import classes from './index.module.scss'

export const Text: React.FC<
  FieldProps<string> & {
    type?: 'text' | 'password' | 'hidden'
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    value?: string
    customOnChange?: (e: any) => void
    suffix?: React.ReactNode
    readOnly?: boolean
  }
> = (props) => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    type = 'text',
    onChange: onChangeFromProps,
    customOnChange,
    initialValue,
    className,
    copy = false,
    disabled,
    readOnly,
    elementAttributes = {
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'none',
    },
    description,
    value: valueFromProps,
    showError: showErrorFromProps,
    icon,
    fullWidth = true,
    suffix,
  } = props

  const prevValueFromProps = React.useRef(valueFromProps)

  const [isHidden, setIsHidden] = React.useState(type === 'password')
  const [isFocused, setIsFocused] = React.useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    setIsFocused(value ? true : false)
  }

  const defaultValidateFunction = React.useCallback(
    (fieldValue: unknown): string | true => {
      if (required && !fieldValue) {
        return 'Please enter a value.'
      }

      if (fieldValue && typeof fieldValue !== 'string') {
        return 'This field can only be a string.'
      }

      return true
    },
    [required],
  )

  const {
    onChange,
    value: valueFromContext,
    showError,
    errorMessage,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  const value = valueFromProps || valueFromContext

  useEffect(() => {
    if (
      valueFromProps !== undefined &&
      valueFromProps !== prevValueFromProps.current &&
      valueFromProps !== valueFromContext
    ) {
      prevValueFromProps.current = valueFromProps
      onChange(valueFromProps)
    }
  }, [valueFromProps, onChange, valueFromContext])

  return (
    <div
      className={[
        className,
        classes.component,
        (showError || showErrorFromProps) && classes.showError,
        classes[`type--${type}`],
        fullWidth && classes.fullWidth,
        isFocused && classes.focused,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {description && <p className={classes.description}>{description}</p>}
      {type !== 'hidden' && (
        <div className={[classes.errorAndLabel].filter(Boolean).join(' ')}>
          <Label
            actionsClassName={[!copy && type !== 'password' && classes.actionsLabel]
              .filter(Boolean)
              .join(' ')}
            className={[classes.textLabel].filter(Boolean).join(' ')}
            htmlFor={path}
            label={label}
            required={required}
            margin={false}
            actionsSlot={
              <React.Fragment>
                {copy && <CopyToClipboard value={value} />}
                {type === 'password' && (
                  <Tooltip
                    text={isHidden ? 'show' : 'hide'}
                    onClick={() => setIsHidden((h) => !h)}
                    className={classes.tooltipButton}
                  >
                    <EyeIcon closed={isHidden} size="large" />
                  </Tooltip>
                )}
              </React.Fragment>
            }
          />
          <Error
            className={classes.error}
            showError={Boolean((showError || showErrorFromProps) && errorMessage)}
            message={errorMessage}
          />
        </div>
      )}
      <input
        {...elementAttributes}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={[classes.input].filter(Boolean).join(' ')}
        value={value || ''}
        onChange={
          customOnChange
            ? customOnChange
            : (e) => {
                onChange(e.target.value)
              }
        }
        placeholder={placeholder}
        type={type === 'password' && !isHidden ? 'text' : type}
        id={path}
        name={path}
        readOnly={readOnly}
      />
      {(icon || suffix) && (
        <div className={classes.iconWrapper}>
          {suffix && <div className={classes.suffix}>{suffix}</div>}
          {icon && <div className={classes.icon}>{icon}</div>}
        </div>
      )}
    </div>
  )
}
```

# \_components/CMSForm/fields/Select/states.ts

```ts
export const stateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
]
```

# \_components/CMSForm/fields/Select/index.tsx

```tsx
'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import ReactSelect from 'react-select'
import Error from '@app/_components/forms/Error'
import { FieldProps } from '@app/_components/forms/fields/types'
import { useFormField } from '@app/_components/forms/useFormField'

import Label from '@app/_components/CMSForm/Label'
import { countryOptions } from './countries'
import { stateOptions } from './states'

import classes from './index.module.scss'

type Option = {
  label: string
  value: any
}

type SelectProps = FieldProps<string | string[]> & {
  options: Option[]
  isMulti?: boolean
  isClearable?: boolean
  components?: {
    [key: string]: React.FC<any>
  }
  selectProps?: any
  value?: string | string[]
  onMenuScrollToBottom?: () => void
}

export const Select: React.FC<SelectProps & { selectType?: 'normal' | 'state' | 'country' }> = (
  props,
) => {
  const {
    path,
    required,
    validate,
    label,
    options: optionsFromProps,
    onChange,
    className,
    initialValue: initialValueFromProps, // allow external control
    isMulti,
    isClearable,
    components,
    selectProps,
    value: valueFromProps, // allow external control
    description,
    disabled,
    onMenuScrollToBottom,
    selectType = 'normal',
  } = props

  const [isFocused, setIsFocused] = React.useState(false)

  const id = useId()
  const ref = useRef<any>(null)
  const prevValueFromProps = useRef<string | string[] | undefined>(valueFromProps)

  const options = useMemo(() => {
    switch (selectType) {
      case 'state':
        return stateOptions
      case 'country':
        return countryOptions
      default:
        return optionsFromProps
    }
  }, [selectType, optionsFromProps])

  const defaultValidateFunction = React.useCallback(
    (fieldValue: Option | Option[]): string | true => {
      // need to check all types of values here, strings, arrays, and objects
      if (
        required &&
        (!fieldValue ||
          (Array.isArray(fieldValue)
            ? !fieldValue.length
            : !(typeof fieldValue === 'string' ? fieldValue : fieldValue?.value)))
      ) {
        return 'This field is required.'
      }

      const isValid = Array.isArray(fieldValue)
        ? fieldValue.every((v) =>
            options.find((item) => item.value === (typeof v === 'string' ? v : v?.value)),
          ) // eslint-disable-line function-paren-newline
        : options.find(
            (item) =>
              item.value === (typeof fieldValue === 'string' ? fieldValue : fieldValue?.value),
          )

      if (!isValid) {
        return 'Selected value is not valid option.'
      }

      return true
    },
    [options, required],
  )

  const fieldFromContext = useFormField<string | string[]>({
    path,
    validate: validate || defaultValidateFunction,
    initialValue: initialValueFromProps,
  })

  const { value: valueFromContext, showError, setValue, errorMessage } = fieldFromContext

  const [internalState, setInternalState] = useState<Option | Option[] | undefined>(() => {
    const initialValue = valueFromContext || initialValueFromProps

    if (initialValue && Array.isArray(initialValue)) {
      const matchedOption =
        options?.filter((item) => {
          // `item.value` could be string or array, i.e. `isMulti`
          if (Array.isArray(item.value)) {
            return item.value.find((x) => initialValue.find((y) => y === x))
          }

          return initialValue.find((x) => x === item.value)
        }) || []

      return matchedOption
    }

    return options?.find((item) => item.value === initialValue) || undefined
  })

  const setFormattedValue = useCallback(
    (incomingSelection?: any | string | string[]) => {
      let isDifferent = false
      let differences

      if (incomingSelection && !internalState) {
        isDifferent = true
      }

      if (incomingSelection && internalState) {
        if (Array.isArray(incomingSelection) && Array.isArray(internalState)) {
          const internalValues = internalState.map((item) => item.value)
          differences = incomingSelection.filter((x) => internalValues.includes(x))
          isDifferent = differences.length > 0
        }

        if (typeof incomingSelection === 'string' && typeof internalState === 'string') {
          isDifferent = incomingSelection !== internalState
        }

        if (
          typeof incomingSelection === 'string' &&
          typeof internalState === 'object' &&
          internalState !== null &&
          'value' in internalState
        ) {
          isDifferent = incomingSelection !== internalState.value
        }
      }

      if (incomingSelection !== undefined && isDifferent) {
        let newValue: Option | Option[] | undefined = undefined

        if (Array.isArray(incomingSelection)) {
          newValue =
            options?.filter((item) => incomingSelection.find((x) => x === item.value)) || []
        }

        if (typeof incomingSelection === 'string') {
          newValue = options?.find((item) => item.value === incomingSelection) || undefined
        }

        setInternalState(newValue)
      }
    },
    [internalState, options],
  )

  // allow external control
  useEffect(() => {
    // compare prevValueFromProps.current to valueFromProps
    // this is bc components which are externally control the value AND rendered inside the form context
    // will throw an infinite loop after the form state is updated-even if the value is the same, it is a new instance
    if (valueFromProps !== prevValueFromProps.current) {
      setFormattedValue(valueFromProps)
      setIsFocused(!!valueFromProps)
      prevValueFromProps.current = valueFromProps
    }
  }, [valueFromProps, setFormattedValue, prevValueFromProps])

  const handleChange = useCallback(
    (incomingSelection: any | Option | Option[]) => {
      let selectedOption

      if (Array.isArray(incomingSelection)) {
        selectedOption = incomingSelection.map((item) => item.value)
      } else {
        selectedOption = incomingSelection.value
      }
      setInternalState(incomingSelection)

      // Keep isFocused true if an option is selected
      setIsFocused(!!incomingSelection)

      if (typeof setValue === 'function') {
        setValue(selectedOption)
      }

      if (typeof onChange === 'function') {
        onChange(selectedOption)
      }
    },
    [onChange, setValue],
  )

  const handleMenuClose = () => {
    // Only set isFocused to false if no option is selected
    if (!internalState || (Array.isArray(internalState) && internalState.length === 0)) {
      setIsFocused(false)
    }
  }

  return (
    <div
      className={[
        className,
        classes.select,
        showError && classes.error,
        isFocused && classes.focused,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={[classes.errorAndLabel].filter(Boolean).join(' ')}>
        <Label
          className={[classes.selectLabel].filter(Boolean).join(' ')}
          htmlFor={path}
          label={label}
          required={required}
        />
        <Error className={classes.errorLabel} showError={showError} message={errorMessage} />
      </div>
      <ReactSelect
        ref={ref}
        isMulti={isMulti}
        isClearable={isClearable}
        instanceId={id}
        onChange={handleChange}
        options={options}
        value={internalState}
        className={classes.reactSelect}
        classNamePrefix="rs"
        components={components}
        // @ts-expect-error
        selectProps={selectProps}
        isDisabled={disabled}
        onMenuScrollToBottom={onMenuScrollToBottom}
        noOptionsMessage={() => 'No options'}
        onMenuOpen={() => setIsFocused(true)}
        onMenuClose={handleMenuClose}
      />
      {description && <div className={classes.description}>{description}</div>}
    </div>
  )
}
```

# \_components/CMSForm/fields/Select/countries.ts

```ts
export const countryOptions = [
  {
    label: 'Afghanistan',
    value: 'AF',
  },
  {
    label: 'Åland Islands',
    value: 'AX',
  },
  {
    label: 'Albania',
    value: 'AL',
  },
  {
    label: 'Algeria',
    value: 'DZ',
  },
  {
    label: 'American Samoa',
    value: 'AS',
  },
  {
    label: 'Andorra',
    value: 'AD',
  },
  {
    label: 'Angola',
    value: 'AO',
  },
  {
    label: 'Anguilla',
    value: 'AI',
  },
  {
    label: 'Antarctica',
    value: 'AQ',
  },
  {
    label: 'Antigua and Barbuda',
    value: 'AG',
  },
  {
    label: 'Argentina',
    value: 'AR',
  },
  {
    label: 'Armenia',
    value: 'AM',
  },
  {
    label: 'Aruba',
    value: 'AW',
  },
  {
    label: 'Australia',
    value: 'AU',
  },
  {
    label: 'Austria',
    value: 'AT',
  },
  {
    label: 'Azerbaijan',
    value: 'AZ',
  },
  {
    label: 'Bahamas',
    value: 'BS',
  },
  {
    label: 'Bahrain',
    value: 'BH',
  },
  {
    label: 'Bangladesh',
    value: 'BD',
  },
  {
    label: 'Barbados',
    value: 'BB',
  },
  {
    label: 'Belarus',
    value: 'BY',
  },
  {
    label: 'Belgium',
    value: 'BE',
  },
  {
    label: 'Belize',
    value: 'BZ',
  },
  {
    label: 'Benin',
    value: 'BJ',
  },
  {
    label: 'Bermuda',
    value: 'BM',
  },
  {
    label: 'Bhutan',
    value: 'BT',
  },
  {
    label: 'Bolivia',
    value: 'BO',
  },
  {
    label: 'Bosnia and Herzegovina',
    value: 'BA',
  },
  {
    label: 'Botswana',
    value: 'BW',
  },
  {
    label: 'Bouvet Island',
    value: 'BV',
  },
  {
    label: 'Brazil',
    value: 'BR',
  },
  {
    label: 'British Indian Ocean Territory',
    value: 'IO',
  },
  {
    label: 'Brunei Darussalam',
    value: 'BN',
  },
  {
    label: 'Bulgaria',
    value: 'BG',
  },
  {
    label: 'Burkina Faso',
    value: 'BF',
  },
  {
    label: 'Burundi',
    value: 'BI',
  },
  {
    label: 'Cambodia',
    value: 'KH',
  },
  {
    label: 'Cameroon',
    value: 'CM',
  },
  {
    label: 'Canada',
    value: 'CA',
  },
  {
    label: 'Cape Verde',
    value: 'CV',
  },
  {
    label: 'Cayman Islands',
    value: 'KY',
  },
  {
    label: 'Central African Republic',
    value: 'CF',
  },
  {
    label: 'Chad',
    value: 'TD',
  },
  {
    label: 'Chile',
    value: 'CL',
  },
  {
    label: 'China',
    value: 'CN',
  },
  {
    label: 'Christmas Island',
    value: 'CX',
  },
  {
    label: 'Cocos (Keeling) Islands',
    value: 'CC',
  },
  {
    label: 'Colombia',
    value: 'CO',
  },
  {
    label: 'Comoros',
    value: 'KM',
  },
  {
    label: 'Congo',
    value: 'CG',
  },
  {
    label: 'Congo, The Democratic Republic of the',
    value: 'CD',
  },
  {
    label: 'Cook Islands',
    value: 'CK',
  },
  {
    label: 'Costa Rica',
    value: 'CR',
  },
  {
    label: "Cote D'Ivoire",
    value: 'CI',
  },
  {
    label: 'Croatia',
    value: 'HR',
  },
  {
    label: 'Cuba',
    value: 'CU',
  },
  {
    label: 'Cyprus',
    value: 'CY',
  },
  {
    label: 'Czech Republic',
    value: 'CZ',
  },
  {
    label: 'Denmark',
    value: 'DK',
  },
  {
    label: 'Djibouti',
    value: 'DJ',
  },
  {
    label: 'Dominica',
    value: 'DM',
  },
  {
    label: 'Dominican Republic',
    value: 'DO',
  },
  {
    label: 'Ecuador',
    value: 'EC',
  },
  {
    label: 'Egypt',
    value: 'EG',
  },
  {
    label: 'El Salvador',
    value: 'SV',
  },
  {
    label: 'Equatorial Guinea',
    value: 'GQ',
  },
  {
    label: 'Eritrea',
    value: 'ER',
  },
  {
    label: 'Estonia',
    value: 'EE',
  },
  {
    label: 'Ethiopia',
    value: 'ET',
  },
  {
    label: 'Falkland Islands (Malvinas)',
    value: 'FK',
  },
  {
    label: 'Faroe Islands',
    value: 'FO',
  },
  {
    label: 'Fiji',
    value: 'FJ',
  },
  {
    label: 'Finland',
    value: 'FI',
  },
  {
    label: 'France',
    value: 'FR',
  },
  {
    label: 'French Guiana',
    value: 'GF',
  },
  {
    label: 'French Polynesia',
    value: 'PF',
  },
  {
    label: 'French Southern Territories',
    value: 'TF',
  },
  {
    label: 'Gabon',
    value: 'GA',
  },
  {
    label: 'Gambia',
    value: 'GM',
  },
  {
    label: 'Georgia',
    value: 'GE',
  },
  {
    label: 'Germany',
    value: 'DE',
  },
  {
    label: 'Ghana',
    value: 'GH',
  },
  {
    label: 'Gibraltar',
    value: 'GI',
  },
  {
    label: 'Greece',
    value: 'GR',
  },
  {
    label: 'Greenland',
    value: 'GL',
  },
  {
    label: 'Grenada',
    value: 'GD',
  },
  {
    label: 'Guadeloupe',
    value: 'GP',
  },
  {
    label: 'Guam',
    value: 'GU',
  },
  {
    label: 'Guatemala',
    value: 'GT',
  },
  {
    label: 'Guernsey',
    value: 'GG',
  },
  {
    label: 'Guinea',
    value: 'GN',
  },
  {
    label: 'Guinea-Bissau',
    value: 'GW',
  },
  {
    label: 'Guyana',
    value: 'GY',
  },
  {
    label: 'Haiti',
    value: 'HT',
  },
  {
    label: 'Heard Island and Mcdonald Islands',
    value: 'HM',
  },
  {
    label: 'Holy See (Vatican City State)',
    value: 'VA',
  },
  {
    label: 'Honduras',
    value: 'HN',
  },
  {
    label: 'Hong Kong',
    value: 'HK',
  },
  {
    label: 'Hungary',
    value: 'HU',
  },
  {
    label: 'Iceland',
    value: 'IS',
  },
  {
    label: 'India',
    value: 'IN',
  },
  {
    label: 'Indonesia',
    value: 'ID',
  },
  {
    label: 'Iran, Islamic Republic Of',
    value: 'IR',
  },
  {
    label: 'Iraq',
    value: 'IQ',
  },
  {
    label: 'Ireland',
    value: 'IE',
  },
  {
    label: 'Isle of Man',
    value: 'IM',
  },
  {
    label: 'Israel',
    value: 'IL',
  },
  {
    label: 'Italy',
    value: 'IT',
  },
  {
    label: 'Jamaica',
    value: 'JM',
  },
  {
    label: 'Japan',
    value: 'JP',
  },
  {
    label: 'Jersey',
    value: 'JE',
  },
  {
    label: 'Jordan',
    value: 'JO',
  },
  {
    label: 'Kazakhstan',
    value: 'KZ',
  },
  {
    label: 'Kenya',
    value: 'KE',
  },
  {
    label: 'Kiribati',
    value: 'KI',
  },
  {
    label: "Democratic People's Republic of Korea",
    value: 'KP',
  },
  {
    label: 'Korea, Republic of',
    value: 'KR',
  },
  {
    label: 'Kosovo',
    value: 'XK',
  },
  {
    label: 'Kuwait',
    value: 'KW',
  },
  {
    label: 'Kyrgyzstan',
    value: 'KG',
  },
  {
    label: "Lao People's Democratic Republic",
    value: 'LA',
  },
  {
    label: 'Latvia',
    value: 'LV',
  },
  {
    label: 'Lebanon',
    value: 'LB',
  },
  {
    label: 'Lesotho',
    value: 'LS',
  },
  {
    label: 'Liberia',
    value: 'LR',
  },
  {
    label: 'Libyan Arab Jamahiriya',
    value: 'LY',
  },
  {
    label: 'Liechtenstein',
    value: 'LI',
  },
  {
    label: 'Lithuania',
    value: 'LT',
  },
  {
    label: 'Luxembourg',
    value: 'LU',
  },
  {
    label: 'Macao',
    value: 'MO',
  },
  {
    label: 'Macedonia, The Former Yugoslav Republic of',
    value: 'MK',
  },
  {
    label: 'Madagascar',
    value: 'MG',
  },
  {
    label: 'Malawi',
    value: 'MW',
  },
  {
    label: 'Malaysia',
    value: 'MY',
  },
  {
    label: 'Maldives',
    value: 'MV',
  },
  {
    label: 'Mali',
    value: 'ML',
  },
  {
    label: 'Malta',
    value: 'MT',
  },
  {
    label: 'Marshall Islands',
    value: 'MH',
  },
  {
    label: 'Martinique',
    value: 'MQ',
  },
  {
    label: 'Mauritania',
    value: 'MR',
  },
  {
    label: 'Mauritius',
    value: 'MU',
  },
  {
    label: 'Mayotte',
    value: 'YT',
  },
  {
    label: 'Mexico',
    value: 'MX',
  },
  {
    label: 'Micronesia, Federated States of',
    value: 'FM',
  },
  {
    label: 'Moldova, Republic of',
    value: 'MD',
  },
  {
    label: 'Monaco',
    value: 'MC',
  },
  {
    label: 'Mongolia',
    value: 'MN',
  },
  {
    label: 'Montenegro',
    value: 'ME',
  },
  {
    label: 'Montserrat',
    value: 'MS',
  },
  {
    label: 'Morocco',
    value: 'MA',
  },
  {
    label: 'Mozambique',
    value: 'MZ',
  },
  {
    label: 'Myanmar',
    value: 'MM',
  },
  {
    label: 'Namibia',
    value: 'NA',
  },
  {
    label: 'Nauru',
    value: 'NR',
  },
  {
    label: 'Nepal',
    value: 'NP',
  },
  {
    label: 'Netherlands',
    value: 'NL',
  },
  {
    label: 'Netherlands Antilles',
    value: 'AN',
  },
  {
    label: 'New Caledonia',
    value: 'NC',
  },
  {
    label: 'New Zealand',
    value: 'NZ',
  },
  {
    label: 'Nicaragua',
    value: 'NI',
  },
  {
    label: 'Niger',
    value: 'NE',
  },
  {
    label: 'Nigeria',
    value: 'NG',
  },
  {
    label: 'Niue',
    value: 'NU',
  },
  {
    label: 'Norfolk Island',
    value: 'NF',
  },
  {
    label: 'Northern Mariana Islands',
    value: 'MP',
  },
  {
    label: 'Norway',
    value: 'NO',
  },
  {
    label: 'Oman',
    value: 'OM',
  },
  {
    label: 'Pakistan',
    value: 'PK',
  },
  {
    label: 'Palau',
    value: 'PW',
  },
  {
    label: 'Palestinian Territory, Occupied',
    value: 'PS',
  },
  {
    label: 'Panama',
    value: 'PA',
  },
  {
    label: 'Papua New Guinea',
    value: 'PG',
  },
  {
    label: 'Paraguay',
    value: 'PY',
  },
  {
    label: 'Peru',
    value: 'PE',
  },
  {
    label: 'Philippines',
    value: 'PH',
  },
  {
    label: 'Pitcairn',
    value: 'PN',
  },
  {
    label: 'Poland',
    value: 'PL',
  },
  {
    label: 'Portugal',
    value: 'PT',
  },
  {
    label: 'Puerto Rico',
    value: 'PR',
  },
  {
    label: 'Qatar',
    value: 'QA',
  },
  {
    label: 'Reunion',
    value: 'RE',
  },
  {
    label: 'Romania',
    value: 'RO',
  },
  {
    label: 'Russian Federation',
    value: 'RU',
  },
  {
    label: 'Rwanda',
    value: 'RW',
  },
  {
    label: 'Saint Helena',
    value: 'SH',
  },
  {
    label: 'Saint Kitts and Nevis',
    value: 'KN',
  },
  {
    label: 'Saint Lucia',
    value: 'LC',
  },
  {
    label: 'Saint Pierre and Miquelon',
    value: 'PM',
  },
  {
    label: 'Saint Vincent and the Grenadines',
    value: 'VC',
  },
  {
    label: 'Samoa',
    value: 'WS',
  },
  {
    label: 'San Marino',
    value: 'SM',
  },
  {
    label: 'Sao Tome and Principe',
    value: 'ST',
  },
  {
    label: 'Saudi Arabia',
    value: 'SA',
  },
  {
    label: 'Senegal',
    value: 'SN',
  },
  {
    label: 'Serbia',
    value: 'RS',
  },
  {
    label: 'Seychelles',
    value: 'SC',
  },
  {
    label: 'Sierra Leone',
    value: 'SL',
  },
  {
    label: 'Singapore',
    value: 'SG',
  },
  {
    label: 'Slovakia',
    value: 'SK',
  },
  {
    label: 'Slovenia',
    value: 'SI',
  },
  {
    label: 'Solomon Islands',
    value: 'SB',
  },
  {
    label: 'Somalia',
    value: 'SO',
  },
  {
    label: 'South Africa',
    value: 'ZA',
  },
  {
    label: 'South Georgia and the South Sandwich Islands',
    value: 'GS',
  },
  {
    label: 'Spain',
    value: 'ES',
  },
  {
    label: 'Sri Lanka',
    value: 'LK',
  },
  {
    label: 'Sudan',
    value: 'SD',
  },
  {
    label: 'Suriname',
    value: 'SR',
  },
  {
    label: 'Svalbard and Jan Mayen',
    value: 'SJ',
  },
  {
    label: 'Swaziland',
    value: 'SZ',
  },
  {
    label: 'Sweden',
    value: 'SE',
  },
  {
    label: 'Switzerland',
    value: 'CH',
  },
  {
    label: 'Syrian Arab Republic',
    value: 'SY',
  },
  {
    label: 'Taiwan',
    value: 'TW',
  },
  {
    label: 'Tajikistan',
    value: 'TJ',
  },
  {
    label: 'Tanzania, United Republic of',
    value: 'TZ',
  },
  {
    label: 'Thailand',
    value: 'TH',
  },
  {
    label: 'Timor-Leste',
    value: 'TL',
  },
  {
    label: 'Togo',
    value: 'TG',
  },
  {
    label: 'Tokelau',
    value: 'TK',
  },
  {
    label: 'Tonga',
    value: 'TO',
  },
  {
    label: 'Trinidad and Tobago',
    value: 'TT',
  },
  {
    label: 'Tunisia',
    value: 'TN',
  },
  {
    label: 'Turkey',
    value: 'TR',
  },
  {
    label: 'Turkmenistan',
    value: 'TM',
  },
  {
    label: 'Turks and Caicos Islands',
    value: 'TC',
  },
  {
    label: 'Tuvalu',
    value: 'TV',
  },
  {
    label: 'Uganda',
    value: 'UG',
  },
  {
    label: 'Ukraine',
    value: 'UA',
  },
  {
    label: 'United Arab Emirates',
    value: 'AE',
  },
  {
    label: 'United Kingdom',
    value: 'GB',
  },
  {
    label: 'United States',
    value: 'US',
  },
  {
    label: 'United States Minor Outlying Islands',
    value: 'UM',
  },
  {
    label: 'Uruguay',
    value: 'UY',
  },
  {
    label: 'Uzbekistan',
    value: 'UZ',
  },
  {
    label: 'Vanuatu',
    value: 'VU',
  },
  {
    label: 'Venezuela',
    value: 'VE',
  },
  {
    label: 'Viet Nam',
    value: 'VN',
  },
  {
    label: 'Virgin Islands, British',
    value: 'VG',
  },
  {
    label: 'Virgin Islands, U.S.',
    value: 'VI',
  },
  {
    label: 'Wallis and Futuna',
    value: 'WF',
  },
  {
    label: 'Western Sahara',
    value: 'EH',
  },
  {
    label: 'Yemen',
    value: 'YE',
  },
  {
    label: 'Zambia',
    value: 'ZM',
  },
  {
    label: 'Zimbabwe',
    value: 'ZW',
  },
]
```

# \_components/CMSForm/fields/Checkbox/index.tsx

```tsx
'use client'

import React, { useEffect } from 'react'
import Error from '@app/_components/forms/Error'
import { FieldProps } from '@app/_components/forms/fields/types'
import { useField } from '@app/_components/forms/fields/useField'

import Label from '@app/_components/CMSForm/Label'
import { CheckIcon } from '@app/_icons/CheckIcon'

import classes from './index.module.scss'

export const Checkbox: React.FC<
  FieldProps<boolean> & {
    checked?: boolean
  }
> = (props) => {
  const {
    path,
    required,
    label,
    onChange: onChangeFromProps,
    initialValue,
    validate,
    className,
    checked: checkedFromProps,
    disabled,
  } = props

  const [checked, setChecked] = React.useState<boolean | undefined | null>(initialValue || false)
  const prevChecked = React.useRef<boolean | undefined | null>(checked)
  const prevContextValue = React.useRef<boolean | undefined | null>(initialValue)

  const defaultValidateFunction = React.useCallback(
    (fieldValue: unknown): string | true => {
      if (required && !fieldValue) {
        return 'This field is required.'
      }

      if (typeof fieldValue !== 'boolean') {
        return 'This field can only be equal to true or false.'
      }

      return true
    },
    [required],
  )

  const {
    onChange,
    value: valueFromContext,
    showError,
    errorMessage,
  } = useField<boolean>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  // allow external control
  useEffect(() => {
    if (
      checkedFromProps !== undefined &&
      checkedFromProps !== prevChecked.current &&
      checkedFromProps !== checked
    ) {
      setChecked(checkedFromProps)
    }

    prevChecked.current = checkedFromProps
  }, [checkedFromProps, checked])

  // allow context control
  useEffect(() => {
    if (
      valueFromContext !== undefined &&
      valueFromContext !== prevContextValue.current &&
      valueFromContext !== checked
    ) {
      setChecked(valueFromContext)
    }

    prevContextValue.current = valueFromContext
  }, [valueFromContext, checked])

  return (
    <div
      className={[
        className,
        classes.checkbox,
        showError && classes.error,
        checked && classes.checked,
        disabled && classes.disabled,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        className={classes.htmlInput}
        type="checkbox"
        name={path}
        id={path}
        checked={Boolean(checked)}
        readOnly
        disabled={disabled}
        tabIndex={-1}
      />
      <button
        type="button"
        className={classes.button}
        onClick={() => {
          if (!disabled) onChange(!checked)
        }}
        disabled={disabled}
      >
        <span className={classes.input}>
          <CheckIcon className={classes.icon} size="medium" bold />
        </span>
        <Label className={classes.label} htmlFor={path} label={label} required={required} />
      </button>
      <Error className={classes.errorLabel} showError={showError} message={errorMessage} />
    </div>
  )
}
```

# \_blocks/Hero/Home/LogoShowcase/index.tsx

```tsx
import React, { useEffect, useState } from 'react'

import { Media } from '@app/_components/Media'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Media as MediaType } from '@payload-types'

import classes from './index.module.scss'

type LogoItem = {
  logoMedia: string | MediaType
  id?: string | null
}

type PositionedLogo = {
  logo: LogoItem
  position: number
  isVisible: boolean
}

type Props = {
  logos: LogoItem[] | null | undefined
}

const TOTAL_CELLS = 12
const ANIMATION_DURATION = 650 // Duration for fade-out and fade-in in milliseconds
const ANIMATION_DELAY = 650 // Delay between animations in milliseconds

const getRandomPosition = (excludePositions: number[]) => {
  let newPos
  const excludedCells = [0, 11] // Exclude first and last cells
  do {
    newPos = Math.floor(Math.random() * TOTAL_CELLS)
  } while (excludePositions.includes(newPos) || excludedCells.includes(newPos))
  return newPos
}

export const LogoShowcase: React.FC<Props> = ({ logos }) => {
  const [logoPositions, setLogoPositions] = useState<PositionedLogo[]>([])
  const [currentAnimatingIndex, setCurrentAnimatingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (logos) {
      let occupiedPositions: number[] = []
      const initialPositions = logos.map((logo) => {
        const position = getRandomPosition(occupiedPositions)
        occupiedPositions.push(position)
        return { logo, position, isVisible: true }
      })
      setLogoPositions(initialPositions)
    }
  }, [logos])

  useEffect(() => {
    if (!logos || logos.length === 0 || logos.length > TOTAL_CELLS) return

    /* eslint-disable function-paren-newline */
    const animateLogo = () => {
      const logoIndex =
        currentAnimatingIndex !== null ? (currentAnimatingIndex + 1) % logos.length : 0
      setCurrentAnimatingIndex(logoIndex)

      setLogoPositions((prevPositions) =>
        prevPositions.map((pos, idx) => (idx === logoIndex ? { ...pos, isVisible: false } : pos)),
      )

      setTimeout(() => {
        setLogoPositions((prevPositions) => {
          const occupiedPositions = prevPositions.map((p) => p.position)
          let newPosition
          do {
            newPosition = getRandomPosition(occupiedPositions)
          } while (newPosition === prevPositions[logoIndex].position)

          return prevPositions.map((pos, idx) =>
            idx === logoIndex ? { ...pos, position: newPosition, isVisible: false } : pos,
          )
        })

        setTimeout(() => {
          setLogoPositions((prevPositions) =>
            prevPositions.map((pos, idx) =>
              idx === logoIndex ? { ...pos, isVisible: true } : pos,
            ),
          )
        }, 100)
      }, ANIMATION_DURATION + 500)
    }
    /* eslint-enable function-paren-newline */

    const interval = setInterval(animateLogo, ANIMATION_DELAY + ANIMATION_DURATION)
    return () => clearInterval(interval)
  }, [logoPositions, currentAnimatingIndex, logos])

  return (
    <div className={classes.logoShowcase}>
      <div
        className={[classes.horizontalLine, classes.topHorizontalLine].filter(Boolean).join(' ')}
      />
      {[...Array(2)].map((_, idx) => (
        <div
          key={`h-line-${idx}`}
          className={classes.horizontalLine}
          style={{ top: `${(idx + 1) * 33.333}%` }}
        />
      ))}
      {[...Array(3)].map((_, idx) => {
        if (idx === 1) return null // Skip the line at left: 50%
        return (
          <div
            key={`v-line-${idx}`}
            className={classes.verticalLine}
            style={{ left: `${(idx + 1) * 25}%` }}
          />
        )
      })}
      <div
        className={[classes.horizontalLine, classes.bottomHorizontalLine].filter(Boolean).join(' ')}
      />
      {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
        const hasLogo = logoPositions.some((item) => item.position === index && item.isVisible)
        // Determine if the current cell is the first or last cell
        const isEdgeCell = index === 0 || index === TOTAL_CELLS - 1
        return (
          <div
            className={[
              classes.logoShowcaseItem,
              hasLogo ? classes.logoPresent : isEdgeCell ? classes.noScanline : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={index}
          >
            <div className={classes.contentWrapper}>
              {logoPositions
                .filter((item) => item.position === index)
                .map(({ logo, isVisible }, idx) => (
                  <div
                    key={idx}
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity ${ANIMATION_DURATION}ms ease, filter ${ANIMATION_DURATION}ms ease`,
                      filter: isVisible ? 'blur(0px)' : 'blur(8px)',
                    }}
                  >
                    {typeof logo.logoMedia === 'object' && logo.logoMedia !== null && (
                      <Media resource={logo.logoMedia} />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )
      })}
      <CrosshairIcon className={[classes.crosshair, classes.crosshairBottomLeft].join(' ')} />
      <CrosshairIcon className={[classes.crosshair, classes.crosshairTopRight].join(' ')} />
      <CrosshairIcon className={[classes.crosshair, classes.crosshairFirstCell].join(' ')} />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairSecondRowThirdCell].join(' ')}
      />
    </div>
  )
}

export default LogoShowcase
```

# (pages)/shop/order/confirmation/page.tsx

```tsx
'use client'
import React, { Suspense, useEffect } from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { OrderEmpty } from '@app/_blocks/Order/OrderEmpty'
import { orderText } from '@/utilities/refData'
import { buttonLook, contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import { useOrder } from '@app/_providers/Order'
import { OrderItems } from '@app/_blocks/Order/OrderItems'
import { OrderSummary } from '@app/_blocks/Order/OrderSummary'
import { CMSLink } from '@app/_components/CMSLink'
import { DollarSignIcon } from 'lucide-react'
import Link from 'next/link'
import cn from '@/utilities/cn'

export default function CartPage() {
  const { order, orderIsEmpty, hasInitializedOrder } = useOrder()

  // If we have order data, render the content regardless of hasInitializedOrder
  if (order && order.items && order.items.length > 0) {
    return renderCartContent(order, orderIsEmpty)
  }

  // If we don't have order data and hasInitializedOrder is false, show loading
  if (!hasInitializedOrder) {
    return <CartLoadingSkeleton />
  }

  // If we have initialized but the order is empty, show empty order
  return <OrderEmpty />
}

function renderCartContent(order: any, orderIsEmpty: any) {
  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        {orderIsEmpty ? (
          <OrderEmpty />
        ) : (
          <>
            <div className="flex flex-row justify-between #gap-6">
              <h1
                className={[
                  contentFormats.global,
                  contentFormats.h3,
                  'tracking-tighter text-3xl sm:text-2xl font-medium my-2',
                ].join(' ')}
              >
                {'Your Cart'}
              </h1>

              {/* <div className="hidden sm:flex w-1/6">
                <Link
                  href="#summary-heading"
                  scroll={true}
                  className={[
                    buttonLook.variants.base,
                    buttonLook.sizes.medium,
                    buttonLook.widths.full,
                    `flex flex-row justify-between no-underline`,
                  ].join(' ')}
                >
                  <span className={cn(contentFormats.global, contentFormats.p, '')}>
                    {`Order Summary `}
                  </span>
                  <span> &darr; </span>
                </Link>
              </div> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Suspense fallback={<OrderItemsSkeleton />}>{order && <OrderItems />}</Suspense>

              <Suspense fallback={<OrderSummarySkeleton />}>
                {order && <OrderSummary order={order} />}
              </Suspense>
            </div>
          </>
        )}
      </Gutter>
    </BlockWrapper>
  )
}

const CartLoadingSkeleton = () => (
  <BlockWrapper className={getPaddingClasses('hero')}>
    <Gutter>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 w-3/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:basis-3/4">
            <OrderItemsSkeleton />
          </div>
          <div className="lg:basis-1/4">
            <OrderSummarySkeleton />
          </div>
        </div>
      </div>
    </Gutter>
  </BlockWrapper>
)

const OrderItemsSkeleton: React.FC = () => {
  return (
    <div className="border border-solid border-gray-200/90 animate-pulse">
      <div className="flex flex-col gap-6 p-5 md:flex-row md:justify-between">
        <div className="flex min-w-0 gap-x-4">
          <div className="h-20 w-20 flex-none bg-gray-200"></div>
          <div className="flex flex-col gap-x-3 sm:items-start">
            <div className="w-32 h-6 bg-gray-200 mb-2"></div>
            <div className="w-48 h-4 bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-none items-end gap-x-4 align-top">
          <div className="w-24 h-8 bg-gray-200"></div>
          <div className="w-24 h-8 bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

const OrderSummarySkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="relative flex justify-between gap-4">
        <h2 className="bg-gray-200 rounded h-6 w-32"></h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-48"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="bg-gray-200 rounded h-4 w-36"></div>
          <div className="bg-gray-200 rounded h-4 w-20"></div>
        </div>
      </div>
    </div>
  )
}
```
