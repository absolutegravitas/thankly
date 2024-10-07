// This is a server component file in a Next.js 14 application using the App Router.
// The file contains functions for interacting with a Payload CMS backend to manage shopping carts.

'use server'

import { Cart } from '@/payload-types' // Import the Cart type from a local file
import { getPayloadHMR } from '@payloadcms/next/utilities' // Import a utility function from the Payload CMS library
import configPromise from '@payload-config' // Import a configuration object for the Payload CMS

/**
 * Deletes a cart from the Payload CMS backend.
 *
 * @param cart - The cart object to be deleted.
 * @returns A Promise that resolves when the cart is successfully deleted.
 *
 * Performance considerations:
 * - This function relies on the Payload CMS backend, so its performance depends on the backend's responsiveness.
 * - Potential optimization: Implement caching or batching for frequent cart deletions.
 */
export async function deletePayloadCart(cart: Cart) {
  const config = await configPromise // Await the Payload CMS configuration object
  let payload: any = await getPayloadHMR({ config }) // Get the Payload CMS instance with HMR support

  try {
    let { docs } = await payload.delete({
      // Call the delete method on the Payload CMS instance
      collection: 'carts', // The collection to delete from
      where: { cartNumber: { equals: cart.cartNumber } },
    })
  } catch (error) {
    console.error('Error upserting cart:', error) // Log any errors that occur during the delete operation
    throw new Error('Failed to delete cart') // Throw an error for higher-level error handling
  }
}
