import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Page } from '@payload-types'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

import { fetchPage } from '@app/_queries/pages'

import { generateMeta } from '@/utilities/generateMeta'
import { PageTemplate } from './page.client'

// Payload Cloud caches all files through Cloudflare, so we don't need Next.js to cache them as well
// This means that we can turn off Next.js data caching and instead rely solely on the Cloudflare CDN
// To do this, we include the `no-cache` header on the fetch requests used to get the data for this page
// But we also need to force Next.js to dynamically render this page on each request for preview mode to work
// See https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// If you are not using Payload Cloud then this line can be removed, see `../../../README.md#cache`
// export const dynamic = 'force-dynamic'

// Fetch the page in a server component, pass it to the client component, then thread it through the hook
// The hook will take over from there and keep the preview in sync with the changes you make
// The `data` property will contain the live data of the document

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  // try {
  //   page = await fetchDoc<Page>({
  //     collection: 'pages',
  //     slug,
  //     draft: isDraftMode,
  //   })
  // } catch (error) {
  //   // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
  //   // so swallow the error here and simply render the page with fallback data where necessary
  //   // in production you may want to redirect to a 404  page or at least log the error somewhere
  //   console.error(error)
  // }

  // if no `home` page exists, render a static one using dummy content
  // you should delete this code once you have a home page in the CMS
  // this is really only useful for those who are demoing this template
  // if (!page && slug === 'home') {
  //   page = staticHome
  // }

  if (!page) {
    return <>TES TEST </>
    // return <notFound()>
  }

  return <PageTemplate page={page} />
}

// export async function generateStaticParams() {
//   try {
//     const pages = await fetchDocs<Page>('pages')
//     return pages?.map(({ slug }) => slug)
//   } catch (error) {
//     return []
//   }
// }

// export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
//   const { isEnabled: isDraftMode } = draftMode()

//   let page: Page | null = null

//   try {
//     page = await fetchDoc<Page>({
//       collection: 'pages',
//       slug,
//       draft: isDraftMode,
//     })
//   } catch (error) {
//     // don't throw an error if the fetch fails
//     // this is so that we can render a static home page for the demo
//     // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
//     // in production you may want to redirect to a 404  page or at least log the error somewhere
//   }

//   if (!page && slug === 'home') {
//     page = staticHome
//   }

//   return generateMeta({ doc: page })
// }

// // Multiple versions of this page will be statically generated
// // using the `params` returned by `generateStaticParams` with
// // a default of home if params has nothing
// export default async function Page({ params: { slug = 'home' } }) {
//   const { isEnabled: isDraftMode } = draftMode()
//   let page: Page | null = null

//   // try {
//   //   page = await fetchPage(slug)
//   // } catch (error) {
//   //   console.error('Failed to fetch page:', error)
//   //   return notFound()
//   // }

//   if (
//     !page ||
//     typeof page !== 'object' // ||
//     // (Object.keys(page).length === 0 && page.constructor === Object)
//   ) {
//     return notFound()
//   }

//   return (
//     <Suspense fallback="Loading...">
//       test
//       {/* <PageTemplate page={page} /> */}
//     </Suspense>
//   )
// }

// // return a list of params to populate the [slug] dynamic segment for each page to be rendered
// export async function generateStaticParams() {
//   const fetchPageSlugs = unstable_cache(
//     async (): Promise<{ slug: string }[]> => {
//       const config = await configPromise
//       let payload: any = await getPayloadHMR({ config })

//       try {
//         const { docs } = await payload.find({
//           collection: 'pages',
//           depth: 0,
//           pagination: false,
//           context: {
// // context: {
// //     /**
// //      * Selects:
// //      * top level id, title fields
// //      * text field from "nestedGroup" group field
// //      * all fields from "nestedArray" field
// //      * "title" field from populated relationship document
// //      **/
// //     select: ['id', 'title', 'nestedGroup.text', 'nestedArray', 'relationship.title
//             select: ['slug'],
//             // sort: {
//             //   field:'slug',
//             //   order: 'asc',
//             // },
//           },
//         })

//         console.log('docs', docs)

//         if (!docs || docs.length === 0) {
//           console.log('No pages found')
//           return []
//         }

//         console.log('Found pages list')

//         return docs
//           .map((page: Page) => ({
//             slug: page.slug || '',
//           }))
//           .filter((item: any) => item.slug !== '') // Filter out any empty slugs
//       } catch (error) {
//         console.error('Error fetching pages:', error)
//         return []
//       }
//     },
//     ['fetchProductSlugs'],
//     {
//       revalidate: 60, // 10 seconds
//       tags: ['fetchProductSlugs'],
//     },
//   )

//   const pageSlugs = await fetchPageSlugs()

//   return pageSlugs.map((page) => ({
//     slug: page.slug,
//   }))

//   // try {
//   //   const slugs = await fetchPageSlugs()

//   //   // Ensure 'home' is always included
//   //   const homeSlug = { slug: 'home' }
//   //   const uniqueSlugs = [homeSlug, ...slugs].filter(
//   //     (item, index, self) => index === self.findIndex((t) => t.slug === item.slug),
//   //   )

//   //   console.log('Generated static params:', uniqueSlugs)
//   //   return uniqueSlugs
//   // } catch (error) {
//   //   console.error('Error in generateStaticParams:', error)
//   //   return [{ slug: 'home' }]
//   // }
// }

// export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
//   const { isEnabled: isDraftMode } = draftMode()

//   let page: Page | null = null

//   try {
//     page = await fetchPage(slug)
//   } catch (error) {
//     console.error('Failed to fetch page:', error)
//     return {}
//   }

//   // if (!page && slug === 'home') {
//   //   page = staticHome
//   // }

//   return generateMeta({ doc: page })
// }
