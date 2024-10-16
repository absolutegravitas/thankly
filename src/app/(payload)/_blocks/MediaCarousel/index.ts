import type { Block } from 'payload'
import { blockFields } from '@cms/_fields/blockFields'

export const MediaCarousel: Block = {
  slug: 'mediaCarousel',
  fields: [
    blockFields({
      name: 'mediaCarouselFields',
      fields: [
        {
          name: 'items',
          type: 'array',
          admin: {
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: false },
          ],
        },
        { name: 'imageTailwind', type:'text', required: false }
      ],
    }),
  ],
}
