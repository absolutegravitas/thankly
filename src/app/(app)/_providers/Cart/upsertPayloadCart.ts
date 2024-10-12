'use server'

import { Cart } from '@/payload-types'

// Import utility functions from the @payloadcms/next package for server-side data management
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'

export async function upsertPayloadCart(cart: Cart) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let serverCart: Cart | null = null

  // console.log('cart provided -- ', JSON.stringify(cart))

  // Transform the cart object to ensure product IDs are strings because the cart object we get back has the full product object and we dont need that for the upsert
  const transformedCart: Cart = {
    ...cart,
    items: cart.items?.map((item) => ({
      ...item,
      product: typeof item.product === 'object' ? item.product.id : item.product,
      addOns: item.addOns?.map((addOn) => (typeof addOn === 'object' ? addOn.id : addOn)),
    })),
    billing: cart.billing
      ? {
          ...cart.billing,
          orderedBy: cart.billing.orderedBy ? Number(cart.billing.orderedBy) : undefined,
        }
      : undefined,
  }

  console.log('Transformed cart:', JSON.stringify(transformedCart, null, 2))

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
