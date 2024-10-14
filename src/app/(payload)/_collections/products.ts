import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { slugField } from '@cms/_fields/slug'
// import { populateArchiveBlock } from '@/blocks/ArchiveBlock/populateArchiveBlock'
import { layoutField } from '@cms/_fields/layoutField'
import { upsertStripeProduct } from '@cms/_hooks/upsertStripeProduct'
import { deleteStripeProduct } from '@cms/_hooks/deleteStripeProduct'
import { adminsOnly, publishedOnly } from '@/utilities/access'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Product, Review } from '@/payload-types'
// import { themeField } from '../_fields/blockFields'

const calculateStarRating: CollectionBeforeChangeHook<Product> = async ({ data, req }) => {
  const updatedData = { ...data }

  if (updatedData.reviews && updatedData.reviews.length > 0) {
    // Fetch all reviews
    const fetchedReviews = await req.payload.find({
      collection: 'reviews',
      where: {
        id: {
          in: updatedData.reviews.map(String), // Convert numbers to strings for the query
        },
      },
    })

    const validReviews = fetchedReviews.docs.filter((review) => review.starRating !== null)

    if (validReviews.length > 0) {
      const totalStars = validReviews.reduce(
        (sum, review) => sum + parseInt(review.starRating as string),
        0,
      )
      const averageRating = totalStars / validReviews.length
      updatedData.starRating = Math.ceil(averageRating)
    } else {
      updatedData.starRating = 0
    }
  } else {
    updatedData.starRating = 0
  }

  return updatedData
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    group: 'Commerce',
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
    beforeChange: [calculateStarRating, upsertStripeProduct],
    // afterChange: [revalidateProduct],
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
            { label: 'Add On', value: 'addOn' },
          ],
        },
        {
          name: 'categories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
        },
        {
          name: 'tags',
          type: 'relationship',
          relationTo: 'tags',
          hasMany: true,
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
      type: 'row',
      fields: [
        { name: 'promoted',
          type: 'number',
          label: 'Promoted (The higher the number, the higher it appears in the shop)',
          required: true,
          defaultValue: 0,
        }
      ]
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
          //Details & Add ons
          label: 'Details',
          description: 'Text descriptions of the product',
          admin: { condition: (_, siblingData) => siblingData.productType !== 'addOn' },
          fields: [
            {
              name: 'description',
              label: 'Product Description',
              type: 'richText',
              editor: lexicalEditor(),
            },
            {
              name: 'extraDetails',
              label: 'Extra Details',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'details', type: 'richText', editor: lexicalEditor(), required: true },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'displayTags',
                  label: 'Display Tags',
                  type: 'relationship',
                  relationTo: 'tags',
                  hasMany: true,
                },
                {
                  name: 'addOns',
                  label: 'Add Ons',
                  type: 'relationship',
                  relationTo: 'products',
                  hasMany: true,
                  admin: { condition: (_, siblingData) => siblingData.productType !== 'addOn' }, // don't allow addOns to be linked to more addOns
                  //filterOptions: ({}) => {return {'categories.title': { equals: "Add On"}}}, //only "Add On" category products
                  filterOptions: ({}) => {
                    return { productType: { equals: 'addOn' } }
                  }, //only "Add On" product type
                },
              ],
            },
          ],
        },
        {
          // Images
          label: 'Images',
          description: 'Product Images',
          fields: [
            {
              name: 'media',
              label: 'Images',
              type: 'array',
              fields: [{ name: 'mediaItem', type: 'upload', relationTo: 'media' }],
            },
          ],
        },
        {
          label: 'Reviews',
          description: 'Linked Product Reviews',
          fields: [
            {
              name: 'reviews',
              label: 'Linked Reviews',
              type: 'relationship',
              relationTo: 'reviews',
              hasMany: true,
            },
            {
              name: 'starRating',
              label: 'Average Star Rating',
              type: 'number',
              admin: {
                readOnly: true,
                description: 'Average star rating calculated from linked reviews',
              },
            },
          ],
        },
        {
          //Stock
          label: 'Stock',
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
          ],
        },
        {
          //Page Layout
          label: 'Page Layout',
          description: 'Product Page Layout',
          fields: [layoutField()],
        },
        {
          //Tech Info
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
