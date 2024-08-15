/**
 * @file page.tsx
 * @module PageModule
 * @description Handles rendering and generation of individual pages in the application.
 * @overview
 * This file is responsible for fetching and rendering the content of individual pages in the application using data from the PayloadCMS. It utilizes the Next.js framework for server-side rendering (SSR) and static site generation (SSG) for optimal performance.
 *
 * The main functionality of this file includes:
 *
 * 1. Fetching page data from the PayloadCMS based on the provided slug (URL path).
 * 2. Rendering the page content using the `Blocks` component, which assembles the page layout using reusable content blocks.
 * 3. Generating static parameters (page slugs) for the pages during the build process, enabling SSG.
 * 4. Generating metadata (title, description, open graph data) for each page based on the fetched content.
 *
 * The file leverages various Next.js features such as `unstable_cache` for caching and revalidation, `notFound` for handling non-existent pages, and `generateStaticParams` for generating static parameters during the build process. It also integrates with the PayloadCMS through the `@payloadcms/next/utilities` library.
 */

import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Page } from '@payload-types'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { generateMeta } from '@/utilities/generateMeta'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Blocks from '@app/_blocks'

const Page = async ({ params: { slug = 'home' } }) => {
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
            select: ['slug', 'title', 'meta'],
          },
        })

        if (!docs || docs.length === 0) {
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
  console.log(
    'pages ==',
    pages,
    '==',
    pages.map(({ slug }) => ({
      slug: slug.split('/').filter(Boolean),
    })),
  )

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

  // Default metadata
  const defaultTitle = 'Thankly'
  const defaultDescription =
    'Express your gratitude with Thankly - Your one-stop shop for thoughtful gifts and cards.'
  const defaultImageURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/images/og-image.png`

  const page = await fetchPage(slugString)

  if (!page || !page.meta) {
    return {
      title: defaultTitle,
      description: defaultDescription,
      openGraph: mergeOpenGraph({
        title: defaultTitle,
        description: defaultDescription,
        url: '/',
        images: [{ url: defaultImageURL }],
      }),
    }
  }

  const ogImage =
    typeof page.meta.image === 'object' &&
    page.meta.image !== null &&
    'url' in page.meta.image &&
    `${process.env.NEXT_PUBLIC_SERVER_URL}${page.meta.image.url}`

  return {
    title: page.meta.title || defaultTitle,
    description: page.meta.description || defaultDescription,
    openGraph: mergeOpenGraph({
      title: page.meta.title || defaultTitle,
      description: page.meta.description || defaultDescription,
      url: Array.isArray(slug) ? slug.join('/') : '/',
      images: ogImage ? [{ url: ogImage }] : [{ url: defaultImageURL }],
    }),
  }
}

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
        return page
      }
    },
    [`fetchPage-${slug}`],
    {
      revalidate: 10,
      tags: [`fetchPage-${slug}`],
    },
  )

  return cachedFetchPage()
}
