'use server'
import { cache } from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

interface Props {
  collection: string
  id?: number
  slug?: string
  where?: object
  depth?: number
  context?: any
  pagination?: boolean
  sort?: string
  limit?: number
}

const FetchItems = cache(
  async ({
    collection,
    id,
    slug,
    where,
    depth = 3,
    limit,
    pagination = false,
    context,
    sort,
  }: Props): Promise<any | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })

    const query: any = {
      collection: collection,
      depth: depth,
      pagination: pagination,
      context: context,
    }

    if (slug !== undefined) {
      query.where = { slug: { equals: slug } }
    } else if (id !== undefined) {
      query.where = { id: { equals: id } }
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
      console.error(`Error fetching ${collection}: ${slug || id}`, error)
      return null
    }
  },
)

export default FetchItems
