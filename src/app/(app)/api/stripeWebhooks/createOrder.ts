'use server'
import { Order } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, User } from '@/payload-types'

export async function createOrder(cart: Cart, orderNumber: string, paymentIntentId: string) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let order: Order | null = null

  const orderData = {
    orderNumber,
    status: 'pending' as const,
    discountCodeApplied: cart.discountCodeApplied,
    stripeId: null, // You might want to generate this if needed
    totals: {
      cost: cart.totals.cost,
      shipping: cart.totals.shipping || null,
      discount: cart.totals.discount || null,
      total: cart.totals.total,
    },
    billing: cart.billing,
    items: cart.items?.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      price: item.price,
      product: typeof item.product === 'object' ? item.product.id : item.product,
      addOns: item.addOns?.map((addOn) => (typeof addOn === 'object' ? addOn.id : addOn)),
      receiverId: item.receiverId,
      giftCard: item.giftCard,
    })),
    receivers: cart.receivers?.map((receiver) => ({
      receiverId: receiver.receiverId,
      firstName: receiver.firstName,
      lastName: receiver.lastName,
      address: receiver.address,
      delivery: receiver.delivery,
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
