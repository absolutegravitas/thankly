import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

const payload = await getPayloadHMR({ config: configPromise })

export async function getOrder(slug: string, draft: boolean = false) {
  const order = await payload.find({
    collection: 'orders',
    limit: 1,
    where: { slug: { equals: slug } },
    draft: draft,
  })

  return order.docs.length != 0 ? order.docs : null
}

export async function getOrders() {
  const orders = await payload.find({
    collection: 'orders',
    // where: { slug: { not_equals: 'cart' } },
    draft: false,
    depth: 1,
    pagination: false,
  })

  return orders.docs.length != 0 ? orders.docs : null
}
