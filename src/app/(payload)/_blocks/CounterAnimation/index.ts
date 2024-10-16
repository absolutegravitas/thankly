import { Block } from "payload";

export const CounterAnimation: Block = {
  slug: 'counterAnimation',
  fields: [
    {
      name: 'desktopImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'count', type: 'number', required: true },
        { name: 'text', type: 'text', required: true },
      ]
    }
  ],
}