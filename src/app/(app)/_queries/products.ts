import { revalidatePath, unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Product } from '@payload-types'

export const fetchProduct = (slug: string): Promise<Product | null> => {
  const cachedFetchProduct = unstable_cache(
    async (): Promise<Product | null> => {
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

export const fetchShopList = unstable_cache(
  async (): Promise<{ products: any[] } | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let result: any = null

    try {
      const { docs } = await payload.find({
        collection: 'products',
        depth: 1, // 1 needed to get media info
        pagination: false,
      })

      if (docs?.length === 0) {
        console.log('not found')
        return null
      }

      result = docs
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    return result
  },
  ['fetchShopList'],
  {
    revalidate: 60, // 10 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year
    tags: ['fetchShopList'],
  },
)

export const fetchProductsList = unstable_cache(
  async (): Promise<{ products: any[] } | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let result: any

    try {
      const { docs } = await payload.find({
        collection: 'products',
        depth: 0,
        // depth: 1, // to include image/page refs details, not needed for generateStaticParams?
        pagination: false,
      })

      console.log('docs', docs)

      if (docs?.length === 0) {
        console.log('not found')
        return null
      }
      console.log('found products list')
      result = docs.map((product: Product) => ({
        slug: product.slug,
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    return result || null
  },
  ['fetchProductsList'],
  {
    revalidate: 60, // 10 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year
    tags: ['fetchProductsList'],
  },
)
