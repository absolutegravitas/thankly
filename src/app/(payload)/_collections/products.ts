import type { CollectionConfig } from 'payload'

import { slugField } from '@cms/_fields/slug'
// import { populateArchiveBlock } from '@/blocks/ArchiveBlock/populateArchiveBlock'
import { revalidateProduct } from '@cms/_hooks/revalidateProduct'
import { layoutField } from '@cms/_fields/layoutField'
import { upsertStripeProduct } from '@cms/_hooks/upsertStripeProduct'
import { deleteStripeProduct } from '@cms/_hooks/deleteStripeProduct'
import { adminsOnly, publishedOnly } from '@/utilities/access'
// import { themeField } from '../_fields/blockFields'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'productType', 'stripeId', 'availability'],
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
  },
  hooks: {
    beforeChange: [upsertStripeProduct],
    // afterChange: [revalidateProduct], // probably dont need this
    // afterRead: [populateArchiveBlock],
    afterDelete: [deleteStripeProduct],
  },
  versions: { drafts: true },
  access: {
    create: adminsOnly,
    read: publishedOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'productType',
          type: 'select',
          defaultValue: 'gift',
          options: [
            { label: 'Card', value: 'card' },
            { label: 'Gift', value: 'gift' },
          ],
        },
        // basically shipping size/weight determines what the predefault base ship price is for a gift
        {
          name: 'shippingSize',
          type: 'select',
          defaultValue: 'medium',
          admin: { condition: (_, siblingData) => siblingData.productType === 'gift' },
          options: [
            { label: 'Mini', value: 'mini' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
        },
      ],
    },
    {
      name: 'prices',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'basePrice',
              label: 'Price',
              type: 'number',
              required: true,
              defaultValue: 0,
            },

            {
              name: 'salePrice',
              label: 'Promotional Price',
              type: 'number',
              required: false,
              // defaultValue: null,
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Page Layout',
          description: 'Product Page Layout',
          fields: [layoutField()],
        },
        {
          label: 'Basics',
          description: 'Basic Product Info',
          fields: [
            {
              name: 'stock',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'availability',
                      type: 'select',
                      defaultValue: 'available',
                      hasMany: false,
                      required: false,
                      admin: { isClearable: false },
                      options: [
                        { label: 'Available', value: 'available' },
                        { label: 'Unavailable', value: 'unavailable' },
                      ],
                    },
                    { name: 'stockOnHand', type: 'number', required: false },
                    {
                      name: 'lowStockThreshold',
                      type: 'number',
                      required: false,
                      defaultValue: 5,
                      min: 1,
                    },
                  ],
                },
              ],
            },

            {
              name: 'media',
              label: 'Images',
              type: 'array',
              fields: [{ name: 'mediaItem', type: 'upload', relationTo: 'media' }],
            },
          ],
        },

        {
          label: 'Tech Info',
          fields: [
            slugField(),

            {
              name: 'stripe',
              type: 'group',
              fields: [
                { name: 'productId', label: 'Product ID', type: 'text' },
                { name: 'basePriceId', label: 'Base Price ID', type: 'text' },
                {
                  name: 'salePriceId',
                  label: 'Promo Price ID',
                  type: 'text',
                  required: false,
                  hidden: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
