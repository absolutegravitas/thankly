'use server'
import { Product } from "@/payload-types"
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function fetchProductsByCategory(categoryId: number): Promise<Product[]> {
  const config = await configPromise
  const payload: any = await getPayloadHMR({ config })

  const query: any = {
    collection: 'products',
    depth: 1,
    limit: 15, // Adjust this limit as needed
    where: {
      and: [
        { _status: { equals: 'published' } },
        { productType: { not_equals: 'addOn' } },
        { 'categories.id': { equals: categoryId } },
      ],
    },
  }

  try {
    const productsResult = await payload.find(query)
    return productsResult.docs
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

