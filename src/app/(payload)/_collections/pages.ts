import type { CollectionConfig } from 'payload/types'

// import { checkRole } from '@cms/_access/checkRole'
// import { publishedOnly } from '@cms/_access/publishedOnly'

import { fullTitle } from '@cms/_fields/fullTitle'
// import { formatPreviewURL } from '@cms/_utilities/formatPreviewURL'
// import { revalidatePage } from '@cms/_utilities/revalidatePage'
import { layoutField } from '@cms/_fields/layoutField'

import { slugField } from '@cms/_fields/slug'
// import pathField from '@cms/_fields/path'

export const COLLECTION_SLUG_PAGE = 'pages'

export const Pages: CollectionConfig = {
  slug: COLLECTION_SLUG_PAGE,
  admin: {
    useAsTitle: 'title',
    // preview: (doc) => formatPreviewURL('pages', doc),
    defaultColumns: ['title', 'slug', 'createdAt', 'updatedAt'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 5,
  },
  // access: {
  //   create: ({ req: { user } }) => checkRole(['admin'], user),
  //   read: publishedOnly,
  //   readVersions: ({ req: { user } }) => checkRole(['admin'], user),
  //   update: ({ req: { user } }) => checkRole(['admin'], user),
  //   delete: ({ req: { user } }) => checkRole(['admin'], user),
  // },
  // hooks: {
  //   // afterChange: [
  //   //   ({ req: { payload }, doc }) => {
  //   //     revalidatePage({
  //   //       payload,
  //   //       collection: 'pages',
  //   //       doc,
  //   //     })
  //   //   },
  //   // ],
  // },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    // pathField(),

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
