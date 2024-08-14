import { notFound } from 'next/navigation'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { contentFormats } from '@app/_css/tailwindClasses'
import { CheckCircleIcon, ClockIcon } from 'lucide-react'
import { unstable_cache } from 'next/cache'

async function getStripeSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'line_items.data.price.product'],
  })
  return session
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    notFound()
  }

  const stripeSession = await getStripeSession(sessionId)
  const payloadClient = await getPayloadClient()

  const { docs: orders } = await payloadClient.find({
    collection: 'orders',
    where: {
      stripePaymentIntentID: {
        equals: stripeSession.payment_intent?.id,
      },
    },
  })

  const [order] = orders

  const orderStatus = stripeSession.payment_status === 'paid' ? 'completed' : 'processing'
  const isProcessing = orderStatus === 'processing'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className={cn(contentFormats.global, contentFormats.h1, 'mb-8 text-center')}>
          Order Confirmation
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            {isProcessing ? (
              <ClockIcon className="w-6 h-6 text-yellow-500 mr-2" />
            ) : (
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
            )}
            <h2 className={cn(contentFormats.global, contentFormats.h3)}>
              {isProcessing ? 'Order Processing' : 'Order Confirmed'}
            </h2>
          </div>
          <p className={cn(contentFormats.global, contentFormats.text)}>
            {isProcessing
              ? 'Your order is being processed. We will notify you once the payment is confirmed.'
              : 'Thank you for your purchase! Your order has been confirmed.'}
          </p>
          <p className={cn(contentFormats.global, contentFormats.text, 'mt-2')}>
            Order number: {order.orderNumber}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className={cn(contentFormats.global, contentFormats.h3, 'mb-4')}>Order Summary</h2>
          <ul className="divide-y divide-gray-200">
            {stripeSession.line_items?.data.map((item) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <p className={cn(contentFormats.global, contentFormats.text, 'font-medium')}>
                    {(item.price?.product as Stripe.Product).name}
                  </p>
                  <p
                    className={cn(
                      contentFormats.global,
                      contentFormats.text,
                      'text-sm text-gray-500',
                    )}
                  >
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className={cn(contentFormats.global, contentFormats.text)}>
                  {/* {formatPrice(item.amount_total / 100)} */}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <p className={cn(contentFormats.global, contentFormats.text, 'font-medium')}>Total</p>
            <p className={cn(contentFormats.global, contentFormats.text, 'font-medium')}>
              {/* {formatPrice(stripeSession.amount_total! / 100)} */}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className={cn(contentFormats.global, contentFormats.h3, 'mb-4')}>
            Payment Information
          </h2>
          <p className={cn(contentFormats.global, contentFormats.text)}>
            Payment Status: {stripeSession.payment_status}
          </p>
          <p className={cn(contentFormats.global, contentFormats.text)}>
            Payment Method: {stripeSession.payment_method_types?.[0]}
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className={cn(
              contentFormats.global,
              contentFormats.a,
              'inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600',
            )}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

const fetchStripeSession = async (slug: string): Promise<any | null> => {
  const cachedFetchStripeSession = unstable_cache(
    async (): Promise<any | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let product: any | null = null

      try {
        const { docs } = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        product = docs[0]
        const inCart: boolean = false
        product = { ...product, inCart } // set the inCart key so that browser cart can update
      } catch (error) {
        console.error(`Error fetching product: ${slug}`, error)
      } finally {
        return product // cant return Product coz inCart doesnt exist on type
      }
    },
    [`fetchProduct-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      tags: [`fetchProduct-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchStripeSession()
}

// Utility function to fetch product data from the Payload CMS
const fetchOrder = async (slug: string): Promise<any | null> => {
  const cachedFetchOrder = unstable_cache(
    async (): Promise<any | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let product: any | null = null

      try {
        const { docs } = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        product = docs[0]
        const inCart: boolean = false
        product = { ...product, inCart } // set the inCart key so that browser cart can update
      } catch (error) {
        console.error(`Error fetching order: ${slug}`, error)
      } finally {
        return product // cant return Product coz inCart doesnt exist on type
      }
    },
    [`fetchProduct-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      tags: [`fetchProduct-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchOrder()
}
