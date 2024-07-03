'use client'
import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { Button } from '@app/_components/Button'
import { clearCart } from '@/app/(app)/_providers/Cart/cartActions'
import { revalidateCache } from '@/utilities/revalidateCache'
import { CMSLink } from '@app/_components/CMSLink'
import { ArrowLeftIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

export function CartButtons() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex flex-col gap-4 pt-10">
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

      <Link href="/shop" className="flex items-center justify-center">
        &larr;{` Continue Shopping`}
      </Link>
      {/* <CMSLink
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
      /> */}
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
    </div>
  )
}
