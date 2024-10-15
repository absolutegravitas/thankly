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
        description: 'Enter GTML content with Tailwind classes',
      },
    },
  ],
}