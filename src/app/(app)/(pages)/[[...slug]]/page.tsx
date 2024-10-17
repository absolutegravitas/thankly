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

// ISR: Revalidate every 60 seconds (or as per PAGE_CACHE_REVALIDATE env setting)
export const revalidate = (() => {
  const value = Number(process.env.PAGE_CACHE_REVALIDATE)
  return isNaN(value) ? 60 : value
})()

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

const fetchPageSlugs = async (): Promise<{ slug: string }[]> => {
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

    return docs
      .map((page: Page) => ({
        slug: page.slug || '',
      }))
      .filter((item: any) => item.slug !== '') // Filter out any empty slugs
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}

const Page = async ({ params: { slug } }) => {
  console.log('===slug===', slug)
  const slugString = getSlugString(slug)
  console.log('===slugstring===', slugString)
  const page: Page | null = await fetchPage(slugString)
  console.log('===page===', page)
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

const getSlugString = (slug: string | string[]) => {
  //Consider '/' as a requset for 'home'
  if (!slug || slug.length === 0) return 'home'
  //Handle slug being a '/a/b/c' string
  if (Array.isArray(slug)) return slug.join('/')
  //otherwise just return the slug string
  return slug
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const slugString = getSlugString(slug)

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
