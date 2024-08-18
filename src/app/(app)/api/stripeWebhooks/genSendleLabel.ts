// This file contains a function to generate a shipping label using the Sendle API
// for a given order, item, and receiver details.

// TypeScript type definition for the Product object
interface Product {
  weight?: {
    value?: string
    units?: string
  }
  dimensions?: {
    length?: string
    width?: string
    height?: string
    units?: string
  }
}

// Use the 'use server' directive to mark this file as a server component
;('use server')

// Import the Order type from a separate file
import { Order } from '@/payload-types'

// Function to generate a Sendle shipping label
export async function genSendleLabel(order: Order, item: any, receiver: any) {
  const sendleApiUrl = 'https://sandbox.sendle.com/api/orders'
  const sendleId = process.env.SENDLE_ID_TEST
  const sendleKey = process.env.SENDLE_KEY_TEST

  // Payload object to be sent to the Sendle API
  const payload = {
    sender: {
      contact: { name: 'Thankly' },
      address: {
        address_line1: process.env.SENDER_ADDRESS_LINE1,
        suburb: process.env.SENDER_SUBURB,
        postcode: process.env.SENDER_POSTCODE,
        state_name: process.env.SENDER_STATE,
      },
    },
    receiver: {
      contact: {
        name: receiver.name,
        // email: order.billing?.email, // comment this if we're sending order & delivery updates
      },
      address: {
        address_line1: receiver.delivery?.address?.addressLine1,
        address_line2: receiver.delivery?.address?.addressLine2 || '',
        suburb: receiver.delivery?.address?.suburb,
        postcode: receiver.delivery?.address?.postcode,
        state_name: receiver.delivery?.address?.state,
        country: receiver.delivery?.address?.country || 'AU',
      },
      instructions: receiver.delivery?.instructions || 'ATL',
    },
    description: `Order #${order.orderNumber} - Item #${item.id}`, // doesnt appear on label
    customer_reference: `Your Thankly from ${order.billing?.name} ${order.billing?.orgName || ''} (#${order.orderNumber})`, // appears on label
    product_code: 'STANDARD-DROPOFF',

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
    metadata: { ...order },
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
