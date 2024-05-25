import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
// import richText from '@cms/_fields/richText'
import { contentField } from '@cms/_fields/contentField'

export const CaseStudyCards: Block = {
  slug: 'caseStudyCards',
  labels: {
    singular: 'Case Study Cards',
    plural: 'Case Study Cards',
  },
  fields: [
    blockFields({
      name: 'caseStudyCardFields',
      fields: [
        {
          name: 'pixels',
          label: 'Show Pixel Background?',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'cards',
          type: 'array',
          fields: [
            contentField(),
            {
              name: 'caseStudy',
              type: 'relationship',
              relationTo: 'case-studies',
              required: true,
            },
          ],
        },
      ],
    }),
  ],
}
