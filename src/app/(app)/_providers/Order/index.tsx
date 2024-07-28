/**
 * @file index.tsx
 * @module OrderProvider
 * @description Order management system for an e-commerce application
 * @overview
 * This file implements a custom order management system using React's Context API. It provides a centralized state management solution for handling orders in an e-commerce application. The OrderProvider component manages the order state, including adding/removing products, managing receivers, updating shipping methods, and synchronizing with local storage. It uses a reducer pattern for state updates and exposes various utility functions through the OrderContext.
 */

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
import { Order, Product } from '@/payload-types'
import { OrderItem, orderReducer, OrderAction } from './reducer'
import { debounce } from 'lodash'

type ShippingMethod = 'standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null
type Receiver = NonNullable<OrderItem['receivers']>[number]
type UpdateReceiverFields = Partial<Omit<Receiver, 'id' | 'totals' | 'delivery'>> & {
  delivery?: Partial<Receiver['delivery']>
}

export type OrderContext = {
  order: Order
  orderIsEmpty: boolean
  hasInitializedOrder: boolean
  validateOrder: () => boolean

  isProductInOrder: (productId: string | number) => boolean

  addProduct: (product: Product, price: number) => void
  removeProduct: (productId: number | string) => void
  clearOrder: () => void

  addReceiver: (
    productId: number | string,
    receiver: NonNullable<OrderItem['receivers']>[number],
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

const Context = createContext<OrderContext | undefined>(undefined)
const debouncedUpdateLocalStorage = debounce((order) => {
  localStorage.setItem('cart', JSON.stringify(order))
}, 300)

export const useOrder = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useOrder must be used within a OrderProvider')
  }
  return context
}

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [order, dispatchOrder] = useReducer<React.Reducer<Order, OrderAction>>(orderReducer, {
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

  const [total, setTotal] = useState<{ formatted: string; raw: number }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedOrder, setHasInitialized] = useState(false)

  const validateOrder = useCallback((): boolean => {
    if (!order.items || order.items.length === 0) return false

    return order.items.every(
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
  }, [order])

  const addProduct = useCallback((product: Product | number, price: number) => {
    dispatchOrder({
      type: 'ADD_PRODUCT',
      payload: {
        product,
        price,
      },
    })
  }, [])

  const addReceiver = useCallback(
    (productId: number | string, receiver: NonNullable<OrderItem['receivers']>[number]) => {
      dispatchOrder({
        type: 'ADD_RECEIVER',
        payload: { productId, receiver },
      })
    },
    [],
  )

  const copyReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchOrder({
      type: 'COPY_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  const updateReceiver = useCallback(
    (productId: number | string, receiverId: string, updatedFields: UpdateReceiverFields) => {
      dispatchOrder({
        type: 'UPDATE_RECEIVER',
        payload: { productId, receiverId, updatedFields },
      })
    },
    [],
  )

  const removeReceiver = useCallback((productId: number | string, receiverId: string) => {
    dispatchOrder({
      type: 'REMOVE_RECEIVER',
      payload: { productId, receiverId },
    })
  }, [])

  const updateShippingMethod = useCallback(
    (productId: number | string, receiverId: string, shippingMethod: ShippingMethod) => {
      dispatchOrder({
        type: 'UPDATE_SHIPPING_METHOD',
        payload: { productId, receiverId, delivery: { shippingMethod } },
      })
    },
    [],
  )

  const removeProduct = useCallback((productId: number | string) => {
    dispatchOrder({
      type: 'REMOVE_PRODUCT',
      payload: { productId },
    })
  }, [])

  const clearOrder = useCallback(() => {
    dispatchOrder({
      type: 'CLEAR_ORDER',
    })
  }, [])

  const isProductInOrder = useCallback(
    (productId: string | number): boolean => {
      return (
        order.items?.some((item) =>
          typeof item.product === 'object'
            ? item.product.id === productId
            : item.product === productId,
        ) || false
      )
    },
    [order.items],
  )

  const orderIsEmpty = useMemo(() => order.items?.length === 0, [order.items])

  const contextValue = useMemo(
    () => ({
      addProduct,
      addReceiver,
      order,
      orderIsEmpty,
      total: total,
      clearOrder,
      copyReceiver,

      hasInitializedOrder,
      isProductInOrder,
      removeProduct,
      removeReceiver,
      updateReceiver,
      updateShippingMethod,
      validateOrder,
    }),
    [
      addProduct,
      addReceiver,
      order,
      orderIsEmpty,
      clearOrder,
      copyReceiver,
      hasInitializedOrder,
      isProductInOrder,
      removeProduct,
      removeReceiver,
      total,
      updateReceiver,
      updateShippingMethod,
      validateOrder,
    ],
  )

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        try {
          const localCart = localStorage.getItem('cart')
          const parsedOrder = JSON.parse(localCart || '{}')

          if (parsedOrder?.items && parsedOrder.items.length > 0) {
            dispatchOrder({
              type: 'SET_ORDER',
              payload: parsedOrder,
            })
          } else {
            // console.log('OrderProvider: No items in local storage')
          }
        } catch (error) {
          // console.error('OrderProvider: Error initializing order:', error)
        } finally {
          setHasInitialized(true)
        }
      }

      syncCartFromLocalStorage()
    }
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) return
    debouncedUpdateLocalStorage(order)
  }, [order])

  useEffect(() => {
    if (!hasInitializedOrder) return

    setTotal({
      formatted: order.totals.total.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      raw: order.totals.total,
    })
  }, [order, hasInitializedOrder])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
