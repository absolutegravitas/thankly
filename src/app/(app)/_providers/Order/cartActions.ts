// 'use server'
// import { headers, cookies } from 'next/headers'
// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'
// import { Order } from '@/payload-types'
// import { revalidatePath, revalidateTag } from 'next/cache'
// import { shippingPrices } from '@/utilities/refData'

// //////////////////////////////////////////////////////////

// // export async function createOrder(order: Order): Promise<Order | null> {
// //   const config = await configPromise
// //   const payload = await getPayloadHMR({ config })

// //   try {
// //     if (!order) {
// //       throw new Error('Order not found')
// //     }

// //     // Create the draft order
// //     const order = await payload.create({
// //       collection: 'orders',
// //       data: {
// //         // orderNumber: Date.now(), // You might want to use a more sophisticated method
// //         billing: {
// //           // orderedBy: order.customer,
// //           name: order.billing.name,
// //           address: order.billing.address,
// //           email: order.billing.email,
// //           contactNumber: order.billing.contactNumber,
// //           orgName: order.billing.orgName,
// //           orgId: order.billing.orgId,
// //           billingAddress: order.billing.billingAddress,
// //         },
// //         status: 'pending',
// //         totals: { orderThanklys: 0, orderShipping: 0, orderTotal: 0 },
// //         items: order.items,
// //       },
// //     })

// //     // Don't clear the order yet, as we're just creating a draft order

// //     return order
// //   } catch (error) {
// //     console.error('Error creating draft order:', error)
// //     return null
// //   }
// // }

// //////////////////////////////////////////////////////////
// export async function getOrderId() {
//   return cookies().get('orderId')?.value
// }

// //////////////////////////////////////////////////////////
// export async function createOrder() {
//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let order: Order | null = null

//   try {
//     order = await payload.create({
//       collection: 'orders',
//       data: {
//         items: [],
//         totals: { orderValue: 0, shipping: 0, thanklys: 0 },
//       },
//     })

//     if (order) {
//       const expiryDate = new Date()
//       expiryDate.setMinutes(expiryDate.getMinutes() + 60)

//       const cookieStore = cookies()
//       cookieStore.set('orderId', order.id.toString(), { expires: expiryDate })
//       console.log('cookie saved...orderId:', order.id)
//       revalidatePath('/shop/order')
//     }
//   } catch (error: any) {
//     console.error(`Error fetching order.`, error)
//   } finally {
//     return order || null
//   }
// }

// //////////////////////////////////////////////////////////
// export async function getOrder(orderId?: string, depth?: number) {
//   const isStaticGeneration = typeof window === 'undefined' && !cookies().has('orderId')

//   if (isStaticGeneration) return null
//   if (!orderId) orderId = await getOrderId()
//   if (!orderId) return null

//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let order = null

//   try {
//     const { docs } = await payload.find({
//       collection: 'orders',
//       where: { id: { equals: orderId } },
//       depth: depth || 2,
//       limit: 1,
//       pagination: false,
//     })

//     order = docs[0]
//     if (order && order.items.length === 0) order = null

//     revalidatePath('/shop/order')
//   } catch (error) {
//     console.error(`Error fetching order: ${orderId}`, error)
//   }

//   return order || null
// }
