import type { CollectionConfig } from 'payload/types'
import payload from 'payload'

import { adminsAndUserOnly, adminsOnly } from '../../../utilities/access'
// import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

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
    create: () => true,
    read: adminsAndUserOnly,
    update: adminsAndUserOnly,
    delete: adminsOnly,
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'orderNumber',
          type: 'number',
          unique: true,
          // hooks: {
          //   beforeValidate: [
          //     async ({ data, operation, req }) => {
          //       if (operation === 'create') {
          //         const lastOrder = await req.payload.find({
          //           collection: 'orders',
          //           sort: '-orderNumber',
          //           limit: 1,
          //         })

          //         // console.log(lastOrder)

          //         const lastOrderNumber = lastOrder.docs[0]?.orderNumber ?? 0
          //         return lastOrderNumber > 0 ? lastOrderNumber + 1 : data?.orderNumber
          //       }

          //       return data?.orderNumber
          //     },
          //   ],
          // },
        },
        {
          name: 'orderedBy',
          type: 'relationship',
          relationTo: 'users',
          required: false, // no you need at least a customer account, even if only to track email
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
    {
      type: 'row',
      fields: [
        { name: 'orderSubtotal', type: 'number', min: 0, admin: { width: '25%' } },
        // { name: 'orderTax', type: 'number', min: 0, admin: { width: '25%' } },
        { name: 'orderShipping', type: 'number', min: 0, admin: { width: '25%' } },
        { name: 'orderTotal', type: 'number', min: 0, admin: { width: '25%' } },
      ],
    },

    {
      name: 'items',
      labels: { singular: 'Item', plural: 'Items' },
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        {
          type: 'row',
          fields: [
            { name: 'itemPrice', type: 'number', min: 0, admin: { width: '25%' } },
            // {
            //   name: 'itemTotalTax',
            //   label: 'Taxes',
            //   type: 'number',
            //   min: 0,
            //   admin: { width: '25%' },
            // },
            { name: 'itemTotalShipping', type: 'number', min: 0, admin: { width: '25%' } },
            { name: 'itemTotal', type: 'number', min: 0, admin: { width: '25%' } },
          ],
        },
        {
          name: 'receivers',
          labels: { singular: 'Receiver', plural: 'Receivers' },
          type: 'array',
          fields: [
            {
              type: 'row',
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
                { name: 'receiverPrice', type: 'number', min: 0, admin: { width: '25%' } },
                // {
                //   name: 'receiverTax',
                //   label: 'Taxes',
                //   type: 'number',
                //   min: 0,
                //   admin: { width: '25%' },
                // },
                { name: 'receiverShipping', type: 'number', min: 0, admin: { width: '25%' } },
                { name: 'receiverTotal', type: 'number', min: 0, admin: { width: '25%' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
