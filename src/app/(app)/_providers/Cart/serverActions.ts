'use server'

import { Cart } from '@/payload-types'

// Import utility functions from the @payloadcms/next package
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function upsertPayloadCart(cart: Cart): Promise<Cart | null> {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let payloadCart: Cart | null = null

  const transformedCart = {
    ...cart,
    items: cart.items?.map((item) => ({
      ...item,
      product: typeof item.product === 'object' ? item.product.id : item.product,
    })),
  }

  console.log('upsert cart -- ', JSON.stringify(transformedCart))

  try {
    if (cart.cartNumber) {
      const result = await payload.find({
        collection: 'carts',
        cartNumber: cart.cartNumber,
        depth: 0,
      })

      console.log('result ', result)

      if (result) {
        // Update existing cart
        payloadCart = await payload.update({
          collection: 'carts',
          cartNumber: cart.cartNumber,
          data: transformedCart,
        })

        console.log('payloadCart -- ', payloadCart)
      } else {
        // Create new cart
        payloadCart = await payload.create({
          collection: 'carts',
          data: transformedCart,
        })

        console.log('payloadCart -- ', payloadCart)
      }
    }
    return payloadCart
  } catch (error) {
    console.error('Error upserting cart:', error)
    throw new Error('Failed to upsert cart')
  }
}
