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
type ShippingMethod =
  | 'free'
  | 'standardMail'
  | 'expressMail'
  | 'standardParcel'
  | 'expressParcel'
  | null

export type CartContext = {
  cart: Cart
  addProduct: (product: Product, productPrice: number) => void
  addReceiver: (
    productId: number | string,
    receiver: NonNullable<CartItem['receivers']>[number],
  ) => void
  updateReceiver: (
    productId: number | string,
    receiverId: string,
    updatedFields: Partial<NonNullable<CartItem['receivers']>[number]>,
  ) => void
  removeReceiver: (productId: number | string, receiverId: string) => void
  copyReceiver: (productId: number | string, receiverId: string) => void
  updateShippingMethod: (
    productId: number | string,
    receiverId: string,
    shippingMethod: ShippingMethod,
  ) => void
  removeProduct: (productId: number | string) => void
  cartIsEmpty: boolean
  clearCart: () => void
  isProductInCart: (productId: string | number) => boolean
  cartTotal: {
    formatted: string
    raw: number
  }
  hasInitializedCart: boolean
}

const Context = createContext<CartContext | undefined>(undefined)
const debouncedUpdateLocalStorage = debounce((cart) => {
  localStorage.setItem('cart', JSON.stringify(cart))
}, 300)

export const useCart = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatchCart] = useReducer<React.Reducer<Cart, CartAction>>(cartReducer, {
    id: 0,
    items: [],
    totals: {
      cartTotal: 0,
      cartThanklys: 0,
      cartShipping: null,
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })

  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  const addProduct = useCallback((product: Product | number, productPrice: number) => {
    dispatchCart({
      type: 'ADD_PRODUCT',
      payload: {
        product,
        productPrice,
      },
    })
  }, [])

  const addReceiver = useCallback(
    (productId: number | string, receiver: NonNullable<CartItem['receivers']>[number]) => {
      dispatchCart({
        type: 'ADD_RECEIVER',
        payload: { productId, receiver },
      })
    },
    [],
  )

  const copyReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchCart({
      type: 'COPY_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  const updateReceiver = useCallback(
    (
      productId: number | string,
      receiverId: string,
      updatedFields: Partial<NonNullable<CartItem['receivers']>[number]>,
    ) => {
      dispatchCart({
        type: 'UPDATE_RECEIVER',
        payload: { productId, receiverId, updatedFields },
      })
    },
    [],
  )

  const removeReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchCart({
      type: 'REMOVE_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  const updateShippingMethod = useCallback(
    (productId: number | string, receiverId: string, shippingMethod: ShippingMethod) => {
      dispatchCart({
        type: 'UPDATE_SHIPPING_METHOD',
        payload: { productId, receiverId, shippingMethod },
      })
    },
    [],
  )

  const removeProduct = useCallback((productId: number | string) => {
    dispatchCart({
      type: 'REMOVE_PRODUCT',
      payload: { productId },
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

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

  const cartIsEmpty = useMemo(() => cart.items?.length === 0, [cart.items])

  const contextValue = {
    cart,
    addProduct,
    addReceiver,
    copyReceiver,
    updateReceiver,
    removeReceiver,
    updateShippingMethod,
    removeProduct,
    cartIsEmpty,
    clearCart,
    isProductInCart,
    cartTotal: total,
    hasInitializedCart,
  }

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        const localCart = localStorage.getItem('cart')
        const parsedCart = JSON.parse(localCart || '{}')

        if (parsedCart?.items && parsedCart.items.length > 0) {
          dispatchCart({
            type: 'SET_CART',
            payload: parsedCart,
          })
        }
      }

      syncCartFromLocalStorage()
    }
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) return
    debouncedUpdateLocalStorage(cart)
  }, [cart])

  useEffect(() => {
    if (!hasInitializedCart) return

    setTotal({
      formatted: cart.totals.cartTotal.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      raw: cart.totals.cartTotal,
    })
  }, [cart, hasInitializedCart])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}