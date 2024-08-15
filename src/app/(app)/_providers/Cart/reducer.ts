// This file contains utility types, interfaces, and a reducer function for managing a shopping cart in a Next.js 14 application with server components.
// It handles various actions such as adding/removing products, updating receivers (recipients), calculating totals, and managing shipping methods.

// Import type definitions for Cart and Product
import type { Cart, Product } from '@/payload-types'
import { shippingPrices } from '@/utilities/referenceText'
import { isMetroPostcode, isRegionalPostcode, isRemotePostcode } from './shippingCalcs'
import { upsertPayloadCart } from './upsertPayloadCart'
import { deletePayloadCart } from './deletePayloadCart'
import { debounce } from 'lodash' // You'll need to install lodash if not already present

// Create a debounced version of the upsertPayloadCart function
const debouncedUpsertPayloadCart = debounce(upsertPayloadCart, 1000)

// Type alias for a single item in the Cart
export type CartItem = NonNullable<Cart['items']>[number]

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
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'CLEAR_CART' }

// Helper function to get the product ID from a CartItem
const getProductId = (product: CartItem['product']): string | number => {
  return typeof product === 'object' ? product.id : product
}

// Cart reducer function to handle different actions
export const cartReducer = (cart: Cart, action: CartAction): Cart => {
  let updatedCart: Cart

  switch (action.type) {
    case 'ADD_PRODUCT': {
      const { product, price } = action.payload
      const productId = typeof product === 'object' ? product.id : product

      const existingItem = cart.items?.find((item) =>
        typeof item.product === 'object'
          ? item.product.id === productId
          : item.product === productId,
      )

      if (existingItem) return cart

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

      // return the updated cart with one empty receiver to get customer started
      let cartToReturn = cartReducer(updatedCart, {
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

      // upsert the server cart
      console.log('product added, upsert cart -- ')
      debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
    }

    case 'REMOVE_PRODUCT': {
      const { productId } = action.payload
      const updatedItems = cart.items?.filter(
        (item) => getProductId(item.product) !== productId,
      ) as CartItem[]

      let cartToReturn = {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }

      // if this is the last product removed, then delete the cart client & server, otherwise return the updated cart
      if (cartToReturn.items?.length === 0) {
        deletePayloadCart(cartToReturn)
        return { ...cart, items: [], totals: { total: 0, cost: 0, shipping: 0 } }
      } else {
        // upsert the server cart
        console.log('product added, upsert cart -- ')
        debouncedUpsertPayloadCart(cartToReturn)

        return cartToReturn
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

      let cartToReturn = {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }

      // upsert the server cart
      console.log('product added, upsert cart -- ')
      debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
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

      let cartToReturn = {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }

      // upsert the server cart
      console.log('product added, upsert cart -- ')
      debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
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

      let cartToReturn = {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }

      // upsert the server cart
      console.log('product added, upsert cart -- ')
      // upsertPayloadCart(cartToReturn)
      // Use the debounced function for updating the server cart
      debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
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

      let cartToReturn = {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }

      // upsert the server cart
      console.log('product added, upsert cart -- ')
      debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
    }

    case 'CLEAR_CART': {
      // also clear / delete the cart on payloadCMS
      deletePayloadCart(cart)
      return { ...cart, items: [], totals: { total: 0, cost: 0, shipping: 0 } }
    }

    case 'SET_CART': {
      return action.payload
    }

    default: {
      return cart
    }
  }
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

      // stupid sale v base price calcs
      let itemPrice = 0
      if (typeof item.product !== 'number') {
        if (item.product.prices.salePrice === undefined || item.product.prices.salePrice === null) {
          itemPrice = item.product.prices.basePrice
        } else {
          itemPrice = Math.min(item.product.prices.basePrice, item.product.prices.salePrice)
        }
      }

      receiver.totals = {
        shipping,
        cost: itemPrice,
        subTotal: itemPrice + (shipping || 0),
      }
    })
    item.totals = {
      cost: item.receivers?.reduce((sum, receiver) => sum + receiver.totals.cost, 0) || 0,
      shipping:
        item.receivers?.reduce((sum, receiver) => sum + (receiver.totals.shipping || 0), 0) || 0,
      subTotal: item.receivers?.reduce((sum, receiver) => sum + receiver.totals.subTotal, 0) || 0,
    }
  })

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
