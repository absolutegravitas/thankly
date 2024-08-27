'use server'
import { Order } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, User } from '@/payload-types'

function generateOrderNumber(): string {
  return `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
}

async function isOrderNumberUnique(payload: any, orderNumber: string): Promise<boolean> {
  const existingOrder = await payload.find({
    collection: 'orders',
    where: {
      orderNumber: {
        equals: orderNumber,
      },
    },
  })
  return existingOrder.totalDocs === 0
}

export async function createOrder(cart: Cart, stripeSessionId: string) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let order: Order | null = null

  const transformedCart = {
    ...cart,
    items: cart.items?.map((item) => ({
      ...item,
      product: typeof item.product === 'object' ? item.product.id : item.product,
      receivers: item.receivers?.map((receiver) => ({
        ...receiver,
        errors: undefined,
      })),
    })),
  }

  let orderNumber: string
  do {
    orderNumber = generateOrderNumber()
  } while (!(await isOrderNumberUnique(payload, orderNumber)))

  const orderData = {
    orderNumber,
    status: 'pending' as const,
    stripeId: stripeSessionId,
    totals: transformedCart.totals,
    billing: transformedCart.billing,
    items: transformedCart.items,
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
