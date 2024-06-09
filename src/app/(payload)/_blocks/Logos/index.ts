import type { Block } from 'payload/types'
// import { ColourTextField } from '@nouance/payload-better-fields-plugin'

import link from '@cms/_fields/link'
// import richText from '@/fields/richText'
// import colorField from '@/fields/colorPicker/config'
import linkGroup from '@cms/_fields/linkGroup'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Logos: Block = {
  slug: 'logos',
  fields: [
    // colorField('backgroundColor','Background Color', false),
    {
      name: 'introContent',
      label: 'Intro Content',
      type: 'richText',
      required: false,
      editor: lexicalEditor(),
    },
    // richText({
    //   name: 'introContent',
    //   label: 'Intro Content',
    //   required: false,
    // }),
    {
      name: 'fewerItems',
      type: 'checkbox',
      label: 'Show fewer logos on smaller screens',
      defaultValue: false,
    },
    {
      name: 'logos',
      label: 'Companies / Brands',
      type: 'array',
      admin: {
        // components: {
        //   RowLabel: ({ data, index, path }) => {
        //     if (data.title) {
        //       return data.title
        //     }
        //   },
        // },
      },
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: false },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        linkGroup(),
        //   { overrides: {
        //   maxRows: 2
        // } }

        // link({ looks: false, overrides: { required: false } }),
      ],
    },
  ],
}
