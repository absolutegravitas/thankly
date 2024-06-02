import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import link from '@cms/_fields/link'
import linkGroup from '@cms/_fields/linkGroup'
import { contentField } from '@cms/_fields/contentField'
// import richText from '../../fields/richText'

export const CardGrid: Block = {
  slug: 'cardGrid',
  fields: [
    blockFields({
      name: 'cardGridFields',
      fields: [
        contentField(),
        // richText(),
        linkGroup({
          looks: false,
          overrides: {
            admin: {
              description: 'These links will be placed above the card grid as calls-to-action.',
            },
          },
        }),
        {
          name: 'revealDescription',
          label: 'Reveal descriptions on hover?',
          type: 'checkbox',
        },
        {
          name: 'cards',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
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
              disableLabel: true,
              looks: false,
              overrides: {
                admin: {
                  condition: (_: any, { enableLink }: any) => enableLink,
                },
              },
            }),
          ],
        },
      ],
    }),
  ],
}
