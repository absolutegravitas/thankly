import Stripe from 'stripe'
import type { Product } from '@payload-types'
import { CollectionAfterDeleteHook } from 'payload'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

// doesn't really delete - just soft deletes

export const deleteStripeProduct: CollectionAfterDeleteHook<Product> = async ({
  req, // full express request
  id, // id of document to delete
  doc, // deleted document
}) => {
  // console.log('deleteStripeProduct', doc)

  try {
    // just archive the product instead of fucking around with prices

    if (doc.stripe?.productId && typeof doc.stripe.productId === 'string') {
      // const prices = await stripe.prices.list({ product: doc.stripe.productId })
      // // console.log('prices to deactivate', prices)
      // for (const price of prices.data) {
      //   await stripe.prices.update(price.id, { active: false })
      // }

      await stripe.products.update(doc.stripe.productId, { active: false })
    } else {
      req.payload.logger.warn('No valid Stripe product ID found for deletion')
    }
  } catch (error: unknown) {
    req.payload.logger.error(`Error deleting Stripe product: ${error}`)
  }
}
