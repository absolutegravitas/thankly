import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react'
import { Cart, Order, Product } from '@/payload-types'
import { CartItem, cartReducer, CartAction } from './reducer'
import { debounce } from 'lodash'
import { auth } from '@/utilities/auth'

// Type aliases for common types used throughout the file
type Receiver = NonNullable<CartItem['receivers']>[number]
type UpdateReceiverFields = Partial<Omit<Receiver, 'id' | 'totals' | 'delivery'>> & {
  delivery?: Partial<Receiver['delivery']>
}

// Interface defining the CartContext shape
// exposes objects and methods for use on the client
export type CartContext = {
  cart: Cart

  // checking methods
  hasInitializedCart: boolean
  cartIsEmpty: boolean
  isProductInCart: (productId: string | number) => boolean
  validateCart: () => boolean

  // cart actions
  addProduct: (product: Product, price: number) => void
  removeProduct: (productId: number | string) => void
  addReceiver: (
    productId: number | string,
    receiver: NonNullable<CartItem['receivers']>[number],
  ) => void
  updateReceiver: (
    productId: number | string,
    receiverId: string,
    updatedFields: UpdateReceiverFields,
  ) => void
  removeReceiver: (productId: number | string, receiverId: string) => void
  copyReceiver: (productId: number | string, receiverId: string) => void

  // convertCartToOrder: () => Promise<Order | null>
  clearCart: () => void
}

const Context = createContext<CartContext | undefined>(undefined)

const debouncedUpdateLocalStorage = debounce((cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}, 300)

// Custom hook to access the CartContext
export const useCart = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

let lastTimestamp = 0
let counter = 1

function generateCartNumber() {
  const now = Date.now()

  if (now === lastTimestamp) {
    counter++
  } else {
    counter = 1
    lastTimestamp = now
  }

  const timestampPart = now.toString().slice(-8) // Last 8 digits of timestamp
  const counterPart = counter.toString().padStart(3, '0') // 4-digit counter

  return `${timestampPart}-${counterPart}`
}

// CartProvider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state and reducer
  const [cart, dispatchCart] = useReducer<React.Reducer<Cart, CartAction>>(cartReducer, {
    cartNumber: generateCartNumber(),
    id: 0,
    items: [],
    status: 'pending' as const,
    totals: {
      total: 0,
      cost: 0,
      shipping: 0,
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })

  // checking methods
  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  // Memoized value for checking if the cart is empty
  const cartIsEmpty = useMemo(() => cart.items?.length === 0, [cart.items])

  // Checks if a product is in the cart
  const isProductInCart = useCallback(
    (productId: string | number): boolean => {
      return (
        cart.items?.some((item) =>
          typeof item.product === 'object'
            ? item.product.id === productId
            : item.product === productId,
        ) || false
      )
    },
    [cart.items],
  )

  // Validates the cart by checking if all receivers have required fields
  const validateCart = useCallback((): boolean => {
    if (!cart.items || cart.items.length === 0) return false

    return cart.items.every(
      (item) =>
        item.receivers &&
        item.receivers.every(
          (receiver) =>
            receiver.name &&
            receiver.message &&
            receiver.delivery?.address?.formattedAddress &&
            receiver.delivery?.shippingMethod,
        ),
    )
  }, [cart])

  //
  //
  //
  // cart actions
  // Adds a product to the cart
  const addProduct = useCallback((product: Product | number, price: number) => {
    dispatchCart({
      type: 'ADD_PRODUCT',
      payload: {
        product,
        price,
      },
    })
  }, [])

  // Removes a product from the cart
  const removeProduct = useCallback((productId: number | string) => {
    dispatchCart({
      type: 'REMOVE_PRODUCT',
      payload: { productId },
    })
  }, [])

  // Adds a receiver to a product in the cart
  const addReceiver = useCallback(
    (productId: number | string, receiver: NonNullable<CartItem['receivers']>[number]) => {
      dispatchCart({
        type: 'ADD_RECEIVER',
        payload: { productId, receiver },
      })
    },
    [],
  )

  // Updates a receiver for a product in the cart
  const updateReceiver = useCallback(
    (productId: number | string, receiverId: string, updatedFields: UpdateReceiverFields) => {
      dispatchCart({
        type: 'UPDATE_RECEIVER',
        payload: { productId, receiverId, updatedFields },
      })
    },
    [],
  )

  // Removes a receiver from a product in the cart
  const removeReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchCart({
      type: 'REMOVE_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  // Copies a receiver for a product in the cart
  const copyReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchCart({
      type: 'COPY_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  // Clears the entire cart
  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  // const convertCartToOrder = useCallback(async () => {
  //   if (!validateCart()) return null

  //   const orderData = {
  //     ...cart,
  //     status: 'pending' as const,
  //   }

  //   try {
  //     const newOrder = await createOrder(orderData)
  //     clearCart()
  //     return newOrder
  //   } catch (error) {
  //     console.error('Error creating order:', error)
  //     return null
  //   }
  // }, [cart, validateCart, clearCart])

  // Memoized value for the CartContext
  const contextValue = useMemo(
    () => ({
      addProduct,
      addReceiver,
      cart,
      cartIsEmpty,
      clearCart,
      copyReceiver,

      hasInitializedCart,
      isProductInCart,
      removeProduct,
      removeReceiver,
      updateReceiver,
      validateCart,
      // convertCartToOrder,
    }),
    [
      addProduct,
      addReceiver,
      cart,
      cartIsEmpty,
      clearCart,
      copyReceiver,
      hasInitializedCart,
      isProductInCart,
      removeProduct,
      removeReceiver,
      updateReceiver,
      validateCart,
      // convertCartToOrder,
    ],
  )

  // Effect to initialize the cart from local storage
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        try {
          const localCart = localStorage.getItem('cart')
          const parsedCart = JSON.parse(localCart || '{}')

          // if (parsedCart?.items && parsedCart.items.length > 0) {
          //   dispatchCart({
          //     type: 'UPSERT_CART',
          //     payload: parsedCart,
          //   })
          // } else {
          //   console.log('CartProvider: No items in local storage')
          // }
        } catch (error) {
          console.error('CartProvider: Error initializing cart:', error)
        } finally {
          setHasInitialized(true)
        }
      }

      syncCartFromLocalStorage()
    }
  }, [])

  // Effect to update local storage with cart changes
  useEffect(() => {
    if (!hasInitialized.current) return
    debouncedUpdateLocalStorage(cart)
  }, [cart])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'

// export async function createOrder(orderData: Cart): Promise<Order | null> {
//   const config = await configPromise
//   const payload = await getPayloadHMR({ config })

//   try {
//     const newOrder = await payload.create({
//       collection: 'orders',
//       data: orderData,
//     })

//     return newOrder
//   } catch (error) {
//     console.error('Error creating order:', error)
//     throw new Error('Failed to create order')
//   }
// }
