import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import linkGroup from '@cms/_fields/linkGroup'
import link from '@cms/_fields/link'
import { contentField } from '@/app/(payload)/_fields/contentField'
// import richText from '@cms/_fields/richText'

export const MediaContentAccordion: Block = {
  slug: 'mediaContentAccordion',
  fields: [
    blockFields({
      name: 'mediaContentAccordionFields',
      fields: [
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'contentMedia',
          options: [
            {
              label: 'Content + Media',
              value: 'contentMedia',
            },
            {
              label: 'Media + Content',
              value: 'mediaContent',
            },
          ],
          admin: {
            description: 'Choose how to align the content for this block.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'leader',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'heading',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'accordion',
          type: 'array',
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'position',
                  type: 'select',
                  defaultValue: 'normal',
                  options: [
                    {
                      label: 'Normal',
                      value: 'normal',
                    },
                    {
                      label: 'Inset',
                      value: 'inset',
                    },
                    {
                      label: 'Wide',
                      value: 'wide',
                    },
                  ],
                  admin: {
                    description: 'Choose how to position the media itself.',
                    width: '50%',
                  },
                },
                {
                  name: 'background',
                  type: 'select',
                  defaultValue: 'none',
                  options: [
                    {
                      label: 'None',
                      value: 'none',
                    },
                    {
                      label: 'Gradient',
                      value: 'gradient',
                    },
                    {
                      label: 'Scanlines',
                      value: 'scanlines',
                    },
                  ],
                  admin: {
                    description: 'Select the background you want to sit behind the media.',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'mediaLabel',
              type: 'text',
              required: true,
            },
            contentField({ name: 'mediaDescription' }),
            // richText({ name: 'mediaDescription' }),
            // {
            //   name: 'mediaDescription',
            //   type: 'richText',
            //   required: true,
            // },
            {
              name: 'enableLink',
              type: 'checkbox',
            },
            link({
              looks: false,
              overrides: {
                admin: {
                  condition: (_: any, { enableLink }: any) => enableLink,
                },
              },
            }),
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    }),
  ],
}
