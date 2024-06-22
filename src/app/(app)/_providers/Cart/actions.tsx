// server action to set and update cart data
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import type { Cart, Product, User } from '@payload-types'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { uuid } from '@/utilities/uuid'

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
        totals: {
          orderValue: 0,
          shipping: 0,
          thanklys: 0,
        },
      },
    })

    if (cart) {
      // console.log('saving cookie...')
      const expiryDate = new Date()
      expiryDate.setMinutes(expiryDate.getMinutes() + 60)

      const cookieStore = cookies()
      cookieStore.set('cartId', cart.id.toString(), { expires: expiryDate })
      console.log('cookie saved...cartId:', cart.id)
      // do i need this here?
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
  if (!cartId) {
    cartId = getCartId()
  }

  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })
  let cart = null

  try {
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

    // Why Use revalidatePath for Cart Page with Server Components?
    // Targeted Revalidation: revalidatePath allows you to specify exact paths that should be revalidated when the cart data changes. This is ideal for pages like a cart page where you want specific UI components to update immediately upon cart changes.
    // Clear Intent: Using revalidatePath('/cart'), for example, explicitly tells Next.js to refresh the cache for the /cart path. This ensures that any server components or static content associated with the cart page are updated with the latest data.

    revalidatePath('/shop/cart')
  } catch (error) {
    console.error(`Error fetching cart: ${cartId}`, error)
  } finally {
    return cart || null
  }
}

//////////////////////////////////////////////////////////
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
  })
  cookieStore.delete('cartId')
}

//////////////////////////////////////////////////////////
function getCartId() {
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')?.value
  return cartId
}

//////////////////////////////////////////////////////////
export async function addProduct(product: Product) {
  // console.log('product to be added -- ', product)

  try {
    // see if there's an existing cart to add the product to
    const cartId = getCartId()
    let cart = await getCart(cartId, 0)

    // if not, create a new cart
    if (!cartId || cartId === '' || !cart) {
      console.log('No cart id found, creating new cart.')
      cart = await createCart()
    }

    // then add the Product to the cart including an initial Receiver to this product
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    // get cart.items array
    const items = cart?.items || []

    items.push({
      product: product.id,
      productPrice: Math.min(product.price ?? 0, product.promoPrice ?? 0),
      // add one empty receiver the first time a product is added
      receivers: [
        {
          id: `${Date.now()}`, // Use a unique temporary ID
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
        },
      ],
    })

    // console.log('product added to cart -- ', cart)

    cart = updateCartTotals(cart)

    // Result will be the updated cart document.
    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: [...items] },
      depth: 0,
    })
    // console.log('cart result --', result)
    revalidatePath('/shop/cart')

    return result
  } catch (e: any) {
    console.log(e.message)
    return 'Error adding item to cart.'
  }
}

//////////////////////////////////////////////////////////
export async function addReceiver(productId: number | string, newReceiver: any) {
  try {
    const cartId = getCartId()
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
    const updatedReceivers = [...cart.items[itemIndex].receivers, newReceiver]
    cart.items[itemIndex].receivers = updatedReceivers

    // Simplify the payload to include only necessary fields
    const simplifiedItems = cart.items.map((item: any) => ({
      ...item,
      product: item.product.id || item.product,
    }))

    // Update cart totals
    cart = updateCartTotals(cart)

    // Update the cart on the server
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: simplifiedItems },
      depth: 2, // Adjust depth as needed
    })

    console.log('Updated cart after adding receiver:', result)
    revalidatePath('/shop/cart')
    return result
  } catch (error: any) {
    console.error('Error adding receiver:', error.message)
    throw new Error('Error adding receiver')
  }
}

//////////////////////////////////////////////////////////
export async function removeReceiver(cartItemId: string, receiverId: string) {
  console.log('Attempting to delete receiver -- ', receiverId)
  console.log('For cart item -- ', cartItemId)
  try {
    let cartId = getCartId()
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

    // console.log('Original cart items:', JSON.stringify(cart.items, null, 2))

    // Remove receiver from the cart items array
    cart.items = cart.items
      .map((item: any) => {
        console.log(`Checking item with id: ${item.id}`)
        if (item.id === cartItemId) {
          console.log(`Found matching item. Receivers before:`, item.receivers.length)
          console.log('Receivers:', JSON.stringify(item.receivers, null, 2))
          const updatedReceivers = item.receivers.filter((receiver: any) => {
            const keep = receiver.id !== receiverId
            console.log(`Receiver ${receiver.id}: keep = ${keep}`)
            return keep
          })
          console.log(`Receivers after:`, updatedReceivers.length)
          return {
            ...item,
            receivers: updatedReceivers,
          }
        }
        return item
      })
      .filter((item: any) => item.receivers && item.receivers.length > 0)

    console.log('Updated cart items:', JSON.stringify(cart.items, null, 2))

    cart = updateCartTotals(cart)

    // Simplify the payload to include only necessary fields
    const simplifiedItems = cart.items?.map((item: any) => ({
      ...item,
      product: item.product.id || item.product,
    }))

    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: simplifiedItems },
      depth: 2, // Adjust depth as needed
    })

    revalidatePath('/shop/cart')
    return result
  } catch (error: any) {
    console.error('Error removing receiver:', error.message)
    throw new Error(`Error removing receiver: ${error.message}`)
  }
}

//////////////////////////////////////////////////////////
export async function removeProduct(cartItemId: string) {
  console.log('Attempting to delete product with cart item ID:', cartItemId)
  try {
    let cartId = getCartId()
    if (!cartId || cartId === '') {
      console.log('No cart id found, nothing to do...')
      return null
    }

    console.log('Cart id found, getting cart details from db....')
    let cart = await getCart(cartId, 2) // Adjust the depth as needed
    if (!cart) {
      console.log('Cart not found, nothing to do...')
      return null
    }

    // console.log('Original cart items:', JSON.stringify(cart.items, null, 2))

    // Remove the entire item from the cart
    cart.items = cart.items.filter((item: any) => item.id !== cartItemId)

    console.log('Updated cart items:', JSON.stringify(cart.items, null, 2))
    cart = updateCartTotals(cart)

    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let result

    if (cart.items.length === 0) {
      // If the cart is now empty, delete the entire cart
      console.log('Cart is now empty. Deleting the entire cart.')
      const result = await payload.delete({
        collection: 'carts',
        where: { id: { equals: cart.id } },
        depth: 0,
      })

      // Clear the cart ID from the cookie or wherever it's stored
      const cookieStore = cookies()
      cookieStore.delete('cartId')
    } else {
      // Update the cart with the remaining items
      result = await payload.update({
        collection: 'carts',
        id: cart.id,
        data: { items: cart.items },
        depth: 2, // Adjust depth as needed
      })
    }

    revalidatePath('/shop/cart')
    return result
  } catch (error: any) {
    console.error('Error removing product:', error.message)
    throw new Error(`Error removing product: ${error.message}`)
  }
}

//////////////////////////////////////////////////////////
export async function copyReceiver(cartItemId: string, receiverId: string) {
  console.log('Attempting to copy receiver -- ', receiverId)
  console.log('For cart item -- ', cartItemId)
  try {
    let cartId = getCartId()
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

    // console.log('Original cart items:', JSON.stringify(cart.items, null, 2))

    // Copy receiver in the cart items array
    cart.items = cart.items.map((item: any) => {
      console.log(`Checking item with id: ${item.id}`)
      if (item.id === cartItemId) {
        console.log(`Found matching item. Receivers before:`, item.receivers.length)
        console.log('Receivers:', JSON.stringify(item.receivers, null, 2))

        const receiverToCopy = item.receivers.find((receiver: any) => receiver.id === receiverId)
        if (receiverToCopy) {
          const newReceiver = { ...receiverToCopy, id: `${Date.now()}` }
          return {
            ...item,
            receivers: [...item.receivers, newReceiver],
          }
        }
      }
      return item
    })

    console.log('Updated cart items:', JSON.stringify(cart.items, null, 2))
    cart = updateCartTotals(cart)

    // Simplify the payload to include only necessary fields
    const simplifiedItems = cart?.items?.map((item: any) => ({
      ...item,
      product: item.product.id || item.product,
    }))

    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: { items: simplifiedItems },
      depth: 2, // Adjust depth as needed
    })

    revalidatePath('/shop/cart')
    return result
  } catch (error: any) {
    console.error('Error copying receiver:', error.message)
    throw new Error(`Error copying receiver: ${error.message}`)
  }
}

//////////////////////////////////////////////////////////
function updateCartTotals(cart: Cart): Cart {
  let orderValue = 0
  let thanklys = 0
  let shipping = 0

  // iterate through cart and update totals
  // console.log('Original cart items:', JSON.stringify(cart.items, null, 2))

  cart.items?.forEach((item) => {
    const basePrice = item.productPrice || 0

    // Update each receiver's price and total
    item.receivers?.forEach((receiver) => {
      receiver.totals.receiverThankly = basePrice
      receiver.totals.receiverTotal =
        (receiver.totals.receiverThankly || 0) + (receiver.totals?.receiverShipping || 0)
      if (receiver.totals?.receiverShipping) shipping += receiver.totals?.receiverShipping
    })

    // Update item totals
    item.productPrice =
      item.receivers?.reduce((sum, receiver) => sum + (receiver.totals?.receiverThankly || 0), 0) ||
      0

    item.totals.itemShipping =
      item.receivers?.reduce(
        (sum, receiver) => sum + (receiver.totals?.receiverShipping || 0),
        0,
      ) || 0
    item.totals.itemTotal = item.productPrice + item.totals?.itemShipping

    orderValue += item.totals?.itemTotal || 0
    shipping += item.totals?.itemShipping || 0
  })

  // Calculate thanklys as the sum of all cart item totals
  thanklys = cart.items?.reduce((sum, item) => sum + (item.totals?.itemTotal || 0), 0) || 0
  shipping = cart.items?.reduce((sum, item) => sum + (item.totals?.itemShipping || 0), 0) || 0

  console.log('totaled cart:', JSON.stringify(cart, null, 2))

  revalidatePath('/shop/cart')

  return cart
}
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////
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
