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
          required: true,
          options: [
            { label: 'Pending', value: 'pending' }, // draft, created upon checkout
            { label: 'Processing', value: 'processing' }, // paid, waiting to be fulfilled
            { label: 'Completed', value: 'completed' }, // paid, fulfilled/shipped
            { label: 'Cancelled', value: 'cancelled' }, // not paid, refunded, cancelled by user
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

    // order totals
    {
      name: 'totals',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'cost', type: 'number', required: true, admin: { width: '25%' } },
            { name: 'shipping', type: 'number', required: false, admin: { width: '25%' } },
            { name: 'discount', type: 'number', required: false, admin: { width: '25%' } },
            { name: 'total', type: 'number', required: true, admin: { width: '25%' } },
          ],
        },
      ],
    },

    {
      type: 'tabs', // required
      tabs: [
        {
          name: 'billing',
          label: 'Billing',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'orderedBy',
                  type: 'relationship',
                  relationTo: 'users',
                  required: false,
                  admin: { width: '50%' },
                },
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
                    { name: 'json', type: 'json', admin: { width: '100%' } }, // whole address object for debug
                  ],
                },
              ],
            },
          ],
        },
        {
          // name: 'items',
          label: 'Order Items',
          fields: [
            {
              name: 'items',
              label: 'Items',
              type: 'array',
              // required: true, // doesn't export types as a proper array unless this is specified, but also fucks up order creation in frontend
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
                        { name: 'cost', type: 'number', required: true, defaultValue: 0 },
                        { name: 'shipping', type: 'number', required: false },
                        { name: 'subTotal', type: 'number', required: true, defaultValue: 0 },
                        { name: 'discount', type: 'number', required: false },
                      ],
                    },
                  ],
                },
                {
                  name: 'receivers',
                  label: { singular: 'Receiver', plural: 'Receivers' },
                  type: 'array',
                  fields: [
                    {
                      name: 'totals',
                      type: 'group',
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            { name: 'cost', type: 'number', required: true, defaultValue: 0 },
                            { name: 'shipping', type: 'number', required: false },
                            { name: 'subTotal', type: 'number', required: true, defaultValue: 0 },
                            { name: 'discount', type: 'number', required: false },
                          ],
                        },
                      ],
                    },
                    { name: 'name', type: 'text' },
                    { name: 'message', type: 'textarea' },

                    {
                      name: 'delivery',
                      label: 'Delivery',
                      type: 'group',
                      fields: [
                        {
                          name: 'tracking',
                          label: 'Tracking',
                          type: 'group',
                          fields: [
                            {
                              type: 'row',
                              fields: [
                                { name: 'id', type: 'text', admin: { width: '20%' } },
                                { name: 'link', type: 'text', admin: { width: '50%' } },
                              ],
                            },
                          ],
                        },
                        {
                          name: 'shippingMethod',
                          type: 'select',
                          hasMany: false,
                          required: false,
                          admin: { width: '30%' },
                          options: [
                            { label: 'Standard Mail', value: 'standardMail' },
                            { label: 'Express Post', value: 'expressMail' },
                            { label: 'Standard Parcel', value: 'standardParcel' },
                            { label: 'Express Parcel', value: 'expressParcel' },
                          ],
                        },
                        {
                          name: 'address',
                          label: 'Address',
                          type: 'group',
                          fields: [
                            {
                              type: 'row',
                              fields: [
                                { name: 'formattedAddress', type: 'text', admin: { width: '50%' } },
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
                          ],
                        },

                        // {
                        //   type: 'row',
                        //   fields: [
                        //     {
                        //       name: 'tracking',
                        //       label: 'Tracking',
                        //       type: 'group',
                        //       fields: [],
                        //     },
                        //   ],
                        // },
                      ],
                    },

                    { name: 'errors', type: 'json', admin: { width: '100%' } }, // errors for this receiver
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
