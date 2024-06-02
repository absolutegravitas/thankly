import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import { Content } from '../Content'
import { HoverHighlights } from '../HoverHighlights'
import { StickyHighlights } from '../StickyHighlights'
import { layoutField } from '@cms/_fields/layoutField'

export const Steps: Block = {
  slug: 'steps',
  labels: {
    singular: 'Steps Block',
    plural: 'Steps Blocks',
  },
  fields: [
    blockFields({
      name: 'stepsFields',
      fields: [
        {
          name: 'steps',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [Content, HoverHighlights, StickyHighlights],
            },
          ],
        },
      ],
    }),
  ],
}
