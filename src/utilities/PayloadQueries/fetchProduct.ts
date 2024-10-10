import { Review } from "@/payload-types"
import FetchItem from "./fetchItem"
import FetchItems from "./fetchItems"
import FetchGlobal from "./fetchGlobal"


// Utility function to fetch product data from the Payload CMS
export const fetchProduct = async (slug: string): Promise<any | null> => {
  try {
    // Fetch the product
    const product = await FetchItem({ collection: 'products', slug: slug, depth: 4 })
    if (!product) {
      return null
    }

    // Check if the product type is 'gift'
    if (product.productType === 'gift') {
      // Fetch the settings to get the default gift card
      const settings = await FetchGlobal({ slug: 'settings', depth: 2 })
      const defaultGiftCard = settings?.defaultGiftCard?.defaultGiftCard

      // If there's a default gift card with media, add its first image to the product's media
      if (defaultGiftCard?.media && defaultGiftCard.media.length > 0) {
        const defaultGiftCardImage = defaultGiftCard.media[0]
        product.media = [...product.media, defaultGiftCardImage]
      }
    }

    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}