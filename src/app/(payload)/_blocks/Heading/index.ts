import { Block } from "payload";

export const Heading: Block = {
  slug: 'heading',
  fields: [
    {
      name: 'htmlContent',
      label: 'Heading Section',
      type: 'code',
      admin: {
        language: 'html',
        description: 'Enter HTML content with Tailwind classes',
      },
    },
  ],
}