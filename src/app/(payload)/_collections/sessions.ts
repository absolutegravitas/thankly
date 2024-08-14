import { adminsOnly } from "@/utilities/access";
import { CollectionConfig } from "payload";


export const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: {
    group: '9. Common'
  },
  access: {
    read:   adminsOnly,
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: false } },
    { name: 'sessionToken', type: 'text', required: true, index: true, admin: { readOnly: false } },
    { name: 'expires', type: 'date', admin: { readOnly: false, date: { pickerAppearance: 'dayAndTime' } }, required: false }
  ]
} as const