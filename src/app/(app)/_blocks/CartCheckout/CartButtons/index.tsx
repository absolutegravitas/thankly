'use client'
import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { Button } from '@app/_components/Button'
import { clearCart } from '@app/_providers/Cart/actions'
import { revalidateCache } from '@/utilities/revalidateCache'
import { CMSLink } from '@app/_components/CMSLink'
import { ArrowBigLeft, ArrowLeftIcon, ShoppingBagIcon, ShoppingCartIcon, XIcon } from 'lucide-react'

export function CartButtons() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <React.Fragment>
      <CMSLink
        data={{
          label: !isPending ? 'Clear Cart' : 'Clearing Cart... please wait',
          // type: 'custom',
          // url: '/shop',
        }}
        look={{
          theme: 'light',
          type: 'button',
          size: 'medium',
          width: 'full',
          variant: 'blocks',
          icon: {
            content: <XIcon strokeWidth={1.25} />,
            iconPosition: 'right',
          },
        }}
        actions={{
          onClick: async () => {
            startTransition(async () => {
              await clearCart()
              revalidateCache({ path: '/shop' })
              router.push('/shop')
            })
          },
        }}
      />
      <CMSLink
        data={{
          label: 'Continue Shopping',
          type: 'custom',
          url: '/shop',
        }}
        look={{
          theme: 'light',
          type: 'button',
          size: 'medium',
          width: 'full',
          variant: 'blocks',
          icon: {
            content: <ArrowLeftIcon strokeWidth={1.25} />,
            iconPosition: 'right',
          },
        }}
      />
      {/* <CMSLink
        className="dark"
        data={{
          label: 'Checkout',
          type: 'custom',
          url: '/shop/checkout',
        }}
        look={{
          theme: 'dark',
          type: 'button',
          size: 'medium',
          width: 'wide',
          variant: 'blocks',
          icon: {
            content: <ShoppingCartIcon strokeWidth={1.25} />,
            iconPosition: 'right',
          },
        }}
      /> */}
    </React.Fragment>
  )
}
