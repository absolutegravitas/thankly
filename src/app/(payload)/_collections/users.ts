import type { CollectionConfig } from 'payload'
import { upsertStripeCustomer } from '@cms/_hooks/upsertStripeCustomer'
import {
  adminsAndUserOnly,
  adminsOnly,
  // isAdmin,
  // isAdminOrCurrentUser,
  checkRole,
  makeFirstUserAdmin,
} from '@/utilities/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName'],
    group: 'Global',
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
    delete: adminsOnly,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [upsertStripeCustomer],
    // afterChange: [loginAfterCreate], // seems to work ootb
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
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
              type: 'row',
              fields: [
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
                {
                  name: 'imageUrl',
                  label: 'Profile Image URL',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                  // saveToJWT: true
                },
              ],
            },
            {
              type: 'row',
              fields: [
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
                  options: ['admin', 'public', 'customer'],
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
          label: 'Billing',
          fields: [
            {
              name: 'billingAddress',
              type: 'group',
              label: 'Billing Address',
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
            {
              name: 'contactNumber',
              label: 'Contact Number',
              type: 'text',
              admin: {
                width: '50%',
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
            },
          ],
        },
        {
          label: 'Auth',
          fields: [
            {
              name: 'accounts',
              type: 'array',
              saveToJWT: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'provider', type: 'text', admin: { readOnly: true } },
                    { name: 'providerAccountId', type: 'text', admin: { readOnly: true } },
                    { name: 'providerSearchString', type: 'text', admin: { readOnly: true } },
                  ],
                },
              ],
            },
            {
              name: 'verificationTokens',
              type: 'array',
              saveToJWT: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'identifier', type: 'text', admin: { readOnly: true } },
                    { name: 'token', type: 'text', admin: { readOnly: true } },
                    {
                      name: 'expires',
                      type: 'date',
                      admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
                    },
                  ],
                },
              ],
            },
            {
              name: 'emailVerified',
              type: 'date',
              admin: {
                width: '30%',
              },
            },
          ],
        },
      ],
    },
  ],
}
