'use server'

// Import the Stripe library for interacting with the Stripe API
import Stripe from 'stripe'
import { Cart } from '@/payload-types'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

// Create a Stripe instance using the secret key from the environment variables
// This instance will be used to interact with the Stripe API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// create a paymentIntent and pass the secret back to the client so that stripe can confirm the payment
export async function createPaymentIntent(cart: Cart): Promise<any> {
  try {
    // TODO:
    // find the cart on the server to prevent modification of prices on frontend
    // and use that to create paymentintent
    console.log('see if this worked')

    // attempt to find the customer from the cart so we can assocate this payment intent to the customer on stripe side
    const stripeCustomerId = await getStripeCustomerFromPayload(
      cart.billing?.orderedBy,
      cart.billing?.email,
    )

    // should we create a customer if one doesnt exist? NO that would break privacy
    // instead associate the orders when that person chooses to become a customer by running a search on orders during account creation

    // Create a PaymentIntent on the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cart.totals.total * 100),
      currency: 'aud',
      // confirm: true, // create and confirm the payment intent at the same time so we dont have to screw around with back and forth.
      // return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/order?id={1234}`,

      metadata: {
        cartId: cart.id,
        cartNumber: cart.cartNumber || null,
      }, // Include cart object in metadata, so we can use it to create an order and reference it later

      ...(stripeCustomerId != null && { customer: stripeCustomerId }), // associate with stripeCustomer if one is found
      ...(cart.billing?.email && { receipt_email: cart.billing.email }), // Include the email for receipt if provided
    })

    // create an order here?
    // no do it on confirmPayment webhook so that we can follow up later for unpaid payments and/or show the webhook handler update when payment is successfully completed

    // Return the client secret for use on the client side
    return { client_secret: paymentIntent.client_secret }
  } catch (err: any) {
    // Log any errors that occurred during PaymentIntent creation
    console.error('Error creating PaymentIntent:', err)
    // Return null for the client secret in case of an error
    return null
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

export async function getStripeCustomerFromPayload(orderedBy?: any, email?: any): Promise<any> {
  // customer takes priority over email if both are supplied
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const whereClause = orderedBy
      ? { email: { equals: orderedBy.email } }
      : email
        ? { email: { equals: email } }
        : null

    if (!whereClause) {
      return null // No valid search criteria provided
    }

    const { docs } = await payload.find({
      collection: 'users',
      depth: 1,
      limit: 1,
      where: whereClause,
    })

    if (docs.length === 0) {
      return null
    }

    return docs[0].stripeId
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('Failed to create order')
  }

  return null
}
