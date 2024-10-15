'use server'
import { cache } from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

interface Props {
  slug: string
  depth?: number
}

const FetchGlobal = cache(async ({ slug, depth = 3 }: Props): Promise<any | null> => {
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
})

export default FetchGlobal
