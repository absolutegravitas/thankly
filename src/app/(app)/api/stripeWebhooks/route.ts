import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, Order } from '@/payload-types'
import { Resend } from 'resend'
import OrderConfirmationEmail from '@app/_emails/order-confirmation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
const resend = new Resend(process.env.RESEND_KEY)

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

    await processShipping(order)

    console.log(`Order ${order.id} processed successfully`)
  } catch (error) {
    console.error('Error handling completed checkout session:', error)
  }
}

async function sendConfirmationEmail(order: Order) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_DEFAULT_EMAIL || 'orders@thankly.co',
      to: order.billing?.email || 'code@prasit.co',
      subject: `Order Confirmation #${order.orderNumber}`,
      react: OrderConfirmationEmail(order),
    })
    console.log(`Confirmation email sent for order ${order.id}`)
  } catch (error) {
    console.error('Error sending confirmation email:', error)
  }
}

async function processShipping(order: Order) {
  for (const item of order.items || []) {
    for (const receiver of item.receivers || []) {
      try {
        const trackingInfo = await createSendleShipment(order, item, receiver)
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

async function createSendleShipment(order: Order, item: any, receiver: any) {
  const sendleApiUrl = 'https://sandbox.sendle.com/api/orders'
  const sendleId = process.env.SENDLE_ID_TEST
  const sendleKey = process.env.SENDLE_KEY_TEST

  const payload = {
    sender: {
      contact: {
        name: 'Thankly',
        email: 'orders@thankly.co',
        phone: '+61 404 361 476',
      },
      address: {
        address_line1: '20 Canterbury Road',
        suburb: 'Camberwell',
        postcode: '3124',
        state_name: 'VIC',
        country: 'AU',
      },
    },
    receiver: {
      contact: {
        name: receiver.name,
        email: order.billing?.email,
        // phone: receiver.delivery?.phone || order.billing?.contactNumber,
      },
      address: {
        address_line1: receiver.delivery?.address?.addressLine1,
        address_line2: receiver.delivery?.address?.addressLine2 || '',
        suburb: receiver.delivery?.address?.suburb,
        postcode: receiver.delivery?.address?.postcode,
        state_name: receiver.delivery?.address?.state,
        country: receiver.delivery?.address?.country || 'AU',
      },
      instructions: receiver.delivery?.instructions || 'Leave at front door if no answer',
    },
    description: `Order #${order.orderNumber} - ${item.product.title}`,
    weight: {
      value: item.product.weight?.value || '1',
      units: item.product.weight?.units || 'kg',
    },
    dimensions: {
      length: item.product.dimensions?.length || '20',
      width: item.product.dimensions?.width || '15',
      height: item.product.dimensions?.height || '10',
      units: item.product.dimensions?.units || 'cm',
    },
    product_code: receiver.delivery?.shippingMethod || 'STANDARD-DROPOFF',
    customer_reference: `Order #${order.orderNumber} - Item #${item.id}`,
  }

  try {
    const response = await fetch(sendleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${sendleId}:${sendleKey}`).toString('base64')}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Sendle API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      trackingId: data.tracking_id,
      trackingLink: data.tracking_url,
    }
  } catch (error) {
    console.error('Error creating Sendle shipment:', error)
    throw error
  }
}

async function updateOrderTracking(
  orderId: number,
  itemId: string,
  receiverId: string,
  trackingInfo: any,
) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        items: {
          [itemId]: {
            receivers: {
              [receiverId]: {
                delivery: {
                  tracking: {
                    id: trackingInfo.trackingId,
                    link: trackingInfo.trackingLink,
                  },
                },
              },
            },
          },
        },
      },
    })
    console.log(`Updated tracking for order ${orderId}, item ${itemId}, receiver ${receiverId}`)
  } catch (error) {
    console.error('Error updating order tracking:', error)
  }
}
