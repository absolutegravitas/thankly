import path from 'path'
import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'url'
import { adminsOnly } from '../../../utilities/access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Globals' },
  upload: { staticDir: path.resolve(dirname, '../../media') },

  access: {
    create: adminsOnly,
    read: () => true,
    update: adminsOnly,
    delete: adminsOnly,
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'darkModeFallback',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Choose an upload to render if the visitor is using dark mode.',
      },
    },
  ],
}
