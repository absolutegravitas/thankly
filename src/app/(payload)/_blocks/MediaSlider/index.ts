import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import link from '@cms/_fields/link'

export const MediaSlider: Block = {
  slug: 'mediaSlider',
  fields: [
    blockFields({
      name: 'mediaSliderFields',
      fields: [
        {
          name: 'slides',
          type: 'array',
          admin: {
            // components: {
            //   RowLabel: ({ data, index, path }) => {
            //     if (data.name) {
            //       return data.name
            //     }
            //   },
            // },
          },
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: false }],
        },
      ],
    }),
  ],
}
