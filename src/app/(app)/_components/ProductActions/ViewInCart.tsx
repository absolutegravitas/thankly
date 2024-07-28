/**
 * @file
 * @module components/ViewInCartButton
 * @description Component for displaying a button to view the cart
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { ChevronsRightIcon, LoaderCircleIcon } from 'lucide-react'

/**
 * @component
 * @description Renders a button to view the cart
 * @returns {JSX.Element}
 */
export function ViewInCartButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  /**
   * @function
   * @description Handles click event on the "View in Cart" button
   */
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
