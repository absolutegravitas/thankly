import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import link from '@cms/_fields/link'
import { contentField } from '@cms/_fields/contentField'
// import richText from '../../fields/richText'

export const MediaContent: Block = {
  slug: 'mediaContent',
  fields: [
    blockFields({
      name: 'mediaContentFields',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'alignment',
              type: 'select',
              defaultValue: 'contentMedia',
              options: [
                {
                  label: 'Content + Media',
                  value: 'contentMedia',
                },
                {
                  label: 'Media + Content',
                  value: 'mediaContent',
                },
              ],
              admin: {
                description: 'Choose how to align the content for this block.',
                width: '50%',
              },
            },
          ],
        },
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
