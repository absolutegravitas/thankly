import type { Field, ArrayField } from 'payload/types'

import deepMerge from '@/utilities/deepMerge'
import type { LinkLooks } from './link'
import link from './link'

type LinkGroupType = (options?: {
  overrides?: Partial<ArrayField>
  looks?: LinkLooks[] | false
}) => Field

const additionalFields: Field[] = [
  {
    name: 'type',
    type: 'select',
    defaultValue: 'link',
    options: [
      { value: 'link', label: 'Link' },
      // { value: 'npmCta', label: 'NPM CTA' },
    ],
  },
]

const linkGroup: LinkGroupType = ({
  overrides = {},
  looks,
  // additions
} = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    admin: {
      // components: {
      //   RowLabel: ({ data, index, path }) => {
      //     if (data.link?.label) {
      //       return data.link?.label
      //     }
      //   },
      // },
    },
    fields: [
      ...// additions?.npmCta
      // ? [
      //     ...additionalFields,
      //     link({
      //       overrides: {
      //         admin: { condition: (_: any, { type }: any) => Boolean(type === 'link') },
      //       },
      //       looks,
      //     }),
      //   ]
      // :
      [link({ looks })],
    ],
  }

  return deepMerge(generatedLinkGroup, overrides)
}

export default linkGroup
