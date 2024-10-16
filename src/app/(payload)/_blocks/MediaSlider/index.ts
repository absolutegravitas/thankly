import type { Block } from 'payload'
import { blockFields } from '@cms/_fields/blockFields'

export const MediaSlider: Block = {
  slug: 'mediaSlider',
  fields: [
    blockFields({
      name: 'mediaSliderFields',
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
          type: 'tabs',
          tabs: [
            {
              label: 'Columns',
              description: 'Columns settings',
              fields: [                
                { name: 'colsMobile', type:'number', required: true, min: 1, max: 10 },
                { name: 'colsMedium', type:'number', required: true, min: 1, max: 10 },
                { name: 'colsLarge', type:'number', required: true, min: 1, max: 10 },
                { name: 'colsXLarge', type:'number', required: true, min: 1, max: 10 },
                { name: 'cols2XLarge', type:'number', required: true, min: 1, max: 10 },
              ]
            },
          ]
        }
      ],
    }),
  ],
}
