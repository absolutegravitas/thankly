import { adminsOnly } from '@/utilities/access'
import { CollectionConfig, FieldHook } from 'payload'

const uppercaseHook: FieldHook = ({ value }): string | any => {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value
}

export const DiscountCodes: CollectionConfig = {
  slug: 'discountcodes',
  labels: {
    plural: 'Discount Codes',
    singular: 'Discount Code',
  },
  admin: {
    group: 'Commerce',
  },
  access: {
    read: adminsOnly,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'slug',
          label: 'Discount Code',
          type: 'text',
          required: true,
          index: true,
          admin: { width: '25%', readOnly: false },
          hooks: {
            beforeValidate: [uppercaseHook],
          },
        },
        {
          name: 'cartDescription',
          type: 'text',
          required: true,
          admin: { width: '75%', readOnly: false },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'discountAmount',
          type: 'number',
          required: true,
          admin: { width: '25%', readOnly: false },
          defaultValue: 0,
        },
        {
          name: 'discountType',
          type: 'select',
          required: true,
          admin: { width: '25%', readOnly: false },
          options: [
            { label: 'Percent Off', value: 'percentOff' },
            { label: 'Dollars Off', value: 'dollarsOff' },
          ],
        },
        {
          name: 'starts',
          type: 'date',
          admin: { width: '25%', readOnly: false, date: { pickerAppearance: 'dayAndTime' } },
          required: true,
        },
        {
          name: 'expires',
          type: 'date',
          admin: { width: '25%', readOnly: false, date: { pickerAppearance: 'dayAndTime' } },
          required: true,
        },
      ],
    },

    {
      name: 'homePageDetails', // required
      type: 'group', // required
      fields: [
        {
          name: 'onHomePage',
          label: 'Advertised on Home Page',
          type: 'checkbox',
          required: true,
          admin: { readOnly: false },
          defaultValue: false,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'AdvertisedDescription',
              type: 'text',
              required: false,
              admin: { width: '50%', readOnly: false },
            },
            {
              name: 'starts',
              label: 'Advertising Starts',
              type: 'date',
              admin: { width: '25%', readOnly: false, date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'expires',
              label: 'Advertising Ends',
              type: 'date',
              admin: { width: '25%', readOnly: false, date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },
  ],
} as const
