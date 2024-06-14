import { META } from './meta'

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
