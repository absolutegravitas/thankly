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
        {
          type: 'tabs',
          tabs: [
            {
              label: 'Columns',
              description: 'Columns settings',
              fields: [                
                { name: 'colsMobile', type:'number', required: true, min: 1, max: 12 },
                { name: 'colsMedium', type:'number', required: true, min: 1, max: 12 },
                { name: 'colsLarge', type:'number', required: true, min: 1, max: 12 },
                { name: 'colsXLarge', type:'number', required: true, min: 1, max: 12 },
                { name: 'cols2XLarge', type:'number', required: true, min: 1, max: 12 },
              ]
            },
          ]
        }
      ],
    }),
  ],
}
