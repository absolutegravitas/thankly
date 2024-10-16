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
          type: 'row',
          fields: [
            {
              name: 'collectionName',
              type: 'text',
              required: true,
              admin: { width: '40%' }
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
              hasMany: false,
              admin: { width: '40%' }
            }
          ]
        }
      ]
    }
  ]
}
