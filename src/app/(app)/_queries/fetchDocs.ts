import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import type { Config } from '@payload-types'

import { payloadToken } from './token'
import { queryMaps } from './shared'

export const fetchDocs = async <T>(
  collection: keyof Config['collections'],
  draft?: boolean,
): Promise<T[]> => {
  if (!queryMaps[collection]) throw new Error(`Collection ${collection} not found`)

  let token: RequestCookie | undefined

  if (draft) {
    const { cookies } = await import('next/headers')
    token = cookies().get(payloadToken)
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
      },
      next: { tags: [collection] },
      body: JSON.stringify({
        query: queryMaps[collection].query,
      }),
    })

    const result = await response.json()

    if (result.errors) throw new Error(result?.errors?.[0]?.message ?? 'Error fetching docs')

    const docs = result?.data?.[queryMaps[collection].key]?.docs

    // Ensure that docs is an array before returning it
    return Array.isArray(docs) ? docs : []
  } catch (error) {
    console.error('Error fetching documents:', error)
    return [] // Return an empty array in case of error
  }
}
