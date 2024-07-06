'use client'

import React, { useState, useTransition } from 'react'

import { CMSLink } from '@app/_components/CMSLink'
import { CopyIcon, TrashIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { useCart } from '@app/_providers/Cart'
import { CartItem } from '@/app/(app)/_providers/Cart/reducer'
import { useRouter } from 'next/navigation'

interface AddReceiverButtonProps {
  productId: number | string
  addReceiver: (
    productId: number | string,
    receiver: NonNullable<CartItem['receivers']>[number],
  ) => void
}

export const AddReceiverButton: React.FC<AddReceiverButtonProps> = ({ productId, addReceiver }) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    startTransition(() => {
      const newReceiver: NonNullable<CartItem['receivers']>[number] = {
        id: `${Date.now()}`,
        name: 'John Smith',
        message: 'Add a message with your thankly here...',
        addressLine1: 'Add delivery address here...',
        addressLine2: null,
        city: null,
        state: null,
        postcode: null,
        shippingMethod: null,
        totals: {
          receiverTotal: 0,
          receiverThankly: 0,
          receiverShipping: 0,
        },
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
          width: 'narrow',
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

interface CopyReceiverIconProps {
  cartItemId: string | number
  receiverId: string
  copyReceiver: (productId: string | number, receiverId: string) => void
}

export const CopyReceiverIcon: React.FC<CopyReceiverIconProps> = ({
  cartItemId,
  receiverId,
  copyReceiver,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      copyReceiver(cartItemId, receiverId)
    })
  }

  return (
    <CopyIcon
      className={`h-5 w-5 cursor-pointer hover:text-green hover:animate-pulse ${
        isPending ? 'opacity-50' : ''
      }`}
      aria-hidden="true"
      strokeWidth={1.4}
      onClick={handleClick}
    />
  )
}

interface RemoveReceiverIconProps {
  cartItemId: string | number // Changed from just string to string | number
  receiverId: string
  removeReceiver: (productId: string | number, receiverId: string) => void // Matches CartContext
}

export const RemoveReceiverIcon: React.FC<RemoveReceiverIconProps> = ({
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
    <XIcon
      className={`h-5 w-5 cursor-pointer hover:text-green hover:animate-pulse ${
        isPending ? 'opacity-50' : ''
      }`}
      aria-hidden="true"
      strokeWidth={1.4}
      onClick={handleClick}
    />
  )
}

interface RemoveProductButtonProps {
  cartItemId: string | number
}

export const RemoveProductButton: React.FC<RemoveProductButtonProps> = ({ cartItemId }) => {
  const [isPending, startTransition] = useTransition()
  const { removeProduct } = useCart()
  const router = useRouter()

  const handleClick = () => {
    startTransition(() => {
      removeProduct(cartItemId)
      router.refresh()
      // router.push('/shop/cart')
    })
  }

  return (
    <CMSLink
      data={{
        label: 'Delete Thankly',
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
