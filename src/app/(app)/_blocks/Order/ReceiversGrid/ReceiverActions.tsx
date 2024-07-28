'use client'

import React, { useState, useTransition } from 'react'

import { CMSLink } from '@app/_components/CMSLink'
import { CopyIcon, TrashIcon, UserPlusIcon, XIcon } from 'lucide-react'
import { useOrder } from '@app/_providers/Order'
import { OrderItem } from '@app/_providers/Order/reducer'
import { useRouter } from 'next/navigation'

interface AddReceiverButtonProps {
  productId: number | string
}

export const AddReceiverButton: React.FC<AddReceiverButtonProps> = ({ productId }) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { addReceiver, order } = useOrder()

  const handleClick = () => {
    startTransition(() => {
      const orderItem = order.items?.find(
        (item) => typeof item.product === 'object' && item.product.id === productId,
      )
      const productType =
        typeof orderItem?.product === 'object' ? orderItem.product.productType : null

      const defaultShippingMethod =
        productType === 'gift' ? 'standardParcel' : productType === 'card' ? 'standardMail' : null

      const newReceiver: NonNullable<OrderItem['receivers']>[number] = {
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
  orderItemId: string | number
  receiverId: string
}
export const CopyReceiverIcon: React.FC<CopyReceiverIconProps> = ({ orderItemId, receiverId }) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { copyReceiver } = useOrder()

  const handleClick = () => {
    startTransition(() => {
      try {
        copyReceiver(orderItemId, receiverId)
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

interface RemoveReceiverIconProps {
  orderItemId: string | number // Changed from just string to string | number
  receiverId: string
  removeReceiver: (productId: string | number, receiverId: string) => void // Matches OrderContext
}

export const RemoveReceiverIcon: React.FC<RemoveReceiverIconProps> = ({
  orderItemId,
  receiverId,
  removeReceiver,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(() => {
      removeReceiver(orderItemId, receiverId)
    })
  }

  return (
    <XIcon
      className={`h-5 w-5 sm:h-5 sm:w-5  cursor-pointer hover:text-green hover:animate-pulse ${
        isPending ? 'opacity-50' : ''
      }`}
      aria-hidden="true"
      strokeWidth={1.4}
      onClick={handleClick}
    />
  )
}

interface RemoveProductButtonProps {
  orderItemId: string | number
}

export const RemoveProductButton: React.FC<RemoveProductButtonProps> = ({ orderItemId }) => {
  const [isPending, startTransition] = useTransition()
  const { removeProduct } = useOrder()
  const router = useRouter()

  const handleClick = () => {
    startTransition(() => {
      removeProduct(orderItemId)
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
