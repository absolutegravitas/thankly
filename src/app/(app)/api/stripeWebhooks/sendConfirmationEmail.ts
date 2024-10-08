'use server'

// Import relevant types from '@/payload-types'
import { Order } from '@/payload-types'
// Import the React component for the order confirmation email
import OrderConfirmationEmail from '@app/_emails/order-confirmation'
// Import the Resend library for sending emails
import { Resend } from 'resend'

// Initialize the Resend client with the API key from the environment variable
const resend = new Resend(process.env.RESEND_KEY)

// Function to send a confirmation email for a given order
export async function sendConfirmationEmail(order: Order) {
  try {
    // Retrieve the recipient's email and name from the order data, or set to null if not available
    const recipientEmail = order.billing?.email || null
    const recipientFirstName = order.billing?.firstName || null
    const recipientLastName = order.billing?.lastName || null

    // Initialize an array of email recipients with the hardcoded development emails
    let toEmails: string[]

    // If the recipient's email is available, add it to the recipients array
    if (recipientEmail) {
      toEmails.unshift(recipientEmail)
    }

    // Send the email using the Resend client
    await resend.emails.send({
      from: process.env.RESEND_DEFAULT_EMAIL || 'no-reply@thankly.co', // Use the default email from environment variable, or fallback to 'no-reply@thankly.co'
      to: toEmails, // Send to the recipients array
      subject: `${recipientFirstName ? recipientFirstName + ', y' : 'Y'}our order is confirmed #${order.orderNumber}`, // Construct the email subject line with the recipient's name (if available) and the order number

      // Pass the order data to the OrderConfirmationEmail component to generate the email content
      react: OrderConfirmationEmail(order),
    })
    console.log(`Confirmation email sent for order ${order.orderNumber}`) // Log a success message with the order ID
  } catch (error) {
    console.error('Error sending confirmation email:', error) // Log any errors that occurred during email sending
  }
}
