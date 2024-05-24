import path from 'path'
import sharp from 'sharp'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// plugins
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

// collections
import { Users, sessions } from '@cms/_collections/users'
import { Media } from '@cms/_collections/media'
import { Products } from '@cms/_collections/products'
import { Pages } from '@cms/_collections/pages'
import { Reusable } from '@cms/_collections/reusables'
import { Orders } from '@cms/_collections/orders'
import { Settings } from '@cms/_collections/settings'
// import { resendAdapter } from '@payloadcms/email-resend'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import {
  COLLECTION_SLUG_MEDIA,
  COLLECTION_SLUG_PAGE,
  COLLECTION_SLUG_PRODUCTS,
} from '@cms/_collections/config'

import { buildConfig } from 'payload/config'
import { fileURLToPath } from 'url'
import generateBreadcrumbsUrl from '@cms/_utilities/generateBreadcrumbsUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  collections: [Users, Orders, Products, Pages, Reusable, Media, sessions],
  globals: [Settings],
  editor: lexicalEditor({}),
  db: postgresAdapter({ pool: { connectionString: process.env.POSTGRES_URL } }),
  // i18n: { supportedLanguages: { en } },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
  // email:
  //   process.env.RESEND_DEFAULT_EMAIL && process.env.AUTH_RESEND_KEY
  //     ? resendAdapter({
  //         defaultFromAddress: process.env.RESEND_DEFAULT_EMAIL,
  //         defaultFromName: 'Thankly Admin',
  //         apiKey: process.env.AUTH_RESEND_KEY || '',
  //       })
  //     : undefined,
  admin: {
    user: Users.slug,
    livePreview: {
      url: ({ data, locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/preview${data.path}${
          locale ? `?locale=${locale.code}` : ''
        }`,
      collections: ['pages', 'products'], // The collections to enable Live Preview on (globals are also possible)
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  cors: [
    'https://checkout.stripe.com',
    'https://thankly.co',
    'https://www.thankly.co',
    'https://thankly.com.au',
    'https://www.thankly.com.au',
    'https://thankly.vercel.app',
    'http://localhost:3000',
  ].filter(Boolean),
  csrf: [
    'https://checkout.stripe.com',
    'https://thankly.co',
    'https://www.thankly.co',
    'https://thankly.com.au',
    'https://www.thankly.com.au',
    'https://thankly.vercel.app',
    'http://localhost:3000',
  ].filter(Boolean),

  plugins: [
    stripePlugin({
      isTestKey: Boolean(process.env.NEXT_PUBLIC_STRIPE_IS_TEST_KEY),
      rest: false,
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
      // webhooks: {
      //   'price.updated': priceUpsert,
      //   'price.created': priceUpsert,
      //   // 'customer.subscription.created': subscriptionUpsert,
      //   // 'customer.subscription.updated': subscriptionUpsert,
      //   // 'customer.subscription.deleted': subscriptionDeleted,
      // },
      sync: [
        {
          collection: COLLECTION_SLUG_PRODUCTS,
          stripeResourceType: 'products',
          stripeResourceTypeSingular: 'product',
          fields: [
            { fieldPath: 'active', stripeProperty: 'active' },
            { fieldPath: 'name', stripeProperty: 'name' },
            { fieldPath: 'description', stripeProperty: 'description' },
            { fieldPath: 'image', stripeProperty: 'images.0' },
          ],
        },
      ],
    }),
    seoPlugin({ collections: ['pages', 'products'], uploadsCollection: 'media' }),
    redirectsPlugin({
      collections: ['pages', 'products'],
      overrides: { admin: { group: 'Globals' } },
    }),
    formBuilderPlugin({ redirectRelationships: ['pages'], fields: { state: false } }),
    nestedDocsPlugin({ collections: ['pages', 'products'], generateURL: generateBreadcrumbsUrl }),
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
