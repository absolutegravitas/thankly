import type { CollectionConfig } from 'payload'
import { adminsAndUserOnly, adminsOnly } from '@/utilities/access'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: `orderNumber`,
    defaultColumns: ['orderNumber', 'createdAt', 'orderedBy'],
  },
  hooks: {
    // beforeChange: [getOrderNumber],
    afterChange: [],
  },

  access: {
    // create: () => true,
    create: adminsOnly,
    read: adminsAndUserOnly,
    update: adminsAndUserOnly,
    delete: adminsOnly,
  },

  fields: [
    {
      type: 'row',
      fields: [
        // global
        {
          name: 'orderNumber',
          type: 'number',
          unique: true,
          hooks: {
            beforeValidate: [
              async ({ data, operation, req }) => {
                if (operation === 'create') {
                  const lastOrder = await req.payload.find({
                    collection: 'orders',
                    sort: '-orderNumber',
                    limit: 1,
                  })

                  console.log(lastOrder)

                  const lastOrderNumber = lastOrder.docs[0]?.orderNumber ?? 0
                  return lastOrderNumber > 0 ? lastOrderNumber + 1 : data?.orderNumber
                }

                return data?.orderNumber
              },
            ],
          },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          hasMany: false,
          required: false,

          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'On Hold', value: 'onhold' },
          ],
        },
        {
          name: 'stripePaymentIntentID',
          label: 'Stripe Payment Intent ID',
          type: 'text',
        },
      ],
    },
    // billing
    {
      name: 'billing',
      type: 'group',
      fields: [
        { name: 'orderedBy', type: 'relationship', relationTo: 'users', required: false },
        { name: 'name', label: 'Name', type: 'text', admin: { width: '50%' } },
        { name: 'email', label: 'Email', type: 'email', admin: { width: '50%' } },
        {
          name: 'contactNumber',
          label: 'Contact Number',
          type: 'number',
          admin: { width: '50%' },
        },
        {
          name: 'orgName',
          label: 'Company or Organisation',
          type: 'text',
          admin: { width: '50%' },
        },

        { name: 'orgId', label: 'ABN / ACN', type: 'text', admin: { width: '50%' } },

        {
          name: 'billingAddress',
          type: 'group',
          fields: [
            { name: 'formattedAddress', type: 'text', admin: { width: '100%' } },
            {
              type: 'row',
              fields: [
                { name: 'addressLine1', type: 'text', admin: { width: '50%' } },
                { name: 'addressLine2', type: 'text', admin: { width: '50%' } },
                { name: 'json', type: 'json', admin: { width: '100%' } }, // whole address object for debug
              ],
            },
          ],
        },
      ],
    },

    {
      name: 'totals',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'orderThanklys', type: 'number', required: true, admin: { width: '25%' } },
            { name: 'orderShipping', type: 'number', required: true, admin: { width: '25%' } },
            { name: 'orderTotal', type: 'number', required: true, admin: { width: '25%' } },
          ],
        },
      ],
    },

    // order items
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      // required: true, // doesn't export types as a proper array unless this is specified, but also fucks up cart creation in frontend
      // minRows: 1,
      fields: [
        { name: 'price', type: 'number', defaultValue: 0, min: 0 },
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        {
          name: 'totals',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'itemCost', type: 'number', required: true, defaultValue: 0 },
                { name: 'shippingCost', type: 'number', required: false },
                { name: 'subTotalCost', type: 'number', required: true, defaultValue: 0 },
              ],
            },
          ],
        },

        {
          name: 'receivers',
          type: 'array',
          fields: [
            { name: 'name', type: 'text' },
            { name: 'message', type: 'textarea' },

            {
              name: 'shippingMethod',
              type: 'select',
              hasMany: false,
              required: false,
              admin: { width: '100%' },
              options: [
                { label: 'Standard Mail', value: 'standardMail' },
                { label: 'Express Post', value: 'expressMail' },
                { label: 'Standard Parcel', value: 'standardParcel' },
                { label: 'Express Parcel', value: 'expressParcel' },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'formattedAddress', type: 'text', admin: { width: '100%' } },
                {
                  type: 'row',
                  fields: [
                    { name: 'addressLine1', type: 'text', admin: { width: '50%' } },
                    { name: 'addressLine2', type: 'text', admin: { width: '50%' } },
                    { name: 'json', type: 'json', admin: { width: '100%' } }, // whole address object
                  ],
                },
              ],
            },

            {
              name: 'totals',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'receiverTotal', type: 'number', required: true, defaultValue: 0 },
                    { name: 'receiverThankly', type: 'number', required: true, defaultValue: 0 },
                    { name: 'receiverShipping', type: 'number', required: false },
                  ],
                },
              ],
            },
            { name: 'errors', type: 'json', admin: { width: '100%' } }, // errors for this receiver
          ],
        },
      ],
    },
  ],
}
