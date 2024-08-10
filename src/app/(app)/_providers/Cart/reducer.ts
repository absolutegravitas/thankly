// This file contains utility types, interfaces, and a reducer function for managing a shopping cart in a Next.js 14 application with server components.
// It handles various actions such as adding/removing products, updating receivers (recipients), calculating totals, and managing shipping methods.

// Import type definitions for Cart and Product
import type { Cart, Product } from '@/payload-types'
import { shippingPrices } from '@/utilities/referenceText'
import { isMetroPostcode, isRegionalPostcode, isRemotePostcode } from './shippingCalcs'
import { upsertPayloadCart } from './serverActions'

// Type alias for a single item in the Cart
export type CartItem = NonNullable<Cart['items']>[number]

// Type aliases for Cart and ShippingMethod
type CartType = Cart
type ShippingMethod =
  // | 'free'
  'standardMail' | 'registeredMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

// Union type for different cart actions
export type CartAction =
  | {
      type: 'ADD_PRODUCT'
      payload: { product: Product | number; price: number }
    }
  | {
      type: 'REMOVE_PRODUCT'
      payload: { productId: number | string }
    }
  | {
      type: 'ADD_RECEIVER'
      payload: {
        productId: number | string
        receiver: NonNullable<NonNullable<Cart['items']>[number]['receivers']>[number]
      }
    }
  | {
      type: 'COPY_RECEIVER'
      payload: { productId: number | string; receiverId: string }
    }
  | {
      type: 'UPDATE_RECEIVER'
      payload: {
        productId: number | string
        receiverId: string
        updatedFields: Partial<NonNullable<NonNullable<Cart['items']>[number]['receivers']>[number]>
      }
    }
  | {
      type: 'REMOVE_RECEIVER'
      payload: { productId: number | string; receiverId: string }
    }
  | { type: 'CLEAR_CART' }

// Helper function to get the product ID from a CartItem
const getProductId = (product: CartItem['product']): string | number => {
  return typeof product === 'object' ? product.id : product
}

// Function to calculate the totals for the entire cart
const calculateCartTotals = (items: CartItem[] | undefined): Cart['totals'] => {
  if (!items) return { total: 0, cost: 0, shipping: 0 }
  items.forEach((item) => {
    const product = item.product as Product

    item.receivers?.forEach((receiver) => {
      let shipping: number | null = null
      const postalCode = (() => {
        if (
          typeof receiver.delivery?.address?.json === 'object' &&
          receiver.delivery?.address.json !== null
        ) {
          return (receiver.delivery?.address.json as { [k: string]: unknown })['postalCode'] as
            | string
            | undefined
        }
        return undefined
      })()

      if (
        product.productType &&
        receiver.delivery?.shippingMethod &&
        product.shippingSize &&
        postalCode
      ) {
        if (product.productType === 'card') {
          shipping =
            shippingPrices.cards[
              receiver.delivery?.shippingMethod as keyof typeof shippingPrices.cards
            ] ?? null
        } else if (product.productType === 'gift') {
          shipping =
            shippingPrices.gifts.size[
              product.shippingSize as keyof typeof shippingPrices.gifts.size
            ] ?? null
          if (shipping !== null) {
            if (isRegionalPostcode(postalCode)) {
              shipping += shippingPrices.gifts.surcharge.regional
            } else if (isRemotePostcode(postalCode)) {
              shipping += shippingPrices.gifts.surcharge.remote
            }
            if (receiver.delivery?.shippingMethod === 'expressParcel') {
              shipping += shippingPrices.gifts.surcharge.expressParcel
            }
          }
        }
      }
      receiver.totals = {
        cost: item.price || 0,
        shipping,
        subTotal: (item.price || 0) + (shipping || 0),
      }
    })
    item.totals = {
      cost: item.receivers?.reduce((sum, receiver) => sum + receiver.totals.cost, 0) || 0,
      shipping:
        item.receivers?.reduce((sum, receiver) => sum + (receiver.totals.shipping || 0), 0) || 0,
      subTotal: item.receivers?.reduce((sum, receiver) => sum + receiver.totals.subTotal, 0) || 0,
    }
  })

  // also sync to payloadcms coz claudeai is dogshit

  // return the totals
  return items.reduce(
    (totals, item) => ({
      cost: totals.cost + (item.totals?.cost || 0),
      shipping: totals.shipping + (item.totals?.shipping || 0),
      discount:
        totals.total + (item.totals?.subTotal || 0) > 150
          ? -1 * (totals.shipping + (item.totals?.shipping || 0))
          : 0,
      total: totals.total + (item.totals?.subTotal || 0),
    }),
    { total: 0, cost: 0, shipping: 0, discount: 0 },
  )
}

// Cart reducer function to handle different actions
export const cartReducer = (cart: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const { product, price } = action.payload
      const productId = typeof product === 'object' ? product.id : product

      const existingItem = cart.items?.find((item) =>
        typeof item.product === 'object'
          ? item.product.id === productId
          : item.product === productId,
      )

      if (existingItem) {
        return cart
      }

      // add a new product to existing cart
      const newItem: CartItem = {
        product: product,
        price: price,
        receivers: [],
        totals: {
          subTotal: 0,
          cost: 0,
          shipping: null,
        },
        id: Date.now().toString(),
      }

      const updatedItems = [...(cart.items || []), newItem]

      const updatedCart = {
        ...cart,
        items: updatedItems,
      }

      return cartReducer(updatedCart, {
        type: 'ADD_RECEIVER',
        payload: {
          productId: productId,
          receiver: {
            id: Date.now().toString(),
            name: null,
            message: null,
            delivery: {
              address: {
                addressLine1: null,
                addressLine2: null,
                formattedAddress: null,
                json: null,
              },
              shippingMethod: null,
            },
            totals: {
              subTotal: price,
              cost: price,
              shipping: null,
            },
          },
        },
      })
    }

    case 'REMOVE_PRODUCT': {
      const { productId } = action.payload
      const updatedItems = cart.items?.filter(
        (item) => getProductId(item.product) !== productId,
      ) as CartItem[]

      return {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }
    }

    case 'ADD_RECEIVER': {
      const { productId, receiver } = action.payload
      const updatedItems =
        cart.items?.map((item) => {
          if (getProductId(item.product) === productId) {
            return {
              ...item,
              receivers: [...(item.receivers || []), receiver],
              totals: {
                subTotal: (item.totals?.subTotal || 0) + (receiver.totals?.subTotal || 0),
                cost: (item.totals?.cost || 0) + (receiver.totals?.cost || 0),
                shipping: (item.totals?.shipping || 0) + (receiver.totals?.shipping || 0),
              },
            }
          }
          return item
        }) || []

      return {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }
    }

    case 'COPY_RECEIVER': {
      const { productId, receiverId } = action.payload

      const updatedItems =
        cart.items?.map((item) => {
          // find matching product

          if (getProductId(item.product) === productId) {
            // console.log('product --', productId)
            // find matching receiver
            const receiverToCopy = item.receivers?.find((r) => r.id === receiverId)
            // console.log('copiedreceiver --', receiverToCopy)
            // receiver found
            if (receiverToCopy) {
              const newReceiver: NonNullable<CartItem['receivers']>[number] = {
                ...receiverToCopy,
                id: Date.now().toString(),
              }

              return {
                ...item,
                receivers: [...(item.receivers || []), newReceiver],
                totals: {
                  subTotal: (item.totals?.subTotal || 0) + (newReceiver.totals?.subTotal || 0),
                  cost: (item.totals?.cost || 0) + (newReceiver.totals?.cost || 0),
                  shipping: (item.totals?.shipping || 0) + (newReceiver.totals?.shipping || 0),
                },
              }
            }
          }
          return item
        }) || []

      return {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }
    }

    case 'UPDATE_RECEIVER': {
      const { productId, receiverId, updatedFields } = action.payload
      const updatedItems = cart.items?.map((item) => {
        if (getProductId(item.product) === productId) {
          const updatedReceivers = item.receivers?.map((receiver) =>
            receiver.id === receiverId
              ? {
                  ...receiver,
                  ...updatedFields,
                  delivery: {
                    ...receiver.delivery,
                    ...updatedFields.delivery,
                    address: {
                      ...receiver.delivery?.address,
                      ...updatedFields.delivery?.address,
                    },
                  },
                }
              : receiver,
          )
          return { ...item, receivers: updatedReceivers }
        }
        return item
      })
      return {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }
    }

    case 'REMOVE_RECEIVER': {
      const { productId, receiverId } = action.payload
      const updatedItems = cart.items
        ?.map((item) => {
          if (getProductId(item.product) === productId) {
            const updatedReceivers = item.receivers?.filter(
              (receiver) => receiver.id !== receiverId,
            )
            return { ...item, receivers: updatedReceivers }
          }
          return item
        })
        .filter((item) => item.receivers && item.receivers.length > 0) as CartItem[]

      return {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }
    }

    case 'CLEAR_CART': {
      // also clear / delete the cart on payloadCMS

      return {
        ...cart,
        items: [],
        totals: {
          total: 0,
          cost: 0,
          shipping: 0,
        },
      }
    }

    default: {
      return cart
    }
  }
}
