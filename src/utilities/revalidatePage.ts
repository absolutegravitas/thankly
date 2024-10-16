import type { Payload } from 'payload'

import { revalidatePayload } from './revalidate'

export const revalidatePage = async ({
  doc,
  collection,
  payload,
}: {
  doc: any
  collection: string
  payload: Payload
}): Promise<void> => {
  if (doc._status === 'published') {
    revalidatePayload({ payload, collection, slug: doc.slug })
  }
}
