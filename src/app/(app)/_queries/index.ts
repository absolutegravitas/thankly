// 'use server'
import 'server-only'
import { revalidatePath, unstable_cache } from 'next/cache'
import { Page, Product, Order, Setting, User, Cart } from '@payload-types'
import { cookies, headers as getHeaders } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { areProductsInCart, createCart } from '../_components/ProductActions/actions'
// https://payloadcms.com/docs/queries/pagination#pagination

export const fetchProduct = (slug: string): Promise<Product | null> => {
  const cachedFetchProduct = unstable_cache(
    async (): Promise<Page | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })

      let page = null
      try {
        // console.log('fetchPage slug //', slug) // should be 'home' if it's null

        const { docs } = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        page = docs[0]
      } catch (error) {
        console.error(`Error fetching product: ${slug}`, error)
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

  return cachedFetchProduct()
}

export const fetchProducts = unstable_cache(
  async (): Promise<{ products: any[] } | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let result = null

    try {
      const { docs } = await payload.find({
        collection: 'products',
        depth: 0,
        pagination: false,
      })

      if (docs?.length === 0) {
        console.log('not found')
        return { products: [] }
      }

      // get slug, id, and title prop only from the returned docs
      const products = docs?.map(({ slug, id, title }: any) => ({
        slug,
        id,
        title,
      }))

      result = { products }
    } catch (error) {
      console.error('Error fetching pages:', error)
      result = { products: [] } // Return empty pages and total 0 on error
    }
    return result
  },
  ['fetchProducts'],
  {
    revalidate: 60, // 10 seconds
    // other revalidate options...
    tags: ['fetchProducts'],
  },
)

export const fetchPage = (slug: string): Promise<Page | null> => {
  // console.log(`slug received:--${slug}--`)

  const cachedFetchPage = unstable_cache(
    async (): Promise<Page | null> => {
      let page: Page | null = null

      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })

      try {
        // console.log(`payload exists -${payload === null || payload === undefined ? true : false}`)
        const { docs } = await payload.find({
          collection: 'pages',
          where: { slug: { equals: slug } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        // console.log('docs', docs)
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

  // console.log(`unstable_cache ${JSON.stringify(cachedFetchPage())}`)

  // Check if cachedFetchPage is defined before invoking it
  // return cachedFetchPage ? cachedFetchPage() : Promise.resolve(null)

  return cachedFetchPage()
}

export const fetchPages = unstable_cache(
  async (): Promise<{ pages: any[] } | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let result = null
    try {
      const { docs } = await payload.find({
        collection: 'pages',
        depth: 3,
        pagination: false,
      })

      if (docs?.length === 0) {
        console.log('not found')
        return { pages: [] }
      }

      // get slug, id, and title prop only from the returned docs
      const pages = docs?.map(({ slug, id, title }: any) => ({
        slug,
        id,
        title,
      }))

      result = { pages }
    } catch (error) {
      console.error('Error fetching pages:', error)
      result = { pages: [] } // Return empty pages and total 0 on error
    }
    return result
  },
  ['fetchPages'],
  {
    revalidate: 60, // 10 seconds
    // other revalidate options...
    tags: ['fetchPages'],
  },
)

export const fetchSettings = unstable_cache(
  async (): Promise<Setting | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let settings = null
    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 3 })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    // console.log('settings -- ', settings)
    return settings
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
