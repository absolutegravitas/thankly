import type { Block } from 'payload/types'

import { blockFields } from '@cms/_fields/blockFields'
import { contentField } from '@cms/_fields/contentField'
// import richText from '@cms/_fields/richText'

export const Content: Block = {
  slug: 'content',
  fields: [
    blockFields({
      name: 'contentFields',
      fields: [
        {
          name: 'useLeadingHeader',
          label: 'Use Leading Header',
          type: 'checkbox',
        },
        contentField({
          name: 'leadingHeader',
          label: 'Leading Header',
          admin: {
            condition: (_: any, siblingData) => siblingData.useLeadingHeader,
          },
        }),
        // richText({
        //   name: 'leadingHeader',
        //   label: 'Leading Header',
        //   admin: {
        //     condition: (_: any, siblingData) => siblingData.useLeadingHeader,
        //   },
        // }),
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'oneColumn',
          options: [
            {
              label: 'One Column',
              value: 'oneColumn',
            },
            {
              label: 'Two Columns',
              value: 'twoColumns',
            },
            {
              label: 'Two Thirds + One Third',
              value: 'twoThirdsOneThird',
            },
            {
              label: 'Half + Half',
              value: 'halfAndHalf',
            },
            {
              label: 'Three Columns',
              value: 'threeColumns',
            },
          ],
        },
        contentField({ name: 'columnOne' }),
        contentField({
          name: 'columnTwo',
          admin: {
            condition: (_: any, siblingData) =>
              ['twoColumns', 'twoThirdsOneThird', 'halfAndHalf', 'threeColumns'].includes(
                siblingData.layout,
              ),
          },
        }),
        contentField({
          name: 'columnThree',
          admin: {
            condition: (_: any, siblingData) => siblingData.layout === 'threeColumns',
          },
        }),
        // richText({
        //   name: 'columnOne',
        // }),
        // richText({
        //   name: 'columnTwo',
        //   admin: {
        //     condition: (_: any, siblingData) =>
        //       ['twoColumns', 'twoThirdsOneThird', 'halfAndHalf', 'threeColumns'].includes(
        //         siblingData.layout,
        //       ),
        //   },
        // }),
        // richText({
        //   name: 'columnThree',
        //   admin: {
        //     condition: (_: any, siblingData) => siblingData.layout === 'threeColumns',
        //   },
        // }),
      ],
    }),
  ],
}
