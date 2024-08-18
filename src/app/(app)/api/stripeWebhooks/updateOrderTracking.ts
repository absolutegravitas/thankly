'use server'

// Import necessary utilities for fetching and updating data from PayloadCMS
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * Updates the tracking information for a specific item and receiver in an order.
 *
 * @param orderId - The ID of the order to update.
 * @param itemId - The ID of the item within the order to update.
 * @param receiverId - The ID of the receiver associated with the item.
 * @param trackingInfo - An object containing the tracking ID and link.
 *
 * Performance considerations:
 * - Updating nested data structures in real-time could become inefficient for large orders or frequent updates.
 * - Consider batching updates or implementing caching strategies to improve performance.
 *
 * @returns {Promise<void>}
 */
export async function updateOrderTracking(
  orderId: number,
  itemId: string,
  receiverId: string,
  trackingInfo: { trackingId: string; trackingLink: string },
): Promise<void> {
  // Fetch the configuration for the PayloadCMS instance
  const config = await configPromise

  // Initialize the PayloadCMS instance with the fetched configuration
  let payload: any = await getPayloadHMR({ config })

  try {
    // Update the order with the new tracking information
    await payload.update({
      collection: 'orders', // Collection name
      id: orderId, // Order ID
      data: {
        items: {
          [itemId]: {
            receivers: {
              [receiverId]: {
                delivery: {
                  tracking: {
                    id: trackingInfo.trackingId, // Tracking ID
                    link: trackingInfo.trackingLink, // Tracking link
                  },
                },
              },
            },
          },
        },
      },
    })
    console.log(`Updated tracking for order ${orderId}, item ${itemId}, receiver ${receiverId}`)
  } catch (error) {
    console.error('Error updating order tracking:', error)
  }
}