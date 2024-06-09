import { CART } from './cart'

export const ME_QUERY = `query {
  meUser {
    user {
      id
      email
      name
      lastName
      type
      phoneNumber
      businessName
      billingAddress
      stripeCustomerID
      ${CART}
      roles
    }
    exp
  }
}`
