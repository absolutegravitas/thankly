import type { CollectionConfig } from 'payload'
import { adminsAndUserOnly, adminsOnly } from '@/utilities/access'
import { randomUUID } from 'crypto'

export const Carts: CollectionConfig = {
  slug: 'carts',

  admin: {
    group: '2. Shop',
    useAsTitle: `orderNumber`,
    defaultColumns: ['cartNumber', 'createdAt'],
  },

  access: {
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
          name: 'cartNumber',
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
            { label: 'Draft', value: 'pending' }, // draft, created upon checkout
            { label: 'Completed', value: 'completed' }, // converted to order
            { label: 'Cancelled', value: 'cancelled' }, // not ordered, deleted by user, expired
          ],
        },
      ],
    },

    // cart totals
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
          label: 'Cart Items',
          fields: [
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
                      ],
                    },

                    { name: 'errors', type: 'json', admin: { width: '100%' } },
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
