'use server'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, Order } from '@/payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getCart } from './cartActions'

//////////////////////////////////////////////////////////
export async function createOrder(cartId: string): Promise<Order | null> {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let cart: Cart | null = await getCart(cartId)

  if (!cart) {
    console.error('No cart found')
    return null
  }

  try {
    const order: Order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: Date.now(),
        orderedBy: cart.customer,
        status: 'pending',
        orderSubtotal: cart.totals.cartThanklys,
        orderShipping: cart.totals.cartShipping,
        orderTotal: cart.totals.cartTotal,
        items: cart.items?.map((item) => ({
          product: item.product,
          itemPrice: item.productPrice,
          itemTotalShipping: item.totals.itemShipping,
          itemTotal: item.totals.itemTotal,
          receivers: item.receivers?.map((receiver) => ({
            name: receiver.name,
            message: receiver.message,
            addressLine1: receiver.addressLine1,
            addressLine2: receiver.addressLine2,
            city: receiver.city,
            state: receiver.state,
            postcode: receiver.postcode,
            shippingMethod: receiver.shippingMethod,
            receiverPrice: receiver.totals.receiverThankly,
            receiverShipping: receiver.totals.receiverShipping,
            receiverTotal: receiver.totals.receiverTotal,
          })),
        })),
      },
    })

    revalidatePath('/shop/checkout')
    return order
  } catch (error: any) {
    console.error('Error creating order:', error)
    return null
  }
}

//////////////////////////////////////////////////////////
export async function updateOrderStatus(
  orderId: number,
  status: Order['status'],
  stripePaymentIntentID: string,
): Promise<Order | null> {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const updatedOrder: Order = await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        status,
        stripePaymentIntentID,
      },
    })

    revalidatePath(`/shop/order-confirmation/${orderId}`)
    return updatedOrder
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return null
  }
}

//////////////////////////////////////////////////////////

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function createPaymentIntent(cartId: string) {
  try {
    const cart = await getCart(cartId)

    if (!cart || !cart.totals || cart.totals.cartTotal <= 0) {
      throw new Error('Invalid cart or cart total')
    }

    const amount = Math.round(cart.totals.cartTotal * 100) // Convert to cents

    if (amount < 50) {
      // Stripe's minimum amount is 50 cents
      throw new Error('Order total is below the minimum allowed amount')
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'aud',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return { client_secret: paymentIntent.client_secret }
  } catch (err: any) {
    console.error('Error creating PaymentIntent:', err)
    return { error: err.message }
  }
}
