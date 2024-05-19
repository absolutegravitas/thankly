import type { CollectionConfig } from 'payload/types'
import { adminsOnly, publishedOnly } from '@cms/_utilities/access'

// import { formatPreviewURL } from '@cms/_utilities/formatPreviewURL'
import { revalidatePage } from '@cms/_utilities/revalidatePage'
import { layoutField } from '@cms/_fields/layoutField'

import { slugField } from '@cms/_fields/slug'
import { themeField } from '../_fields/blockFields'
// import pathField from '@cms/_fields/path'

export const COLLECTION_SLUG_PAGE = 'pages'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    // preview: (doc) => formatPreviewURL('pages', doc),
    defaultColumns: ['title', 'slug', 'createdAt', 'updatedAt'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 5,
  },
  access: {
    create: adminsOnly,
    read: publishedOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  hooks: {
    afterChange: [
      ({ req: { payload }, doc }) => {
        revalidatePage({
          payload,
          collection: 'pages',
          doc,
        })
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    // pathField(),
    themeField,

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout', // required
          description: 'Product Page Layout',
          fields: [layoutField()],
        },
      ],
    },
  ],
}
