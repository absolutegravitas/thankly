import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { defaultCacheRevalidate } from './defaultCacheRevalidate'

interface Props {
  collection: string,
  slug?: string,
  depth?: number,
  context?: any,
  pagination?: boolean,
  revalidate?: number,
}

const FetchItems = async ( {collection, slug, depth = 3, pagination = false, context, revalidate = defaultCacheRevalidate } : Props ) : Promise<any | null> => {
  const cachedFetchItems = unstable_cache(
    async (): Promise<any | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let items: any | null = null

      const query: any = {
        collection: collection,
        depth: depth,
        limit: 1,
        pagination: pagination,
        context: context
      };

      if (slug !== undefined) {
        query.where = { slug: { equals: slug } };
      }

      try {
        const { docs } = await payload.find(query)
      } catch (error) {
        console.error(`Error fetching ${collection}}: ${slug}`, error)
      } finally {
        return items
      }
    },
    [`fetchItems-${collection}-${slug}`], // Include the slug in the cache key
    {
      revalidate: revalidate, // 60 seconds
      tags: [`fetchItems-${collection}-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )
  return cachedFetchItems();
}

export default FetchItems;