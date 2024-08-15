// app/shop/order/page.tsx
import { notFound } from 'next/navigation'
<<<<<<< HEAD
import Link from 'next/link'
import cn from '@/utilities/cn'
import { contentFormats } from '@app/_css/tailwindClasses'
import { CheckCircleIcon, ClockIcon } from 'lucide-react'
=======
>>>>>>> b843998173401c5d6f03f483871947818128c4e5
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

import OrderDetails from '@app/_blocks/OrderDetails'

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id: string }
}) {
  const { session_id } = searchParams

  if (!session_id) {
    notFound()
  }

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const { docs } = await payload.find({
      collection: 'orders',
      where: {
        stripeId: {
          equals: session_id,
        },
      },
      depth: 2,
      limit: 1,
    })

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
