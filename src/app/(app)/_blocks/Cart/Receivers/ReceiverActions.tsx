'use client'

import React, { useState, useTransition } from 'react'

import { CMSLink } from '@app/_components/CMSLink'
import { CopyIcon, TrashIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { useCart } from '@/app/(app)/_providers/Cart'
import { CartItem } from '@/app/(app)/_providers/Cart/reducer'
import { useRouter } from 'next/navigation'

// This component renders a button to add a new receiver for a specific product.
interface AddReceiverProps {
  productId: number | string // The ID of the product for which a receiver needs to be added
}

export const AddReceiver: React.FC<AddReceiverProps> = ({ productId }) => {
  const [isPending, startTransition] = useTransition() // State for tracking the pending state of an asynchronous operation
  const [error, setError] = useState<string | null>(null) // State for storing any error messages
  const { addReceiver, cart } = useCart() // Destructuring the `addReceiver` function and `cart` object from the `useCart` hook

  // Function to handle the click event for adding a new receiver
  const handleClick = () => {
    startTransition(() => {
      // Find the cart item corresponding to the given `productId`
      const cartItem = cart.items?.find(
        (item) => typeof item.product === 'object' && item.product.id === productId,
      )
      // Determine the product type based on the cart item
      const productType =
        typeof cartItem?.product === 'object' ? cartItem.product.productType : null

      // Set the default shipping method based on the product type
      const defaultShippingMethod =
        productType === 'gift' ? 'standardParcel' : productType === 'card' ? 'standardMail' : null

      // Create a new receiver object with default values
      const newReceiver: NonNullable<CartItem['receivers']>[number] = {
        id: `${Date.now()}`, // Generate a unique ID for the receiver
        name: null,
        message: null,
        delivery: {
          address: { addressLine1: null },
          shippingMethod: defaultShippingMethod,
        },
        totals: { subTotal: 0, cost: 0, shipping: 0 },
      }

      try {
        addReceiver(productId, newReceiver) // Add the new receiver to the cart
        setError(null) // Reset any previous error
      } catch (error) {
        console.error('Error adding receiver:', error)
        setError('Failed to add receiver. Please try again.') // Set an error message
      }
    })
  }

  return (
    <>
      <CMSLink
        data={{
          label: 'Add Receiver',
        }}
        look={{
          theme: 'light',
          type: 'button',
          size: 'small',
          width: 'wide',
          variant: 'blocks',
          icon: {
            content: <UserPlusIcon strokeWidth={1.25} />,
            iconPosition: 'right',
          },
        }}
        actions={{
          onClick: handleClick,
        }}
        pending={isPending}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </>
  )
}

// This component renders a button to copy an existing receiver for a specific cart item.
interface CopyReceiverProps {
  cartItemId: string | number // The ID of the cart item for which the receiver needs to be copied
  receiverId: string // The ID of the receiver to be copied
}
export const CopyReceiver: React.FC<CopyReceiverProps> = ({ cartItemId, receiverId }) => {
  const [isPending, startTransition] = useTransition() // State for tracking the pending state of an asynchronous operation
  const [error, setError] = useState<string | null>(null) // State for storing any error messages
  const { copyReceiver } = useCart() // Destructuring the `copyReceiver` function from the `useCart` hook

  // Function to handle the click event for copying a receiver
  const handleClick = () => {
    startTransition(() => {
      try {
        copyReceiver(cartItemId, receiverId) // Copy the receiver for the given cart item and receiver IDs
        setError(null) // Reset any previous error
      } catch (error) {
        console.error('Error copying receiver:', error)
        setError('Failed to copy receiver. Please try again.') // Set an error message
      }
    })
  }

  return (
    <div className="relative">
      <CopyIcon
        className={`h-5 w-5 sm:h-5 sm:w-5 cursor-pointer hover:text-green transition-colors duration-200 ${
          isPending ? 'opacity-50' : ''
        }`}
        aria-hidden="true"
        strokeWidth={1.4}
        onClick={handleClick}
      />
    </div>
  )
}

// This component renders a button to remove an existing receiver from a specific cart item.
interface RemoveReceiverProps {
  cartItemId: string | number // The ID of the cart item from which the receiver needs to be removed
  receiverId: string // The ID of the receiver to be removed
  removeReceiver: (productId: string | number, receiverId: string) => void // Function to remove a receiver, matching the signature from the CartContext
}

export const RemoveReceiver: React.FC<RemoveReceiverProps> = ({
  cartItemId,
  receiverId,
  removeReceiver,
}) => {
  const [isPending, startTransition] = useTransition() // State for tracking the pending state of an asynchronous operation

  // Function to handle the click event for removing a receiver
  const handleClick = () => {
    startTransition(() => {
      removeReceiver(cartItemId, receiverId) // Remove the receiver for the given cart item and receiver IDs
    })
  }

  return (
    <TrashIcon
      className={`h-5 w-5 sm:h-5 sm:w-5  cursor-pointer hover:text-green hover:animate-pulse ${
        isPending ? 'opacity-50' : ''
      }`}
      aria-hidden="true"
      strokeWidth={1.4}
      onClick={handleClick}
    />
  )
}

// This component renders a button to remove a product from the cart.
interface RemoveProductProps {
  productId: string | number // The ID of the product to be removed
}

export const RemoveProduct: React.FC<RemoveProductProps> = ({ productId }) => {
  const [isPending, startTransition] = useTransition() // State for tracking the pending state of an asynchronous operation
  const { removeProduct } = useCart() // Destructuring the `removeProduct` function from the `useCart` hook
  const router = useRouter() // Accessing the Next.js router instance

  // Function to handle the click event for removing a product
  const handleClick = () => {
    startTransition(() => {
      removeProduct(productId) // Remove the product from the cart
      router.refresh() // Refresh the current page after removing the product
    })
  }

  return (
    <CMSLink
      data={{
        label: 'Remove Thankly',
      }}
      look={{
        theme: 'light',
        type: 'button',
        size: 'small',
        width: 'narrow',
        variant: 'blocks',
        icon: {
          content: <TrashIcon strokeWidth={1.25} />,
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleClick,
      }}
      pending={isPending}
    />
  )
}