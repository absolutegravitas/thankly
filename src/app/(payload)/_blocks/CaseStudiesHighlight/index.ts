import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import richText from '@cms/_fields/richText'
import { contentField } from '../../_fields/contentField'

export const CaseStudiesHighlight: Block = {
  slug: 'caseStudiesHighlight',
  fields: [
    blockFields({
      name: 'caseStudiesHighlightFields',
      fields: [
        contentField(),
        {
          name: 'caseStudies',
          type: 'relationship',
          relationTo: 'case-studies',
          hasMany: true,
          required: true,
        },
      ],
    }),
  ],
}
