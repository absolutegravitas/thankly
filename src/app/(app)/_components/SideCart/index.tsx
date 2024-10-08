'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useCart } from '../../_providers/Cart'

interface CartItem {
  id: number
  name: string
  price: number
  recipient: string
  message: string
  quantity: number
  image: string
}

export default function SideCart() {
  const { isSideCartOpen, openSideCart, closeSideCart } = useCart()
  // const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'The Happy Chappy',
      price: 89,
      recipient: 'Alex',
      message: 'I love you, Love Kathy',
      quantity: 1,
      image: '/placeholder.svg?height=100&width=100',
    },
    {
      id: 2,
      name: 'The Happy Chappy',
      price: 89,
      recipient: 'Mochi',
      message: 'I love you Mochi from Mum & Dad',
      quantity: 1,
      image: '/placeholder.svg?height=100&width=100',
    },
  ])

  // const toggleCart = () => setIsOpen(!isOpen)

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item,
      ),
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
        {/* <button
          onClick={toggleCart}
          className="fixed top-4 right-4 z-50 bg-black text-white p-2 rounded"
        >
          Open Cart
        </button> */}

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
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-black">Your Gifts.</h2>
                    <button onClick={closeSideCart} className="text-gray-500 hover:text-gray-700">
                      <X size={24} />
                    </button>
                  </div>
                  {cartItems.map((item) => (
                    <div key={item.id} className="mb-4 pb-4 border-b">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">${item.price}</p>
                          <p className="text-sm">To: {item.recipient}</p>
                          <p className="text-sm">Message: {item.message}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Minus size={20} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Subtotal</span>
                      <span className="font-semibold text-2xl">${subtotal}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Shipping calculated at checkout</p>
                    <button className="w-full bg-black text-white py-3 rounded font-semibold">
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
