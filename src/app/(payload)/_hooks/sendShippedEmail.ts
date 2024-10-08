import { Order, User } from '@/payload-types'
import { Resend } from 'resend'
import OrderShippedEmail from '@app/_emails/order-shipped'
import { fetchUserDetails } from '@/app/(app)/(pages)/account/userActions'

const resend = new Resend(process.env.RESEND_KEY)

export async function sendShippedEmail(order: Order) {
  try {
    console.log(`Preparing to send shipped email for order ${order.orderNumber}`)

    let user: Partial<User> = {}

    if (order.billing?.orderedBy) {
      try {
        user = await fetchUserDetails(order.billing.orderedBy as number)
      } catch (error) {
        console.error(`Error fetching user details for order ${order.orderNumber}:`, error)
      }
    }

    // Fallback to billing information if user details are not available
    if (!user.email && order.billing) {
      user = {
        email: order.billing.email || '',
        firstName: order.billing.firstName || '',
        lastName: order.billing.lastName || '',
      }
    }

    if (!user.email) {
      console.error(`No valid email found for order ${order.orderNumber}. Order details:`, order)
      return
    }

    console.log(`Sending shipped email for order ${order.orderNumber} to ${user.email}`)

    await resend.emails.send({
      from: process.env.RESEND_DEFAULT_EMAIL || 'no-reply@thankly.co',
      to: user.email,
      subject: `${user.firstName}, your order is on it's way!`,
      react: OrderShippedEmail({ order, user }),
    })

    console.log(`Shipped email sent successfully for order ${order.orderNumber}`)
  } catch (error) {
    console.error(`Error sending shipped email for order ${order.orderNumber}:`, error)
  }
}
