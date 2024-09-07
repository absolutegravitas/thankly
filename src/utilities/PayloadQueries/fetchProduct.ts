import { Review } from "@/payload-types"
import FetchItem from "./fetchItem"
import FetchItems from "./fetchItems"




// Utility function to fetch product data from the Payload CMS
export 
const fetchProduct = async (slug: string): Promise<any | null> => {
  const productData = await FetchItem({ collection: 'products', slug: slug, depth: 4 })

  if (!productData) {
    return null
  }

  //fetch any related reviews
  const reviews = await FetchItems({
    collection: 'reviews',
    where: {products: {contains: slug}},
  })

  const averageStarRating = calculateAverageRating(reviews)

  // set the inCart key so that browser cart can update
  const product = { ...productData, inCart: false, starRating: averageStarRating}

  return product
}


const calculateAverageRating = (reviews : Review[]) => {
  const { sum, count } = reviews.reduce((accumulator, review) => {
    const rating = parseFloat((review.starRating as string));
    if (!isNaN(rating)) {
      return {
        sum: accumulator.sum + rating,
        count: accumulator.count + 1
      };
    }
    return accumulator;
  }, { sum: 0, count: 0 });

  return count > 0 ? Math.ceil(sum / count) : 0;
};