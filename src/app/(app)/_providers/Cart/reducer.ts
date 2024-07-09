import type { Cart, Product } from '@/payload-types'

export type CartItem = NonNullable<Cart['items']>[number]
type CartType = Cart
type ShippingMethod =
  | 'free'
  | 'standardMail'
  | 'registeredMail'
  | 'expressMail'
  | 'standardParcel'
  | 'expressParcel'
  | null

export type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'MERGE_CART'; payload: Cart }
  | { type: 'FORCE_UPDATE' }
  | {
      type: 'ADD_PRODUCT'
      payload: {
        product: Product | number
        productPrice: number
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
        shippingMethod: ShippingMethod
      }
    }
  | {
      type: 'REMOVE_PRODUCT'
      payload: {
        productId: number | string
      }
    }
  | { type: 'CLEAR_CART' }

const getProductId = (product: CartItem['product']): string | number => {
  return typeof product === 'object' ? product.id : product
}

const calculateCartTotals = (items: CartItem[] | undefined): Cart['totals'] => {
  if (!items) return { cartTotal: 0, cartThanklys: 0, cartShipping: 0 }

  items.forEach((item) => {
    item.receivers?.forEach((receiver) => {
      receiver.totals = {
        receiverThankly: item.productPrice || 0,
        // receiverShipping: 0,
        receiverTotal: item.productPrice || 0,
      }
    })

    item.totals = {
      itemThanklys:
        item.receivers?.reduce((sum, receiver) => sum + receiver.totals.receiverThankly, 0) || 0,
      // itemShipping: item.receivers?.reduce((sum, receiver) => sum + receiver.totals.receiverShipping, 0) || 0,
      itemTotal:
        item.receivers?.reduce((sum, receiver) => sum + receiver.totals.receiverTotal, 0) || 0,
    }

    // item.totals.itemShipping = itemShipping
  })

  return items.reduce(
    (totals, item) => ({
      cartTotal: totals.cartTotal + (item.totals?.itemTotal || 0),
      cartThanklys: totals.cartThanklys + (item.totals?.itemThanklys || 0),
      cartShipping: totals.cartShipping + (item.totals?.itemShipping || 0),
    }),
    { cartTotal: 0, cartThanklys: 0, cartShipping: 0 },
  )
}

export const cartReducer = (cart: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'SET_CART': {
      return action.payload
    }

    case 'MERGE_CART': {
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
                itemTotal:
                  (acc[existingItemIndex].totals?.itemTotal || 0) + (item.totals?.itemTotal || 0),
                itemThanklys:
                  (acc[existingItemIndex].totals?.itemThanklys || 0) +
                  (item.totals?.itemThanklys || 0),
                itemShipping:
                  (acc[existingItemIndex].totals?.itemShipping || 0) +
                  (item.totals?.itemShipping || 0),
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
      const { product, productPrice } = action.payload
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
        productPrice: productPrice,
        receivers: [],
        totals: {
          itemTotal: 0,
          itemThanklys: 0,
          itemShipping: null,
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
            addressLine1: null,
            addressLine2: null,
            city: null,
            state: null,
            postcode: null,
            shippingMethod: null,
            totals: {
              receiverTotal: productPrice,
              receiverThankly: productPrice,
              receiverShipping: null,
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
                itemTotal: (item.totals?.itemTotal || 0) + (receiver.totals?.receiverTotal || 0),
                itemThanklys:
                  (item.totals?.itemThanklys || 0) + (receiver.totals?.receiverThankly || 0),
                itemShipping:
                  (item.totals?.itemShipping || 0) + (receiver.totals?.receiverShipping || 0),
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

      console.log('FUCKING CART --', cart)
      const updatedItems =
        cart.items?.map((item) => {
          // find matching product
          // console.log('FIRST ITEM -- ', item)

          console.log('FIRST ITEM -- ', getProductId(item.product))
          console.log('FIRST ITEM -- ', productId)

          if (getProductId(item.product) === productId) {
            console.log('product --', productId)
            // find matching receiver
            const receiverToCopy = item.receivers?.find((r) => r.id === receiverId)
            console.log('copiedreceiver --', receiverToCopy)
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
                  itemTotal:
                    (item.totals?.itemTotal || 0) + (newReceiver.totals?.receiverTotal || 0),
                  itemThanklys:
                    (item.totals?.itemThanklys || 0) + (newReceiver.totals?.receiverThankly || 0),
                  itemShipping:
                    (item.totals?.itemShipping || 0) + (newReceiver.totals?.receiverShipping || 0),
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
            receiver.id === receiverId ? { ...receiver, ...updatedFields } : receiver,
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
      const { productId, receiverId, shippingMethod } = action.payload
      const updatedItems = cart.items?.map((item) => {
        if (getProductId(item.product) === productId) {
          const updatedReceivers = item.receivers?.map((receiver) =>
            receiver.id === receiverId ? { ...receiver, shippingMethod } : receiver,
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

    case 'CLEAR_CART': {
      return {
        ...cart,
        items: [],
        totals: {
          cartTotal: 0,
          cartThanklys: 0,
          cartShipping: 0,
        },
      }
    }

    default: {
      return cart
    }
  }
}
