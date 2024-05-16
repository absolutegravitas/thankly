import type { Block } from 'payload/types'

import { blockFields } from '../../_fields/blockFields'
import linkGroup from '../../_fields/linkGroup'

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
