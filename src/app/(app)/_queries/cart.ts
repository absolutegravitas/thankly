import { META } from './shared'

export const CART = `cart {
  items {
    product {
      id
      slug
      lowStockThreshold
      stockOnHand
      priceJSON
      ${META}
    }
    quantity
  }
}`
