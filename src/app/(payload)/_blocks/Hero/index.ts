import type { Block } from 'payload'
import { HTMLConverterFeature, lexicalEditor, TreeViewFeature } from '@payloadcms/richtext-lexical'

import link from '@cms/_fields/link'
import linkGroup from '@cms/_fields/linkGroup'
import { contentField } from '@cms/_fields/contentField'
import { themeField } from '@cms/_fields/blockFields'

export const Hero: Block = {
  slug: 'hero',
  fields: [
    themeField,
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

    // home specific
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
    linkGroup({
      looks: false,
      overrides: {
        name: 'primaryButtons',
        label: 'Primary Buttons',
        admin: {
          condition: (_: any, { type }: any) => type === ['home', 'default'].includes(type),
        },
        
      },
    }),
    // linkGroup({
    //   looks: false,
    //   overrides: {
    //     name: 'secondaryButtons',
    //     label: 'Secondary Buttons',
    //     admin: {
    //       condition: (_: any, { type }) => type === 'home',
    //     },
    //   },
    // }),
    // {
    //   name: 'secondaryHeading',
    //   type: 'richText',
    //   admin: {
    //     condition: (_: any, { type }) => type === 'home',
    //   },
    //   editor: lexicalEditor({
    //     features: ({ defaultFeatures }) => [
    //       ...defaultFeatures,
    //       HTMLConverterFeature({}),
    //       //TreeViewFeature(),
    //     ],
    //   }),
    // },
    // {
    //   name: 'secondaryDescription',
    //   type: 'richText',
    //   admin: {
    //     condition: (_: any, { type }) => type === 'home',
    //   },
    //   editor: lexicalEditor({
    //     features: ({ defaultFeatures }) => [
    //       ...defaultFeatures,
    //       HTMLConverterFeature({}),
    //       //TreeViewFeature(),
    //     ],
    //   }),
    // },
    // {
    //   name: 'secondaryMedia',
    //   type: 'upload',
    //   relationTo: 'media',
    //   required: false,
    //   admin: {
    //     condition: (_: any, { type }) => type === 'home',
    //   },
    // },
    // {
    //   name: 'featureVideo',
    //   type: 'upload',
    //   relationTo: 'media',
    //   required: false,
    //   admin: {
    //     condition: (_: any, { type }) => type === 'home',
    //   },
    // },
    // {
    //   name: 'logos',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'logoMedia',
    //       label: 'Media',
    //       type: 'upload',
    //       relationTo: 'media',
    //       required: true,
    //     },
    //   ],
    //   admin: {
    //     condition: (_: any, { type }) => type === 'home',
    //   },
    // },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_: any, { type } = {}) => ['contentMedia', 'home', 'default'].includes(type),
      },
    },

    // //
    //gradient specific

    {
      type: 'checkbox',
      name: 'fullBackground',
      admin: {
        condition: (_: any, { type } = {}) => type === 'gradient',
      },
    },
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
      overrides: {
        admin: {
          condition: (_: any, { type }: any = {}) =>
            [
              'contentMedia',
              //'default',
              // 'livestream',
              'centeredContent',
              'gradient',
            ].includes(type),
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

    // {
    //   name: 'form',
    //   type: 'relationship',
    //   relationTo: 'forms',
    //   admin: {
    //     condition: (_:any, { type }) => type === 'form',
    //   },
    // },
  ],
}
