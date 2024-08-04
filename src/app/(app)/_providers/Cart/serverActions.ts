'use server'

import { Cart } from '@/payload-types'

// Import utility functions from the @payloadcms/next package
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function syncCartToPayload(cart: Cart): Promise<Cart> {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    if (cart.id) {
      const updatedCart = await payload.update({
        collection: 'carts',
        id: cart.id,
        data: cart,
      })
      return updatedCart
    } else {
      const newCart = await payload.create({
        collection: 'carts',
        data: cart,
      })
      return newCart
    }
  } catch (error) {
    console.error('Error syncing cart to Payload:', error)
    throw new Error('Failed to sync cart')
  }
}

export async function fetchCartFromPayload(): Promise<Cart | null> {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const result = await payload.find({
      collection: 'carts',
      // Add your condition to find the user's cart
      // For example: where: { user: { equals: userId } }
    })

    if (result.docs.length > 0) {
      return result.docs[0] as Cart
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching cart from Payload:', error)
    throw new Error('Failed to fetch cart')
  }
}
