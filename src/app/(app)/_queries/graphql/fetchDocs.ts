import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import type { Config } from '@/payload-types'
// import { ORDERS } from '../graphql/orders'
// import { PAGES } from '../graphql/pages'
import { PRODUCTS } from '@/app/(app)/_queries/graphql/products'
import { payloadToken } from '../token'

const queryMap: any = {
  // pages: {
  //   query: PAGES,
  //   key: 'Pages',
  // },
  products: {
    query: PRODUCTS,
    key: 'Products',
  },
  // orders: {
  //   query: ORDERS,
  //   key: 'Orders',
  // },
}

export const fetchDocs = async <T>(
  collection: keyof Config['collections'],
  draft?: boolean,
): Promise<T[]> => {
  if (!queryMap[collection]) throw new Error(`Collection ${collection} not found`)

  let token: RequestCookie | undefined

  if (draft) {
    const { cookies } = await import('next/headers')
    token = cookies().get(payloadToken)
  }

  const docs: T[] = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
    },
    // cache: 'no-store', // requird for payload cloud, not for other self-hosted stuff
    next: { tags: [collection] },
    body: JSON.stringify({
      query: queryMap[collection].query,
    }),
  })
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')

      return res?.data?.[queryMap[collection].key]?.docs
    })

  return docs
}
