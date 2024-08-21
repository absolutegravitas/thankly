import type { CollectionConfig } from 'payload'
import { adminsOnly, publishedOnly } from '@/utilities/access'

// import { formatPreviewURL } from '@/utilities/formatPreviewURL'
import { revalidatePage } from '@/utilities/revalidatePage'
import { layoutField } from '@cms/_fields/layoutField'

import { slugField } from '@cms/_fields/slug'
// import { themeField } from '@cms/_fields/blockFields'
// import pathField from '@cms/_fields/path'

export const COLLECTION_SLUG_PAGE = 'pages'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: '1. Website',
    // livePreview: {
    //   url: ({ data }) =>
    //     `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
    //       `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${
    //         data.slug !== 'home' ? `/products/${data.slug}` : ''
    //       }`,
    //     )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`,
    //   // `${process.env.PAYLOAD_PUBLIC_SERVER_URL}${data.slug !== 'home' ? `/${data.slug}` : ''}`,
    // },
    // preview: doc => {
    //   return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
    //     `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
    //   )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`
    // },
    defaultColumns: ['title', 'slug', 'createdAt', 'updatedAt'],
  },
  versions: {
    drafts: true,
    maxPerDoc: 5,
  },
  access: {
    create: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  hooks: { afterChange: [] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout',
          description: 'Page Layout',
          fields: [layoutField()],
        },
      ],
    },
  ],
}
