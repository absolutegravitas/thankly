import type { Block } from 'payload'
import { blockFields } from '@cms/_fields/blockFields'

export const MediaGrid: Block = {
  slug: 'mediaGrid',
  fields: [
    blockFields({
      name: 'mediaGridFields',
      fields: [
        {
          name: 'items',
          type: 'array',
          admin: {
          },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: false },
            { name: 'text', type: 'text', required: false }
          ],
        },
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
