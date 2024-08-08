'use server'

// Import the unstable_cache function from Next.js for caching
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

// Import type definitions for Product, Category, and Tag from @/payload-types
import { Product, Category, Tag } from '@/payload-types'

export const fetchFilters = (): Promise<{ categories: Category[]; tags: Tag[] } | null> => {
  const cachedFetchPage = unstable_cache(
    async (): Promise<{ categories: Category[]; tags: Tag[] } | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })

      let categoriesResult
      let tagsResult

      try {
        const categoriesResponse = await payload.find({
          collection: 'categories',
          limit: 10,
          pagination: false,
          depth: 0,
        })
        categoriesResult = categoriesResponse.docs

        const tagsResponse = await payload.find({
          collection: 'tags',
          limit: 10,
          pagination: false,
          depth: 0,
        })
        tagsResult = tagsResponse.docs

        console.log(JSON.stringify(categoriesResult, tagsResult))
      } catch (error) {
        console.error(`Error fetching categories & tags: `, error)
        return null
      }

      return { categories: categoriesResult, tags: tagsResult }
    },
    [`fetchFilters`],
    {
      revalidate: 100,
      tags: [`fetchFilters`],
    },
  )

  return cachedFetchPage()
}
