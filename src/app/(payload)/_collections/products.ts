import type { CollectionConfig } from 'payload/types'

import { slugField } from '@cms/_fields/slug'
// import { populateArchiveBlock } from '@/blocks/ArchiveBlock/populateArchiveBlock'
import { deleteProductFromCarts } from '@cms/_hooks/deleteProductFromCarts'
import { revalidateProduct } from '@cms/_hooks/revalidateProduct'
import { layoutField } from '@cms/_fields/layoutField'
import { upsertStripeProduct } from '@cms/_hooks/upsertStripeProduct'
import { deleteStripeProduct } from '@cms/_hooks/deleteStripeProduct'
import { adminsOnly, publishedOnly } from '@/utilities/access'
import { themeField } from '../_fields/blockFields'

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
    afterChange: [revalidateProduct], // probably dont need this
    // afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts, deleteStripeProduct],
  },
  versions: {
    drafts: true,
  },
  access: {
    create: adminsOnly,
    read: publishedOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  fields: [
    {
      type: 'row', // required
      fields: [
        { name: 'title', type: 'text', required: true },
        slugField(),
        {
          name: 'productType',
          type: 'select',
          defaultValue: 'gift',
          options: [
            {
              label: 'Card',
              value: 'card',
            },
            {
              label: 'Gift',
              value: 'gift',
            },
          ],
        },
      ],
    },

    {
      type: 'tabs', // required
      tabs: [
        {
          label: 'Basics', // required
          description: 'Basic Product Info',
          fields: [
            // grab from meta
            // { name: 'shortDescription', type: 'textarea', maxLength: 150, required: false },
            // grab from media Slider & default from meta
            // { name: 'defaultImage', type: 'upload', relationTo: 'media', required: false },
            {
              type: 'row', // required
              fields: [
                {
                  name: 'stripeId',
                  label: 'Stripe ID',
                  type: 'text',
                },
                themeField,
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
              ],
            },

            {
              type: 'row', // required
              fields: [
                {
                  name: 'price',
                  label: 'Price',
                  type: 'number',
                  required: false,
                  defaultValue: '0',
                },
                { name: 'stripePriceId', type: 'text', required: false, hidden: false },

                {
                  name: 'promoPrice',
                  label: 'Promotional Price',
                  type: 'number',
                  required: false,
                  defaultValue: '0',
                },
                { name: 'stripePromoPriceId', type: 'text', required: false, hidden: false },
              ],
            },
            {
              type: 'row', // required
              fields: [
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
            // don't need brands (just create a reusable logo grid and drop into layout)
            // {
            //   type: 'row', // required
            //   fields: [
            //     {
            //       name: 'brands',
            //       type: 'array',
            //       fields: [
            //         { name: 'brandLogo', type: 'upload', relationTo: 'media' },
            //         { name: 'brandName', label: 'Brand Name', type: 'text' },
            //         { name: 'productName', label: 'Product Name', type: 'text' },
            //       ],
            //     },
            //     // {
            //     //   name: 'reviews',
            //     //   type: 'array',
            //     //   fields: [
            //     //     { name: '', type: 'upload', relationTo: 'media' },
            //     //     { name: 'brandName', label: 'Brand Name', type: 'text' },
            //     //     { name: 'productName', label: 'Product Name', type: 'text' },
            //     //   ],
            //     // },
            //   ],
            // },
          ],
        },
        {
          label: 'Layout', // required
          description: 'Product Page Layout',
          fields: [layoutField()],
        },
      ],
    },
  ],
}
