import type { CollectionConfig } from 'payload'
import { adminsAndUserOnly, adminsOnly } from '@/utilities/access'
import { sendShippedEmail } from '@cms/_hooks/sendShippedEmail'
import { Order } from '@/payload-types'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: `orderNumber`,
    defaultColumns: ['orderNumber', 'createdAt', 'orderedBy'],
    group: 'Commerce',
  },
  hooks: {
    beforeChange: [
      async ({ req, data, originalDoc }) => {
        if (data.status === 'shipped' && originalDoc.status !== 'shipped') {
          req.payload.logger.info(
            `Order ${data.orderNumber} status changed to shipped. Scheduling email.`,
          )

          console.log('data -- ', data)

          setTimeout(async () => {
            try {
              await sendShippedEmail(data as Order)
            } catch (error) {
              req.payload.logger.error(
                `Error in email sending process for order ${data.orderNumber}:`,
                error,
              )
            }
          }, 0)
        }
        return data
      },
    ],
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
          type: 'text',
          required: false,
          admin: { width: '25%', readOnly: true },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          hasMany: false,
          required: true,
          options: [
            { label: 'Pending', value: 'pending' }, // draft, created upon checkout
            { label: 'Shipped', value: 'shipped' }, // shipped
            { label: 'Delivered', value: 'delivered' }, // delivered
            { label: 'Cancelled', value: 'cancelled' }, // not paid, refunded, cancelled by user or admin
            { label: 'On Hold', value: 'onhold' }, // on hold, awaiting payment
          ],
        },
        {
          name: 'discountCodeApplied',
          type: 'text',
          required: false,
          admin: { width: '25%', readOnly: true },
        },
        {
          name: 'stripeId', // payment intent id?
          label: 'Stripe ID',
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
                // for guest checkout

                { name: 'firstName', label: 'First Name', type: 'text', admin: { width: '50%' } },
                { name: 'lastName', label: 'Last Name', type: 'text', admin: { width: '50%' } },
                { name: 'email', label: 'Email', type: 'email', admin: { width: '50%' } },
                { name: 'orgName', label: 'Organization', type: 'text', admin: { width: '50%' } },
                { name: 'orgId', label: 'ABN / ACN', type: 'text', admin: { width: '50%' } },
                {
                  name: 'contactNumber',
                  label: 'Contact Number',
                  type: 'number',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'address',
              label: 'Billing Address',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'addressLine1', type: 'text', admin: { width: '50%' } },
                    { name: 'addressLine2', type: 'text', admin: { width: '50%' } },
                    { name: 'city', type: 'text', admin: { width: '50%' } },
                    { name: 'state', type: 'text', admin: { width: '50%' } },
                    { name: 'postcode', type: 'text', admin: { width: '50%' } },
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
                { name: 'itemId', type: 'text', required: true },
                { name: 'quantity', type: 'number', defaultValue: 1, min: 1, required: true },
                { name: 'price', type: 'number', defaultValue: 0, min: 0, required: true },
                { name: 'product', type: 'relationship', relationTo: 'products', required: true },
                { name: 'addOns', type: 'relationship', relationTo: 'products', hasMany: true },
                { name: 'receiverId', type: 'text' },
                {
                  name: 'giftCard',
                  type: 'group',
                  fields: [
                    { name: 'message', type: 'textarea', required: true, defaultValue: '' },
                    { name: 'writingStyle', type: 'text', required: true, defaultValue: 'regular' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Receivers',
          fields: [
            {
              name: 'receivers',
              label: 'Receivers',
              type: 'array',
              fields: [
                { name: 'receiverId', type: 'text', required: true },
                { name: 'firstName', type: 'text', required: true },
                { name: 'lastName', type: 'text', required: true },
                {
                  name: 'address',
                  label: 'Address',
                  type: 'group',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            {
                              name: 'addressLine1',
                              type: 'text',
                              admin: { width: '50%' },
                              required: true,
                            },
                            { name: 'addressLine2', type: 'text', admin: { width: '50%' } },
                            { name: 'city', type: 'text', admin: { width: '50%' }, required: true },
                            {
                              name: 'state',
                              type: 'text',
                              admin: { width: '50%' },
                              required: true,
                            },
                            {
                              name: 'postcode',
                              type: 'text',
                              admin: { width: '50%' },
                              required: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
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
                    { name: 'shippingPrice', type: 'number', defaultValue: 0, min: 0 },
                    // { name: 'errors', type: 'json', admin: { width: '100%' } }, //what dis for?
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
