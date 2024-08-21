import type { CollectionConfig } from 'payload'

import { adminsOnly } from '../../../utilities/access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { group: '9. Common', useAsTitle: 'title' },

  access: {
    create: adminsOnly,
    read: () => true,
    update: adminsOnly,
    delete: adminsOnly,
  },

  fields: [{ name: 'title', type: 'text' }],
}
