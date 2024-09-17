// app/shop/order/page.tsx
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

import OrderDetails from '@app/_blocks/OrderDetails'

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderNumber: string }
}) {
  const { orderNumber } = searchParams

  if (!orderNumber) {
    notFound()
  }

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const { docs } = await payload.find({
      collection: 'orders',
      // probably shoudl also check if the customer is logged in and if the order number matches their email or name or something otherwise this is just open to anyone who knows the order number
      where: { orderNumber: { equals: orderNumber } },
      depth: 2,
      limit: 1,
    })

    console.log('orders --', docs)
    if (docs.length === 0) {
      notFound()
    }

    const order = docs[0]

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>
        <OrderDetails order={order} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error // This will trigger the error boundary
  }
}
