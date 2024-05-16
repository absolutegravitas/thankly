import Stripe from 'stripe'
import type { Product } from '@payload-types'
import { CollectionAfterDeleteHook } from 'payload/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
})

// doesn't really delete - just soft deletes

export const deleteStripeProduct: CollectionAfterDeleteHook<Product> = async ({
  req, // full express request
  id, // id of document to delete
  doc, // deleted document
}) => {
  try {
    // "deletes" or inactivates all prices below the product on stripe
    const prices = await stripe.prices.list({ product: doc.stripeId || '' })
    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false })
    }

    // "deletes" or inactivates the product on stripe
    await stripe.products.update(doc.stripeId || '', { active: false })
  } catch (error: unknown) {
    req.payload.logger.error(`Error deleting Stripe product: ${error}`)
  }
}
