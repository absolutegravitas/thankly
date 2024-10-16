import { Block } from "payload";

export const InstagramFeed: Block = {
  slug: 'reviewShowcase',
  fields: [
    {
      name: 'htmlHeading',
      label: 'Heading Section',
      type: 'code',
      admin: {
        language: 'html',
        description: 'Enter HTML content with Tailwind classes',
      },
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
    },
  ]
}
