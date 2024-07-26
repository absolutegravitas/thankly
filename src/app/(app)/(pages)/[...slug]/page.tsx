import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Page } from '@payload-types'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
// import { fetchPage } from '@app/_queries/pages'
import { generateMeta } from '@/utilities/generateMeta'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Blocks from '@app/_blocks'

const fetchPage = (slug: string): Promise<Page | null> => {
  const cachedFetchPage = unstable_cache(
    async (): Promise<Page | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let page = null
      try {
        const { docs } = await payload.find({
          collection: 'pages',
          where: { slug: { equals: slug || 'home' } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        page = docs[0]
      } catch (error) {
        console.error(`Error fetching page: ${slug}`, error)
      } finally {
        return page || null
      }
    },
    [`fetchPage-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      tags: [`fetchPage-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchPage()
}

const Page = async ({ params: { slug = 'home' } }) => {
  const { isEnabled: isDraftMode } = draftMode()

  const page: Page | null = await fetchPage(slug || 'home') //, isDraftMode)

  if (!page) return notFound()

  return <Blocks blocks={page?.layout?.root?.children} />
}

export default Page

// Multiple versions of this page will be statically generated using the `params` returned by `generateStaticParams`
export async function generateStaticParams() {
  const fetchPageSlugs = unstable_cache(
    async (): Promise<{ slug: string }[]> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })

      try {
        const { docs } = await payload.find({
          collection: 'pages',
          depth: 0,
          pagination: false,
          context: {
            /**
             * Selects:
             * top level id, title fields
             * text field from "nestedGroup" group field
             * all fields from "nestedArray" field
             * "title" field from populated relationship document
             **/
            //     select: ['id', 'title', 'nestedGroup.text', 'nestedArray', 'relationship.title
            select: ['slug', 'title', 'meta'],
            // sort: {
            //   field:'slug',
            //   order: 'asc',
            // },
          },
        })

        // console.log('Found pages list')
        // console.log('fetchPageSlugs', docs)

        if (!docs || docs.length === 0) {
          // console.log('No pages found')
          return []
        }

        return docs
          .map((page: Page) => ({
            slug: page.slug || '',
          }))
          .filter((item: any) => item.slug !== '') // Filter out any empty slugs
      } catch (error) {
        console.error('Error fetching pages:', error)
        return []
      }
    },
    ['fetchPageSlugs'],
    {
      revalidate: 60, // 10 seconds
      tags: ['fetchPageSlugs'],
    },
  )

  const pages = await fetchPageSlugs()
  // console.log('pages', pages)

  return pages.map(({ slug }) => ({
    slug: slug.split('/').filter(Boolean),
  }))
}

export async function generateMetadata({
  params: { slug = 'home' },
}: {
  params: { slug?: string | string[] }
}): Promise<Metadata> {
  const slugString = Array.isArray(slug) ? slug.join('/') : slug
  const page = await fetchPage(slugString)

  const ogImage =
    typeof page?.meta?.image === 'object' &&
    page?.meta?.image !== null &&
    'url' in page?.meta?.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${page.meta.image.url}`

  return {
    title: page?.meta?.title || 'thankly',
    description: page?.meta?.description,
    openGraph: mergeOpenGraph({
      title: page?.meta?.title || 'thankly',
      description: page?.meta?.description ?? undefined,
      url: Array.isArray(slug) ? slug.join('/') : '/',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
    }),
  }
}
