import type { CollectionConfig } from 'payload'
import { adminsOnly, isAdminOrCurrentUser } from '@/utilities/access'

export const Carts: CollectionConfig = {
  slug: 'carts',
  admin: {
    useAsTitle: 'id',
    group: 'Globals',
    defaultColumns: ['id', 'customer', 'items', 'total', 'createdAt', 'updatedAt'],
  },
  access: {
    create: adminsOnly,
    read: isAdminOrCurrentUser,
    update: adminsOnly,
    delete: adminsOnly,
  },
  labels: { singular: 'Cart', plural: 'Carts' },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },

    {
      name: 'totals',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'cartTotal',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
            {
              name: 'cartThanklys',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
            {
              name: 'cartShipping',
              type: 'number',
              required: false,
              // defaultValue: 0,
            },
          ],
        },
      ],
    },

    {
      name: 'items',
      label: 'Items',
      type: 'array',
      // required: true, // doesn't export types as a proper array unless this is specified, but also fucks up cart creation in frontend
      // minRows: 1,
      fields: [
        { name: 'productPrice', type: 'number', defaultValue: 0, min: 0 },
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'totals',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'itemTotal',
                  type: 'number',
                  required: true,
                  defaultValue: 0,
                },
                {
                  name: 'itemThanklys',
                  type: 'number',
                  required: true,
                  defaultValue: 0,
                },
                {
                  name: 'itemShipping',
                  type: 'number',
                  required: false,
                  // defaultValue: 0,
                },
              ],
            },
          ],
        },

        {
          name: 'receivers',
          labels: { singular: 'Receiver', plural: 'Receivers' },
          type: 'array',
          fields: [
            { name: 'name', type: 'text' },

            {
              type: 'row',
              fields: [{ name: 'message', type: 'textarea', admin: { width: '100%' } }],
            },
            {
              type: 'row',
              fields: [
                { name: 'addressLine1', type: 'text', admin: { width: '50%' } },
                { name: 'addressLine2', type: 'text', admin: { width: '50%' } },
                { name: 'city', type: 'text', admin: { width: '40%' } },
                { name: 'state', type: 'text', admin: { width: '40%' } },
                { name: 'postcode', type: 'text', admin: { width: '10%' } },
              ],
              // call api to calculate postage here in future
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shippingMethod',
                  type: 'select',
                  defaultValue: 'free',
                  hasMany: false,
                  required: false,
                  admin: { width: '100%' },
                  options: [
                    { label: 'FREE', value: 'free' },
                    { label: 'Standard Mail', value: 'standardMail' },
                    // { label: 'Registered Post', value: 'registeredMail' },
                    { label: 'Express Post', value: 'expressMail' },
                    { label: 'Standard Parcel', value: 'standardParcel' },
                    { label: 'Express Parcel', value: 'expressParcel' },
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
                    {
                      name: 'receiverTotal',
                      type: 'number',
                      required: true,
                      defaultValue: 0,
                    },
                    {
                      name: 'receiverThankly',
                      type: 'number',
                      required: true,
                      defaultValue: 0,
                    },
                    {
                      name: 'receiverShipping',
                      type: 'number',
                      required: false,
                      // defaultValue: 0,
                    },
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
