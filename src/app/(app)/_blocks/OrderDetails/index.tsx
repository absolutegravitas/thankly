'use client'

import React from 'react'
import { Order, Product, Media } from '@/payload-types'
import { format } from 'date-fns'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@app/_components/ui/card'
import { Button } from '@app/_components/ui/button'
import { Separator } from '@app/_components/ui/separator'
import Image from "next/legacy/image"

export default function OrderDetails({ order }: { order: Order }) {
  if (!order) {
    return (
      <Card>
        <CardContent>Error: Order details not available.</CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number | undefined) =>
    amount !== undefined
      ? new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount)
      : 'N/A'

  const getProductImage = (product: Product) => {
    if (product.media && product.media.length > 0) {
      const mediaItem = product.media[0].mediaItem as Media
      return mediaItem.url || '/placeholder-image.jpg'
    }
    return '/placeholder-image.jpg'
  }

  const customerDetails = order.billing || {}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-3xl">
        <CardHeader className="bg-muted/50 px-7 py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Tax Invoice / Order Confirmation</CardTitle>
              <CardDescription className="text-muted-foreground">
                Thank you for your order!
              </CardDescription>
            </div>
            {/* <Button variant="outline" size="icon" className="h-8 w-8">
              <PrinterIcon className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button> */}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 500"
              className="#mx-auto h-40 w-40 m-0"
            >
              <g
                transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path
                  d="M2930 3142 c-6 -2 -10 -172 -10 -478 l0 -474 95 0 95 0 0 110 c0 61
3 110 6 110 3 0 55 -49 116 -110 l110 -110 189 0 189 0 2 233 3 232 59 -105
c33 -58 81 -143 107 -189 28 -49 45 -89 40 -95 -4 -6 -49 -91 -100 -189 l-92
-177 116 0 115 0 51 103 c28 56 93 181 144 277 166 315 245 468 245 474 0 3
-50 6 -111 6 l-110 0 -57 -122 c-32 -68 -62 -134 -68 -147 -10 -23 -16 -14
-90 122 l-79 147 -87 0 -88 0 0 190 c0 105 -3 190 -7 190 -5 1 -46 2 -93 3
l-85 2 -3 -193 -2 -192 -108 0 -107 0 -95 -95 c-52 -52 -98 -95 -102 -95 -5 0
-8 128 -8 285 0 265 -1 285 -17 286 -10 0 -48 1 -86 2 -37 1 -72 1 -77 -1z
m600 -652 c0 -121 -3 -220 -8 -220 -4 0 -57 49 -117 110 l-109 109 109 111
c60 60 113 110 117 110 4 0 8 -99 8 -220z"
                />
                <path
                  d="M1010 2950 l0 -190 -55 0 -55 0 0 105 0 105 -100 0 -100 0 0 -105 0
-105 -40 0 -40 0 0 -75 0 -75 39 0 40 0 3 -147 c3 -131 6 -153 27 -196 17 -34
34 -53 64 -68 44 -23 71 -25 274 -14 l131 7 4 180 3 180 37 34 c28 25 47 34
74 34 91 0 104 -32 104 -255 l0 -175 100 0 100 0 0 77 0 77 28 -45 c37 -56 56
-73 117 -100 74 -33 166 -30 233 6 29 16 52 32 52 37 0 4 5 8 10 8 6 0 10 -13
10 -30 l0 -30 95 0 95 0 0 285 0 286 -97 -3 c-95 -3 -98 -4 -97 -25 1 -24 -10
-30 -22 -12 -15 26 -99 52 -164 52 -105 0 -187 -46 -236 -129 l-27 -46 -13 37
c-24 72 -85 116 -188 136 -61 11 -116 -2 -173 -42 l-43 -30 0 220 0 221 -95 0
-95 0 0 -190z m-1 -487 c0 -101 -3 -141 -9 -125 -8 20 -14 22 -44 17 -48 -10
-56 11 -56 144 l0 111 55 0 55 0 -1 -147z m969 139 c70 -21 109 -112 79 -184
-39 -92 -180 -103 -230 -19 -25 42 -23 121 5 156 35 45 90 62 146 47z"
                />
                <path
                  d="M2594 2766 c-23 -7 -58 -26 -78 -41 l-36 -27 0 31 0 31 -95 0 -95 0
0 -285 0 -285 94 0 94 0 4 181 3 181 37 34 c28 25 47 34 74 34 91 0 104 -32
104 -255 l0 -175 100 0 100 0 0 198 c0 108 -5 214 -11 235 -29 105 -182 179
-295 143z"
                />
              </g>
            </svg>
            <div className="text-right">
              <p className="text-sm">ABN: 12 345 678 901</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Order #:</span>
              <span>{order.orderNumber || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Date:</span>
              <span>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</span>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="font-medium mb-2">Customer Details:</h3>
              <p>
                {order.billing?.firstName} {order.billing?.lastName}
              </p>
              <p>{order.billing?.email}</p>
              {order.billing?.address && (
                <p>
                  {order.billing.address.addressLine1},
                  {order.billing.address.addressLine2 && ` ${order.billing.address.addressLine2},`}
                  {order.billing.address.city}, {order.billing.address.state}{' '}
                  {order.billing.address.postcode}
                </p>
              )}
              {order.billing?.orgName && <p>Organization: {order.billing.orgName}</p>}
              {order.billing?.orgId && <p>Organization ID: {order.billing.orgId}</p>}
            </div>
            <Separator className="my-4" />
            <div className="grid gap-2">
              <div className="font-medium">Items Ordered</div>
              <div className="grid gap-6">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start">
                        <Image
                          src={getProductImage(item.product as Product)}
                          alt={(item.product as Product).title}
                          width={80}
                          height={80}
                          className="object-cover mr-4"
                        />
                        <div>
                          <span className="font-medium">
                            {(item.product as Product).title} x {item.quantity}
                          </span>
                          {item.giftCard && (
                            <span className="block text-xs">
                              Gift Card: {item.giftCard.message}
                            </span>
                          )}
                          <span className="block text-xs mt-1">
                            Price: {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.price ? item.price * item.quantity : undefined)}
                      </span>
                    </div>
                    {/* {item.receiver && (
                      <div className="bg-muted p-2 rounded-md text-xs">
                        <p className="font-medium">Shipping Details:</p>
                        <p>
                          {item.receiver.firstName} {item.receiver.lastName}
                        </p>
                        <p>{item.receiver.address.addressLine1}</p>
                        {item.receiver.address.addressLine2 && (
                          <p>{item.receiver.address.addressLine2}</p>
                        )}
                        <p>
                          {item.receiver.address.city}, {item.receiver.address.state}{' '}
                          {item.receiver.address.postcode}
                        </p>
                        {item.receiver.delivery?.shippingMethod && (
                          <p>Shipping Method: {item.receiver.delivery.shippingMethod}</p>
                        )}
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(order.totals.cost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Shipping:</span>
                <span>{formatCurrency(order.totals.shipping || 0)}</span>
              </div>
              {order.totals.discount !== undefined && order.totals.discount !== null && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Discount:</span>
                  <span>{formatCurrency(order.totals.discount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(order.totals.total)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>GST Included:</span>
                <span>{formatCurrency(order.totals.total / 11)}</span>
              </div>
            </div>
            <div className="text-center text-muted-foreground mt-4">
              Thank you for your order! Your items will be shipped shortly.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PrinterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </svg>
  )
}
