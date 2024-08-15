// This file contains server-side logic for creating a Stripe checkout session based on the items in a user's cart.
// It handles mapping the cart items to Stripe line items, creating the checkout session, and returning the session URL for redirection.
// The code is designed to work with Next.js 14's App Router and server components.

'use server'

// Import the 'Cart' type from a separate file
import { Cart } from '@/payload-types'
import { redirect } from 'next/navigation'
// Import the Stripe library
import Stripe from 'stripe'

// Initialize the Stripe instance with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Function to create a Stripe checkout session for the given cart
export async function createCheckoutSession(cart: Cart) {
  // Ensure the cart is not empty before proceeding
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty')
  }

  try {
    // Map the cart items to Stripe line items
    const line_items = cart.items.map((item) => {
      // Ensure the product object is fully expanded (not just the ID)
      if (typeof item.product === 'number') {
        throw new Error('Product is not expanded')
      }

      // Ensure the product has valid Stripe price IDs
      if (
        !item.product.stripe ||
        (!item.product.stripe.basePriceId && !item.product.stripe.salePriceId)
      ) {
        throw new Error('Stripe price IDs are not set for the product')
      }

      // Determine the Stripe price ID to use based on base or sale price
      let priceId: string
      if (item.product.stripe.salePriceId) {
        priceId = item.product.stripe.salePriceId
      } else if (item.product.stripe.basePriceId) {
        priceId = item.product.stripe.basePriceId
      } else {
        throw new Error('No valid Stripe price ID found for the product')
      }

      // Determine the quantity based on the number of receivers (or 0 if none)
      const qty = item.receivers?.length || 0

      // Return the line item object for Stripe
      return {
        price: priceId,
        quantity: qty,
      }
    })

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Accept card payments
      line_items, // The mapped line items from above
      mode: 'payment', // Set the session mode to payment
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?session_id={CHECKOUT_SESSION_ID}`, // URL for successful payment
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/cart`, // URL for canceled payment
      billing_address_collection: 'required', // Collect billing address
      metadata: {
        cartId: cart.id.toString(), // Store the cart ID as metadata
        cartNumber: cart.cartNumber || '',
      },
    })

    // If the session URL is available, return it for redirection
    if (session.url) {
      // create a payload order  as well
      const newOrder = await createOrder(cart, session.id)
      // update the session on stripe with order info ???
      console.log('newOrder --', newOrder)
      return { redirectUrl: session.url }
    } else {
      throw new Error('No URL returned from Stripe')
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error // Re-throw the original error for better debugging
  }
}

// Performance considerations:
// - Mapping cart items to Stripe line items can be inefficient for large carts.
// - Error handling could be improved to provide more specific error messages.

// Accessibility considerations:
// - The checkout process should be accessible and provide alternative methods for users with disabilities.

// State management:
// - The cart state is managed outside this file, likely in a separate state management system or context.

// Side effects:
// - This function has the side effect of creating a Stripe checkout session and potentially an invoice in the future.

import { Order } from '@/payload-types'
import { v4 as uuidv4 } from 'uuid'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

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
