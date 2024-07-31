'use client'

import React, { useState, useTransition } from 'react'

import { CMSLink } from '@app/_components/CMSLink'
import { CopyIcon, TrashIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { useCart } from '@/app/(app)/_providers/Cart'
import { CartItem } from '@/app/(app)/_providers/Cart/reducer'
import { useRouter } from 'next/navigation'

interface AddReceiverProps {
  productId: number | string
}

export const AddReceiver: React.FC<AddReceiverProps> = ({ productId }) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { addReceiver, cart } = useCart()

  const handleClick = () => {
    startTransition(() => {
      const cartItem = cart.items?.find(
        (item) => typeof item.product === 'object' && item.product.id === productId,
      )
      const productType =
        typeof cartItem?.product === 'object' ? cartItem.product.productType : null

      const defaultShippingMethod =
        productType === 'gift' ? 'standardParcel' : productType === 'card' ? 'standardMail' : null

      const newReceiver: NonNullable<CartItem['receivers']>[number] = {
        id: `${Date.now()}`,
        name: null,
        message: null,
        delivery: {
          address: { addressLine1: null },
          shippingMethod: defaultShippingMethod,
        },
        totals: { subTotal: 0, cost: 0, shipping: 0 },
      }

      try {
        addReceiver(productId, newReceiver)
        setError(null)
      } catch (error) {
        console.error('Error adding receiver:', error)
        setError('Failed to add receiver. Please try again.')
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

interface CopyReceiverProps {
  cartItemId: string | number
  receiverId: string
}
export const CopyReceiver: React.FC<CopyReceiverProps> = ({ cartItemId, receiverId }) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { copyReceiver } = useCart()

  const handleClick = () => {
    startTransition(() => {
      try {
        copyReceiver(cartItemId, receiverId)
        setError(null)
      } catch (error) {
        console.error('Error copying receiver:', error)
        setError('Failed to copy receiver. Please try again.')
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

interface RemoveReceiverProps {
  cartItemId: string | number // Changed from just string to string | number
  receiverId: string
  removeReceiver: (productId: string | number, receiverId: string) => void // Matches CartContext
}

export const RemoveReceiver: React.FC<RemoveReceiverProps> = ({
  cartItemId,
  receiverId,
  removeReceiver,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      removeReceiver(cartItemId, receiverId)
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

interface RemoveProductProps {
  productId: string | number
}

export const RemoveProduct: React.FC<RemoveProductProps> = ({ productId }) => {
  const [isPending, startTransition] = useTransition()
  const { removeProduct } = useCart()
  const router = useRouter()

  const handleClick = () => {
    startTransition(() => {
      removeProduct(productId)
      router.refresh()
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
