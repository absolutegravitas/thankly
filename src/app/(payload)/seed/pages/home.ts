import { Media, Page } from "@/payload-types";

export const home: Partial<Page> = {
  title: 'Home',
  slug: 'home',
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
            type: 'default',
            media: '{{IMAGE_HERO}}',
            theme: 'light',
            blockName: '',
            blockType: 'hero',

            description: {
              root: {
                type: 'root',
                format: '',
                indent: 0,
                version: 1,

                children: [
                  {
                    tag: 'h4',
                    type: 'heading',
                    format: 'center',
                    indent: 0,
                    version: 1,

                    children: [
                      {
                        mode: 'normal',
                        text: "IT'S GOOD TO BE BACK!",
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                  },

                  {
                    tag: 'h2',
                    type: 'heading',
                    format: 'center',
                    indent: 0,
                    version: 1,

                    children: [
                      {
                        mode: 'normal',
                        text: 'Best gifts for the best people.',
                        type: 'text',
                        style: '',
                        detail: 0,
                        format: 0,
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                  },

                  {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    direction: 'ltr',
                    textFormat: 0,
                  },
                ],
                direction: 'ltr',
              },
            },

            primaryButtons: [
              {
                link: {
                  url: '/shop/gifts',
                  type: 'custom',
                  label: 'SHOP GIFTS',
                },
              },

              {
                link: {
                  url: '/shop/cards',
                  type: 'custom',
                  label: 'SHOP CARDS',
                },
              },
            ],

            announcementLink: {
              type: 'reference',
            },

            buttons: [],

            links: [],

            images: [],
          },
          format: '',
          version: 2,
        },
      ],
      direction: null,
    },
  },

  meta: {
    title: 'Thankly',
    description: 'Send a thankly to the special people in your life.',
    image: '{{IMAGE_HERO}}' as any,
  },
}

