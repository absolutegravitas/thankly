import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
// import richText from '../../fields/richText'
import { contentField } from '@cms/_fields/contentField'

export const Form: Block = {
  slug: 'form',
  labels: {
    singular: 'Form Block',
    plural: 'Form Blocks',
  },
  graphQL: {
    singularName: 'FormBlock',
  },
  fields: [
    blockFields({
      name: 'formFields',
      fields: [
        contentField(),
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
        },
      ],
    }),
  ],
}
