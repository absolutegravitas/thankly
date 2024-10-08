import type { GlobalConfig } from 'payload'
import linkGroup from '@cms/_fields/linkGroup'
import { contentField } from '@cms/_fields/contentField'
import link from '@cms/_fields/link'
import { revalidateTag } from 'next/cache'
import { adminsOnly } from '../../../utilities/access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: { group: 'Global' },
  access: {
    read: () => true,
    update: adminsOnly,
  },
  hooks: {
    afterChange: [async () => revalidateTag('settings')],
  },
  fields: [
    {
      name: 'topBar',
      interfaceName: 'topBar',
      type: 'group',
      fields: [
        {
          name: 'visible',
          type: 'checkbox',
          defaultValue: false,
        },
        contentField(),
      ],
    },
    {
      name: 'defaultGiftCard',
      interfaceName: 'defaultGiftCard',
      type: 'group',
      fields: [
        {
          name: 'defaultGiftCard',
          type: 'relationship',
          relationTo: 'products',
          hasMany: false,
        },
      ],
    },
    {
      name: 'menu',
      interfaceName: 'menu',
      type: 'group',
      fields: [
        {
          name: 'tabs',
          type: 'array',
          fields: [
            { name: 'label', required: true, type: 'text' },
            {
              type: 'row',
              fields: [
                { type: 'checkbox', name: 'enableDirectLink' },
                { type: 'checkbox', name: 'enableDropdown' },
              ],
            },
            {
              label: 'Direct Link',
              type: 'collapsible',
              admin: {
                condition: (_, siblingData) => siblingData.enableDirectLink,
              },
              fields: [link({ looks: false, disableLabel: true })],
            },
            {
              label: 'Dropdown Menu',
              type: 'collapsible',
              admin: {
                condition: (_, siblingData) => siblingData.enableDropdown,
              },
              fields: [
                { name: 'description', type: 'textarea' },
                {
                  name: 'descriptionLinks',
                  type: 'array',
                  fields: [link({ overrides: { label: false }, looks: false })],
                },
                {
                  name: 'items',
                  type: 'array',
                  admin: {
                    components: {
                      RowLabel: ({ data }) => {
                        if (data?.style === 'default') {
                          return data.defaultLink?.link.label
                        }
                        if (data?.style === 'featured') {
                          return data.featuredLink?.tag
                        }
                        if (data?.style === 'list') {
                          return data.listLinks?.tag
                        }
                      },
                    },
                  },
                  fields: [
                    {
                      name: 'style',
                      type: 'select',
                      defaultValue: 'default',
                      options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Featured', value: 'featured' },
                        { label: 'List', value: 'list' },
                      ],
                    },
                    {
                      name: 'defaultLink',
                      type: 'group',
                      admin: {
                        condition: (_, siblingData) => siblingData.style === 'default',
                      },
                      fields: [
                        link({ overrides: { label: false }, looks: false }),
                        { name: 'description', type: 'textarea' },
                      ],
                    },
                    {
                      name: 'featuredLink',
                      type: 'group',
                      admin: {
                        condition: (_, siblingData) => siblingData.style === 'featured',
                      },
                      fields: [
                        { name: 'tag', type: 'text' },
                        { name: 'label', type: 'richText' },
                        {
                          name: 'links',
                          type: 'array',
                          fields: [link({ overrides: { label: false }, looks: false })],
                        },
                      ],
                    },
                    {
                      name: 'listLinks',
                      type: 'group',
                      admin: {
                        condition: (_, siblingData) => siblingData.style === 'list',
                      },
                      fields: [
                        { name: 'tag', type: 'text' },
                        {
                          name: 'links',
                          type: 'array',
                          fields: [link({ overrides: { label: false }, looks: false })],
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
    {
      name: 'footer',
      interfaceName: 'footer', // optional
      type: 'group',
      fields: [
        {
          name: 'columns',
          type: 'array',
          minRows: 1,
          maxRows: 4,
          fields: [
            { name: 'label', label: 'Column Name', type: 'text' },
            { name: 'items', type: 'array', fields: [link({ looks: false })] },
          ],
        },
      ],
    },
  ],
}
