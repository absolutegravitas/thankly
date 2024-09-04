import { adminsOnly, publishedOnly } from "@/utilities/access";
import { CollectionConfig } from "payload";


export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    group: '3. Marketing'
  },
  access: {
    create: adminsOnly,
    read: publishedOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text'
        },
        {
          name: 'starRating',
          type: 'select',
          label: 'Star Rating',
          options: [
            {
              label: '1 Star',
              value: '1',
            },
            {
              label: '2 Stars',
              value: '2',
            },
            {
              label: '3 Stars',
              value: '3',
            },
            {
              label: '4 Stars',
              value: '4',
            },
            {
              label: '5 Stars',
              value: '5',
            },
          ],
        },
        {
          name: 'reviewDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'd MMM yyy',
            },
          },
        },
      ]
    },
    {
      name: 'body',
      type: 'textarea'
    },
    {
      name: 'products',
      label: 'Linked Products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true
    },
    {
      name: 'reviewer',
      type: 'group',
      fields: [
        { name:'name', type:'text'},
      ]
    },

  ]
}
