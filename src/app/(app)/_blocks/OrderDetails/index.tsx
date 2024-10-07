'use client'

import React, { useEffect } from 'react'
import { Order, Product } from '@/payload-types'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@app/_components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/_components/ui/table'
import { useCart } from '../../_providers/Cart'

export default function OrderDetails({ order }: { order: Order }) {
  const { clearCart } = useCart()

  if (!order) {
    return (
      <Card>
        <CardContent>Error: Order details not available.</CardContent>
      </Card>
    )
  }

  useEffect(() => {
    clearCart()
  }, [])

  const formatCurrency = (amount: number | undefined) =>
    amount !== undefined
      ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount)
      : 'N/A'

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Tax Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Order #{order.orderNumber || 'N/A'}</h2>
            <p>Date: {format(new Date(order.createdAt), 'dd/MM/yyyy')}</p>
            <p>ABN: 12 345 678 901</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Your Company Name</p>
            <p>123 Business St</p>
            <p>Sydney, NSW 2000</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Bill To</h3>
          <p>
            {order.billing?.firstName} {order.billing?.lastName}
          </p>
          <p>{order.billing?.email}</p>
          <p>{order.billing?.address?.addressLine1}</p>
          {order.billing?.address?.addressLine2 && <p>{order.billing.address.addressLine2}</p>}
          <p>
            {order.billing?.address?.city}, {order.billing?.address?.state}{' '}
            {order.billing?.address?.postcode}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {(item.product as Product)?.title || 'Unknown Product'}
                  {item.giftCard && (
                    <span className="block text-sm text-muted-foreground">
                      Gift Card: {item.giftCard.message}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.price ? item.price * item.quantity : undefined)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end mt-6">
          <div className="text-right">
            <p>Subtotal: {formatCurrency(order.totals.cost)}</p>
            <p>Shipping: {formatCurrency(order.totals.shipping || 0)}</p>
            {order.totals.discount !== undefined && order.totals.discount !== null && (
              <p>Discount: {formatCurrency(order.totals.discount)}</p>
            )}
            <p className="font-semibold">Total: {formatCurrency(order.totals.total)}</p>
            <p className="text-sm text-muted-foreground">
              GST Included: {formatCurrency(order.totals.total / 11)}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Shipping Details</h3>
          {order.receivers?.map((receiver, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="font-semibold">
                Receiver: {receiver.firstName} {receiver.lastName}
              </p>
              <p>{receiver.address.addressLine1}</p>
              {receiver.address.addressLine2 && <p>{receiver.address.addressLine2}</p>}
              <p>
                {receiver.address.city}, {receiver.address.state} {receiver.address.postcode}
              </p>
              {receiver.delivery?.tracking && (
                <p>
                  Tracking:{' '}
                  <a
                    href={receiver.delivery.tracking.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {receiver.delivery.tracking.id}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          <p>Thank you for your business!</p>
          <p>This invoice was issued by Your Company Name, ABN: 12 345 678 901</p>
        </div>
      </CardContent>
    </Card>
  )
}
