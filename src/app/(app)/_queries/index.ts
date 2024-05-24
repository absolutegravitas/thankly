// 'use server'
import 'server-only'
import { unstable_cache } from 'next/cache'
import { Page, Product, Order, Setting, User } from '@payload-types'
import { headers as getHeaders } from 'next/headers'
import { payload } from '@app/_utilities/getPayload'

export const fetchProduct = (slug: string): Promise<Product | null> => {
  const cachedFetchPage = unstable_cache(
    async (): Promise<Page | null> => {
      let page = null
      try {
        console.log('fetchPage slug //', slug) // should be 'home' if it's null

        const { docs } = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
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
    [`fetchProduct-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      // revalidate: 300, // 5 min
      // revalidate: 3600, // 1 hour
      // revalidate: 86400, // 1 day
      // revalidate: 604800, // 1 week
      // revalidate: 2592000, // 1 month
      // revalidate: 31536000, // 1 year
      tags: [`fetchProduct-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchPage()
}

export const fetchProducts = unstable_cache(
  async (): Promise<any | null> => {
    let pages = null
    try {
      const { docs } = await payload.find({
        collection: 'products',
        depth: 3,
        pagination: false,
      })

      if (docs?.length === 0) {
        console.log('not found')
      }

      // get slug, id and title prop only from the returned docs
      pages = docs?.map(({ slug, id, title }) => ({ slug, id, title }))
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      return pages
    }
  },
  ['fetchProducts'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year
    tags: ['fetchProducts'],
  },
)

export const fetchPage = (slug: string): Promise<Page | null> => {
  const cachedFetchPage = unstable_cache(
    async (): Promise<Page | null> => {
      let page = null
      try {
        console.log('fetchPage slug //', slug) // should be 'home' if it's null

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
      } finally {
        return page || null
      }
    },
    [`fetchPage-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      // revalidate: 300, // 5 min
      // revalidate: 3600, // 1 hour
      // revalidate: 86400, // 1 day
      // revalidate: 604800, // 1 week
      // revalidate: 2592000, // 1 month
      // revalidate: 31536000, // 1 year
      tags: [`fetchPage-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchPage()
}

export const fetchPages = unstable_cache(
  async (): Promise<any | null> => {
    let pages = null
    try {
      const { docs } = await payload.find({
        collection: 'pages',
        depth: 3,
        pagination: false,
      })

      if (docs?.length === 0) {
        console.log('not found')
      }

      // get slug, id and title prop only from the returned docs
      pages = docs?.map(({ slug, id, title }) => ({ slug, id, title }))
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      return pages
    }
  },
  ['fetchPages'],
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
    let settings = null
    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    console.log('settings -- ', settings)
    return settings
  },
  ['settings'],
  {
    revalidate: 10, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['settings'],
  },
)

/**
 * Get the current user with out needing to import the payload instance & headers.
 *
 * @description The difference between this function and the one in the auth/edge.ts file is that here we get
 * payload instance, just to make other parts of you code cleaner. We can't get the payload instance in the
 * auth/edge.ts file because that could cause a import loop.
 */
export async function getCurrentUser(): Promise<User | null> {
  const headers = getHeaders()
  // const payload = await getPayload()
  return (await payload.auth({ headers })).user
}
