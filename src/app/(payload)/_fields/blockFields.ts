import type { Field, GroupField } from 'payload/types'

import deepMerge from '@cms/_utilities/deepMerge'

interface Args {
  name: string
  label?: string
  fields: Field[]
  overrides?: Partial<GroupField>
}

export const themeField: Field = {
  name: 'thm',
  label: 'Theme',
  type: 'select',
  admin: {
    description: 'Leave blank for system default',
  },
  options: [
    {
      label: 'Light',
      value: 'light',
    },
    {
      label: 'Dark',
      value: 'dark',
    },
  ],
}

export const blockFields = ({ name, label, fields, overrides }: Args): Field =>
  deepMerge(
    {
      name,
      label: label || false,
      type: 'group',
      admin: {
        hideGutter: true,
        style: {
          margin: 0,
          padding: 0,
        },
      },
      fields: [
        {
          type: 'collapsible',
          label: 'Settings',
          fields: [
            {
              type: 'group',
              label: false,
              admin: {
                hideGutter: true,
              },
              name: 'settings',
              fields: [themeField],
            },
          ],
        },
        ...fields,
      ],
    },
    overrides,
  )