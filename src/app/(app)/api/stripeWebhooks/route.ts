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
import { Cart, Order } from '@/payload-types'
import { sendConfirmationEmail } from './sendConfirmationEmail'
import { genSendleLabel } from './genSendleLabel'
import { updateOrderTracking } from './updateOrderTracking'
import { createOrder } from './createOrder'

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
      // case 'checkout.session.completed':
      //   const session = event.data.object as Stripe.Checkout.Session
      //   await handleCheckoutSessionCompleted(session)
      //   break
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('paymentIntent --', paymentIntent)
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
    // find the orderNumber associated with the stripe payment intent from the metadata
    const orderNumber = paymentIntent.metadata.orderNumber
    if (!orderNumber) {
      throw new Error('No order number found in payment intent metadata')
    }
    // find the order on the payload server by orderNumber
    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      depth: 2,
      limit: 1,
    })

    if (orders.length === 0) {
      throw new Error(`No order found with order number ${orderNumber}`)
    }

    const order = orders[0] as Order
    console.log('order found -- ', order)

    // do stuff if order was successfully created
    if (order) {
      console.log(`New order ${order?.id} created from payment intent ${paymentIntent.id}`)

      // // TODO: delete cart on payloadCMS as it's no longer valid
      // await payload.delete({
      //   collection: 'carts',
      //   id: cart.id,
      // })

      // send confirmation email to customer
      await sendConfirmationEmail(order)

      // generate sendle labels for each receiver in the order
      // only if the receiver is getting a gift product type AND the address is not a PO BOX, Parcel Collect, or Parcel Locker - these have to be prepped manually in AusPost / with postage stamps
      // for (const item of newOrder.items || []) {
      //   for (const receiver of item.receivers || []) {
      //     if (
      //       !/PO BOX|Parcel Collect|Parcel Locker/i.test(
      //         receiver.delivery?.address?.addressLine1 || '',
      //       )
      //     ) {
      //       try {
      //         const trackingInfo = await genSendleLabel(newOrder, item, receiver)
      //         if (trackingInfo) {
      //           await updateOrderTracking(newOrder.id, item.id!, receiver.id!, trackingInfo)
      //         }
      //       } catch (error) {
      //         console.error(
      //           `Error processing shipping for order ${newOrder.id}, item ${item.id}, receiver ${receiver.id}:`,
      //           error,
      //         )
      //       }
      //     }
      //   }
      // }
    }
  } catch (error) {
    console.error('Error handling succeeded payment intent:', error)
  }
}

// // Handle a completed Stripe checkout session for Stripe Checkout only
// async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
//   console.log('Checkout session was completed!')
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })

//   try {
//     // Find the order associated with the Stripe checkout session
//     const { docs: orders } = await payload.find({
//       collection: 'orders',
//       where: { stripeId: { equals: session.id } },
//       depth: 2,
//       limit: 1,
//     })

//     if (orders.length === 0) {
//       throw new Error(`No order found with Stripe Checkout Session ID ${session.id}`)
//     }

//     const order = orders[0] as Order

//     // Update the order status to "processing"
//     await payload.update({
//       collection: 'orders',
//       id: order.id,
//       data: {
//         status: 'processing' as const,
//       },
//     })

//     // Send confirmation email for the order
//     await sendConfirmationEmail(order)

//     // Process shipping for each item and receiver in the order
//     for (const item of order.items || []) {
//       for (const receiver of item.receivers || []) {
//         try {
//           const trackingInfo = await genSendleLabel(order, item, receiver)
//           if (trackingInfo) {
//             await updateOrderTracking(order.id, item.id!, receiver.id!, trackingInfo)
//           }
//         } catch (error) {
//           console.error(
//             `Error processing shipping for order ${order.id}, item ${item.id}, receiver ${receiver.id}:`,
//             error,
//           )
//         }
//       }
//     }

//     console.log(`Order ${order.id} processed successfully`)
//   } catch (error) {
//     console.error('Error handling completed checkout session:', error)
//   }
// }
