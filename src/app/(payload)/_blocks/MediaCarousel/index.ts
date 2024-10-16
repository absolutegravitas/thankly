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
        { name: 'columnsMobile', type:'number', required: true, min:1, max:12 },
        { name: 'columnsDesktop', type:'number', required: true, min:1, max:12 }
      ],
    }),
  ],
}
