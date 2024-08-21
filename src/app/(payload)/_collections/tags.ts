import type { CollectionConfig } from 'payload'

import { adminsOnly } from '../../../utilities/access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { group: '9. Common', useAsTitle: 'title' },

  access: {
    create: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },

  fields: [{ name: 'title', type: 'text' }],
}
