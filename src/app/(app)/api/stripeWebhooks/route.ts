import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Order } from '@/payload-types'
import { sendConfirmationEmail } from './sendConfirmationEmail'
import { genSendleLabel } from './genSendleLabel'
import { updateOrderTracking } from './updateOrderTracking'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 })
  }

  if (!signature) {
    console.error('Missing Stripe signature')
    return NextResponse.json({ error: 'No Stripe signature found' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutSessionCompleted(session)
    } else {
      console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session was completed!')
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
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

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        status: 'processing' as const,
      },
    })

    await sendConfirmationEmail(order)
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
