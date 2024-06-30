'use client'

import React, { useState } from 'react'
import { CMSLink } from '@app/_components/CMSLink'
import { XIcon, LoaderCircleIcon } from 'lucide-react'
import { removeProduct } from '@app/_providers/Cart/cartItemsActions'

export function RemoveFromCartButton({ cartItemId }: { cartItemId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRemoveFromCart = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await removeProduct(cartItemId)
      window.location.reload() // Refresh the page to reflect the changes
    } catch (e: any) {
      setError(e.message || 'Failed to remove product from cart. Please try again.')
      setIsLoading(false)
    }
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
        onClick: handleRemoveFromCart,
      }}
    />
  )
}
