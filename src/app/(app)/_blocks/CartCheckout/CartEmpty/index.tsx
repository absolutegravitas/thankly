import React from 'react'
import { Gutter } from '../../../_components/Gutter'
import { BlockWrapper } from '../../../_components/BlockWrapper'
import CallToAction from '../../CallToAction'
import classes from './index.module.scss'

export const CartEmpty: React.FC<any> = () => {
  return (
    <React.Fragment>
      <div className={classes.wrapper}>
        <CallToAction
          blockType="cta"
          padding={{ top: 'large', bottom: 'large' }}
          ctaFields={{
            links: [
              {
                id: '6654071db8f61fc8c2b5b72b',

                link: {
                  type: 'reference',
                  label: 'Home',

                  reference: {
                    value: {
                      id: 1,
                      title: 'Home',
                      slug: 'home',
                      theme: 'light',

                      layout: {
                        root: {
                          type: 'root',
                          format: '',
                          indent: 0,
                          version: 1,

                          children: [
                            {
                              type: 'paragraph',
                              format: '',
                              indent: 0,
                              version: 1,
                              children: [],
                              direction: null,
                              textFormat: 0,
                            },
                            {
                              type: 'block',

                              fields: {
                                id: '6654061801542698a8558f7a',
                                blockName: '',
                                blockType: 'cta',

                                ctaFields: {
                                  links: [
                                    {
                                      id: '6654071db8f61fc8c2b5b72b',

                                      link: {
                                        type: 'reference',
                                        label: 'Home',

                                        reference: {
                                          value: 1,
                                          relationTo: 'pages',
                                        },
                                      },
                                    },
                                    {
                                      id: '66540722b8f61fc8c2b5b72e',

                                      link: {
                                        url: '/shop',
                                        type: 'custom',
                                        label: 'Shop',
                                      },
                                    },
                                  ],

                                  // settings: {
                                  //   theme: 'light',
                                  // },
                                },
                              },
                              format: '',
                              version: 2,
                            },
                          ],
                          direction: null,
                        },
                      },
                      meta: {
                        title: null,
                        description: null,
                      },
                      breadcrumbs: [
                        {
                          id: '6654072bb8f61fc8c2b5b72f',
                          url: '/home',
                          label: 'Home',
                          doc: 1,
                        },
                      ],
                      updatedAt: '2024-05-27T04:08:11.215Z',
                      createdAt: '2024-05-27T04:04:15.032Z',
                      _status: 'published',
                    },
                    relationTo: 'pages',
                  },
                },
              },
              {
                id: '66540722b8f61fc8c2b5b72e',

                link: {
                  url: '/shop',
                  type: 'custom',
                  label: 'Shop',
                },
              },
            ],
            content: {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,

                children: [
                  {
                    tag: 'h2',
                    type: 'heading',
                    format: '',
                    indent: 0,
                    version: 1,

                    children: [
                      {
                        mode: 'normal',
                        text: 'Your cart is empty',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                  },
                ],
                direction: 'ltr',
              },
            },
            settings: {
              theme: 'light',
            },
          }}
        />
      </div>
    </React.Fragment>
  )
}
