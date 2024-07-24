'use client'

import React, { useState } from 'react'
import { CMSLink } from '@app/_components/CMSLink'
import { XIcon, LoaderCircleIcon } from 'lucide-react'
// import { removeProduct } from '@app/_providers/Cart/orderItemsActions'
import { useOrder } from '../../_providers/Order'
import { useRouter } from 'next/navigation'

export function RemoveFromCartButton({ orderItemId }: { orderItemId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { removeProduct } = useOrder()
  const router = useRouter()

  const handleRemoveFromOrder = async () => {
    setIsLoading(true)
    setError(null)
    removeProduct(orderItemId)
    // try {
    //   await
    //   window.location.reload() // Refresh the page to reflect the changes
    // } catch (e: any) {
    //   setError(e.message || 'Failed to remove product from order. Please try again.')
    setIsLoading(false)
    router.refresh()
    // }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <CMSLink
      data={{
        label: '',
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
          content: isLoading ? (
            <LoaderCircleIcon className="animate-spin" strokeWidth={1.25} />
          ) : (
            <XIcon className="!ml-0" strokeWidth={1.25} />
          ),
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleRemoveFromOrder,
      }}
    />
  )
}
