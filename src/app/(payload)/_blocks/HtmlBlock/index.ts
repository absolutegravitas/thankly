import { Block } from "payload";

export const HtmlBlock: Block = {
  slug: 'htmlBlock',
  fields: [
    {
      name: 'htmlContent',
      label: 'HTML Code',
      type: 'code',
      admin: {
        language: 'html',
        description: 'Enter HTML content with Tailwind classes',
      },
    },
  ],
}