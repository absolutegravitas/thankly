'use server'
import { Cart } from '@/payload-types'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function createCheckoutSession(cart: Cart) {
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty')
  }

  try {
    const line_items = cart.items.map((item) => {
      if (typeof item.product === 'number') {
        throw new Error('Product is not expanded')
      }

      if (
        !item.product.stripe ||
        (!item.product.stripe.basePriceId && !item.product.stripe.salePriceId)
      ) {
        throw new Error('Stripe price IDs are not set for the product')
      }

      let priceId: string

      if (item.product.stripe.salePriceId) {
        priceId = item.product.stripe.salePriceId
      } else if (item.product.stripe.basePriceId) {
        priceId = item.product.stripe.basePriceId
      } else {
        throw new Error('No valid Stripe price ID found for the product')
      }

      const qty = item.receivers?.length || 0

      return {
        price: priceId,
        quantity: qty,
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/cart`,
      billing_address_collection: 'required',
      metadata: {
        cartId: cart.id.toString(),
      },
    })

    if (session.url) {
      return { redirectUrl: session.url }
    } else {
      throw new Error('No URL returned from Stripe')
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error // Re-throw the original error for better debugging
  }
}
