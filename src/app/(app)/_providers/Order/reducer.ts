import type { Order, Product } from '@/payload-types'
import { shippingPrices } from '@/utilities/refData'

export type OrderItem = NonNullable<Order['items']>[number]
type OrderType = Order
type ShippingMethod =
  // | 'free'
  'standardMail' | 'registeredMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

export type OrderAction =
  | { type: 'SET_ORDER'; payload: Order }
  | { type: 'MERGE_ORDER'; payload: Order }
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
        receiver: NonNullable<NonNullable<Order['items']>[number]['receivers']>[number]
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
        updatedFields: Partial<
          NonNullable<NonNullable<Order['items']>[number]['receivers']>[number]
        >
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

const getProductId = (product: OrderItem['product']): string | number => {
  return typeof product === 'object' ? product.id : product
}

const calculateOrderTotals = (items: OrderItem[] | undefined): Order['totals'] => {
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

export const orderReducer = (order: Order, action: OrderAction): Order => {
  switch (action.type) {
    case 'SET_ORDER': {
      return action.payload
    }

    case 'MERGE_ORDER': {
      const { payload: incomingOrder } = action
      const mergedItems = [...(order.items || []), ...(incomingOrder.items || [])].reduce(
        (acc: OrderItem[], item) => {
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
        ...order,
        items: mergedItems,
        totals: calculateOrderTotals(mergedItems),
      }
    }

    case 'ADD_PRODUCT': {
      const { product, price } = action.payload
      const productId = typeof product === 'object' ? product.id : product

      const existingItem = order.items?.find((item) =>
        typeof item.product === 'object'
          ? item.product.id === productId
          : item.product === productId,
      )

      if (existingItem) {
        return order
      }

      const newItem: OrderItem = {
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

      const updatedItems = [...(order.items || []), newItem]

      const updatedOrder = {
        ...order,
        items: updatedItems,
      }

      return orderReducer(updatedOrder, {
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
      const updatedItems = order.items?.filter(
        (item) => getProductId(item.product) !== productId,
      ) as OrderItem[]

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'ADD_RECEIVER': {
      const { productId, receiver } = action.payload
      const updatedItems =
        order.items?.map((item) => {
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
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'COPY_RECEIVER': {
      const { productId, receiverId } = action.payload

      const updatedItems =
        order.items?.map((item) => {
          // find matching product

          if (getProductId(item.product) === productId) {
            console.log('product --', productId)
            // find matching receiver
            const receiverToCopy = item.receivers?.find((r) => r.id === receiverId)
            console.log('copiedreceiver --', receiverToCopy)
            // receiver found
            if (receiverToCopy) {
              const newReceiver: NonNullable<OrderItem['receivers']>[number] = {
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
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'UPDATE_RECEIVER': {
      const { productId, receiverId, updatedFields } = action.payload

      console.log('payload ', action.payload)
      const updatedItems = order.items?.map((item) => {
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
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'REMOVE_RECEIVER': {
      const { productId, receiverId } = action.payload
      const updatedItems = order.items
        ?.map((item) => {
          if (getProductId(item.product) === productId) {
            const updatedReceivers = item.receivers?.filter(
              (receiver) => receiver.id !== receiverId,
            )
            return { ...item, receivers: updatedReceivers }
          }
          return item
        })
        .filter((item) => item.receivers && item.receivers.length > 0) as OrderItem[]

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'UPDATE_SHIPPING_METHOD': {
      const {
        productId,
        receiverId,
        delivery: { shippingMethod },
      } = action.payload
      const updatedItems = order.items?.map((item) => {
        if (getProductId(item.product) === productId) {
          const updatedReceivers = item.receivers?.map((receiver) =>
            receiver.id === receiverId
              ? {
                  ...receiver,
                  delivery: {
                    ...receiver.delivery,
                    shippingMethod,
                  },
                }
              : receiver,
          )
          return { ...item, receivers: updatedReceivers }
        }
        return item
      }) as OrderItem[]

      return {
        ...order,
        items: updatedItems,
        totals: calculateOrderTotals(updatedItems),
      }
    }

    case 'CLEAR_ORDER': {
      return {
        ...order,
        items: [],
        totals: {
          total: 0,
          cost: 0,
          shipping: 0,
        },
      }
    }

    default: {
      return order
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
