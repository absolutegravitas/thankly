'use server'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart, Product } from '@/payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createCart, getCart, getCartId, getShippingCost } from './cartActions'

//////////////////////////////////////////////////////////
export async function addProduct(product: Product): Promise<Cart> {
  try {
    const cartId = await getCartId()
    let cart = await getCart(cartId, 0)

    if (!cartId || cartId === '' || !cart) cart = await createCart()

    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    const items = cart?.items || []
    const productPrice = Math.min(product.price ?? 0, product.promoPrice ?? 0)

    const newItem = {
      product: product.id, // Ensure this is just the ID
      productPrice: Math.min(product.price ?? 0, product.promoPrice ?? 0),
      receivers: [
        {
          id: `${Date.now()}`,
          firstName: 'John',
          lastName: 'Smith',
          message: 'Add a message with your thankly here...',
          addressLine1: 'Add delivery address here...',
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
      ],
      totals: {
        itemTotal: productPrice,
        itemThanklys: productPrice,
        itemShipping: null,
      },
    }

    items.push(newItem)
    // console.log('Product being added to cart:', newItem)

    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        items: items.map((item: any) => ({
          ...item,
          product: typeof item.product === 'object' ? item.product.id : item.product,
        })),
        // totals: {
        //   cartTotal: items.reduce((total: number, item: any) => total + item.totals.itemTotal, 0),
        //   cartThanklys: items.reduce(
        //     (total: number, item: any) => total + item.totals.itemThanklys,
        //     0,
        //   ),
        //   cartShipping: null,
        // },
      },
      depth: 0,
    })

    // console.log('Updated cart:', result)

    revalidatePath('/shop/cart')
    return result
  } catch (e: any) {
    console.error('Error adding item to cart:', e)
    throw new Error(`Error adding item to cart: ${e.message}`)
  }
}

//////////////////////////////////////////////////////////
export async function removeProduct(cartItemId: string) {
  console.log('Attempting to delete product with cart item ID:', cartItemId)
  try {
    let cartId = await getCartId()
    if (!cartId || cartId === '') return null
    let cart = await getCart(cartId, 2) // Adjust the depth as needed
    if (!cart) return null

    // Remove the entire item from the cart
    cart.items = cart.items.filter((item: any) => item.product.id !== cartItemId)
    // console.log('Updated cart items:', JSON.stringify(cart.items, null, 2))

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
      result = await payload.update({
        collection: 'carts',
        id: cart.id,
        data: {
          items: cart.items.map((item: any) => ({
            ...item,
            product: typeof item.product === 'object' ? item.product.id : item.product,
          })),
          totals: {
            cartTotal: cart.items.reduce(
              (total: number, item: any) => total + item.totals.itemTotal,
              0,
            ),
            cartThanklys: cart.items.reduce(
              (total: number, item: any) => total + item.totals.itemThanklys,
              0,
            ),
            cartShipping: null, // do this via validation function that checks whether address has been populated
          },
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
export async function isProductInCart(productId: number | string) {
  try {
    const cartId = await getCartId()
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
