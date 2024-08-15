// app/shop/order/OrderDetails.tsx
'use client'

import { Order } from '@/payload-types'

export default function OrderDetails({ order }: { order: Order }) {
  if (!order) {
    return <div>Error: Order details not available.</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Order #{order.orderNumber || 'N/A'}</h2>
      <div className="mb-4">
        <p className="font-semibold">
          Status: <span className="capitalize">{order.status || 'N/A'}</span>
        </p>
        <p className="font-semibold">Total: ${order.totals?.total.toFixed(2) || 'N/A'}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Billing Information</h3>
        <p>{order.billing?.name || 'N/A'}</p>
        <p>{order.billing?.email || 'N/A'}</p>
        <p>{order.billing?.address?.formattedAddress || 'N/A'}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Order Items</h3>
        {order.items && order.items.length > 0 ? (
          order.items.map((item, index) => (
            <div key={index} className="mb-4 border-b pb-4 last:border-b-0">
              <p className="font-semibold">
                {(typeof item.product != 'number' && item.product?.title) || 'Unknown Product'}
              </p>
              <p>Price: ${item.price?.toFixed(2) || 'N/A'}</p>
              <p>Quantity: {item.receivers?.length || 0}</p>
              {item.receivers && item.receivers.length > 0 ? (
                item.receivers.map((receiver, rIndex) => (
                  <div key={rIndex} className="ml-4 mt-2">
                    <p className="font-semibold">Receiver: {receiver.name || 'N/A'}</p>
                    <p>Message: {receiver.message || 'N/A'}</p>
                    {receiver.delivery?.tracking && (
                      <p>
                        Tracking:{' '}
                        <a
                          href={receiver.delivery.tracking.link || ''}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {receiver.delivery.tracking.id}
                        </a>
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="ml-4 mt-2">No receiver information available</p>
              )}
            </div>
          ))
        ) : (
          <p>No items in this order</p>
        )}
      </div>
    </div>
  )
}
