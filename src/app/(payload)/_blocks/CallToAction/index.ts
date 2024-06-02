import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import linkGroup from '@cms/_fields/linkGroup'
import { contentField } from '@cms/_fields/contentField'
// import richText from '@cms/_fields/richText'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToAction',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
    blockFields({
      name: 'ctaFields',
      fields: [
        contentField(),
        // richText(),
        linkGroup({
          looks: false,
          // additions: {
          //   npmCta: true,
          // },
        }),
      ],
    }),
  ],
}
