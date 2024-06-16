// import 'server-only'

import { revalidatePath, unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, Product } from '@payload-types'
import { getCart } from '@app/_providers/Cart'
import { headers, cookies } from 'next/headers'

export const fetchProduct = async (slug: string): Promise<any | null> => {
  let cart: any | null = null
  cart = await getCart()

  const cachedFetchProduct = unstable_cache(
    async (): Promise<any | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let product: any | null = null

      try {
        // console.log('fetchPage slug //', slug) // should be 'home' if it's null

        const { docs } = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        product = docs[0]
        const inCart: boolean = false
        product = { ...product, inCart }

        if (cart && product) {
          product.inCart = cart?.items?.some((p: any) => p.product.id === product?.id)
          // product = { ...product, inCart }
          console.log('fetchProduct', product)
        }
      } catch (error) {
        console.error(`Error fetching product: ${slug}`, error)
      } finally {
        return product || null
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

export const fetchShopList = async (): Promise<any[] | null> => {
  let cart: any | null = null
  cart = await getCart()

  const shopList = unstable_cache(
    async (): Promise<any[] | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let result: any[] | null = null

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

        // console.log('fetchShopList result --', JSON.stringify(result))

        if (cart) {
          result?.map((shopItem: any) => {
            // console.log('shopItem', shopItem)
            shopItem.inCart = cart?.items?.some((p: any) => p.product.id === shopItem.id)
            // console.log('shopItem', shopItem)

            return shopItem
          })

          //  result = result?.map((product: any) => ({
          //    ...product,
          //    inCart: cart?.items?.some((p) => p.product === product.id),
          //  }))
        }

        // for each result, check if the cart already has this product added
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

  return shopList()
}

export const fetchProductSlugs = unstable_cache(
  async (): Promise<{ slug: string }[]> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let result: { slug: string }[] = []

    try {
      const { docs } = await payload.find({
        collection: 'products',
        depth: 0,
        pagination: false,
      })

      // console.log('products docs', docs)

      if (!docs || docs.length === 0) {
        console.log('not found')
        return [] // Return an empty array instead of null
      }

      // console.log('found products list')
      result = docs.map((product: Product) => ({
        slug: product.slug,
      }))
    } catch (error) {
      console.error('Error fetching products:', error)
    }

    return result // Always return an array
  },
  ['fetchProductSlugs'],
  {
    revalidate: 60, // 10 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year
    tags: ['fetchProductSlugs'],
  },
)
