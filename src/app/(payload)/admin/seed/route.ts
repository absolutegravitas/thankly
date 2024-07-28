
// import payload from 'payload';
// import { Page, Media } from '../../../../payload-types';  // Adjust the import path as needed

// const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// // Import your Payload config
// import payloadConfig from '../../../../payload.config';  // Adjust the import path as needed

export async function GET() {
//   try {
//     console.log('Starting seed process');

//     // Ensure payload is initialized with the correct configuration
//     if (!payload.db) {
//       console.log('Initializing payload');
//       await payload.init({
//         secret: process.env.PAYLOAD_SECRET || '',
//         local: true,
//         config: payloadConfig,
//       });
//     }

//     console.log('Payload initialized');

//     // Example: Seeding a "pages" collection
//     const pages: Partial<Page>[] = [
//       {
//         title: "Hometest",
//         slug: "homeseedtest",
//         theme: null,
//         layout: {
//           root: {
//             type: "root",
//             format: "",
//             indent: 0,
//             version: 1,
//             children: [
//               // {
//               //   type: "paragraph",
//               //   format: "",
//               //   indent: 0,
//               //   version: 1,
//               //   children: [],
//               //   direction: null,
//               //   textFormat: 0
//               // },
//               {
//                 type: "block",
//                 fields: {
//                   id: "66a48477bb2217e185816d8c",
//                   type: "default",
//                   media: {
//                     id: 2,
//                     alt: "Premium thankly gift items surrounding a Thankly Gift Box",
//                     caption: null,
//                     darkModeFallback: null,
//                     updatedAt: "2024-07-27T05:20:03.304Z",
//                     createdAt: "2024-07-27T05:20:03.304Z",
//                     url: "/api/media/file/Thankly-Hero-Image_Home.png",
//                     thumbnailURL: null,
//                     filename: "Thankly-Hero-Image_Home.png",
//                     mimeType: "image/png",
//                     filesize: 10135134,
//                     width: 4032,
//                     height: 3024,
//                     focalX: 50,
//                     focalY: 50
//                   },
//                   theme: "light",
//                   blockName: "",
//                   blockType: "hero",
//                   description: {
//                     root: {
//                       type: "root",
//                       format: "",
//                       indent: 0,
//                       version: 1,
//                       children: [
//                         {
//                           tag: "h4",
//                           type: "heading",
//                           format: "center",
//                           indent: 0,
//                           version: 1,
//                           children: [
//                             {
//                               mode: "normal",
//                               text: "IT'S GOOD TO BE BACK",
//                               type: "text",
//                               style: "",
//                               detail: 0,
//                               format: 1,
//                               version: 1
//                             }
//                           ],
//                           direction: "ltr"
//                         },
//                         {
//                           tag: "h2",
//                           type: "heading",
//                           format: "center",
//                           indent: 0,
//                           version: 1,
//                           children: [
//                             {
//                               mode: "normal",
//                               text: "Best gifts for the best people.",
//                               type: "text",
//                               style: "",
//                               detail: 0,
//                               format: 1,
//                               version: 1
//                             }
//                           ],
//                           direction: "ltr"
//                         }
//                       ],
//                       direction: "ltr"
//                     }
//                   },
//                   primaryButtons: [
//                     {
//                       id: "66a4a4017e550970bc8e13ec",
//                       link: {
//                         url: "/shop/gifts",
//                         type: "custom",
//                         label: "SHOP GIFTS"
//                       }
//                     },
//                     {
//                       id: "66a4a4ae14b5b370bc73c2dd",
//                       link: {
//                         url: "/shop/cards",
//                         type: "custom",
//                         label: "SHOP CARDS"
//                       }
//                     }
//                    ],
//                   announcementLink: {
//                     type: "reference"
//                   },
//                   buttons: [],
//                   links: [],
//                   images: []
//                 },
//                 format: "",
//                 version: 2
//               }
//             ],
//             direction: null
//           }
//         }
//       },
//       // {
//       //   title: 'About',
//       //   slug: 'about',
//       //   layout: {
//       //     root: {
//       //       type: 'root',
//       //       children: [{
//       //         type: 'paragraph',
//       //         children: [{ text: 'Learn more about us.' }],
//       //         version: 1,
//       //       }],
//       //       direction: null,
//       //       format: '',
//       //       indent: 0,
//       //       version: 1,
//       //     }
//       //   },
//       // },
//     ];

//     for (const page of pages) {
//         console.log('Creating page:', page);
//         await payload.create<'pages'>({
//             collection: 'pages',
//             data: page,
//         });
//     }


//     // Example: Seeding a "pages" collection
//     const images: Partial<Media>[] = [
//         // {
//         //     "alt": "Premium thankly gift items surrounding a Thankly Gift Box",
//         //     "url": "/api/media/file/Thankly-Hero-Image_Home.png",
//         //     "filename": "Thankly-Hero-Image_Home.png",
//         // },
//       ];
  
//       for (const image of images) {
//         console.log('Inserting image reference:', image);
//         await payload.create({
//           collection: 'media',
//           data: {
//             alt: image.alt,
//             url: image.url,
//             filename: image.filename,
//           }
//         });
//       }

//     console.log('Seed completed!');

//     return new Response('Database seeded successfully', { status: 200 });
//   } catch (error) {
//     console.error('Seeding failed:', error);
//     return new Response('Seeding failed: ' + ((error as Error).message || 'Unknown error'), { status: 500 });
//   }
}