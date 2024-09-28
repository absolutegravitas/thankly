import type { CollectionConfig } from 'payload'

import { adminsOnly } from '../../../utilities/access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: { group: 'Global', useAsTitle: 'title' },

  access: {
    create: adminsOnly,
    read: () => true,
    update: adminsOnly,
    delete: adminsOnly,
  },

  fields: [{ name: 'title', type: 'text' }],
}
