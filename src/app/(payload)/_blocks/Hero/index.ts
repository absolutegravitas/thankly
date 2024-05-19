import type { Block } from 'payload/types'
import { HTMLConverterFeature, lexicalEditor, TreeViewFeature } from '@payloadcms/richtext-lexical'

import link from '@/app/(payload)/_fields/link'
import linkGroup from '@/app/(payload)/_fields/linkGroup'
import { contentField } from '@/app/(payload)/_fields/contentField'
import { themeField } from '@/app/(payload)/_fields/blockFields'

export const Hero: Block = {
  slug: 'hero',
  fields: [
    // {
    //   type: 'select',
    //   name: 'type',
    //   label: 'Type',
    //   required: true,
    //   defaultValue: 'slider',
    //   options: [{ label: 'Slider', value: 'slider' }],
    // },
    // {
    //   name: 'slides',
    //   type: 'array',
    //   admin: {
    //     condition: (_: any, { type } = {}) => ['slider'].includes(type),
    //     components: {
    //       RowLabel: ({ data, index, path }) => {
    //         if (data.name) {
    //           return data.name
    //         }
    //       },
    //     },
    //   },
    //   fields: [
    //     { name: 'name', label: 'Slide Name', type: 'text', required: false },
    //     { name: 'image', type: 'upload', relationTo: 'media', required: false },
    //     contentField(),
    //     linkGroup({
    //       //   overrides: { maxRows: 3 },
    //     }),
    //   ],
    // },

    {
      type: 'select',
      name: 'type',
      label: 'Type',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Content and Media',
          value: 'contentMedia',
        },
        {
          label: 'Centered Content',
          value: 'centeredContent',
        },
        // {
        //   label: 'Form',
        //   value: 'form',
        // },
        {
          label: 'Home',
          value: 'home',
        },
        // {
        //   label: 'Livestream',
        //   value: 'livestream',
        // },
        {
          label: 'Gradient',
          value: 'gradient',
        },
        {
          label: '3.0',
          value: 'three',
        },
      ],
    },
    {
      type: 'checkbox',
      name: 'fullBackground',
      admin: {
        condition: (_: any, { type } = {}) => type === 'gradient',
      },
    },
    themeField,
    // {
    //   type: 'collapsible',
    //   label: 'Breadcrumbs Bar',
    //   fields: [
    //     {
    //       type: 'checkbox',
    //       name: 'enableBreadcrumbsBar',
    //       label: 'Enable Breadcrumbs Bar',
    //     },
    //     linkGroup({
    //       overrides: {
    //         name: 'breadcrumbsBarLinks',
    //         labels: {
    //           singular: 'Link',
    //           plural: 'Links',
    //         },
    //         admin: {
    //           condition: (_: any, { enableBreadcrumbsBar } = {}) => Boolean(enableBreadcrumbsBar),
    //         },
    //       },
    //       looks: false,
    //     }),
    //   ],
    // },
    // livestreamFields,
    {
      name: 'enableAnnouncement',
      type: 'checkbox',
      admin: {
        condition: (_: any, { type }) => type === 'home',
      },
      label: 'Enable Announcement?',
    },
    link({
      looks: false,
      overrides: {
        name: 'announcementLink',
        admin: {
          condition: (_: any, { enableAnnouncement }: any) => enableAnnouncement,
        },
      },
    }),

    {
      name: 'description',
      type: 'richText',
      admin: {
        condition: (_: any, { type } = {}) =>
          // type !== 'livestream' &&
          type !== 'centeredContent' && type !== 'three',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
          //TreeViewFeature(),
        ],
      }),
    },

    linkGroup({
      looks: false,
      overrides: {
        name: 'primaryButtons',
        label: 'Primary Buttons',
        admin: {
          condition: (_: any, { type }) => type === 'home',
        },
      },
    }),
    {
      name: 'secondaryHeading',
      type: 'richText',
      admin: {
        condition: (_: any, { type }) => type === 'home',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
          //TreeViewFeature(),
        ],
      }),
    },
    {
      name: 'secondaryDescription',
      type: 'richText',
      admin: {
        condition: (_: any, { type }) => type === 'home',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HTMLConverterFeature({}),
          //TreeViewFeature(),
        ],
      }),
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_: any, { type } = {}) =>
            [
              'contentMedia',
              'default',
              // 'livestream',
              'centeredContent',
              'gradient',
            ].includes(type),
        },
      },
    }),
    {
      name: 'buttons',
      type: 'blocks',
      labels: {
        singular: 'Button',
        plural: 'Buttons',
      },
      admin: {
        condition: (_: any, { type }) => type === 'three',
      },
      blocks: [
        {
          slug: 'link',
          labels: {
            singular: 'Link',
            plural: 'Links',
          },
          fields: [link()],
        },
        {
          slug: 'command',
          labels: {
            singular: 'Command Line',
            plural: 'Command Lines',
          },
          fields: [
            {
              name: 'command',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    linkGroup({
      looks: false,
      overrides: {
        name: 'secondaryButtons',
        label: 'Secondary Buttons',
        admin: {
          condition: (_: any, { type }) => type === 'home',
        },
      },
    }),
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      admin: {
        condition: (_: any, { type } = {}) => ['gradient'].includes(type),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_: any, { type } = {}) => ['contentMedia', 'home'].includes(type),
      },
    },
    {
      name: 'secondaryMedia',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_: any, { type }) => type === 'home',
      },
    },
    {
      name: 'featureVideo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_: any, { type }) => type === 'home',
      },
    },
    // {
    //   name: 'form',
    //   type: 'relationship',
    //   relationTo: 'forms',
    //   admin: {
    //     condition: (_:any, { type }) => type === 'form',
    //   },
    // },
    {
      name: 'logos',
      type: 'array',
      fields: [
        {
          name: 'logoMedia',
          label: 'Media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        condition: (_: any, { type }) => type === 'home',
      },
    },
  ],
}
