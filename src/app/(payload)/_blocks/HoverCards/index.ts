import type { Block } from 'payload/types'

import { blockFields } from '../../_fields/blockFields'
import link from '../../_fields/link'
// import richText from '@../../fields/richText'
import { contentField } from '@/app/(payload)/_fields/contentField'

export const HoverCards: Block = {
  slug: 'hoverCards',
  fields: [
    blockFields({
      name: 'hoverCardsFields',
      fields: [
        contentField(),
        // richText(),
        {
          name: 'cards',
          type: 'array',
          minRows: 1,
          maxRows: 3,
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
            link({
              disableLabel: true,
              looks: false,
            }),
          ],
        },
      ],
    }),
  ],
}