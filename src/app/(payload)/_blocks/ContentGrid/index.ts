// import { slateEditor } from '@payloadcms/richtext-slate'
import type { Block } from 'payload/types'

import { blockFields } from '@/app/(payload)/_fields/blockFields'
// import richText from '@cms/_fields/richText'
// import label from '@cms/_fields/richText/label'
import linkGroup from '@/app/(payload)/_fields/linkGroup'
import { contentField } from '@/app/(payload)/_fields/contentField'

export const ContentGrid: Block = {
  slug: 'contentGrid',
  fields: [
    blockFields({
      name: 'contentGridFields',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'style',
              label: 'Style',
              type: 'select',
              defaultValue: 'gridBelow',
              options: [
                { value: 'gridBelow', label: 'Grid Below' },
                { value: 'sideBySide', label: 'Side by Side' },
              ],
            },
            {
              name: 'showNumbers',
              type: 'checkbox',
            },
          ],
        },
        contentField(),

        // richText({
        //   name: 'content',
        //   label: 'Content',
        //   required: false,
        // }),
        linkGroup({
          looks: false,
          overrides: {},
        }),
        {
          name: 'cells',
          type: 'array',
          minRows: 1,
          maxRows: 8,
          fields: [
            contentField(),
            // richText({ name: 'content' }),
          ],
        },
      ],
    }),
  ],
}
