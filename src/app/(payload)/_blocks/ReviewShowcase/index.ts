import { Block } from "payload";

export const ReviewShowcase: Block = {
  slug: 'reviewShowcase',
  fields: [
    {
      name: 'collections',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'review',
          type: 'text',
          required: true,
          admin: { width: '40%' }
        }
      ]
    }
  ]
}
