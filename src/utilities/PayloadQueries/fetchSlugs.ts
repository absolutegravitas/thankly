import { defaultCacheRevalidate } from "./defaultCacheRevalidate"
import FetchItems from "./fetchItems"

interface Props {
  collection: string,
  revalidate?: number
}


const fetchSlugs = async ( props : Props ) : Promise<string[]> => {
  const items = await FetchItems({...props, depth: 0, context: {select: ['slug']}});

  if (!items || items.length === 0) {
    return []
  }

  return items
    .map((item: any) => ({
      slug: item.slug || '',
    }))
    .filter((item: any) => item.slug !== '') // Filter out any empty slugs
}