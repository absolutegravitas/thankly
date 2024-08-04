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
import { Cart, Product } from '@/payload-types'
import { CartItem, cartReducer, CartAction } from './reducer'
import { debounce } from 'lodash'

// Type aliases for common types used throughout the file
type ShippingMethod = 'standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null
type Receiver = NonNullable<CartItem['receivers']>[number]
type UpdateReceiverFields = Partial<Omit<Receiver, 'id' | 'totals' | 'delivery'>> & {
  delivery?: Partial<Receiver['delivery']>
}

// Interface defining the CartContext shape
export type CartContext = {
  cart: Cart
  cartIsEmpty: boolean
  hasInitializedCart: boolean
  validateCart: () => boolean

  isProductInCart: (productId: string | number) => boolean

  addProduct: (product: Product, price: number) => void
  removeProduct: (productId: number | string) => void
  clearCart: () => void

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
  updateShippingMethod: (
    productId: number | string,
    receiverId: string,
    shippingMethod: ShippingMethod,
  ) => void
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

// CartProvider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state and reducer
  const [cart, dispatchCart] = useReducer<React.Reducer<Cart, CartAction>>(cartReducer, {
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

  // Total state for formatted and raw total values
  const [total, setTotal] = useState<{ formatted: string; raw: number }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

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

  // Copies a receiver for a product in the cart
  const copyReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchCart({
      type: 'COPY_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

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

  // Updates the shipping method for a receiver
  const updateShippingMethod = useCallback(
    (productId: number | string, receiverId: string, shippingMethod: ShippingMethod) => {
      dispatchCart({
        type: 'UPDATE_SHIPPING_METHOD',
        payload: { productId, receiverId, delivery: { shippingMethod } },
      })
    },
    [],
  )

  // Removes a product from the cart
  const removeProduct = useCallback((productId: number | string) => {
    dispatchCart({
      type: 'REMOVE_PRODUCT',
      payload: { productId },
    })
  }, [])

  // Clears the entire cart
  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_ORDER',
    })
  }, [])

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

  // Memoized value for checking if the cart is empty
  const cartIsEmpty = useMemo(() => cart.items?.length === 0, [cart.items])

  // Memoized value for the CartContext
  const contextValue = useMemo(
    () => ({
      addProduct,
      addReceiver,
      cart,
      cartIsEmpty,
      total: total,
      clearCart,
      copyReceiver,

      hasInitializedCart,
      isProductInCart,
      removeProduct,
      removeReceiver,
      updateReceiver,
      updateShippingMethod,
      validateCart,
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
      total,
      updateReceiver,
      updateShippingMethod,
      validateCart,
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

          if (parsedCart?.items && parsedCart.items.length > 0) {
            dispatchCart({
              type: 'SET_ORDER',
              payload: parsedCart,
            })
          } else {
            // console.log('CartProvider: No items in local storage')
          }
        } catch (error) {
          // console.error('CartProvider: Error initializing cart:', error)
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

  // Effect to update the formatted total in state
  useEffect(() => {
    if (!hasInitializedCart) return

    setTotal({
      formatted: cart.totals.total.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      raw: cart.totals.total,
    })
  }, [cart, hasInitializedCart])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
