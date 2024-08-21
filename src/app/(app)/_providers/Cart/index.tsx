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
// import { auth } from '@/utilities/auth'
import { v4 as uuidv4 } from 'uuid'
import { Address, AddressAction, addressReducer } from './address'

// Type aliases for common types used throughout the file
type Receiver = NonNullable<CartItem['receivers']>[number]
type UpdateReceiverFields = Partial<Omit<Receiver, 'id' | 'totals' | 'delivery'>> & {
  delivery?: Partial<Receiver['delivery']>
}

// Interface defining the CartContext shape
// exposes objects and methods for use on the client
export type CartContext = {
  //objects
  cart: Cart
  addresses: Address[]
  multipleAddresses: boolean

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
  setCart: (newCart: Cart) => void
  clearCart: () => void

  // address array actions
  addAddress: (newAddress: Address) => void
  setMultipleAddresses: (multipleAddresses: boolean) => void
}

//initialising cart context locally (which starts off as undefined)
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
  const setCart = useCallback((newCart: Cart) => {
    dispatchCart({ type: 'SET_CART', payload: newCart })
  }, [])

  // Cart state and reducer
  const [cart, dispatchCart] = useReducer<React.Reducer<Cart, CartAction>>(cartReducer, {
    cartNumber: uuidv4(),
    id: 0,
    items: [],
    status: 'pending' as const,
    totals: { total: 0, cost: 0, shipping: 0 },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })

  // checking methods
  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  // Memoized value for checking if the cart is empty
  const cartIsEmpty = useMemo(() => cart.items?.length === 0, [cart.items])

  // state for managing

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
    dispatchCart({ type: 'ADD_PRODUCT', payload: { product, price } })
  }, [])

  // Removes a product from the cart
  const removeProduct = useCallback((productId: number | string) => {
    dispatchCart({ type: 'REMOVE_PRODUCT', payload: { productId } })
  }, [])

  // Adds a receiver to a product in the cart
  const addReceiver = useCallback(
    (productId: number | string, receiver: NonNullable<CartItem['receivers']>[number]) => {
      dispatchCart({ type: 'ADD_RECEIVER', payload: { productId, receiver } })
    },
    [],
  )

  // Updates a receiver for a product in the cart
  const updateReceiver = useCallback(
    (productId: number | string, receiverId: string, updatedFields: UpdateReceiverFields) => {
      dispatchCart({ type: 'UPDATE_RECEIVER', payload: { productId, receiverId, updatedFields } })
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
    dispatchCart({ type: 'COPY_RECEIVER', payload: { productId, receiverId } })
  }, [])

  // Clears the entire cart
  const clearCart = useCallback(() => {
    dispatchCart({ type: 'CLEAR_CART' })
  }, [])

  // addresses state and context (initially empty string)
  const [addresses, dispatchAddresses] = useReducer<React.Reducer<Address[], AddressAction>>(
    addressReducer,
    [],
  )

  //
  //
  //
  // address actions
  const addAddress = useCallback((address: Address) => {
    dispatchAddresses({ type: 'ADD_ADDRESS', payload: { address } })
  }, [])
  //multiple addresses state
  const [multipleAddresses, setMultipleAddresses] = useState(false) //initial value is false

  // Memoized value for the CartContext
  const contextValue = useMemo(
    () => ({
      addresses,
      addAddress,
      addProduct,
      addReceiver,
      cart,
      cartIsEmpty,
      clearCart,
      copyReceiver,
      hasInitializedCart,
      isProductInCart,
      multipleAddresses,
      removeProduct,
      removeReceiver,
      setMultipleAddresses,
      updateReceiver,
      validateCart,
      setCart,
    }),
    [
      addresses,
      addAddress,
      multipleAddresses,
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
      setCart,
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
          if (Object.keys(parsedCart).length > 0) {
            dispatchCart({ type: 'SET_CART', payload: parsedCart })
          }
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
