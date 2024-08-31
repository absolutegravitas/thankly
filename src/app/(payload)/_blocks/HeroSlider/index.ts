import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";
import link from '@cms/_fields/link'

// interface HeroItem {
//   image: string
//   text: string
//   buttonText: string
//   buttonLink: string
// }

export const HeroSlider: Block = {
  slug: 'heroSlider',
  fields: [
    {
      name: 'slider',
      type: 'array',
      label: "Hero Slider",
      minRows: 1,
      fields: [
        //image
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        //text / content
        {
          name: 'htmlContent',
          label: 'Hero Content (HTML)',
          type: 'code',
          admin: {
            language: 'html',
            description: 'Enter HTML content with Tailwind classes',
          },
        },
        //buttonLink and Label
        link({
          looks: false,
          overrides: {
            name: 'buttonLink',
          },
        }),
      ]
    }
  ]
}