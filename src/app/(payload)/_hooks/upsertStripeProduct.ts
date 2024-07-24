import type { CollectionBeforeChangeHook } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export const upsertStripeProduct: CollectionBeforeChangeHook = async ({ req, data, operation }) => {
  if (operation === 'create' && !data.stripeId) {
    try {
      // console.log('upsertProduct data', data)

      // Create a new product
      const product = await stripe.products.create({
        name: data.title,
        description: data.shortDescription,
        metadata: {
          slug: data.slug,
          stockOnHand: data.stockOnHand,
          lowStockThreshold: data.lowStockThreshold,
          type: data.type,
        },
      })

      // Create prices if they are provided
      let stripePriceId
      let stripePromoPriceId

      if (data.stripePriceId != 0) {
        const stripePrice = await stripe.prices.create({
          product: product.id,
          unit_amount: data.price * 100,
          currency: 'aud',
        })
        await stripe.products.update(product.id, {
          default_price: stripePrice.id,
        })
        stripePriceId = stripePrice.id
      }

      if (data.stripePromoPriceId != 0) {
        const stripePromoPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: data.promoPrice * 100,
          currency: 'aud',
        })
        stripePromoPriceId = stripePromoPrice.id
      }

      // Return the object with the latest stripePriceId and stripePromoPriceId
      return {
        ...data,
        stripeId: product.id,
        stripePriceId,
        stripePromoPriceId,
      }
    } catch (error: unknown) {
      req.payload.logger.error(`Error creating Stripe product: ${error}`)
    }
  }

  if (operation === 'update' && data.stripeId) {
    try {
      // see if there are any prices
      // console.log('upsertProduct data', data)

      // Update the existing product
      const product = await stripe.products.update(data.stripeId, {
        name: data.title,
        description: data.shortDescription,
        metadata: {
          slug: data.slug,
          stockOnHand: data.stockOnHand,
          lowStockThreshold: data.lowStockThreshold,
          type: data.type,
        },
      })

      // Find the default price if it exists
      const defaultPrice =
        data.prices.find((price: any) => price.default) ||
        (data.prices.length === 1 ? data.prices[0] : undefined)

      // get prices from stripe
      const stripePrices = await stripe.prices.list({
        product: data.stripeId,
      })

      const updatedPrices = await Promise.all(
        data.prices.map(async (price: any) => {
          if (price.stripeId) {
            // stripe price exists, update labels if needed, can't change amount
            // if it's not the default price, then make price inactive
            if (price.id != defaultPrice.id) {
              const stripePrice = await stripe.prices.update(price.stripeId, {
                active: price.active,
                nickname: price.label,
              })
            } else {
              const stripePrice = await stripe.prices.update(price.stripeId, {
                active: true,
                nickname: price.label,
              })
            }
          } else {
            // no stripe id, so price is new, create it

            const stripePrice = await stripe.prices.create({
              product: data.stripeId,
              unit_amount: price.amount * 100,
              currency: 'aud',
            })
            return { ...price, stripeId: stripePrice.id }
          }
        }),
      )

      return {
        ...data,
      }
    } catch (error: unknown) {
      req.payload.logger.error(`Error updating Stripe product: ${error}`)
    }
  }

  return data
}
