import type { CollectionBeforeChangeHook } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export const upsertStripeProduct: CollectionBeforeChangeHook = async ({ req, data, operation }) => {
  if (operation === 'create') {
    try {
      // console.log('upsertProduct data', data)

      // Create a new product
      const product = await stripe.products.create({
        name: data.title,
        description: data.shortDescription,
        metadata: {
          slug: data.slug,
          id: data.id,
          stockOnHand: data.stockOnHand,
          lowStockThreshold: data.lowStockThreshold,
          type: data.type,
          shippingSize: data.shippingSize,
        },
      })

      // console.log('stripe product ', product)

      // Create prices if they are provided
      let basePriceId
      let salePriceId

      if (data.prices.basePrice !== 0 && data.prices.basePrice) {
        const stripePrice = await stripe.prices.create({
          product: product.id,
          unit_amount: data.prices.basePrice * 100,
          currency: 'aud',
        })
        await stripe.products.update(product.id, {
          default_price: stripePrice.id,
        })
        basePriceId = stripePrice.id
      }
      // console.log('basePriceId', basePriceId)

      if (data.prices.salePrice !== 0 && data.prices.salePrice) {
        const stripesalePrice = await stripe.prices.create({
          product: product.id,
          unit_amount: data.prices.salePrice * 100,
          currency: 'aud',
        })
        await stripe.products.update(product.id, {
          default_price: stripesalePrice.id,
        })
        salePriceId = stripesalePrice.id
      }

      // console.log('salePriceId ', salePriceId)

      // Return the object with the latest priceId and salePriceId
      return {
        ...data,
        stripe: {
          productId: product.id,
          basePriceId: basePriceId,
          salePriceId: salePriceId,
        },
      }
    } catch (error: unknown) {
      req.payload.logger.error(`Error creating Stripe product: ${error}`)
    }
  }

  if (operation === 'update' && data.stripe?.productId) {
    try {
      if (typeof data.stripe.productId !== 'string') {
        throw new Error('Invalid Stripe product ID')
      }

      const product = await stripe.products.update(data.stripe.productId, {
        name: data.title,
        description: data.shortDescription,
        metadata: {
          slug: data.slug,
          id: data.id,
          stockOnHand: data.stock?.stockOnHand,
          lowStockThreshold: data.stock?.lowStockThreshold,
          type: data.productType,
        },
      })

      let updatedBasePriceId = data.stripe.basePriceId
      let updatedsalePriceId = data.stripe.salePriceId

      if (data.prices?.basePrice) {
        if (updatedBasePriceId) {
          await stripe.prices.update(updatedBasePriceId, {
            active: true,
            nickname: 'Base Price',
          })
        } else {
          const newBasePrice = await stripe.prices.create({
            product: data.stripe.productId,
            unit_amount: data.prices.basePrice * 100,
            currency: 'aud',
          })
          updatedBasePriceId = newBasePrice.id
        }
      }

      if (data.prices?.salePrice) {
        if (updatedsalePriceId) {
          await stripe.prices.update(updatedsalePriceId, {
            active: true,
            nickname: 'Promo Price',
          })
        } else {
          const newsalePrice = await stripe.prices.create({
            product: data.stripe.productId,
            unit_amount: data.prices.salePrice * 100,
            currency: 'aud',
          })
          updatedsalePriceId = newsalePrice.id
        }
      }

      return {
        ...data,
        stripe: {
          ...data.stripe,
          basePriceId: updatedBasePriceId,
          salePriceId: updatedsalePriceId,
        },
      }
    } catch (error: unknown) {
      req.payload.logger.error(`Error updating Stripe product: ${error}`)
    }
  }

  return data
}
