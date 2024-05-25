import type { CollectionConfig } from 'payload/types'
import { layoutField } from '@cms/_fields/layoutField'
import { adminsOnly } from '../../../utilities/access'

export const Reusable: CollectionConfig = {
  slug: 'reusable',
  admin: {
    useAsTitle: 'title',
    group: 'Globals',
  },
  access: {
    create: adminsOnly,
    read: () => true,
    update: adminsOnly,
    delete: adminsOnly,
  },
  labels: {
    singular: 'Reusable',
    plural: 'Reusables',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    layoutField(),
  ],
}
