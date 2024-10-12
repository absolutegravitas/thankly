// app/shop/order/page.tsx
import { notFound } from 'next/navigation'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import OrderDetails from '@app/_blocks/OrderDetails'
import OrderConfirmationClient from './OrderConfirmationClient'
import { Order } from '@/payload-types'

// Server action to find an order
async function findOrder(email: string, orderNumber: string): Promise<Order | null> {
  'use server'

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const { docs } = await payload.find({
      collection: 'orders',
      where: {
        and: [{ orderNumber: { equals: orderNumber } }, { 'billing.email': { equals: email } }],
      },
      depth: 2,
      limit: 1,
    })

    if (docs.length === 0) {
      return null
    }

    return docs[0] as Order
  } catch (error) {
    console.error('Error searching for order:', error)
    throw new Error('An error occurred while searching for the order')
  }
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderNumber: string }
}) {
  const { orderNumber } = searchParams
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  if (!orderNumber) {
    return <OrderConfirmationClient findOrder={findOrder} />
  }

  try {
    const { docs } = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      depth: 2,
      limit: 1,
    })

    if (docs.length === 0) {
      notFound()
    }

    const order = docs[0]

    return (
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1> */}
        <OrderDetails order={order} />
        <OrderConfirmationClient order={order} findOrder={findOrder} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
}
