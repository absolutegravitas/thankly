// 'use server'
// import { headers, cookies } from 'next/headers'
// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'
// import { Order, Order } from '@/payload-types'
// import { revalidatePath, revalidateTag } from 'next/cache'
// import { getCart } from './cartActions'

// //////////////////////////////////////////////////////////
// export async function createOrder(orderId: string): Promise<Order | null> {
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let order: Order | null = await getCart(orderId)

//   if (!order) {
//     console.error('No order found')
//     return null
//   }

//   try {
//     const order: Order = await payload.create({
//       collection: 'orders',
//       data: {
//         orderNumber: Date.now(),
//         orderedBy: order.customer,
//         status: 'pending',
//         orderSubtotal: order.totals.cost,
//         orderShipping: order.totals.shipping,
//         orderTotal: order.totals.total,
//         items: order.items?.map((item) => ({
//           product: item.product,
//           itemPrice: item.price,
//           subTotalShipping: item.totals.shipping,
//           subTotal: item.totals.subTotal,
//           receivers: item.receivers?.map((receiver) => ({
//             name: receiver.name,
//             message: receiver.message,
//             addressLine1: receiver.delivery?.addressLine1,
//             addressLine2: receiver.delivery?.addressLine2,
//             city: receiver.city,
//             state: receiver.state,
//             postcode: receiver.postcode,
//             shippingMethod: receiver.delivery?.shippingMethod,
//             receiverPrice: receiver.totals.cost,
//             shipping: receiver.totals.shipping,
//             subTotal: receiver.totals.subTotal,
//           })),
//         })),
//       },
//     })

//     revalidatePath('/shop/checkout')
//     return order
//   } catch (error: any) {
//     console.error('Error creating order:', error)
//     return null
//   }
// }

// //////////////////////////////////////////////////////////
// export async function updateOrderStatus(
//   orderId: number,
//   status: Order['status'],
//   stripePaymentIntentID: string,
// ): Promise<Order | null> {
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })

//   try {
//     const updatedOrder: Order = await payload.update({
//       collection: 'orders',
//       id: orderId,
//       data: {
//         status,
//         stripePaymentIntentID,
//       },
//     })

//     revalidatePath(`/shop/order-confirmation/${orderId}`)
//     return updatedOrder
//   } catch (error: any) {
//     console.error('Error updating order status:', error)
//     return null
//   }
// }

// //////////////////////////////////////////////////////////

// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// export async function createPaymentIntent(orderId: string) {
//   try {
//     const order = await getCart(orderId)

//     if (!order || !order.totals || order.totals.total <= 0) {
//       throw new Error('Invalid order or order total')
//     }

//     const amount = Math.round(order.totals.total * 100) // Convert to cents

//     if (amount < 50) {
//       // Stripe's minimum amount is 50 cents
//       throw new Error('Order total is below the minimum allowed amount')
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount,
//       currency: 'aud',
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     })

//     return { client_secret: paymentIntent.client_secret }
//   } catch (err: any) {
//     console.error('Error creating PaymentIntent:', err)
//     return { error: err.message }
//   }
// }
