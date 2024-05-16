import type { CollectionConfig } from 'payload/types'
// import { checkRole } from '@cms/_access/checkRole'
import { layoutField } from '@cms/_fields/layoutField'

export const Reusable: CollectionConfig = {
  slug: 'reusable',
  admin: {
    useAsTitle: 'title',
    group: 'Globals',
  },
  // access: {
  //   create: ({ req: { user } }) => checkRole(['admin'], user),
  //   read: () => true,
  //   readVersions: ({ req: { user } }) => checkRole(['admin'], user),
  //   update: ({ req: { user } }) => checkRole(['admin'], user),
  //   delete: ({ req: { user } }) => checkRole(['admin'], user),
  // },
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
