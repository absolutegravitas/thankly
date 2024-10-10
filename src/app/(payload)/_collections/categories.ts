import type { CollectionConfig } from 'payload'

import { adminsOnly } from '../../../utilities/access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    plural: 'Categories',
    singular: 'Category',
  },
  admin: { group: 'Global', useAsTitle: 'title' },

  access: {
    create: adminsOnly,
    read: () => true,
    update: adminsOnly,
    delete: adminsOnly,
  },

  fields: [
    {
      type: 'row',
      fields: [{ name: 'title', type: 'text', required: true },
        {
          name: 'productType',
          type: 'select',
          defaultValue: 'gift',
          options: [
            { label: 'Card', value: 'card' },
            { label: 'Gift', value: 'gift' },
          ],
        },
      ],
    },
    {
      name: 'shopConfig',
      label: 'Shop Configuration',
      type: 'group',
      fields: [
        { name: 'visible', type: 'checkbox', label: 'Visible in Shop filter', defaultValue: true },
        {
          type: 'row',
          fields: [
            { name: 'shopFilterTitle', type: 'text' },
            { name: 'sortOrder', type: 'number' },
          ],
        },
      ],
    },
  ],
}
