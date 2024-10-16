import React, { Suspense, cache } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Page } from '@payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { generateMeta } from '@/utilities/generateMeta'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Blocks from '@app/_blocks'

const fetchPage = cache(async (slug: string): Promise<Page | null> => {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let page = null

  try {
    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      depth: 3,
      limit: 1,
      pagination: false,
    })

    page = docs[0]
  } catch (error) {
    console.error(`Error fetching page: ${slug}`, error)
  }

  return page
})

const fetchPageSlugs = cache(async (): Promise<{ slug: string }[]> => {
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
})

const Page = async ({ params: { slug = 'home' } }) => {
  const slugString = Array.isArray(slug) ? slug.join('/') : slug
  const page: Page | null = await fetchPage(slugString)
  console.log('page', page)
  if (!page) return notFound()

  return <Blocks blocks={page?.layout?.root?.children} />
}

export default Page

// Multiple versions of this page will be statically generated using the `params` returned by `generateStaticParams`
export async function generateStaticParams() {
  const pages = await fetchPageSlugs()

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
