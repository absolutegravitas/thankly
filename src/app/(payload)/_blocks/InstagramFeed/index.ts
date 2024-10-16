import { Block } from "payload";

export const InstagramFeed: Block = {
  slug: 'instagramFeed',
  fields: [
    {
      name: 'posts',
      type: 'array',
      label: "Instagram Posts",
      minRows: 3,
      fields: [
        {
          name:'postUrl',
          type:'text',
          label: "Instagram post (eg: https://www.instagram.com/hellokathy___/p/CoGGjfiBnj4/ )",
          required: true
        },
        { 
          name: 'showOnMobile',
          type: 'checkbox',
          defaultValue: true
        }
      ]
    }
  ]
}
