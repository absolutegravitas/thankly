import type { Block } from 'payload'

import { blockFields } from '@cms/_fields/blockFields'
import link from '@cms/_fields/link'
// import richText from '../../fields/richText'
import { contentField } from '@cms/_fields/contentField'
// import codeBlips from '../../fields/codeBlips'

export const StickyHighlights: Block = {
  slug: 'stickyHighlights',
  labels: {
    singular: 'Sticky Highlights Block',
    plural: 'Sticky Highlights Blocks',
  },
  fields: [
    blockFields({
      name: 'stickyHighlightsFields',
      fields: [
        {
          name: 'highlights',
          type: 'array',
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
                  condition: (_: any, { enableLink }: any) => Boolean(enableLink),
                },
              },
            }),
            {
              name: 'type',
              type: 'radio',
              options: [
                {
                  label: 'Code',
                  value: 'code',
                },
                {
                  label: 'Media',
                  value: 'media',
                },
              ],
            },
            {
              name: 'code',
              type: 'code',
              required: true,
              admin: {
                condition: (_: any, { type }) => type === 'code',
              },
            },
            // {
            //   ...codeBlips,
            //   admin: {
            //     condition: (_:any, { type }) => type === 'code',
            //   },
            // },
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                condition: (_: any, { type }) => type === 'media',
              },
            },
          ],
        },
      ],
    }),
  ],
}
