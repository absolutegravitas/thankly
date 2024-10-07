/**
 * @file
 * @module reusable
 * @description Configuration file for the 'Reusable Content Blocks' collection in Payload CMS.
 * @overview This file defines the structure and behavior of the 'Reusable Content Blocks' in Payload CMS. BASICALLY THIS IS AN INTERSECTION TABLE THAT ALLOWS FOR REUSABLE CONTENT BLOCKS TO BE CREATED AND USED EVERWHERE ON SITE. It sets up fields, access controls, labels, and other configurations for the collection. No specific performance issues or considerations are noted.
 */

import type { CollectionConfig } from 'payload'
import { layoutField } from '@cms/_fields/layoutField'
import { adminsOnly } from '@/utilities/access'

/**
 * @payloadField
 * Defines the configuration for the 'Reusable' collection in Payload CMS.
 */
export const Reusable: CollectionConfig = {
  slug: 'reusable',
  admin: { useAsTitle: 'title', group: 'Site' },
  access: {
    create: adminsOnly, // @payloadHook Access control hook for create operation
    read: () => true, // Allow read access for everyone
    update: adminsOnly, // @payloadHook Access control hook for update operation
    delete: adminsOnly, // @payloadHook Access control hook for delete operation
  },
  labels: { singular: 'Reusable UI', plural: 'Reusable UIs' },
  fields: [
    { name: 'title', type: 'text', required: true }, // @payloadField Title field (required)
    layoutField(), // @payloadField Layout field (imported from another file)
  ],
}
