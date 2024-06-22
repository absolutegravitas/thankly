'use client'

import React, { useTransition } from 'react'

import { CMSLink } from '@app/_components/CMSLink'
import { CopyIcon, TrashIcon, UserPlusIcon, XIcon } from 'lucide-react'

interface AddReceiverButtonProps {
  productId: string
  addReceiver: (productId: string, receiver: any) => Promise<void>
}

export const AddReceiverButton: React.FC<AddReceiverButtonProps> = ({ productId, addReceiver }) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const newReceiver = {
        id: `${Date.now()}`,
        firstName: 'John',
        lastName: 'Smith',
        message:
          'It was the best of times, it was the blurst of times. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id eleifend leo. Nullam aliquet, nisi at congue consectetur, massa ligula lacinia lorem.',
        addressLine1: '123 Fake St',
        addressLine2: null,
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        shippingOption: 'free',
        receiverPrice: null,
        receiverTotal: null,
        receiverShipping: null,
      }
      await addReceiver(productId, newReceiver)
    })
  }

  return (
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
  )
}

interface CopyReceiverButtonProps {
  cartItemId: string
  receiverId: string
  copyReceiver: (cartItemId: string, receiverId: string) => Promise<void>
}

export const CopyReceiverIcon: React.FC<CopyReceiverButtonProps> = ({
  cartItemId,
  receiverId,
  copyReceiver,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await copyReceiver(cartItemId, receiverId)
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
  cartItemId: string
  receiverId: string
  removeReceiver: (cartItemId: string, receiverId: string) => Promise<void>
}

export const RemoveReceiverIcon: React.FC<RemoveReceiverIconProps> = ({
  cartItemId,
  receiverId,
  removeReceiver,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await removeReceiver(cartItemId, receiverId)
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
  cartItemId: string
  removeProduct: (cartItemId: string) => Promise<void>
}

export const RemoveProductButton: React.FC<RemoveProductButtonProps> = ({
  cartItemId,
  removeProduct,
}) => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await removeProduct(cartItemId)
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
