'use server'
import { unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { defaultCacheRevalidate } from './defaultCacheRevalidate'

interface Props {
  slug: string,
  depth?: number,
  revalidate?: number
}

const FetchGlobal = async ( {slug, depth = 3, revalidate = defaultCacheRevalidate } : Props ) : Promise<any | null> => {
  const cachedGlobal = unstable_cache(
    async (): Promise<any | null> => {
      const config = await configPromise
      let payload: any = await getPayloadHMR({ config })
      let settings = null

      try {
        settings = await payload.findGlobal({
          slug: slug,
          depth: depth,
        })
      } catch (error) {
        console.error(`Error fetching global ${slug}`, error)
      }
      return settings
    },
    ['settings'],
    {
      revalidate: revalidate, // 60 seconds

      // revalidate: 60, // 60 seconds
      tags: [`fetchGlobal-${slug}`],
    },
  )
  return cachedGlobal()
}

export default FetchGlobal;