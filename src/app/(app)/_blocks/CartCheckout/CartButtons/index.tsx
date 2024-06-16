'use client'
import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { Button } from '@app/_components/Button'
import { clearCart } from '@app/_providers/Cart'
import { revalidateCache } from '@/utilities/revalidateCache'

export function CartButtons() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <React.Fragment>
      {/* <Button
        // url="/shop"
        label={!isPending ? 'Clear Cart' : 'Clearing Cart... please wait'}
        appearance={'secondary'}
        fullWidth
        data-theme={'light'}
        icon="trash"
        onClick={async () => {
          startTransition(async () => {
            await clearCart()
            revalidateCache({ path: '/shop' })
            router.push('/shop')
          })
        }}
      />

      <Button
        // url="/shop"
        label={'Back to Shop'}
        appearance={'secondary'}
        fullWidth
        data-theme={'light'}
        icon="chevron"
        onClick={() => {
          // startTransition(async () => {
          revalidateCache({ path: '/shop' })
          router.push('/shop')
          // })
        }}
      />

      <Button
        // url="/shop"
        label={'Checkout'}
        appearance={'primary'}
        fullWidth
        data-theme={'light'}
        icon="chevron"
        onClick={() => {
          // startTransition(async () => {
          revalidateCache({ path: '/shop' })
          router.push('/shop')
          // })
        }}
      /> */}
    </React.Fragment>
  )
}

export function CartCheckout() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <React.Fragment>
      {/* <Button
        url="/checkout"
        label={!isPending ? 'Checkout' : 'Checking out... please wait'}
        appearance={'primary'}
        fullWidth
        data-theme={'light'}
        icon="chevron"
        className="justify-stretch w-full"
        onClick={async () => {
          startTransition(async () => {
            await clearCart()
            router.push('/checkout')
          })
        }}
      /> */}
    </React.Fragment>
  )
}
