import type { Block } from 'payload/types'

import { blockFields } from '../../_fields/blockFields'
import linkGroup from '../../_fields/linkGroup'
// import richText from '../../fields/richText'
import { contentField } from '@/app/(payload)/_fields/contentField'

export const Statement: Block = {
  slug: 'statement',
  labels: {
    singular: 'Statement',
    plural: 'Statements',
  },
  fields: [
    blockFields({
      name: 'statementFields',
      fields: [
        contentField(),
        // richText(),
        linkGroup({
          looks: false,
        }),
      ],
    }),
  ],
}
