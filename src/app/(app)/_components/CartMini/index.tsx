'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '@app/_providers/Cart'
import { CMSLink } from '../CMSLink'
import { ShoppingCartIcon } from 'lucide-react'

export const MiniCart: React.FC = () => {
  const { cart } = useCart()

  if (!cart) return null

  return (
    <div className="relative group">
      <Link href="/shop/cart" className="flex items-center">
        <span className="mr-2">
          <svg
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
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cart.items && (
            <span className="absolute -top-2 -right-2 bg-green text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cart.items.length}
            </span>
          )}
        </span>
      </Link>
      <div className="absolute top-3 right-0 mt-2 w-64 bg-neutral-100 border border-solid shadow-xl rounded-sm hidden group-hover:block">
        <div className="px-4 py-6">
          <span className="text-lg font-semibold mb-2">Cart Summary</span>
          {cart.items?.slice(0, 3).map((item: any, index: number) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{item.product.title}</span>
              <span>
                {item.totals.itemTotal.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                })}
              </span>
            </div>
          ))}
          {cart.items && cart.items?.length > 3 && (
            <div className="text-sm text-gray-500">...and {cart.items?.length - 3} more items</div>
          )}
          <div className="my-4 font-semibold">
            Total:{' '}
            {cart.totals.cartTotal.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' })}
          </div>

          <CMSLink
            data={{
              label: 'View Cart',
              type: 'custom',
              url: '/shop/cart',
            }}
            className="!bg-green !text-white"
            look={{
              theme: 'light',
              type: 'button',
              size: 'medium',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: (
                  <ShoppingCartIcon
                    className="w-4 h-4 !text-white !stroke-white"
                    strokeWidth={1.25}
                  />
                ),
                iconPosition: 'right',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
