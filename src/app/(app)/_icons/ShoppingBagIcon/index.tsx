import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCart } from '@app/_providers/Cart/cartActions'

const ShoppingBagIcon = () => {
  const [itemCount, setItemCount] = useState(0)

  const fetchCartItems = async () => {
    const cart = await getCart()
    if (cart && cart.items) {
      setItemCount(cart.items.length)
    }
  }

  useEffect(() => {
    fetchCartItems()

    // Set up an interval to refresh the cart data every 30 seconds
    const intervalId = setInterval(fetchCartItems, 30000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  return (
    <Link href="/shop/cart" prefetch={false} className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {itemCount}
        </span>
      )}
    </Link>
  )
}

export default ShoppingBagIcon
