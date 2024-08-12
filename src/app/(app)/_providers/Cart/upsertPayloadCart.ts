'use server'

import { Cart } from '@/payload-types'

// Import utility functions from the @payloadcms/next package for server-side data management
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

/**
 * Function to create or update a cart in the Payload CMS database.
 *
 * @param cart - The cart object to upsert (create or update).
 * @returns Promise that resolves to the upserted cart object if successful, or null if an error occurs.
 *
 * Performance considerations:
 * - Potential performance impact due to database operations.
 * - Optimization opportunities: Caching, batching operations, or limiting data fetched.
 *
 * API integrations or data management:
 * - Expects a Cart object with a cartNumber and items array containing product IDs or objects.
 * - Potential error states: Failed database operations, invalid data formats.
 *
 * Side effects:
 * - Creates or updates a cart in the Payload CMS database.
 */

export async function upsertPayloadCart(cart: Cart) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let serverCart: Cart | null = null

  // console.log('cart provided -- ', JSON.stringify(cart))

  // Transform the cart object to ensure product IDs are strings because the cart object we get back has the full product object and we dont need that for the upsert
  const transformedCart = {
    ...cart,
    items: cart.items?.map((item) => ({
      ...item,
      product: typeof item.product === 'object' ? item.product.id : item.product,
    })),
  }

  console.log('cart to upsert -- ', JSON.stringify(transformedCart))

  try {
    let { docs } = await payload.find({
      collection: 'carts',
      where: { cartNumber: { equals: transformedCart.cartNumber } },
      context: { select: ['cartNumber', 'id', 'billing'] },
      depth: 0,
      limit: 1,
      pagination: false,
    })

    // no server cart found, create the server cart
    if (!docs || docs.length === 0) {
      console.log('no serverCart found, so create a new one')

      serverCart = await payload.create({
        collection: 'carts',
        data: transformedCart,
      })

      console.log('serverCart created -- ', serverCart)
    } else {
      console.log('serverCart found -- ', docs[0])

      const { docs: newServerCart } = await payload.update({
        collection: 'carts',
        where: { cartNumber: { equals: cart.cartNumber } },
        data: transformedCart,
      })

      if (newServerCart && newServerCart.length > 0)
        console.log('serverCart updated -- ', newServerCart[0])

      // check if the cart is empty at the end and delete the cart if that is the case
    }
  } catch (error) {
    console.error('Error upserting cart:', error)
    throw new Error('Failed to upsert cart')
  }
}
