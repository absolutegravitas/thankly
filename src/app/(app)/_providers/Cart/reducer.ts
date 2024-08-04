import type { Cart, Product } from '@/payload-types'
import { shippingPrices } from '@/utilities/referenceText'
import { isMetroPostcode, isRegionalPostcode, isRemotePostcode } from './shippingCalcs'
export type CartItem = NonNullable<Cart['items']>[number]
type CartType = Cart
type ShippingMethod =
  // | 'free'
  'standardMail' | 'registeredMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

export type CartAction =
  | { type: 'SET_ORDER'; payload: Cart }
  | { type: 'MERGE_ORDER'; payload: Cart }
  | { type: 'FORCE_UPDATE' }
  | {
      type: 'ADD_PRODUCT'
      payload: {
        product: Product | number
        price: number
      }
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
      payload: {
        productId: number | string
        receiverId: string
      }
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
      payload: {
        productId: number | string
        receiverId: string
      }
    }
  | {
      type: 'UPDATE_SHIPPING_METHOD'
      payload: {
        productId: number | string
        receiverId: string
        delivery: { shippingMethod: ShippingMethod }
      }
    }
  | {
      type: 'REMOVE_PRODUCT'
      payload: {
        productId: number | string
      }
    }
  | { type: 'CLEAR_ORDER' }

const getProductId = (product: CartItem['product']): string | number => {
  return typeof product === 'object' ? product.id : product
}

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

export const cartReducer = (cart: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'SET_ORDER': {
      return action.payload
    }

    case 'MERGE_ORDER': {
      const { payload: incomingCart } = action
      const mergedItems = [...(cart.items || []), ...(incomingCart.items || [])].reduce(
        (acc: CartItem[], item) => {
          const existingItemIndex = acc.findIndex(
            (accItem) => getProductId(accItem.product) === getProductId(item.product),
          )
          if (existingItemIndex > -1) {
            acc[existingItemIndex] = {
              ...acc[existingItemIndex],
              receivers: [...(acc[existingItemIndex].receivers || []), ...(item.receivers || [])],
              totals: {
                subTotal:
                  (acc[existingItemIndex].totals?.subTotal || 0) + (item.totals?.subTotal || 0),
                cost: (acc[existingItemIndex].totals?.cost || 0) + (item.totals?.cost || 0),
                shipping:
                  (acc[existingItemIndex].totals?.shipping || 0) + (item.totals?.shipping || 0),
              },
            }
          } else {
            acc.push(item)
          }
          return acc
        },
        [],
      )

      return {
        ...cart,
        items: mergedItems,
        totals: calculateCartTotals(mergedItems),
      }
    }

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

      // also create Cart on PayloadCMS

      // return cart with 1x added receiver
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

    case 'UPDATE_SHIPPING_METHOD': {
      const { productId, receiverId, delivery } = action.payload
      const updatedItems = cart.items?.map((item) => {
        if (getProductId(item.product) === productId) {
          const updatedReceivers = item.receivers?.map((receiver) =>
            receiver.id === receiverId
              ? {
                  ...receiver,
                  delivery: {
                    ...receiver.delivery,
                    ...delivery,
                  },
                }
              : receiver,
          )
          return { ...item, receivers: updatedReceivers }
        }
        return item
      }) as CartItem[]

      return {
        ...cart,
        items: updatedItems,
        totals: calculateCartTotals(updatedItems),
      }
    }

    case 'CLEAR_ORDER': {
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
