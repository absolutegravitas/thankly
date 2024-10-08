'use server'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { defaultCacheRevalidate } from './defaultCacheRevalidate'

interface Props {
  collection: string,
  id?: number,
  slug?: string,
  where?: object,
  depth?: number,
  context?: any,
  pagination?: boolean,
  revalidate?: number,
  sort?: string
  limit?: number
}

const FetchItems = async ( {collection, id, slug, where, depth = 3, limit, pagination = false, context, revalidate = defaultCacheRevalidate, sort } : Props ) : Promise<any | null> => {
  const cachedFetchItems = unstable_cache(
    async (): Promise<any | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })

      const query: any = {
        collection: collection,
        depth: depth,
        pagination: pagination,
        context: context
      };

      if (slug !== undefined) {
        query.where = { slug: { equals: slug } };
      } else if (id !== undefined) {
        query.where = { id: { equals: id } };
      } else if (where !== undefined) {
        query.where = where
      }

      if (sort !== undefined) {
        query.sort = sort
      }

      if (limit !== undefined) {
        query.limit = limit
      }

      try {
        const { docs } = await payload.find(query)
        return docs
      } catch (error) {
        console.error(`Error fetching ${collection}}: ${slug}`, error)
      }
    },
    [`fetchItems-${collection}-${slug}${id}${where}`], // Include the slug in the cache key
    {
      revalidate: revalidate, // 60 seconds
      tags: [`fetchItems-${collection}-${slug}${id}${where}`], // Include the slug in the tags for easier invalidation
    },
  )
  return cachedFetchItems();
}

export default FetchItems;