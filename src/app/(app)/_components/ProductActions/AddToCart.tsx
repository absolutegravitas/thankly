// This file contains a React component that renders a button to add a product to the shopping cart.
// It uses the Next.js App Router pattern and server components.
//
// The component fetches data from the Payload CMS and displays a button with different states based on the loading or error state.
// When the button is clicked, it adds the product to the shopping cart and redirects the user to the cart page.
//
// Performance considerations:
// - Rendering the button component itself should be efficient as it's a presentational component.
// - However, adding products to the cart and fetching data from the CMS could potentially impact performance depending on the implementation and data size.
//
// Accessibility (a11y) considerations:
// - The button component itself doesn't have any specific accessibility features implemented, but it should be accessible based on the underlying CMSLink component implementation.

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { PlusIcon, LoaderCircleIcon } from 'lucide-react'
import { Product } from '@payload-types'
import { useOrder } from '@app/_providers/Order'

// Interface defining the props for the AddToCartButton component
interface AddToCartButtonProps {
  product: Product
}

// AddToCartButton component
export function AddToCartButton({ product }: AddToCartButtonProps) {
  // State for loading and error handling
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Hooks for navigation and managing the order state
  const router = useRouter()
  const { addProduct } = useOrder()

  // Function to handle adding the product to the order
  const handleAddToOrder = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Determine the price to use based on base and sale prices
      const priceToUse = Math.max(
        0,
        Math.min(product.prices.basePrice ?? Infinity, product.prices.salePrice ?? Infinity),
      )

      // Add the product to the order
      addProduct(product, priceToUse)

      // Navigate to the cart page
      router.push('/shop/cart')
    } catch (e: any) {
      // Handle errors
      setError(e.message || 'Failed to add product to order. Please try again.')
      setIsLoading(false)
    }
  }

  // Render an error message if there's an error
  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  // Render the CMSLink component with different states based on loading or not
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
