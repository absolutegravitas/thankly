'use server'
import { Order } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, User } from '@/payload-types'

export async function createOrder(cart: Cart, orderNumber: string) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let order: Order | null = null

  const orderData = {
    orderNumber,
    status: 'pending' as const,
    totals: cart.totals,
    billing: cart.billing,
    items: cart.items?.map((item) => ({
      price: item.price,
      product: typeof item.product === 'object' ? item.product.id : item.product,
      giftCard: item.giftCard,
    })),
    receivers: cart.receivers?.map((receiver) => ({
      ...receiver,
      errors: undefined,
    })),
  }

  try {
    order = await payload.create({
      collection: 'orders',
      data: orderData,
    })
    console.log('Order created:', order)
    return order
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }
}

// async function isOrderNumberUnique(payload: any, orderNumber: string): Promise<boolean> {
//   const existingOrder = await payload.find({
//     collection: 'orders',
//     where: {
//       orderNumber: {
//         equals: orderNumber,
//       },
//     },
//   })
//   return existingOrder.totalDocs === 0
// }
