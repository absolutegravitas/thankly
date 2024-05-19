// 'use server'
import 'server-only'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import { Order, Page, Product, Setting } from '@payload-types'
import { notFound } from 'next/navigation'

const payload = await getPayloadHMR({ config: await configPromise })

export const fetchPage = unstable_cache(
  async (slug: string): Promise<Page | null> => {
    console.log('which slug //', slug)
    if (!slug || slug === '/') slug = 'home'

    const { docs } = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      depth: 3,
      limit: 1,
      pagination: false,
    })
    // console.log('docs found //', docs)

    // if (docs?.length === 0) {
    //   notFound()
    // }
    const page = docs[0]
    return page || null
  },
  [`fetchPage`],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year
    tags: ['fetchPage'],
  },
)

export const fetchPages = unstable_cache(
  async (): Promise<any | null> => {
    const { docs } = await payload.find({
      collection: 'pages',
      depth: 3,
      pagination: false,
    })

    // if (docs?.length === 0) {
    //   notFound()
    // }

    // get slug, id and title prop only from the returned docs
    const pages = docs?.map(({ slug, id, title }) => ({ slug, id, title }))
    return pages || null
  },
  [`fetchPages`],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year
    tags: ['fetchPages'],
  },
)

export const fetchSettings = unstable_cache(
  async (): Promise<Setting | null> => {
    // const payload = await getPayloadHMR({ config: await configPromise })
    const settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
    return settings || null
  },
  ['settings'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['settings'],
  },
)
