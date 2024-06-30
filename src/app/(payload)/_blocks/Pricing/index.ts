import type { Block } from 'payload'

import { blockFields } from '@cms/_fields/blockFields'
import link from '@cms/_fields/link'

export const Pricing: Block = {
  slug: 'pricing',
  fields: [
    blockFields({
      name: 'pricingFields',
      fields: [
        {
          name: 'plans',
          type: 'array',
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'hasPrice',
              type: 'checkbox',
            },
            {
              name: 'enableCreatePayload',
              type: 'checkbox',
            },
            {
              name: 'price',
              label: 'Price per month',
              type: 'text',
              required: true,
              admin: {
                condition: (_: any, { hasPrice }) => Boolean(hasPrice),
              },
            },
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              admin: {
                condition: (_: any, { hasPrice }) => !Boolean(hasPrice),
              },
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'enableLink',
              type: 'checkbox',
            },
            link({
              looks: false,
              overrides: {
                admin: {
                  condition: (_: any, { enableLink }: any) => enableLink,
                },
              },
            }),
            {
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'icon',
                  type: 'radio',
                  options: [
                    {
                      label: 'Check',
                      value: 'check',
                    },
                    {
                      label: 'X',
                      value: 'x',
                    },
                  ],
                },
                {
                  name: 'feature',
                  label: false,
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'disclaimer',
          type: 'text',
        },
      ],
    }),
  ],
}
