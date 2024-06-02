// import { slateEditor } from '@payloadcms/richtext-slate'
import type { Block } from 'payload/types'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { blockFields } from '@cms/_fields/blockFields'
import { contentField } from '@cms/_fields/contentField'

export const Banner: Block = {
  slug: 'banner',
  fields: [
    blockFields({
      name: 'bannerFields',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'default',
              options: [
                {
                  label: 'Default',
                  value: 'default',
                },
                {
                  label: 'Success',
                  value: 'success',
                },
                {
                  label: 'Warning',
                  value: 'warning',
                },
                {
                  label: 'Error',
                  value: 'error',
                },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'addCheckmark',
              type: 'checkbox',
              admin: {
                width: '50%',
                style: {
                  alignSelf: 'center',
                },
              },
            },
          ],
        },
        contentField(),
        // {
        //   name: 'content',
        //   type: 'richText',
        //   required: true,
        //   editor: lexicalEditor(),
        // },
      ],
    }),
  ],
}
