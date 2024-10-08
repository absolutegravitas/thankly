'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useCart } from '../../_providers/Cart'
import ProductThumbnail from '../../_blocks/Cart/ProductThumbnail'
import { Product } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { capitalize } from 'lodash'

// interface CartItem {
//   id: number
//   name: string
//   price: number
//   recipient: string
//   message: string
//   quantity: number
//   image: string
// }

export default function SideCart() {
  const { isSideCartOpen, openSideCart, closeSideCart, cart, updateQuantity, removeCartItem } =
    useCart()
  const router = useRouter()

  const checkout = () => {
    closeSideCart()
    router.push('/cart')
  }

  return (
    <>
      <Button
        onClick={openSideCart}
        className="relative p-2 text-muted-foreground transition-colors hover:text-foreground bg-transparent hover:bg-transparent mr-2"
      >
        <ShoppingCartIcon className="h-6 w-6" />
        <span className="sr-only">Cart</span>
        <div
          className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground ${
            0 === 0 ? 'hidden' : ''
          }`}
        >
          {0}
        </div>
      </Button>

      <div className="relative min-h-screen">
        <AnimatePresence>
          {isSideCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-40"
                onClick={closeSideCart}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-black">Your Gifts.</h2>
                    <button onClick={closeSideCart} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto pr-4">
                    {cart.items.map((item, index) => (
                      <div key={index} className="mb-4 pb-4 pt-4 border-b text-black">
                        <div className="flex gap-4">
                          <div className="flex-none w-16 h-16">
                            <ProductThumbnail cartItem={item} />
                          </div>
                          <div className="flex-grow">
                            <div className="grid grid-cols-[1fr_auto] gap-4">
                              <div className="text-left">
                                <h3 className="text-left font-semibold">
                                  {(item.product as Product).title}
                                </h3>
                                <h3 className="text-sm">{`$${item.price}`}</h3>
                              </div>
                              <h3 className="text-right font-semibold">
                                ${item.price * item.quantity}
                              </h3>
                            </div>
                            {item.receiverId &&
                              (() => {
                                const receiver = cart.receivers?.find(
                                  (r) => r.receiverId === item.receiverId,
                                )
                                return receiver ? (
                                  <p className="text-xs ">
                                    Deliver to: {receiver.firstName} {receiver.lastName}
                                  </p>
                                ) : null
                              })()}
                            {item.giftCard.message.length > 0 && (
                              <>
                                <p className="text-xs pt-2">Message: {item.giftCard.message}</p>
                                <p className="text-xs pt-2">
                                  Writing style: {capitalize(item.giftCard.writingStyle)}
                                </p>
                              </>
                            )}
                            <div className="flex items-center space-x-4 pt-4">
                              <div className="flex items-center justify-center space-x-4 p-2 bg-white border border-grey-800">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(item.itemId, item.quantity - 1)
                                    } else {
                                      removeCartItem(item.itemId)
                                    }
                                  }}
                                  className="text-gray-500 hover:text-gray-700 transition-colors"
                                  aria-label="Decrease"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-semibold text-gray-700 w-8 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                                  className="text-gray-500 hover:text-gray-700 transition-colors"
                                  aria-label="Increase"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                onClick={() => removeCartItem(item.itemId)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-black">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Subtotal</span>
                      <span className="font-semibold text-2xl">${cart.totals.cost}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Shipping calculated at checkout</p>
                    <button
                      className="w-full bg-black text-white py-3 rounded font-semibold"
                      onClick={checkout}
                    >
                      CHECKOUT
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function ShoppingCartIcon(props: any) {
  return (
    <svg
      {...props}
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
