import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import link from '@cms/_fields/link'
// import richText from '../../fields/richText'
import { contentField } from '@cms/_fields/contentField'

export const HoverHighlights: Block = {
  slug: 'hoverHighlights',
  labels: {
    singular: 'Hover Highlights Block',
    plural: 'Hover Highlights Blocks',
  },
  fields: [
    blockFields({
      name: 'hoverHighlightsFields',
      fields: [
        contentField(),
        // richText(),
        {
          name: 'addRowNumbers',
          type: 'checkbox',
        },
        {
          name: 'highlights',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              required: true,
            },
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'enableLink',
              type: 'checkbox',
            },
            link({
              looks: false,
              disableLabel: true,
              overrides: {
                admin: {
                  condition: (_: any, { enableLink }: any) => Boolean(enableLink),
                },
              },
            }),
          ],
        },
      ],
    }),
  ],
}
