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
// import { Accounts, Sessions } from '@cms/_collections/accounts'
import { Media } from '@cms/_collections/media'
import { Products } from '@cms/_collections/products'
import { Pages } from '@cms/_collections/pages'
import { Reusable } from '@cms/_collections/reusables'
import { Orders } from '@cms/_collections/orders'
import { Settings } from '@cms/_collections/settings'
import { Users } from '@cms/_collections/users'

import {
  COLLECTION_SLUG_MEDIA,
  COLLECTION_SLUG_PAGE,
  COLLECTION_SLUG_PRODUCTS,
} from '@cms/_collections/config'

import { buildConfig } from 'payload/config'
import { fileURLToPath } from 'url'
import generateBreadcrumbsUrl from '@/utilities/generateBreadcrumbsUrl'
import { Carts } from './app/(payload)/_collections/carts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  collections: [Users, Orders, Products, Pages, Reusable, Media, Carts],
  globals: [Settings],
  editor: lexicalEditor({}),
  db: postgresAdapter({ pool: { connectionString: process.env.POSTGRES_URL } }),
  // i18n: { supportedLanguages: { en } },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,

  admin: {
    user: Users.slug,
    livePreview: {
      url: ({ data, locale }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/preview${data.path}${
          locale ? `?locale=${locale.code}` : ''
        }`,
      collections: [COLLECTION_SLUG_PAGE],
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
    seoPlugin({ collections: ['pages', 'products'], uploadsCollection: 'media' }),
    redirectsPlugin({
      collections: ['pages', 'products'],
      overrides: { admin: { group: 'Globals' } },
    }),
    formBuilderPlugin({ redirectRelationships: ['pages'], fields: { state: false } }),
    nestedDocsPlugin({ collections: ['pages'], generateURL: generateBreadcrumbsUrl }),
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
