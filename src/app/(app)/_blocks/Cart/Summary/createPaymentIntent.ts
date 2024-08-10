'use server'

// Import the Stripe library for interacting with the Stripe API
import Stripe from 'stripe'

// Create a Stripe instance using the secret key from the environment variables
// This instance will be used to interact with the Stripe API
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

/**
 * Creates a PaymentIntent with Stripe and returns the client secret for client-side use.
 *
 * @param {number} amount - The amount to charge in the smallest currency unit (e.g., cents for USD)
 * @param {string} [email] - Optional email address for sending receipt
 * @param {Object.<string, string>} [metadata] - Optional metadata to attach to the PaymentIntent
 * @returns {Promise<{ clientSecret: string | null }>} A Promise that resolves to an object containing the client secret or null if an error occurs
 */
export async function createPaymentIntent(
  amount: number,
  email?: string,
  metadata?: { [key: string]: string },
): Promise<{ clientSecret: string | null }> {
  try {
    // Create a PaymentIntent on the Stripe API
    const paymentIntent = await stripe.paymentIntents.create({
      // Convert the amount to the smallest currency unit
      amount: Math.round(amount * 100),
      currency: 'aud', // Set the currency to Australian Dollars
      automatic_payment_methods: {
        enabled: true, // Enable automatic payment methods (e.g., cards, wallets)
      },
      ...(email && { receipt_email: email }), // Include the email for receipt if provided
      ...(metadata && { metadata }), // Include metadata if provided
    })

    // Return the client secret for use on the client side
    return { clientSecret: paymentIntent.client_secret }
  } catch (err: any) {
    // Log any errors that occurred during PaymentIntent creation
    console.error('Error creating PaymentIntent:', err)
    // Return null for the client secret in case of an error
    return { clientSecret: null }
  }
}
