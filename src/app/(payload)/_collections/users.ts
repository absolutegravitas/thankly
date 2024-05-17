import type { CollectionConfig } from 'payload/types'
import { upsertStripeCustomer } from '@cms/_hooks/upsertStripeCustomer'
import {
  adminsAndUserOnly,
  adminsOnly,
  checkRole,
  makeFirstUserAdmin,
} from '@cms/_utilities/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Account',
    plural: 'Accounts',
  },
  admin: {
    useAsTitle: 'email',
  },
  // auth: true,
  // https://payloadcms.com/docs/authentication/config
  // enable api auth
  auth: {
    lockTime: 15 * 60 * 1000, // 15 minutes in milliseconds
    maxLoginAttempts: 5,
    tokenExpiration: 60 * 60, // 1 hour * 24, // 1 day in seconds
    useAPIKey: true,
    cookies: {
      sameSite:
        process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE
          ? 'None'
          : undefined,
      secure:
        process.env.NODE_ENV === 'production' && !process.env.DISABLE_SECURE_COOKIE
          ? true
          : undefined,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  access: {
    create: adminsOnly,
    read: adminsAndUserOnly,
    update: adminsAndUserOnly,
    delete: adminsAndUserOnly,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [upsertStripeCustomer],
    // afterChange: [loginAfterCreate], // seems to work ootb
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row', // required
              fields: [
                // required
                {
                  name: 'firstName',
                  label: 'First Name',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'lastName',
                  label: 'Last Name',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row', // required
              fields: [
                // required
                {
                  name: 'orgName',
                  label: 'Organization',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'orgId',
                  label: 'ABN / ACN',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'website',
                  label: 'Website',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row', // required
              fields: [
                // required
                {
                  name: 'status',
                  type: 'select',
                  hasMany: false,
                  defaultValue: 'active',
                  admin: {
                    width: '33%',
                  },
                  options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ],
                },
                {
                  name: 'type',
                  type: 'select',
                  hasMany: true,
                  defaultValue: 'retail',
                  admin: {
                    width: '33%',
                  },
                  options: [
                    { label: 'Staff', value: 'staff' },
                    { label: 'Guest', value: 'guest' },
                    { label: 'Retail', value: 'retail' },
                    { label: 'Business', value: 'business' },
                    { label: 'Partner', value: 'partner' },
                  ],
                },
                {
                  name: 'roles',
                  type: 'select',
                  hasMany: true,
                  defaultValue: ['public'],
                  required: true,
                  options: ['admin', 'public'],
                  access: {
                    read: ({ req: { user } }) => checkRole(['admin'], user),
                    create: ({ req: { user } }) => checkRole(['admin'], user),
                    update: ({ req: { user } }) => checkRole(['admin'], user),
                  },
                  hooks: {
                    beforeChange: [makeFirstUserAdmin],
                  },
                },
              ],
            },
            {
              name: 'stripeId',
              label: 'Stripe Customer',
              type: 'text',
              admin: {
                width: '100%',
              },
            },
          ],
        },
        {
          label: 'Orders',
          fields: [
            {
              name: 'orders',
              type: 'relationship',
              relationTo: 'orders',
              hasMany: true,
              hidden: false,
              required: false,
              // hooks: {
              //   beforeChange: [resolveDuplicatePurchases], // don't need this because i dont have purchases for ecommerce store
              // },
            },
            {
              label: 'Saved Cart',
              name: 'cart',
              type: 'group',
              fields: [
                {
                  name: 'items',
                  interfaceName: 'CartItems',
                  labels: { singular: 'Item', plural: 'Items' },
                  type: 'array',
                  fields: [
                    {
                      name: 'product',
                      type: 'relationship',
                      relationTo: 'products',
                      required: true,
                    },
                    {
                      type: 'row', // required
                      fields: [
                        { name: 'itemPrice', type: 'number', min: 0, admin: { width: '25%' } },
                        {
                          name: 'itemTotalShipping',
                          type: 'number',
                          min: 0,
                          admin: { width: '25%' },
                        },
                        { name: 'itemTotal', type: 'number', min: 0, admin: { width: '25%' } },
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
                          type: 'row', // required
                          fields: [{ name: 'message', type: 'textarea', admin: { width: '100%' } }],
                        },
                        {
                          type: 'row', // required
                          fields: [
                            { name: 'addressLine1', type: 'text', admin: { width: '50%' } },
                            { name: 'addressLine2', type: 'text', admin: { width: '50%' } },
                            { name: 'city', type: 'text', admin: { width: '40%' } },
                            { name: 'state', type: 'text', admin: { width: '40%' } },
                            { name: 'postcode', type: 'text', admin: { width: '10%' } },
                          ],
                        },
                        {
                          type: 'row', // required
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
                          type: 'row', // required
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
            },
          ],
        },
      ],
    },
  ],
}
