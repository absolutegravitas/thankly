'use server'
import { headers, cookies } from 'next/headers'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Cart } from '@/payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getCart, getCartId, getShippingCost } from './cartActions'

//////////////////////////////////////////////////////////
export async function addReceiver(productId: number | string, newReceiver: any) {
  try {
    const cartId = await getCartId()
    let cart

    if (!cartId || cartId === '') {
      console.log('No cart id found, nothing to do...')
      return null
    } else {
      console.log('Cart id found, getting cart details from db....')
      cart = await getCart(cartId, 2) // Adjust the depth as needed
      if (!cart) return null
    }

    // Find the item in cart's items array with the matching productId
    const itemIndex = cart.items.findIndex((item: any) => item.product?.id === +productId)
    if (itemIndex === -1) throw new Error(`Product with id ${productId} not found in cart`)

    // Add the new receiver to the item's receivers array
    // when adding a receiver, there should be some receiver totals calculated BUT no shipping totals calculated because address / shipping option hasnt been supplied
    newReceiver.totals = {
      receiverTotal: Math.min(
        cart.items[itemIndex].product.price ?? 0,
        cart.items[itemIndex].product.promoPrice ?? 0,
      ),
      receiverThankly: Math.min(
        cart.items[itemIndex].product.price ?? 0,
        cart.items[itemIndex].product.promoPrice ?? 0,
      ),
      receiverShipping: null,
    }

    const updatedReceivers = [...cart.items[itemIndex].receivers, newReceiver]
    cart.items[itemIndex].receivers = updatedReceivers

    // Simplify the payload to include only necessary fields
    const simplifiedItems = cart.items.map((item: any) => ({
      ...item,
      product: item.product.id || item.product,
    }))

    // Update the cart on the server
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        items: simplifiedItems,
        totals: {
          cartTotal: simplifiedItems.reduce(
            (total: number, item: any) => total + item.totals.itemTotal,
            0,
          ),
          cartThanklys: simplifiedItems.reduce(
            (total: number, item: any) => total + item.totals.itemThanklys,
            0,
          ),
          cartShipping: null, // do this via validation function that checks whether address has been populated
        },
      },
      depth: 2, // Adjust depth as needed
    })

    // console.log('Updated cart after adding receiver:', result)
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
    let cartId = await getCartId()
    let cart

    if (!cartId || cartId === '') {
      console.log('No cart id found, nothing to do...')
      return null
    } else {
      console.log('Cart id found, getting cart details from db....')
      cart = await getCart(cartId, 2) // Adjust the depth as needed
      if (!cart) return null
    }

    // console.log('Original cart items:', JSON.stringify(cart.items, null, 2))

    // Copy receiver in the cart items array
    cart.items = cart.items.map((item: any) => {
      console.log(`Checking item with id: ${item.id}`)
      if (item.id === cartItemId) {
        // console.log(`Found matching item. Receivers before:`, item.receivers.length)
        // console.log('Receivers:', JSON.stringify(item.receivers, null, 2))

        const receiverToCopy = item.receivers.find((receiver: any) => receiver.id === receiverId)
        if (receiverToCopy) {
          let newReceiver = { ...receiverToCopy, id: `${Date.now()}` }
          // redo totals for this new receiver if needed
          if (newReceiver.postcode != null && newReceiver.shippingMethod != null) {
            //update shipping cost
            newReceiver.totals.receiverShipping = getShippingCost(
              item.product.productType,
              newReceiver.shippingMethod,
              newReceiver.postcode,
              item.product.shippingClass || 'medium',
            )
            newReceiver.totals.receiverTotal =
              newReceiver.totals.receiverShipping + newReceiver.totals.itemThanklys
          }

          return {
            ...item,
            receivers: [...item.receivers, newReceiver],
          }
        }
      }
      return item
    })

    // console.log('Updated cart items:', JSON.stringify(cart.items, null, 2))

    // Simplify the payload to include only necessary fields
    let simplifiedItems = cart?.items?.map((item: any) => ({
      ...item,
      product: item.product.id || item.product,
    }))

    // update cartItem totals

    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    const result = await payload.update({
      collection: 'carts',
      id: cart.id,
      data: {
        items: simplifiedItems,
        totals: {
          // filter from cartitems.totals.itemtotal
          cartTotal: simplifiedItems.reduce(
            (total: number, item: any) => total + item.totals.itemTotal,
            0,
          ),
          cartThanklys: simplifiedItems.reduce(
            (total: number, item: any) => total + item.totals.itemThanklys,
            0,
          ),
          cartShipping: null,
        },
      },
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
    let cartId = await getCartId()
    let cart

    if (!cartId || cartId === '') {
      console.log('No cart id found, nothing to do...')
      return null
    } else {
      console.log('Cart id found, getting cart details from db....')
      cart = await getCart(cartId, 2) // Adjust the depth as needed
      if (!cart) return null
    }

    // Update receiver in the cart items array
    cart.items = cart.items.map((item: any) => {
      console.log(`Checking item with id: ${item.id}`)
      if (item.id === cartItemId) {
        console.log(`Found matching item. Updating receiver...`)
        const updatedReceivers = item.receivers.map((receiver: any) => {
          if (receiver.id === receiverId) {
            let updatedReceiver = { ...receiver }

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
            if (updatedFields.shippingMethod) {
              updatedReceiver.shippingMethod = updatedFields.shippingMethod
            }
            if (updatedFields.message) {
              updatedReceiver.message = updatedFields.message
            }

            // //update shipping cost
            // updatedReceiver.totals.receiverShipping = getShippingCost(
            //   item.product.productType,
            //   updatedReceiver.shippingMethod,
            //   updatedReceiver.postcode,
            //   item.product.shippingClass || 'medium',
            // )
            // updatedReceiver.totals.receiverTotal =
            //   updatedReceiver.totals.receiverShipping + updatedReceiver.totals.itemThanklys

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
    let cartId = await getCartId()
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
