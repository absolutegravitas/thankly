'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { PlusIcon, LoaderCircleIcon } from 'lucide-react'
import { addProduct } from '@app/_providers/Cart/cartItemsActions'
import { Product } from '@payload-types'

export function AddToCartButton({ product }: { product: Product }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // console.log('produt to add', product)
      await addProduct(product)
      router.push('/shop/cart')
    } catch (e: any) {
      setError(e.message || 'Failed to add product to cart. Please try again.')
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
        onClick: handleAddToCart,
      }}
    />
  )
}
