import type { CollectionConfig } from 'payload/types'
import { upsertStripeCustomer } from '@cms/_hooks/upsertStripeCustomer'
import {
  adminsAndUserOnly,
  adminsOnly,
  // isAdmin,
  // isAdminOrCurrentUser,
  checkRole,
  makeFirstUserAdmin,
} from '@/utilities/payload/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName'],
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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              type: 'row', // required
              fields: [
                { name: 'name', type: 'text', saveToJWT: true },

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

// "WORKING NEXT_AUTH MERGED WITH PAYLOAD"
// BUT DOGSHIT SINCE PAYLOAD ADMIN DOESNT WORK

// import { ADMIN_ACCESS_ROLES, DEFAULT_USER_ROLE } from '@/utilities/auth/config'
// import { findAuthJsCookie, getCurrentUser } from '@/utilities/auth/edge'
// import { revalidateUser } from '@/utilities/payload/actions'
// import parseCookieString from '@/utilities/parseCookieString'
// import { COLLECTION_SLUG_PRODUCTS, COLLECTION_SLUG_SESSIONS, COLLECTION_SLUG_USER } from './config'

// const ADMIN_AUTH_GROUP = 'Auth'

// export const users: CollectionConfig = {
//   slug: COLLECTION_SLUG_USER,
//   admin: {
//     group: ADMIN_AUTH_GROUP,
//     useAsTitle: 'email',
//   },
//   endpoints: [
//     {
//       path: '/refresh-token',
//       method: 'post',
//       async handler(request) {
//         if (!request?.url) return new Response('No request URL provided', { status: 400 })

//         const requestUrl = new URL(request.url)
//         requestUrl.pathname = '/api/auth/session'

//         const newRequest = new Request(requestUrl.toString(), {
//           method: 'GET',
//           headers: new Headers(request.headers),
//         })

//         try {
//           const response = await fetch(newRequest)
//           const data = await response.json()

//           if (!response.ok) {
//             throw new Error('Failed to refresh token')
//           }

//           if (!data?.user) return new Response('No user found', { status: 401 })

//           const responseCookies = parseCookieString(
//             String(response.headers.get('Set-Cookie') || ''),
//           )
//           const authCookie = findAuthJsCookie(responseCookies)
//           if (!authCookie) return new Response('No auth cookie found', { status: 401 })
//           const cookieValue = authCookie.value
//           const responseBody = JSON.stringify({
//             message: 'Token refresh successful',
//             refreshToken: cookieValue?.value,
//             exp:
//               cookieValue && cookieValue?.expires
//                 ? Math.floor(cookieValue.expires.getTime() / 1000)
//                 : null,
//             user: data.user,
//           })

//           return new Response(responseBody, {
//             status: response.status,
//             headers: response.headers,
//           })
//         } catch (error) {
//           console.log(error)
//           return new Response(JSON.stringify({ message: 'Token refresh failed' }), { status: 401 })
//         }
//       },
//     },
//   ],
//   auth: {
//     strategies: [
//       {
//         name: 'next-auth',
//         authenticate: async ({ headers, payload }) => {
//           const currentUser = await getCurrentUser({ headers, payload, cache: true })
//           if (!currentUser) return null
//           return {
//             ...currentUser,
//             collection: COLLECTION_SLUG_USER,
//           }
//         },
//       },
//     ],
//   },
//   hooks: {
//     afterChange: [
//       async ({ doc, req }) => {
//         const payload = req.payload
//         await revalidateUser(doc, payload)
//       },
//     ],
//   },
//   access: {
//     admin: async ({ req }) => {
//       return ADMIN_ACCESS_ROLES.includes(req?.user?.role || DEFAULT_USER_ROLE)
//     },
//     read: isAdminOrCurrentUser,
//     create: isAdmin,
//     update: isAdmin,
//     delete: isAdminOrCurrentUser,
//   },
//   fields: [
//     { name: 'name', type: 'text', saveToJWT: true },
//     { name: 'imageUrl', type: 'text', saveToJWT: true },
//     { name: 'role', type: 'select', options: ['admin', 'user'], saveToJWT: true },
//     { name: 'emailVerified', type: 'date' },
//     {
//       name: 'stripeCustomerId',
//       type: 'text',
//       saveToJWT: true,
//       admin: { readOnly: true, position: 'sidebar' },
//     },
//     {
//       name: 'accounts',
//       type: 'array',
//       saveToJWT: false,
//       fields: [
//         {
//           type: 'row',
//           fields: [
//             { name: 'provider', type: 'text', admin: { readOnly: true } },
//             { name: 'providerAccountId', type: 'text', admin: { readOnly: true } },
//           ],
//         },
//       ],
//     },
//     {
//       name: 'verificationTokens',
//       type: 'array',
//       saveToJWT: false,
//       fields: [
//         {
//           type: 'row',
//           fields: [
//             { name: 'identifier', type: 'text', admin: { readOnly: true } },
//             { name: 'token', type: 'text', admin: { readOnly: true } },
//             { name: 'expires', type: 'date', admin: { readOnly: true } },
//           ],
//         },
//       ],
//     },
//     {
//       name: 'roles',
//       type: 'select',
//       hasMany: true,
//       defaultValue: ['public'],
//       required: true,
//       options: ['admin', 'public'],
//       access: {
//         read: ({ req: { user } }) => checkRole(['admin'], user),
//         create: ({ req: { user } }) => checkRole(['admin'], user),
//         update: ({ req: { user } }) => checkRole(['admin'], user),
//       },
//       hooks: {
//         beforeChange: [makeFirstUserAdmin],
//       },
//     },
//   ],
// } as const

// export const sessions: CollectionConfig = {
//   slug: COLLECTION_SLUG_SESSIONS,
//   admin: {
//     group: ADMIN_AUTH_GROUP,
//   },
//   access: {
//     read: isAdminOrCurrentUser,
//     create: isAdmin,
//     update: isAdmin,
//     delete: isAdmin,
//   },
//   fields: [
//     {
//       name: 'user',
//       type: 'relationship',
//       relationTo: COLLECTION_SLUG_USER,
//       required: true,
//       admin: { readOnly: false },
//     },
//     { name: 'sessionToken', type: 'text', required: true, index: true, admin: { readOnly: false } },
//     {
//       name: 'expires',
//       type: 'date',
//       admin: { readOnly: false, date: { pickerAppearance: 'dayAndTime' } },
//       required: false,
//     },
//   ],
// } as const
