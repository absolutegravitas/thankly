import type { Block } from 'payload'

import { blockFields } from '@cms/_fields/blockFields'
import link from '@cms/_fields/link'
import { contentField } from '@cms/_fields/contentField'
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
