import type { Field } from 'payload/types'

import deepMerge from '@cms/_utilities/deepMerge'

export const lookOptions = {
  default: {
    label: 'Default (shown as link)',
    value: 'default',
  },

  // content
  contentDark: {
    label: 'Content (Dark)',
    value: 'contentDark',
  },
  contentLight: {
    label: 'Content (Light)',
    value: 'contentLight',
  },
  contentTransparentLight: {
    label: 'Content (Transparent Light)',
    value: 'contentTransparentLight',
  },
  contentTransparentDark: {
    label: 'Content (Transparent Dark)',
    value: 'contentTransparentDark',
  },

  // hero
  heroDark: {
    label: 'Hero (Dark)',
    value: 'heroDark',
  },

  heroLight: {
    label: 'Hero (Light)',
    value: 'heroLight',
  },

  heroTransparentLight: {
    label: 'Hero (Transparent Light)',
    value: 'heroTransparentLight',
  },

  heroTransparentDark: {
    label: 'Hero (Transparent Dark)',
    value: 'heroTransparentDark',
  },

  // product
  productDark: {
    label: 'Product (Dark)',
    value: 'productDark',
  },

  productLight: {
    label: 'Product (Light)',
    value: 'productLight',
  },

  productTransparentLight: {
    label: 'Product (Transparent Light)',
    value: 'productTransparentLight',
  },

  productTransparentDark: {
    label: 'Product (Transparent Dark)',
    value: 'productTransparentDark',
  },
}
export type LinkLooks = keyof typeof lookOptions

type LinkType = (options?: {
  looks?: LinkLooks[] | false
  disableLabel?: boolean
  overrides?: Record<string, unknown>
}) => Field

const link: LinkType = ({ looks, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: Field = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
            defaultValue: 'reference',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
          },
          {
            name: 'newTab',
            label: 'Open in new tab',
            type: 'checkbox',
            admin: {
              width: '50%',
              style: {
                alignSelf: 'flex-end',
              },
            },
          },
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      label: 'Document to link to',
      type: 'relationship',
      relationTo: ['pages', 'products'],
      required: true,
      maxDepth: 1,
      admin: {
        condition: (_: any, siblingData) => siblingData?.type === 'reference',
      },
    },
    {
      name: 'url',
      label: 'Custom URL',
      type: 'text',
      required: true,
      admin: {
        condition: (_: any, siblingData) => siblingData?.type === 'custom',
      },
    },
  ]

  if (!disableLabel) {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: '50%',
      },
    }))

    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (looks !== false) {
    let lookOptionsToUse = [
      lookOptions.default,

      lookOptions.contentDark,
      lookOptions.contentLight,
      lookOptions.contentTransparentLight,
      lookOptions.contentTransparentDark,

      lookOptions.heroDark,
      lookOptions.heroLight,
      lookOptions.heroTransparentLight,
      lookOptions.heroTransparentDark,

      lookOptions.productDark,
      lookOptions.productLight,
      lookOptions.productTransparentLight,
      lookOptions.productTransparentDark,
    ]

    if (Array.isArray(looks)) {
      lookOptionsToUse = looks.map((looks) => lookOptions[looks])
    }

    linkResult.fields.push({
      name: 'looks',
      type: 'select',
      defaultValue: 'default',
      options: lookOptionsToUse,
      admin: {
        description: 'Choose how the link should be rendered.',
      },
    })
  }

  return deepMerge(linkResult, overrides)
}

export default link
