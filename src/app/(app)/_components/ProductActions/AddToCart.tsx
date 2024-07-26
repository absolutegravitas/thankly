'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { PlusIcon, LoaderCircleIcon } from 'lucide-react'
import { Product } from '@payload-types'
import { useOrder } from '@app/_providers/Order'

export function AddToCartButton({ product }: { product: Product }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { addProduct } = useOrder()

  const handleAddToOrder = async () => {
    setIsLoading(true)
    setError(null)
    try {
      addProduct(
        product,
        Math.max(
          0,
          Math.min(product.prices.basePrice ?? Infinity, product.prices.salePrice ?? Infinity),
        ),
      )
      router.push('/shop/cart')
    } catch (e: any) {
      setError(e.message || 'Failed to add product to order. Please try again.')
      setIsLoading(false)
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <CMSLink
      data={{
        label: isLoading ? 'Adding...' : 'Add to Cart',
        type: 'custom',
        url: '/shop/cart',
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
            <PlusIcon strokeWidth={1.25} />
          ),
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleAddToOrder,
      }}
    />
  )
}
