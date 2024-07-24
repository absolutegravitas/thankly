import { revalidatePath, unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Page } from '@payload-types'

export const fetchPage = (slug: string): Promise<Page | null> => {
  const cachedFetchPage = unstable_cache(
    async (): Promise<Page | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })

      let page = null
      try {
        // console.log('fetchPage slug //', slug) // should be 'home' if it's null

        const { docs } = await payload.find({
          collection: 'products',
          where: { slug: { equals: slug } },
          depth: 3,
          limit: 1,
          pagination: false,
        })

        page = docs[0]
      } catch (error) {
        console.error(`Error fetching product: ${slug}`, error)
      } finally {
        return page || null
      }
    },
    [`fetchPage-${slug}`], // Include the slug in the cache key
    {
      revalidate: 60, // 60 seconds
      // revalidate: 300, // 5 min
      // revalidate: 3600, // 1 hour
      // revalidate: 86400, // 1 day
      // revalidate: 604800, // 1 week
      // revalidate: 2592000, // 1 month
      // revalidate: 31536000, // 1 year
      tags: [`fetchPage-${slug}`], // Include the slug in the tags for easier invalidation
    },
  )

  return cachedFetchPage()
}

export const fetchPageSlugs = unstable_cache(
  async (): Promise<{ slug: string }[]> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    try {
      const { docs } = await payload.find({
        collection: 'pages',
        depth: 0,
        pagination: false,
      })

      console.log('docs', docs)

      if (!docs || docs.length === 0) {
        console.log('No pages found')
        return []
      }

      console.log('Found pages list')

      return docs
        .map((page: Page) => ({
          slug: page.slug || '',
        }))
        .filter((item: any) => item.slug !== '') // Filter out any empty slugs
    } catch (error) {
      console.error('Error fetching pages:', error)
      return []
    }
  },
  ['fetchProductSlugs'],
  {
    revalidate: 60, // 10 seconds
    tags: ['fetchProductSlugs'],
  },
)
