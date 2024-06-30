// upsert customer once they're created
// update properties if needed e.g. name, email etc.

// import type { BeforeChangeHook } from 'payload/dist/collections/config/types'
import type { CollectionBeforeChangeHook } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

export const upsertStripeCustomer: CollectionBeforeChangeHook = async ({
  req,
  data,
  operation,
}) => {
  // console.log('upsertCustomer data', data)
  if (operation === 'create' && !data.stripeId) {
    try {
      // lookup an existing customer by email and if found, assign the ID to the user
      // if not found, create a new customer and assign the new ID to the user
      const existingCustomer = await stripe.customers.list({
        limit: 1,
        email: data.email,
      })

      if (existingCustomer.data.length) {
        // existing customer found, assign the ID to the user
        return {
          ...data,
          stripeId: existingCustomer.data[0].id,
        }
      }

      // create a new customer and assign the ID to the user
      const customer = await stripe.customers.create({
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        metadata: {
          status: data.status,
          type: JSON.stringify(data.type),
          orgName: data.orgName,
          website: data.website,
        },
      })

      return {
        ...data,
        stripeId: customer.id,
      }
    } catch (error: unknown) {
      req.payload.logger.error(`Error creating Stripe customer: ${error}`)
    }
  }

  if (operation === 'update' && data.stripeId) {
    try {
      const customer = await stripe.customers.update(data.stripeId, {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        metadata: {
          status: data.status,
          type: JSON.stringify(data.type),
          orgName: data.orgName,
          website: data.website,
        },
      })

      return {
        ...data,
      }

      // You may want to handle any response or error here accordingly
    } catch (error: unknown) {
      req.payload.logger.error(`Error updating Stripe customer: ${error}`)
    }
  }

  return data
}
