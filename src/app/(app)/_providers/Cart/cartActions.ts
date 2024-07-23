'use server'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, Order } from '@/payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { shippingPrices } from '@/utilities/refData'

//////////////////////////////////////////////////////////

// export async function createOrder(cart: Cart): Promise<Order | null> {
//   const config = await configPromise
//   const payload = await getPayloadHMR({ config })

//   try {
//     if (!cart) {
//       throw new Error('Cart not found')
//     }

//     // Create the draft order
//     const order = await payload.create({
//       collection: 'orders',
//       data: {
//         // orderNumber: Date.now(), // You might want to use a more sophisticated method
//         billing: {
//           // orderedBy: cart.customer,
//           name: cart.billing.name,
//           address: cart.billing.address,
//           email: cart.billing.email,
//           contactNumber: cart.billing.contactNumber,
//           orgName: cart.billing.orgName,
//           orgId: cart.billing.orgId,
//           billingAddress: cart.billing.billingAddress,
//         },
//         status: 'pending',
//         totals: { orderThanklys: 0, orderShipping: 0, orderTotal: 0 },
//         items: cart.items,
//       },
//     })

//     // Don't clear the cart yet, as we're just creating a draft order

//     return order
//   } catch (error) {
//     console.error('Error creating draft order:', error)
//     return null
//   }
// }

//////////////////////////////////////////////////////////
export async function getCartId() {
  return cookies().get('cartId')?.value
}

//////////////////////////////////////////////////////////
export async function createCart() {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let cart: Cart | null = null

  try {
    cart = await payload.create({
      collection: 'carts',
      data: {
        items: [],
        totals: { orderValue: 0, shipping: 0, thanklys: 0 },
      },
    })

    if (cart) {
      const expiryDate = new Date()
      expiryDate.setMinutes(expiryDate.getMinutes() + 60)

      const cookieStore = cookies()
      cookieStore.set('cartId', cart.id.toString(), { expires: expiryDate })
      console.log('cookie saved...cartId:', cart.id)
      revalidatePath('/shop/cart')
    }
  } catch (error: any) {
    console.error(`Error fetching cart.`, error)
  } finally {
    return cart || null
  }
}

//////////////////////////////////////////////////////////
export async function getCart(cartId?: string, depth?: number) {
  const isStaticGeneration = typeof window === 'undefined' && !cookies().has('cartId')

  if (isStaticGeneration) return null
  if (!cartId) cartId = await getCartId()
  if (!cartId) return null

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let cart = null

  try {
    const { docs } = await payload.find({
      collection: 'carts',
      where: { id: { equals: cartId } },
      depth: depth || 2,
      limit: 1,
      pagination: false,
    })

    cart = docs[0]
    if (cart && cart.items.length === 0) cart = null

    revalidatePath('/shop/cart')
  } catch (error) {
    console.error(`Error fetching cart: ${cartId}`, error)
  }

  return cart || null
}

//////////////////////////////////////////////////////////
export async function clearCart() {
  const cartId = await getCartId()
  if (!cartId) return

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  const result = await payload.delete({
    collection: 'carts',
    where: { id: { equals: cartId } },
    depth: 0,
  })

  const cookieStore = cookies()
  cookieStore.delete('cartId')
}

//////////////////////////////////////////////////////////
export async function updateCartTotals(cart: Cart): Promise<Cart> {
  // Iterate through all cart items and receivers
  cart.items =
    cart.items?.map((item) => {
      let itemTotal = 0
      let itemThanklys = 0
      let itemShipping = 0

      // Update receiver totals
      item.receivers = item.receivers?.map((receiver) => {
        const receiverThankly = item.productPrice || 0
        const receiverShipping = receiver.totals?.receiverShipping || 0
        const receiverTotal = receiverThankly + receiverShipping

        itemTotal += receiverTotal
        itemThanklys += receiverThankly
        itemShipping += receiverShipping

        return {
          ...receiver,
          totals: {
            receiverTotal,
            receiverThankly,
            receiverShipping,
          },
        }
      })

      // Update item totals
      return {
        ...item,
        totals: {
          itemTotal,
          itemThanklys,
          itemShipping,
        },
      }
    }) || []

  // Update cart totals
  cart.totals = {
    cartTotal: cart.items.reduce((total, item) => total + (item.totals?.itemTotal || 0), 0),
    cartThanklys: cart.items.reduce((total, item) => total + (item.totals?.itemThanklys || 0), 0),
    cartShipping: cart.items.reduce((total, item) => total + (item.totals?.itemShipping || 0), 0),
  }

  return cart
}

//////////////////////////////////////////////////////////
// export async function getShippingCost(
//   productType: 'card' | 'gift',
//   shippingMethod: string | null | undefined,
//   postcode: string | null | undefined,
//   shippingClass?: undefined | 'mini' | 'small' | 'medium' | 'large',
// ): Promise<number | null> {
//   let shippingCost: number | null = null

//   if (!shippingMethod) return shippingCost // return null if shippping method is not set
//   if (!postcode) return shippingCost // return null if postcode is not set

//   if (productType === 'card') {
//     if (shippingMethod in shippingPrices.cards) {
//       shippingCost = shippingPrices.cards[shippingMethod as keyof typeof shippingPrices.cards]
//     }
//   } else if (productType === 'gift') {
//     shippingCost =
//       shippingPrices.gifts.size[shippingClass as keyof typeof shippingPrices.gifts.size]

//     if (shippingMethod === 'expressParcel') {
//       shippingCost +=
//         shippingPrices.gifts.surcharge[shippingClass as keyof typeof shippingPrices.gifts.surcharge]
//     }

//     if (isRegionalPostcode(postcode)) {
//       shippingCost +=
//         shippingPrices.gifts.surcharge[shippingClass as keyof typeof shippingPrices.gifts.surcharge]
//     }

//     if (isRemotePostcode(postcode)) {
//       shippingCost +=
//         shippingPrices.gifts.surcharge[shippingClass as keyof typeof shippingPrices.gifts.surcharge]
//     }
//   }

//   return shippingCost
// }
