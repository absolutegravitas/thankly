'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { ChevronsRightIcon, LoaderCircleIcon } from 'lucide-react'

export function ViewInCartButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleViewInOrder = async () => {
    setIsLoading(true)
    router.push('/shop/cart')
  }

  return (
    <CMSLink
      data={{
        label: isLoading ? 'Loading...' : 'View in Cart',
        type: 'custom',
        url: '#',
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
            <ChevronsRightIcon strokeWidth={1.25} />
          ),
          iconPosition: 'right',
        },
      }}
      actions={{
        onClick: handleViewInOrder,
      }}
    />
  )
}
