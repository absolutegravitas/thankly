import type { Cart, Product } from '@/payload-types'
import { shippingPrices } from '@/utilities/refData'

export type CartItem = NonNullable<Cart['items']>[number]
type CartType = Cart
type ShippingMethod =
  // | 'free'
  'standardMail' | 'registeredMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

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
    const product = item.product as Product

    item.receivers?.forEach((receiver) => {
      let receiverShipping: number | null = null

      const postalCode = (() => {
        if (typeof receiver.address?.json === 'object' && receiver.address.json !== null) {
          return (receiver.address.json as { [k: string]: unknown })['postalCode'] as
            | string
            | undefined
        }
        return undefined
      })()

      if (product.productType && receiver.shippingMethod && product.shippingClass && postalCode) {
        if (product.productType === 'card') {
          receiverShipping =
            shippingPrices.cards[receiver.shippingMethod as keyof typeof shippingPrices.cards] ??
            null
        } else if (product.productType === 'gift') {
          receiverShipping =
            shippingPrices.gifts.size[
              product.shippingClass as keyof typeof shippingPrices.gifts.size
            ] ?? null

          if (receiverShipping !== null) {
            if (isRegionalPostcode(postalCode)) {
              receiverShipping += shippingPrices.gifts.surcharge.regional
            } else if (isRemotePostcode(postalCode)) {
              receiverShipping += shippingPrices.gifts.surcharge.remote
            }

            if (receiver.shippingMethod === 'expressParcel') {
              receiverShipping += shippingPrices.gifts.surcharge.expressParcel
            }
          }
        }
      }

      receiver.totals = {
        receiverThankly: item.productPrice || 0,
        receiverShipping,
        receiverTotal: (item.productPrice || 0) + (receiverShipping || 0),
      }
    })

    item.totals = {
      itemThanklys:
        item.receivers?.reduce((sum, receiver) => sum + receiver.totals.receiverThankly, 0) || 0,
      itemShipping:
        item.receivers?.reduce(
          (sum, receiver) => sum + (receiver.totals.receiverShipping || 0),
          0,
        ) || 0,
      itemTotal:
        item.receivers?.reduce((sum, receiver) => sum + receiver.totals.receiverTotal, 0) || 0,
    }
  })

  return items.reduce(
    (totals, item) => ({
      cartThanklys: totals.cartThanklys + (item.totals?.itemThanklys || 0),
      cartShipping: totals.cartShipping + (item.totals?.itemShipping || 0),
      cartShippingDiscount:
        totals.cartTotal + (item.totals?.itemTotal || 0) > 150
          ? -1 * (totals.cartShipping + (item.totals?.itemShipping || 0))
          : 0,
      cartTotal: totals.cartTotal + (item.totals?.itemTotal || 0),
    }),
    { cartTotal: 0, cartThanklys: 0, cartShipping: 0, cartShippingDiscount: 0 },
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
            address: { addressLine1: null, addressLine2: null, formattedAddress: null, json: null },
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

      const updatedItems =
        cart.items?.map((item) => {
          // find matching product

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

      console.log('payload ', action.payload)
      const updatedItems = cart.items?.map((item) => {
        if (getProductId(item.product) === productId) {
          const updatedReceivers = item.receivers?.map((receiver) =>
            receiver.id === receiverId ? { ...receiver, ...updatedFields } : receiver,
          )
          return { ...item, receivers: updatedReceivers }
        }
        console.log('item ', item)
        return item
      })
      console.log('updatedItems - ', updatedItems)

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

type PostcodeRange = string | [string, string]

const metroPostcodeRanges: PostcodeRange[] = [
  ['1000', '1920'],
  ['2000', '2239'],
  ['2555', '2574'],
  ['2740', '2786'],
  ['3000', '3207'],
  ['3335', '3341'],
  ['3427', '3442'],
  ['3750', '3810'],
  ['3910', '3920'],
  ['3926', '3944'],
  ['3975', '3978'],
  ['3980', '3981'],
  ['5000', '5171'],
  ['5800', '5950'],
  ['6000', '6214'],
  ['6800', '6997'],
  ['8000', '8785'],
]

const regionalPostcodeRanges: PostcodeRange[] = [
  ['2250', '2483'],
  ['2500', '2551'],
  ['2575', '2594'],
  ['2621', '2647'],
  ['2649', '2714'],
  ['2716', '2730'],
  ['2787', '2880'],
  ['2648', '2715'],
  ['2717', '2731'],
  '2739',
  ['3211', '3334'],
  ['3342', '3424'],
  ['3444', '3749'],
  ['3812', '3909'],
  ['3921', '3925'],
  ['3945', '3971'],
  '3979',
  '3994',
  '3996',
  ['4371', '4372'],
  ['4382', '4390'],
  ['4406', '4498'],
  '4581',
  '4611',
  '4613',
  ['4620', '4723'],
  ['5201', '5734'],
  ['6215', '6646'],
  ['7000', '7254'],
  ['7258', '7323'],
]

const remotePostcodeRanges: PostcodeRange[] = [
  ['4724', '4870'],
  ['4872', '4873'],
  ['4877', '4888'],
  '4871',
  '4874',
  '4876',
  ['4890', '4895'],
  ['6701', '6770'],
  ['7255', '7257'],
  ['0800', '0821'],
  ['0828', '0834'],
  ['0870', '0871'],
  '0822',
  ['0835', '0862'],
  ['0872', '0875'],
  ['0880', '0881'],
  ['0885', '0909'],
]

function isInRange(postcode: string, ranges: PostcodeRange[]): boolean {
  return ranges.some((range) => {
    if (typeof range === 'string') {
      return postcode === range
    } else {
      const [start, end] = range
      return postcode >= start && postcode <= end
    }
  })
}

function isMetroPostcode(postcode: string): boolean {
  return isInRange(postcode, metroPostcodeRanges)
}

function isRegionalPostcode(postcode: string): boolean {
  return isInRange(postcode, regionalPostcodeRanges)
}

function isRemotePostcode(postcode: string): boolean {
  return isInRange(postcode, remotePostcodeRanges)
}
