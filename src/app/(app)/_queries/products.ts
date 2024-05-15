import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

const payload = await getPayloadHMR({ config: configPromise })

export async function getProduct(slug: string, draft: boolean = false) {
  const product = await payload.find({
    collection: 'products',
    limit: 1,
    where: { slug: { equals: slug } },
    draft: draft,
  })

  // console.log('product found', product)

  return product.docs.length != 0 ? product.docs[0] : null
}

export async function getProducts() {
  const products = await payload.find({
    collection: 'products',
    // where: { slug: { not_equals: 'cart' } },
    draft: false,
    depth: 1,
    pagination: false,
  })

  // console.log('products', products)

  return products.docs.length != 0 ? products.docs : null
}
