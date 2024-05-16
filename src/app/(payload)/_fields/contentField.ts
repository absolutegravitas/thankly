import deepMerge from '@cms/_utilities/deepMerge'
import type { Field } from 'payload/types'
import {
  lexicalEditor,
  FixedToolbarFeature,
  BlocksFeature,
  TreeViewFeature,
  lexicalHTML,
  HTMLConverterFeature,
  HTMLConverter,
  defaultHTMLConverters,
  SerializedBlockNode,
} from '@payloadcms/richtext-lexical'

import type { RichTextField } from 'payload/types'

type ContentField = (
  overrides?: Partial<RichTextField> & {
    admin?: RichTextField['admin']
  },
) => RichTextField

export const contentField: ContentField = (overrides) => {
  const fieldOverrides = { ...(overrides || {}) }

  return deepMerge<RichTextField>(
    {
      name: 'content',
      type: 'richText',
      required: false,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),

          // HTMLConverterFeature({
          //   converters: ({ defaultConverters }) => [...defaultConverters] as HTMLConverter[],
          // }),

          //TreeViewFeature(),
        ],
      }),
    },
    fieldOverrides || {},
  )
}
