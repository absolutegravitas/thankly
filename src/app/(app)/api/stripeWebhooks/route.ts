import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, Order } from '@/payload-types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.processing':
        await handlePaymentIntentProcessing(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
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

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('PaymentIntent was successful!')
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    // 1. Retrieve the cart using the metadata from the PaymentIntent
    const cartId = paymentIntent.metadata.cartId
    if (!cartId) {
      throw new Error('No cartId found in PaymentIntent metadata')
    }

    let cart: Cart | null = null

    const { docs } = await payload.find({
      collection: 'products',
      where: { id: { equals: cartId } },
      depth: 1,
      limit: 1,
      pagination: false,
    })

    cart = docs[0]

    if (!cart) {
      throw new Error(`No cart found with id ${cartId}`)
    }

    // 2. Create a new order based on the cart data
    const newOrder = (await payload.create({
      collection: 'orders',
      data: {
        orderNumber: await generateOrderNumber(),
        status: 'completed',
        stripePaymentIntentID: paymentIntent.id,
        totals: cart.totals,
        billing: cart.billing,
        items: cart.items,
      },
    })) as Order

    // 3. Update the cart status to 'completed'
    await payload.update({
      collection: 'carts',
      id: cartId,
      data: {
        status: 'completed',
      },
    })

    // 4. Send confirmation email to customer
    await sendConfirmationEmail(newOrder)

    // 5. Start shipping process if applicable
    await startShippingProcess(newOrder)

    console.log(`Order ${newOrder.id} created successfully`)
  } catch (error) {
    console.error('Error handling successful payment:', error)
    // You might want to implement some error handling or retry logic here
  }
}

async function generateOrderNumber() {
  // Implement your order number generation logic
  // This could be a simple incremental number or a more complex unique identifier
}

async function sendConfirmationEmail(order: Order) {
  // Implement your email sending logic
  // You might want to use a service like SendGrid or a custom SMTP setup
}

async function startShippingProcess(order: Order) {
  // Implement your shipping process logic
  // This could involve updating the order status, notifying a fulfillment service, etc.
}

async function handlePaymentIntentProcessing(paymentIntent: Stripe.PaymentIntent) {
  console.log('PaymentIntent is processing')
  // TODO: Update order status to 'processing'
  // await updateOrderStatus(paymentIntent.id, 'processing')
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('PaymentIntent failed')
  // TODO: Update order status to 'failed'
  // await updateOrderStatus(paymentIntent.id, 'failed')

  // TODO: Send failure notification to customer
  // await sendPaymentFailureNotification(paymentIntent.receipt_email)
}

// Helper functions (implement these according to your needs)
// async function updateOrderStatus(orderId: string, status: string) {
//   // Implementation
// }

// async function createOrUpdateOrder(paymentIntent: Stripe.PaymentIntent) {
//   // Implementation
// }

// async function sendConfirmationEmail(email: string | null) {
//   // Implementation
// }

// async function startShippingProcess(orderId: string) {
//   // Implementation
// }

// async function sendPaymentFailureNotification(email: string | null) {
//   // Implementation
// }
