// import { slateEditor } from '@payloadcms/richtext-slate'
import type { Block } from 'payload/types'
import { blockFields } from '@cms/_fields/blockFields'
import { HTMLConverterFeature, lexicalEditor, TreeViewFeature } from '@payloadcms/richtext-lexical'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  fields: [
    blockFields({
      name: 'mediaBlockFields',
      fields: [
        {
          name: 'position',
          type: 'select',
          defaultValue: 'default',
          options: [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Wide',
              value: 'wide',
            },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              HTMLConverterFeature({}),
              //TreeViewFeature(),
            ],
          }),
        },
      ],
    }),
  ],
}
