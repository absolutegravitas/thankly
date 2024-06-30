'use server'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart } from '@/payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { shippingPrices } from '@/utilities/refData'

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
export async function getShippingCost(
  productType: 'card' | 'gift',
  shippingMethod: string | null | undefined,
  postcode: string | null | undefined,
  shippingClass?: undefined | 'mini' | 'small' | 'medium' | 'large',
): Promise<number | null> {
  let shippingCost: number | null = null

  if (!shippingMethod) return shippingCost // return null if shippping method is not set
  if (!postcode) return shippingCost // return null if postcode is not set

  if (productType === 'card') {
    if (shippingMethod in shippingPrices.cards) {
      shippingCost = shippingPrices.cards[shippingMethod as keyof typeof shippingPrices.cards]
    }
  } else if (productType === 'gift') {
    shippingCost =
      shippingPrices.gifts.size[shippingClass as keyof typeof shippingPrices.gifts.size]

    if (shippingMethod === 'expressParcel') {
      shippingCost +=
        shippingPrices.gifts.surcharge[shippingClass as keyof typeof shippingPrices.gifts.surcharge]
    }

    if (isRegionalPostcode(postcode)) {
      shippingCost +=
        shippingPrices.gifts.surcharge[shippingClass as keyof typeof shippingPrices.gifts.surcharge]
    }

    if (isRemotePostcode(postcode)) {
      shippingCost +=
        shippingPrices.gifts.surcharge[shippingClass as keyof typeof shippingPrices.gifts.surcharge]
    }
  }

  return shippingCost
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
