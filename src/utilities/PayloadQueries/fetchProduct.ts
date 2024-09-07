import { Review } from "@/payload-types"
import FetchItem from "./fetchItem"
import FetchItems from "./fetchItems"




// Utility function to fetch product data from the Payload CMS
export const fetchProduct = async (slug: string): Promise<any | null> => {
  const product = await FetchItem({ collection: 'products', slug: slug, depth: 4 })
  if (!product) {
    return null
  }
  return product
}