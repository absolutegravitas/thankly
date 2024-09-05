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
import { Media } from '@cms/_collections/media'
import { Products } from '@cms/_collections/products'
import { Pages } from '@cms/_collections/pages'
import { Reusable } from '@cms/_collections/reusables'
import { Carts } from '@cms/_collections/carts'
import { Orders } from '@cms/_collections/orders'
import { Settings } from '@cms/_collections/settings'
import { Users } from '@cms/_collections/users'
import { Sessions } from '@cms/_collections/sessions'
import { Tags } from '@cms/_collections/tags'
import { DiscountCodes } from '@cms/_collections/discountCodes'
import { Categories } from '@cms/_collections/categories'
import { Reviews } from '@cms/_collections/reviews'

// import { buildConfig } from 'payload/config' // deprecated
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { fieldsSelect } from '@payload-enchants/fields-select'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // needs to be ordered in a specific way otherwise the admin grouping fucks up
  collections: [
    Pages,
    Reusable,
    Orders,
    Products,
    Carts,
    Reviews,
    Media,
    Users,
    Tags,
    Categories,
    Sessions,
    DiscountCodes,
  ],

  globals: [Settings],
  editor: lexicalEditor({}),
  db: postgresAdapter({ pool: { connectionString: process.env.POSTGRES_URL } }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  sharp,
  admin: { user: Users.slug },

  cors: [
    'https://checkout.stripe.com',
    'https://thankly.co',
    'https://www.thankly.co',
    'https://thankly.com.au',
    'https://www.thankly.com.au',
    'https://thankly.vercel.app',
    'http://localhost:3000',
    'https://api.hcaptcha.com',
  ].filter(Boolean),
  csrf: [
    'https://checkout.stripe.com',
    'https://thankly.co',
    'https://www.thankly.co',
    'https://thankly.com.au',
    'https://www.thankly.com.au',
    'https://thankly.vercel.app',
    'https://api.hcaptcha.com',
    'http://localhost:3000',
  ].filter(Boolean),

  plugins: [
    fieldsSelect(), // temp plugin for selectively pulling in fields for localAPI
    seoPlugin({ collections: ['pages', 'products'], uploadsCollection: 'media' }),
    formBuilderPlugin({ redirectRelationships: ['pages'], fields: { state: false } }),
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
