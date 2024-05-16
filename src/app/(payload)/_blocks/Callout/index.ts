import type { Block } from 'payload/types'

import { blockFields } from '../../_fields/blockFields'
import linkGroup from '../../_fields/linkGroup'
// import richText from '../../fields/richText'
import { contentField } from '@/app/(payload)/_fields/contentField'

export const Callout: Block = {
  slug: 'callout',
  fields: [
    blockFields({
      name: 'calloutFields',
      fields: [
        contentField(),
        // richText(),
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              type: 'text',
            },
            {
              name: 'role',
              type: 'text',
            },
          ],
        },
        {
          name: 'images',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    }),
  ],
}
