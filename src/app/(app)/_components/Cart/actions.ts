// server action to set and update cart data
'use server'

import { revalidateTag } from 'next/cache'
import { unstable_cache } from 'next/cache'
import type { Cart, Product, User } from '@payload-types'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

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
      depth: depth || 1,
      limit: 1,
      pagination: false,
    })

    cart = docs[0]
  } catch (error) {
    console.error(`Error fetching cart: ${cartId}`, error)
  } finally {
    return cart || null
  }
}

// export const getCart = (cartId?: string, depth?: number): Promise<Cart | null> => {
//   if (!cartId) {
//     const cookieStore = cookies()
//     cartId = cookieStore.get('cartId')?.value
//   }

//   const cachedFetchCart = unstable_cache(
//     async (): Promise<Cart | null> => {
//       const config = await configPromise
//       let payload: any = await getPayloadHMR({ config })

//       let cart = null
//       try {
//         // Fetching the cart based on the cartId
//         const { docs } = await payload.find({
//           collection: 'carts',
//           where: { id: { equals: cartId } },
//           depth: depth || 1,
//           limit: 1,
//           pagination: false,
//         })

//         cart = docs[0]
//       } catch (error) {
//         console.error(`Error fetching cart: ${cartId}`, error)
//       } finally {
//         return cart || null
//       }
//     },
//     [`cart-${cartId}`], // Include the cartId in the cache key
//     {
//       revalidate: 60, // 60 seconds
//       // revalidate: 300, // 5 min
//       // revalidate: 3600, // 1 hour
//       // revalidate: 86400, // 1 day
//       // revalidate: 604800, // 1 week
//       // revalidate: 2592000, // 1 month
//       // revalidate: 31536000, // 1 year
//       tags: [`cart-${cartId}`], // Include the cartId in the tags for easier invalidation
//     },
//   )

//   return cachedFetchCart()
// }

export async function createCart() {
  // create the cart and then set the cookie
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  let cart: Cart | null = null

  try {
    // The created cart is returned
    cart = await payload.create({
      collection: 'carts', // required
      data: {},

      //   user: dummyUserDoc, // implement later if user has logged in
      //   overrideAccess: true,
      //   showHiddenFields: false,
    })

    if (cart) {
      console.log('saving cookie...')
      // Calculate the expiry date/time for 10 minutes from now
      const expiryDate = new Date()
      expiryDate.setMinutes(expiryDate.getMinutes() + 10)

      const cookieStore = cookies()
      cookieStore.set('cartId', cart.id.toString(), { expires: expiryDate })
      console.log('cookie saved...cartId:', cart.id)
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

  console.log('cartId', cartId)
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
}

export const addUserToCart = async (user: User) => {
  // add user to cart
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')
  revalidateTag(`cart-${cartId}`)
}

export async function addProduct(product: Product) {
  // console.log('product to be added -- ', product)
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')
    let cart

    if (!cartId || cartId.value === '') {
      console.log('No cart id found, creating new cart.')
      cart = await createCart()
    } else {
      console.log('Cart id found, getting cart details from db....')
      cart = await getCart(cartId.value)
      if (!cart) {
        console.log('Cart not found, creating new cart.')
        cart = await createCart()
      }
      console.log('cart retrieved -- ', cart)
    }

    // add product to cart
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    // push product to cart.items array
    const items = cart?.items || []

    items.push({
      product: product.id,
      price: Math.min(product.price ?? 0, product.promoPrice ?? 0),
    })

    // console.log('cart items -- ', items)

    // Result will be the updated cart document.
    const result = await payload.update({
      collection: 'carts', // required
      id: cart?.id || cartId, // required
      data: { items: [...items] },
      depth: 0,
      //   locale: 'en',
      //   fallbackLocale: false,
      //   user: dummyUser,
      //   overrideAccess: false,
      //   showHiddenFields: true,
    })

    // console.log('cart result --', result)
    // if adding item was successful, we revalidate the cart cache
    revalidateTag(`cart-${cartId}`)
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
      console.log('cart retrieved -- ', cart)
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

    console.log('cart items -- ', items)

    // update cart with revised set of products
    const result = await payload.update({
      collection: 'carts', // required
      id: cart?.id || cartId, // required
      data: { items: [...items] },
      depth: 0,
      //   locale: 'en',
      //   fallbackLocale: false,
      //   user: dummyUser,
      //   overrideAccess: false,
      //   showHiddenFields: true,
    })

    // console.log('cart result --', result)
    // if adding item was successful, we revalidate the cart cache
    revalidateTag(`cart-${cartId}`)
  } catch (e: any) {
    console.log(e.message)
    return 'Error adding item to cart.'
  }
}

export async function updateCart(item: string, action: any, data: {}) {
  // update cart
  const cookieStore = cookies()
  const cartId = cookieStore.get('cartId')
  revalidateTag(`cart-${cartId}`)
}

export async function isProductInCart(productId: number | string) {
  try {
    const cookieStore = cookies()
    const cartId = cookieStore.get('cartId')
    let cart

    if (!cartId) {
      console.log('No cart id found, product not in cart.')
      return false
    } else {
      console.log('Cart id found, getting cart details from db.')
      cart = await getCart(cartId.value, 0)
      if (!cart) {
        console.log('Cart not found, product not in cart.')
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
    const cartId = cookieStore.get('cartId')
    let cart

    if (!cartId) {
      console.log('No cart id found, products not in cart.')
      return productIds.map(() => false)
    } else {
      console.log('Cart id found, getting cart details from db.')
      cart = await getCart(cartId.value, 0)
      if (!cart) {
        console.log('Cart not found, products not in cart.')
        return productIds.map(() => false)
      }
    }

    const items = cart?.items || []
    const productIdsSet = new Set(productIds)

    return items.map((item: any) => {
      if (typeof item.product === 'object' && item.product !== null) {
        return productIdsSet.has(item.product.id)
      }
      return productIdsSet.has(item.product)
    })
  } catch (e: any) {
    console.log(e.message)
    return productIds.map(() => false)
  }
}
