import {
  ARCHIVE_BLOCK,
  CALL_TO_ACTION,
  CONTENT,
  FEATURED_LOGOS_BLOCK,
  GALLERY_BLOCK,
  // MEDIA_BLOCK,
  PRODUCT_FEATURES_BLOCK,
} from './blocks'
import { CATEGORIES } from './categories'
import { META } from './meta'

export const PRODUCTS = `
  query Products {
    Products(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PRODUCT = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        id
        title
        shortDescription
        type
        stripeProductID
        ${CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${ARCHIVE_BLOCK}
          ${FEATURED_LOGOS_BLOCK}
        }
        lowStockThreshold
        stockOnHand
        priceJSON
        relatedProducts {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`
// breaks product ui layout
// ${GALLERY_BLOCK}

export const PRODUCT_PAYWALL = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        paywall {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${ARCHIVE_BLOCK}
          }
        }
      }
    }
  }
`
