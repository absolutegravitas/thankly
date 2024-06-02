// page.tsx
import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
// import CartClient from './page.client'

// Dummy function to simulate fetching the cart
const fetchCart = async (): Promise<{ items: any[] }> => {
  // Simulate an API call
  return {
    items: [
      // Sample item structure
      { id: '1', name: 'Product 1', price: 100 },
      { id: '2', name: 'Product 2', price: 200 },
    ],
  }
}

export default async function CartPage() {
  const { isEnabled: isDraftMode } = draftMode()

  // let items: any[] = []

  // try {
  //   const result = await fetchCart()
  //   if (result) {
  //     items = result.items
  //   }
  // } catch (error) {
  //   console.error('Failed to fetch cart:', error)
  //   return notFound()
  // }

  // if (!items || items.length === 0) {
  //   return (
  //     <div>
  //       <h1>Cart Page</h1>
  //       <p>There are no items in the cart.</p>
  //     </div>
  //   )
  // }

  return <></>
}
