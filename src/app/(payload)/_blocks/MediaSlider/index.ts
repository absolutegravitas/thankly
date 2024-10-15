import type { Block } from 'payload'
import { blockFields } from '@cms/_fields/blockFields'

export const MediaSlider: Block = {
  slug: 'mediaSlider',
  fields: [
    blockFields({
      name: 's',
      fields: [
        {
          name: 'slides',
          type: 'array',
          admin: {
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: false },
            { name: 'text', type: 'text', required: false }
          ],
        },
        { name: 'showArrows', type:'checkbox', label: 'Show left & right arrows?', defaultValue: false },
        {
          type: 'row',
          fields: [
            { name: 'visibleMobile', type:'number', required: true, min: 1, max: 10 },
            { name: 'visibleMedium', type:'number', required: true, min: 1, max: 10 },
            { name: 'visibleLarge', type:'number', required: true, min: 1, max: 10 },
            { name: 'visibleXLarge', type:'number', required: true, min: 1, max: 10 },
            { name: 'visible2XLarge', type:'number', required: true, min: 1, max: 10 },
          ]
        }
      ],
    }),
  ],
}
