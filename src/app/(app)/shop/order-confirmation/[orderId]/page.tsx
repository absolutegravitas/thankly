import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import type { Order } from '@payload-types'

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  const order: Order | null = await payload.findByID({
    collection: 'orders',
    id: params.orderId,
  })

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="mb-4">Thank you for your order!</p>
        <p className="mb-2">Order Number: {order.orderNumber}</p>
        <p className="mb-2">Status: {order.status}</p>
        <p className="mb-4">Total: ${order.orderTotal?.toFixed(2)}</p>
        <h2 className="text-xl font-bold mb-2">Order Items:</h2>
        <ul>
          {order.items?.map((item, index) => (
            <li key={index} className="mb-2">
              {/* {item.product.title} - ${item.itemTotal?.toFixed(2)} */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
