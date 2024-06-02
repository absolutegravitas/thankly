import type { Block } from 'payload/types'
import { blockFields } from '@cms/_fields/blockFields'

export const Reuse: Block = {
  slug: 'reuse',
  fields: [
    blockFields({
      name: 'reuseBlockFields',
      fields: [
        {
          name: 'reusable',
          type: 'relationship',
          relationTo: 'reusable',
          required: true,
        },
        {
          name: 'customId',
          type: 'text',
          admin: {
            description: () =>
              'This is a custom ID that can be used to target this block with CSS or JavaScript.',
          },
        },
      ],
    }),
  ],
}
