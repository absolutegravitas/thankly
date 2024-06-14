// server action to set and update cart data
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import type { Cart, Product, User } from '@payload-types'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { uuid } from '@/utilities/uuid'

export async function getCart(cartId?: string, depth?: number) {
  if (!cartId) {
    const cookieStore = cookies()
    cartId = cookieStore.get('cartId')?.value
  }

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  let cart = null
  try {
    // Fetching the cart based on the cartId
    const { docs } = await payload.find({
      collection: 'carts',
      where: { id: { equals: cartId } },
      depth: depth || 2, // has to be min of 2 otherwise checkout breaks because media obj is not traversed to
      limit: 1,
      pagination: false,
    })

    cart = docs[0]

    if (cart && cart.items.length === 0) {
      cart = null
    }

    // revalidatePath('/', 'layout')
  } catch (error) {
    console.error(`Error fetching cart: ${cartId}`, error)
  } finally {
    return cart || null
  }
}

export async function createCart() {
  // create the cart and then set the cookie
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  let cart: Cart | null = null

  try {
    // The created cart is returned
    cart = await payload.create({
      collection: 'carts',
      data: {
        items: [],
        totals: {
          orderValue: 0,
          shipping: 0,
          thanklys: 0,
        },
      },
    })

    if (cart) {
      // console.log('saving cookie...')
      // Calculate the expiry date/time for 10 minutes from now
      const expiryDate = new Date()
      expiryDate.setMinutes(expiryDate.getMinutes() + 10)

      const cookieStore = cookies()
      cookieStore.set('cartId', cart.id.toString(), { expires: expiryDate })
      // console.log('cookie saved...cartId:', cart.id)
      revalidatePath('/', 'layout')
    }
  } catch (error: any) {
    console.error(`Error fetching cart.`, error)
  } finally {
    return cart || null
  }
}

export async function clearCart() {
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')?.value
  if (!cartId) return

  // console.log('cartId', cartId)
  // Result will be the now-deleted  document.
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  const result = await payload.delete({
    collection: 'carts',
    where: { id: { equals: cartId } },

    depth: 0,
    // locale: 'en',
    // fallbackLocale: false,
    // user: dummyUser,
    // overrideAccess: false,
    // showHiddenFields: true,
  })
  // console.log(result)
  cookieStore.delete('cartId')
  revalidateTag('fetchProducts')
  revalidatePath('/', 'layout')
}

export const addUserToCart = async (user: User) => {
  // add user to cart
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')?.value
  revalidateTag(`cart-${cartId}`)
}

export async function addProduct(product: Product) {
  console.log('product to be added -- ', product)
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')?.value
    let cart

    if (!cartId || cartId === '') {
      console.log('No cart id found, creating new cart.')
      cart = await createCart()
    } else {
      console.log('Cart id found, getting cart details from db....')
      cart = await getCart(cartId, 0)
      if (!cart) {
        console.log('Cart not found, creating new cart.')
        cart = await createCart()
      }
      console.log('cart retrieved -- ', cart)
    }

    // add product to cart
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    // get cart.items array
    const items = cart?.items || []

    items.push({
      product: product.id,
      price: Math.min(product.price ?? 0, product.promoPrice ?? 0),
      // add one empty receiver the first time a product is added
      receivers: [
        {
          firstName: 'John',
          lastName: 'Smith',
          message:
            'It was the best of times, it was the blurst of times. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id eleifend leo. Nullam aliquet, nisi at congue consectetur, massa ligula lacinia lorem.',
          addressLine1: '123 Fake St',
          addressLine2: null,
          city: 'Melbourne',
          state: 'VIC',
          postcode: '3000',
          shippingOption: 'free',
          receiverPrice: null,
          receiverTotal: null,
          receiverShipping: null,
          // receiverPrice: Math.min(item.product?.price, item.product?.promoPrice),
          // receiverShipping:
          //   item.product?.productType === 'gift' ? 'standardParcel' : 'standardMail',
          // receiverTotal:
          //   Math.min(item.product?.price, item.product?.promoPrice) +
          //     item.product?.productType ===
          //   'gift'
          //     ? 'standardParcel'
          //     : 'standardMail',
        },
      ],
    })

    // console.log('cart items -- ', items)

    // Result will be the updated cart document.
    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: [...items] },
      depth: 0,
    })
    // console.log('cart result --', result)

    // if adding item was successful, we revalidate the cart cache
    revalidateTag(`cart-${cartId}`)
    revalidateTag(`fetchProducts`)
    revalidatePath('/', 'layout')

    return result
  } catch (e: any) {
    console.log(e.message)
    return 'Error adding item to cart.'
  }
}

export async function removeProduct(productId: number | string) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')
    let cart

    if (!cartId) {
      console.log('theres no cart so nothing to remove')
      return
    } else {
      console.log('Cart id found, getting cart details from db.')
      cart = await getCart(cartId.value)
      if (!cart) {
        console.log('Cart not found, nothing to do.')
        return
      }
      // console.log('cart retrieved -- ', cart)
    }

    // find product
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    let items = cart?.items || []
    console.log('cart items -- ', items)

    if (!items || items.length === 0) {
      console.log('no products in cart so nothing to do')
      return
    }

    items = items.filter((item: any) => {
      if (typeof item.product === 'object' && item.product !== null) {
        return item.product.id !== productId
      }
      return item.product !== productId
    })

    // console.log('cart items -- ', items)

    // update cart with revised set of products
    const result = await payload.update({
      collection: 'carts',
      id: cart?.id || cartId,
      data: { items: [...items] },
      depth: 0,
    })

    console.log('cart result --', result)
    // if adding item was successful, we revalidate the cart cache
    revalidateTag(`cart-${cartId}`)
    revalidatePath('/shop/cart')
    revalidatePath('/shop')
  } catch (e: any) {
    console.log(e.message)
    return 'Error adding item to cart.'
  }
}

export async function addReceiver(productId: number | string, newReceiver: any) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')?.value
    let cart

    if (!cartId || cartId === '') {
      console.log('No cart id found, nothing to do...')
      return null
    } else {
      console.log('Cart id found, getting cart details from db....')
      cart = await getCart(cartId, 2) // Adjust the depth as needed
      if (!cart) {
        console.log('Cart not found, nothing to do...')
        return null
      }
    }

    // Find the item in cart's items array with the matching productId
    const itemIndex = cart.items.findIndex((item: any) => item.product?.id === +productId)

    if (itemIndex === -1) {
      throw new Error(`Product with id ${productId} not found in cart`)
    }

    // Add the new receiver to the item's receivers array
    cart.items[itemIndex].receivers.push(newReceiver)

    // Update the cart on the server
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: cart.items },
      depth: 2, // Adjust depth as needed
    })

    console.log('Updated cart after adding receiver:', result)

    // Revalidate tags and paths
    revalidateTag(`cart-${cartId}`)
    revalidatePath('/shop/cart')
    revalidatePath('/shop')

    return result
  } catch (error: any) {
    console.error('Error adding receiver:', error.message)
    throw new Error('Error adding receiver')
  }
}
export async function removeReceiver(productId: number | string, receiverId: number | string) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')?.value
    let cart
    if (!cartId || cartId === '') {
      console.log('No cart id found, nothing to do...')
      return null
    } else {
      console.log('Cart id found, getting cart details from db....')
      cart = await getCart(cartId, 2) // Adjust the depth as needed
      if (!cart) {
        console.log('Cart not found, nothing to do...')
        return null
      }
    }
    // Remove receiver from the cart items array
    cart.items = cart.items.filter((item: any) => {
      if (item.product && item.product.id === +productId) {
        item.receivers = item.receivers.filter((receiver: any) => receiver.id !== receiverId)
      }
      // If the item has no receivers left, remove the item from the cart
      return item.receivers && item.receivers.length > 0
    })

    // Update the cart on the server
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: cart.items },
      depth: 2, // Adjust depth as needed
    })
    console.log('Updated cart after removing receiver:', result)
    // Revalidate tags and paths
    revalidateTag(`cart-${cartId}`)
    revalidatePath('/shop/cart')
    revalidatePath('/shop')
    return result
  } catch (error: any) {
    console.error('Error removing receiver:', error.message)
    throw new Error('Error removing receiver')
  }
}

export async function copyReceiver(productId: number | string, receiverId: number | string) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')?.value
    if (!cartId || cartId === '') {
      console.log('No cart id found, nothing to do...')
      return null
    }

    console.log('Cart id found, getting cart details from db....')
    const cart = await getCart(cartId, 2)
    if (!cart) {
      console.log('Cart not found, nothing to do...')
      return null
    }

    // Ensure the structure of cart items
    if (!cart.items || !Array.isArray(cart.items)) {
      throw new Error('Invalid cart structure: items should be an array')
    }

    const updatedCartData = { ...cart }
    const productIndex = updatedCartData.items.findIndex(
      (item: any) => item.product === +productId || (item.product as Product)?.id === +productId,
    )

    if (productIndex !== -1 && updatedCartData.items) {
      const receiverIndex = updatedCartData.items[productIndex].receivers?.findIndex(
        (receiver: any) => receiver.id === receiverId,
      )
      if (receiverIndex !== -1) {
        const receiverToCopy = updatedCartData.items[productIndex].receivers[receiverIndex]
        const newReceiver = { ...receiverToCopy, id: uuid() }
        updatedCartData.items[productIndex].receivers?.push(newReceiver)
      } else {
        throw new Error('Receiver not found in the cart')
      }
    } else {
      throw new Error('Product not found in the cart')
    }

    // Simplify the payload to include only necessary fields
    const simplifiedItems = updatedCartData.items.map((item: any) => ({
      ...item,
      product: item.product.id || item.product,
    }))

    console.log('Updated cart data:', JSON.stringify(simplifiedItems, null, 2))

    const config = await configPromise
    const payload = await getPayloadHMR({ config })
    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: simplifiedItems },
      depth: 2,
    })
    console.log('Updated cart after copying receiver:', result)

    revalidateTag(`cart-${cartId}`)
    revalidatePath('/shop/cart')
    revalidatePath('/shop')

    return result
  } catch (error: any) {
    console.error('Error copying receiver:', error.message)
    throw new Error('Error copying receiver')
  }
}

export async function isProductInCart(productId: number | string) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')?.value
    let cart

    if (!cartId || cartId === '') {
      // console.log('No cart id found, product not in cart.')
      return false
    } else {
      // console.log('Cart id found, getting cart details from db.')
      cart = await getCart(cartId, 0)
      if (!cart) {
        // console.log('Cart not found, product not in cart.')
        return false
      }
    }

    // find product
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    const items = cart?.items || []
    // console.log('cart items -- ', items)

    if (!items || items.length === 0) {
      return false
    }

    return items.some((item: any) => {
      if (typeof item.product === 'object' && item.product !== null) {
        return item.product.id === productId
      }
      revalidatePath('/', 'layout')
      return item.product === productId
    })
  } catch (e: any) {
    console.log(e.message)
    return false
  }
}

export async function areProductsInCart(productIds: (number | string)[]) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')?.value
    let cart

    if (!cartId) {
      // console.log('No cart id found, products not in cart.')
      return productIds.map(() => false)
    } else {
      // console.log('Cart id found, getting cart details from db.')
      cart = await getCart(cartId, 0)
      if (!cart) {
        // console.log('Cart not found, products not in cart.')
        return productIds.map(() => false)
      }
    }

    const items = cart?.items || []
    const productIdsSet = new Set(productIds)

    // console.log('Product IDs to check:', productIds)
    // console.log('Cart items:', items)

    const results = productIds.map((productId) => {
      const inCart = items.some((item: any) => {
        if (typeof item.product === 'object' && item.product !== null) {
          return item.product.id === productId
        }
        return item.product === productId
      })
      // console.log(`Product ID ${productId} in cart:`, inCart)
      return inCart
    })

    return results
  } catch (e: any) {
    console.log(e.message)
    return productIds.map(() => false)
  }
}
