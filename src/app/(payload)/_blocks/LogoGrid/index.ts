import type { Block } from 'payload/types'

import { blockFields } from '../../_fields/blockFields'
import link from '../../_fields/link'
import { contentField } from '@/app/(payload)/_fields/contentField'
// import richText from '../../fields/richText'

export const LogoGrid: Block = {
  slug: 'logoGrid',
  fields: [
    blockFields({
      name: 'logoGridFields',
      fields: [
        contentField(),
        // richText(),
        {
          name: 'enableLink',
          type: 'checkbox',
        },
        link({
          looks: false,
          overrides: {
            admin: {
              condition: (_: any, { enableLink }: any) => enableLink,
            },
          },
        }),
        {
          name: 'logos',
          type: 'array',
          fields: [
            {
              name: 'logoMedia',
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
