'use client'

import React, { useEffect, useState } from 'react'
import { Order } from '@/payload-types'
import { format } from 'date-fns'
import { Button } from '@/app/(app)/_components/ui/button'
import { Card, CardContent } from '@/app/(app)/_components/ui/card'
import { Separator } from '@/app/(app)/_components/ui/separator'

interface OrderHistoryProps {
  fetchUserOrders: (userId: string) => Promise<Order[]>
  userId: string
}

export default function OrderHistory({ fetchUserOrders, userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await fetchUserOrders(userId)
        setOrders(userOrders)
        if (userOrders.length > 0) {
          setSelectedOrder(userOrders[0])
        }
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [fetchUserOrders, userId])

  if (loading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left-hand side: Order list */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardContent className="p-4">
                {orders.map((order) => (
                  <Button
                    key={order.id}
                    variant={selectedOrder?.id === order.id ? 'default' : 'outline'}
                    className="w-full mb-2 justify-between"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <span>Order #{order.orderNumber}</span>
                    <span>${order.totals.total.toFixed(2)}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right-hand side: Order details */}
          <div className="w-full md:w-2/3">
            {selectedOrder ? (
              <OrderDetails order={selectedOrder} />
            ) : (
              <p>Select an order to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderDetails({ order }: { order: Order }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Order #{order.orderNumber}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 w-20 h-20">
                  {typeof item.product === 'object' &&
                    item.product.media &&
                    item.product.media[0] && (
                      <img
                        src={(item.product.media[0] as { url: string })?.url || ''}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                </div>
                <div>
                  <p className="font-medium">
                    {typeof item.product === 'object' ? item.product.title : 'Product'}
                  </p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Add-ons:{' '}
                      {item.addOns
                        .map((addon) => (typeof addon === 'object' ? addon.title : 'Add-on'))
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Order Information</h3>
            <p>Date: {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
            <p>Status: {order.status}</p>
            <Separator className="my-4" />
            <h3 className="font-semibold mb-2">Billing Information</h3>
            {order.billing && (
              <div className="text-sm">
                <p>
                  {order.billing.firstName} {order.billing.lastName}
                </p>
                <p>{order.billing.email}</p>

                {/* {order.billing.orgName && <p>Organization: {order.billing.orgName}</p>} */}
                {order.billing.address && (
                  <p>
                    {order.billing.address.addressLine1},
                    {order.billing.address.addressLine2 &&
                      `${order.billing.address.addressLine2}, `}
                    {order.billing.address.city}, {order.billing.address.state}{' '}
                    {order.billing.address.postcode}
                  </p>
                )}
              </div>
            )}
            <Separator className="my-4" />
            <OrderSummary order={order} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OrderSummary({ order }: { order: Order }) {
  return (
    <>
      <h3 className="font-semibold mb-2">Order Summary</h3>
      <div className="text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${order.totals.cost.toFixed(2)}</span>
        </div>
        {order.totals.shipping !== undefined &&
          order.totals.shipping !== null &&
          order.totals.shipping !== 0 && (
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${order.totals.shipping.toFixed(2)}</span>
            </div>
          )}
        {order.totals.discount !== undefined &&
          order.totals.discount !== null &&
          order.totals.discount !== 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-${order.totals.discount.toFixed(2)}</span>
            </div>
          )}
        <Separator className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${order.totals.total.toFixed(2)}</span>
        </div>
      </div>
    </>
  )
}
