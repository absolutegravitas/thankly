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
import { cartReducer, CartAction } from './reducer'
import { debounce } from 'lodash'
// import { auth } from '@/utilities/auth'
import { v4 as uuidv4 } from 'uuid'
import { Address, AddressAction, addressReducer } from './address'
import { Receiver, GiftCard, ShippingMethod } from '@app/_blocks/Cart/cart-types'

// Interface defining the CartContext shape
// exposes objects and methods for use on the client
export type CartContext = {
  //objects
  cart: Cart
  addresses: Address[]

  // checking methods
  hasInitializedCart: boolean
  cartIsEmpty: boolean
  cartPersonalisationMissing: boolean
  cartPostageMissing: boolean

  isProductInCart: (productId: string | number) => boolean
  // validateCart: () => boolean

  // cart actions
  addCartItem: (product: number | Product, price: number) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  updateMessage: (cartItemId: string, giftCard: GiftCard) => void
  removeCartItem: (cartItemId: string) => void
  addReceiver: (receiver: Receiver) => void
  linkReceiver: (cartItemId: string, receiverId: string) => void
  updateShipping: (
    receiverId: string,
    shippingMethod: ShippingMethod,
    shippingPrice: number,
  ) => void
  setCart: (newCart: Cart) => void
  clearCart: () => void

  // address array actions
  addAddress: (newAddress: Address) => void
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

  //check that cart items exist, and all have a message and a receiver
  const cartPersonalisationMissing = useMemo((): boolean => {
    if (!cart.items || cart.items.length === 0) return false
    return !cart.items.every((item) => item.receiverId && item.giftCard.message)
  }, [cart.items])

  //check that cart receivers exist, and those that are selected have a postage methods
  const cartPostageMissing = useMemo((): boolean => {
    if (!cart.items || cart.items.length === 0) return false
    if (!cart.receivers || cart.receivers.length === 0) return false
    // Get a set of all receiverIds used in cart items
    const usedReceiverIds = new Set(cart.items.map((item) => item.receiverId))
    return !cart.receivers.every((receiver) => {
      if (!usedReceiverIds.has(receiver.receiverId)) return true
      return receiver.delivery && receiver.delivery.shippingMethod
    })
  }, [cart])

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

  // // Validates the cart by checking if all receivers have required fields
  // const validateCart = useCallback((): boolean => {
  //   if (!cart.items || cart.items.length === 0) return false

  //   return cart.items.every(
  //     (item) =>
  //       item.receivers &&
  //       item.receivers.every(
  //         (receiver) =>
  //           receiver.name &&
  //           receiver.message &&
  //           receiver.delivery?.address?.formattedAddress &&
  //           receiver.delivery?.shippingMethod,
  //       ),
  //   )
  // }, [cart])

  //
  // cart actions
  // Adds a product (as a new cart item) to the cart
  const addCartItem = useCallback((product: number | Product, price: number) => {
    dispatchCart({ type: 'ADD_CART_ITEM', payload: { product, price } })
  }, [])

  // Removes a cart item from the cart
  const removeCartItem = useCallback((cartItemId: string) => {
    dispatchCart({ type: 'REMOVE_CART_ITEM', payload: { cartItemId } })
  }, [])

  // update quantity of a cart item
  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    dispatchCart({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } })
  }, [])

  //update message of a cart item
  const updateMessage = useCallback((cartItemId: string, giftCard: GiftCard) => {
    dispatchCart({ type: 'UPDATE_MESSAGE', payload: { cartItemId, giftCard } })
  }, [])

  // Adds a receiver to the cart
  const addReceiver = useCallback((receiver: Receiver) => {
    dispatchCart({ type: 'ADD_RECEIVER', payload: { receiver } })
  }, [])

  // link a receiver to a cart item
  const linkReceiver = useCallback((cartItemId: string, receiverId: string) => {
    dispatchCart({ type: 'LINK_RECEIVER', payload: { cartItemId, receiverId } })
  }, [])

  //updateShipping: (receiverId: string, shippingMethod: string, shippingPrice: number) => void
  const updateShipping = useCallback(
    (receiverId: string, shippingMethod: ShippingMethod, shippingPrice: number) => {
      dispatchCart({
        type: 'UPDATE_SHIPPING',
        payload: { receiverId, shippingMethod, shippingPrice },
      })
    },
    [],
  )

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

  // Memoized value for the CartContext
  const contextValue = useMemo(
    () => ({
      addAddress,
      addresses,
      addCartItem,
      addReceiver,
      cart,
      cartIsEmpty,
      cartPersonalisationMissing,
      cartPostageMissing,
      clearCart,
      hasInitializedCart,
      isProductInCart,
      linkReceiver,
      removeCartItem,
      setCart,
      updateMessage,
      updateQuantity,
      updateShipping,
      // validateCart,
    }),
    [
      addAddress,
      addresses,
      addCartItem,
      addReceiver,
      cart,
      cartIsEmpty,
      cartPersonalisationMissing,
      cartPostageMissing,
      clearCart,
      hasInitializedCart,
      isProductInCart,
      linkReceiver,
      removeCartItem,
      setCart,
      updateMessage,
      updateQuantity,
      updateShipping,
      // validateCart,
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
