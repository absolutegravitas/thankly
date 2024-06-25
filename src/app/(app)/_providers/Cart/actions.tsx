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
  const isStaticGeneration = typeof window === 'undefined' && !cookies().has('cartId')

  if (isStaticGeneration) {
    return null // Return null during static generation
  }

  if (!cartId) {
    cartId = getCartId()
  }

  if (!cartId) {
    return null // Return null if no cartId is found
  }

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

    if (cart && cart.items.length === 0) {
      cart = null
    }

    revalidatePath('/shop/cart')
  } catch (error) {
    console.error(`Error fetching cart: ${cartId}`, error)
  }

  return cart || null
}

function getCartId() {
  return cookies().get('cartId')?.value
}

// export async function getCart(cartId?: string, depth?: number) {
//   if (!cartId) {
//     cartId = getCartId()
//   }

//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })
//   let cart = null

//   try {
//     const { docs } = await payload.find({
//       collection: 'carts',
//       where: { id: { equals: cartId } },
//       depth: depth || 2, // has to be min of 2 otherwise checkout breaks because media obj is not traversed to
//       limit: 1,
//       pagination: false,
//     })

//     cart = docs[0]

//     if (cart && cart.items.length === 0) {
//       cart = null
//     }

//     // Why Use revalidatePath for Cart Page with Server Components?
//     // Targeted Revalidation: revalidatePath allows you to specify exact paths that should be revalidated when the cart data changes. This is ideal for pages like a cart page where you want specific UI components to update immediately upon cart changes.
//     // Clear Intent: Using revalidatePath('/cart'), for example, explicitly tells Next.js to refresh the cache for the /cart path. This ensures that any server components or static content associated with the cart page are updated with the latest data.

//     revalidatePath('/shop/cart')
//   } catch (error) {
//     console.error(`Error fetching cart: ${cartId}`, error)
//   } finally {
//     return cart || null
//   }
// }

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

//////////////////////////////////////////////////////////
export async function addProduct(product: Product): Promise<Cart> {
  try {
    const cartId = getCartId()
    let cart = await getCart(cartId, 0)

    if (!cartId || cartId === '' || !cart) {
      console.log('No cart id found, creating new cart.')
      cart = await createCart()
    }

    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    const items = cart?.items || []
    const newItem = {
      product: product.id, // Ensure this is just the ID
      productPrice: Math.min(product.price ?? 0, product.promoPrice ?? 0),
      totals: {
        itemTotal: 0,
        itemThanklys: 0,
        itemShipping: 0,
      },
      receivers: [
        {
          firstName: 'John',
          lastName: 'Smith',
          message: 'Add a message with your thankly here...',
          addressLine1: 'Add delivery address here...',
          addressLine2: null,
          city: '',
          state: '',
          postcode: '',
          shippingOption: product.productType === 'card' ? 'standardMail' : 'courierParcel',
          totals: {
            receiverTotal: 0,
            receiverThankly: Math.min(product.price ?? 0, product.promoPrice ?? 0),
            receiverShipping: 0,
          },
          id: `${Date.now()}`,
        },
      ],
    }

    items.push(newItem)

    console.log('Product being added to cart:', newItem)

    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        items: items.map((item: any) => ({
          ...item,
          product: typeof item.product === 'object' ? item.product.id : item.product,
        })),
        totals: {
          cartTotal: 0,
          cartThanklys: 0,
          cartShipping: 0,
        },
      },
      depth: 0,
    })

    console.log('Updated cart:', result)

    revalidatePath('/shop/cart')
    return result
  } catch (e: any) {
    console.error('Error adding item to cart:', e)
    throw new Error(`Error adding item to cart: ${e.message}`)
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
    // cart = updateCartTotals(cart)

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
    // cart = updateCartTotals(cart)

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
export async function updateReceiver(cartItemId: string, receiverId: string, updatedFields: any) {
  console.log('Attempting to update receiver -- ', receiverId)
  console.log('For cart item -- ', cartItemId)
  console.log('Updated fields:', updatedFields)
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

    // Update receiver in the cart items array
    cart.items = cart.items.map((item: any) => {
      console.log(`Checking item with id: ${item.id}`)
      if (item.id === cartItemId) {
        console.log(`Found matching item. Updating receiver...`)
        const updatedReceivers = item.receivers.map((receiver: any) => {
          if (receiver.id === receiverId) {
            const updatedReceiver = { ...receiver }

            // Handle name field
            if (updatedFields.name) {
              updatedReceiver.firstName = updatedFields.name.firstName
              updatedReceiver.lastName = updatedFields.name.lastName
            }

            // Handle address field
            if (updatedFields.address) {
              const addressParts = updatedFields.address.split(', ')
              updatedReceiver.addressLine1 = addressParts[0]
              updatedReceiver.addressLine2 = addressParts.length > 4 ? addressParts[1] : ''
              updatedReceiver.city = addressParts[addressParts.length - 3]
              updatedReceiver.state = addressParts[addressParts.length - 2]
              updatedReceiver.postcode = addressParts[addressParts.length - 1]
            }

            // Handle other fields
            if (updatedFields.shippingOption) {
              updatedReceiver.shippingOption = updatedFields.shippingOption
            }
            if (updatedFields.message) {
              updatedReceiver.message = updatedFields.message
            }

            return updatedReceiver
          }
          return receiver
        })
        return {
          ...item,
          receivers: updatedReceivers,
        }
      }
      return item
    })

    console.log('Updated cart items:', JSON.stringify(cart.items, null, 2))

    // cart = updateCartTotals(cart)

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
    console.error('Error updating receiver:', error.message)
    throw new Error(`Error updating receiver: ${error.message}`)
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

    // cart = updateCartTotals(cart)

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
    cart.items = cart.items.filter((item: any) => item.product.id !== cartItemId)

    console.log('Updated cart items:', JSON.stringify(cart.items, null, 2))
    // cart = updateCartTotals(cart)

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
        data: {
          items: cart.items.map((item: any) => ({
            ...item,
            product: typeof item.product === 'object' ? item.product.id : item.product,
          })),
        },
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
function updateCartTotals(cart: Cart): Cart {
  // iterate through cart and update totals
  // console.log('Original cart items:', JSON.stringify(cart.items, null, 2))

  cart.items?.forEach((item) => {
    const basePrice = item.productPrice || 0

    // Update each receiver's price and total
    item.receivers?.forEach((receiver) => {
      receiver.totals.receiverThankly = basePrice
      // receiver.totals.receiverShipping

      receiver.totals.receiverTotal =
        (receiver.totals.receiverThankly || 0) + (receiver.totals?.receiverShipping || 0)
      // if (receiver.totals?.receiverShipping) shipping += receiver.totals?.receiverShipping
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

    // orderValue += item.totals?.itemTotal || 0
    // shipping += item.totals?.itemShipping || 0
  })

  // Calculate thanklys as the sum of all cart item totals
  // thanklys = cart.items?.reduce((sum, item) => sum + (item.totals?.itemTotal || 0), 0) || 0
  // shipping = cart.items?.reduce((sum, item) => sum + (item.totals?.itemShipping || 0), 0) || 0

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

// export async function isProductInCart(productId: number | string) {
//   const cartId = getCartId()
//   if (!cartId) return false

//   const config = await configPromise
//   let payload: any = await getPayloadHMR({ config })

//   try {
//     const { docs } = await payload.find({
//       collection: 'carts',
//       where: {
//         id: { equals: cartId },
//         'items.product': { equals: productId },
//       },
//       depth: 0,
//       limit: 1,
//     })

//     return docs.length > 0
//   } catch (e: any) {
//     console.error('Error checking if product is in cart:', e.message)
//     return false
//   }
// }
export async function isProductInCart(productId: number | string) {
  try {
    const cartId = getCartId()
    if (!cartId) return false
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
