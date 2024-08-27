// This file contains the logic for handling Stripe webhook events, specifically the "checkout.session.completed" event
// and the "payment_intent.succeeded" event.
// It is responsible for processing completed orders, updating order statuses, sending confirmation emails,
// generating shipping labels, and updating order tracking information.

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Import necessary utilities and types from various modules
import { headers } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Order } from '@/payload-types'
import { sendConfirmationEmail } from './sendConfirmationEmail'
import { genSendleLabel } from './genSendleLabel'
import { updateOrderTracking } from './updateOrderTracking'

// Initialize Stripe with the secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Retrieve the Stripe webhook secret from the environment variable
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Handle POST requests (Stripe webhook events)
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  // Validate the Stripe webhook secret
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 })
  }

  // Validate the Stripe signature
  if (!signature) {
    console.error('Missing Stripe signature')
    return NextResponse.json({ error: 'No Stripe signature found' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Construct the Stripe event object from the request body and signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// Handle a succeeded payment intent
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded!')
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    // find the cart associated with the stripe payment intent from the metadata

    // Find the order associated with the Stripe payment intent
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: { stripeId: { equals: paymentIntent.id } },
      depth: 2,
      limit: 1,
    })

    if (orders.length === 0) {
      // If no order exists, create a new one
      const newOrder = await payload.create({
        collection: 'orders',
        data: {
          stripeId: paymentIntent.id,
          status: 'processing' as const,
          totals: {
            total: paymentIntent.amount / 100, // Convert from cents to dollars
          },
          // Add other relevant order details from the payment intent
        },
      })

      console.log(`New order ${newOrder.id} created from payment intent ${paymentIntent.id}`)

      // Send confirmation email for the new order
      await sendConfirmationEmail(newOrder)

      // Process shipping for the new order (if applicable)
      // Note: You may need to adjust this part based on how shipping information is stored in the payment intent
    } else {
      const order = orders[0] as Order

      // Update the existing order status to "processing"
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          status: 'processing' as const,
        },
      })

      console.log(`Existing order ${order.id} updated for payment intent ${paymentIntent.id}`)

      // Send confirmation email for the updated order
      await sendConfirmationEmail(order)

      // Process shipping for each item and receiver in the order
      for (const item of order.items || []) {
        for (const receiver of item.receivers || []) {
          try {
            const trackingInfo = await genSendleLabel(order, item, receiver)
            if (trackingInfo) {
              await updateOrderTracking(order.id, item.id!, receiver.id!, trackingInfo)
            }
          } catch (error) {
            console.error(
              `Error processing shipping for order ${order.id}, item ${item.id}, receiver ${receiver.id}:`,
              error,
            )
          }
        }
      }
    }
  } catch (error) {
    console.error('Error handling succeeded payment intent:', error)
  }
}

// Handle a completed Stripe checkout session
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session was completed!')
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    // Find the order associated with the Stripe checkout session
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: { stripeId: { equals: session.id } },
      depth: 2,
      limit: 1,
    })

    if (orders.length === 0) {
      throw new Error(`No order found with Stripe Checkout Session ID ${session.id}`)
    }

    const order = orders[0] as Order

    // Update the order status to "processing"
    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'processing' as const,
      },
    })

    // Send confirmation email for the order
    await sendConfirmationEmail(order)

    // Process shipping for each item and receiver in the order
    for (const item of order.items || []) {
      for (const receiver of item.receivers || []) {
        try {
          const trackingInfo = await genSendleLabel(order, item, receiver)
          if (trackingInfo) {
            await updateOrderTracking(order.id, item.id!, receiver.id!, trackingInfo)
          }
        } catch (error) {
          console.error(
            `Error processing shipping for order ${order.id}, item ${item.id}, receiver ${receiver.id}:`,
            error,
          )
        }
      }
    }

    console.log(`Order ${order.id} processed successfully`)
  } catch (error) {
    console.error('Error handling completed checkout session:', error)
  }
}

// Performance considerations:
// - This file handles webhook events from Stripe, so performance is critical for timely processing of orders.
// - The `handleCheckoutSessionCompleted` and `handlePaymentIntentSucceeded` functions may be resource-intensive, especially for large orders with many items and receivers.
// - Potential bottlenecks include database operations, generating shipping labels, and sending confirmation emails.
// - Horizontal scaling or background task processing (e.g., queues) may be necessary for high load scenarios.

// Accessibility (a11y) considerations:
// - No specific accessibility features are implemented in this file, as it focuses on server-side order processing.

// State management:
// - No explicit state management is required in this file, as it handles individual requests.

// Side effects:
// - Both `handleCheckoutSessionCompleted` and `handlePaymentIntentSucceeded` functions have side effects, including creating or updating orders, sending emails, and generating shipping labels.

// Future compatibility:
// - The Stripe API version is hardcoded, but it should be updated when new versions are released.
// - The code may need to be adapted if the Stripe webhook event structure or payload changes in the future.
