import type { CollectionConfig } from 'payload/types'
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
      name: 'items',
      label: 'Items',
      type: 'array',
      // interfaceName: 'CartItems',
      // required: true, // doesn't export types as a proper array unless this is specified
      // minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          type: 'row',
          fields: [
            { name: 'price', type: 'number', min: 0, admin: { width: '25%' } },
            {
              name: 'shipping',
              type: 'number',
              min: 0,
              admin: { width: '25%' },
            },
            { name: 'total', type: 'number', min: 0, admin: { width: '25%' } },
          ],
        },
        {
          name: 'receivers',
          labels: { singular: 'Receiver', plural: 'Receivers' },
          type: 'array',
          fields: [
            {
              type: 'row', // required
              fields: [
                { name: 'firstName', type: 'text' },
                { name: 'lastName', type: 'text' },
              ],
            },
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
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shippingOption',
                  type: 'select',
                  defaultValue: 'free',
                  hasMany: false,
                  required: false,
                  admin: { width: '100%' },
                  options: [
                    { label: 'FREE', value: 'free' },
                    { label: 'Standard Mail', value: 'standardMail' },
                    { label: 'Registered Post', value: 'registeredMail' },
                    { label: 'Express Post', value: 'expressMail' },
                    { label: 'AusPost Parcel', value: 'standardParcel' },
                    { label: 'AusPost Express', value: 'expressParcel' },
                    { label: 'Courier', value: 'courierParcel' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'receiverPrice',
                  type: 'number',
                  min: 0,
                  admin: { width: '25%' },
                },
                {
                  name: 'receiverShipping',
                  type: 'number',
                  min: 0,
                  admin: { width: '25%' },
                },
                {
                  name: 'receiverTotal',
                  type: 'number',
                  min: 0,
                  admin: { width: '25%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
