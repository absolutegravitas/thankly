import type { Block } from 'payload'

import { blockFields } from '@cms/_fields/blockFields'
import linkGroup from '@cms/_fields/linkGroup'

export const LinkGrid: Block = {
  slug: 'linkGrid',
  fields: [
    blockFields({
      name: 'linkGridFields',
      fields: [
        linkGroup({
          looks: false,
        }),
      ],
    }),
  ],
}
