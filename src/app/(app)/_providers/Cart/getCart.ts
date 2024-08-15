'use server'

// Import a utility function from the Payload CMS library
import { getPayloadHMR } from '@payloadcms/next/utilities'

// Import a configuration object for the Payload CMS
import configPromise from '@payload-config'

// Import the Cart type from the payload-types file
import { Cart } from '@/payload-types'

/**
 * Retrieves a cart by its cart number from the Payload CMS.
 *
 * @param cartNumber - The unique identifier for the cart.
 * @returns A Promise that resolves to the Cart object if found, or null if not found or an error occurred.
 */
export async function getCartByNumber(cartNumber: string): Promise<Cart | null> {
  // Await the Payload CMS configuration object
  const config = await configPromise

  // Get the Payload CMS instance with HMR support
  let payload: any = await getPayloadHMR({ config })

  try {
    // Query the 'carts' collection in Payload CMS for the cart with the given cartNumber
    const cart = await payload.find({
      collection: 'carts',
      where: {
        cartNumber: {
          equals: cartNumber,
        },
      },
      limit: 1, // Limit the results to one document
      pagination: false, // Disable pagination
    })

    // If a cart was found, return the first document as a Cart object
    if (cart.docs.length > 0) {
      return cart.docs[0] as Cart
    }
    // If no cart was found, return null
    return null
  } catch (error) {
    // If an error occurred, log the error and return null
    console.error('Error fetching cart:', error)
    return null
  }
}
