'use server'
import { cache } from 'react'
import { Discountcode } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export const validateDiscountCode = cache(async (discountCode: string): Promise<boolean> => {
  //attempt to fetch discount code
  const discount = await fetchDiscountCode(discountCode)
  return !!discount && discount.slug === discountCode.toUpperCase()
})

export const fetchDiscountCode = cache(
  async (discountCode: string): Promise<Discountcode | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let discount: Discountcode | null = null

    const now = new Date()

    const query: any = {
      collection: 'discountcodes',
      limit: 1,
      pagination: false,
      where: {
        and: [
          {
            slug: { equals: discountCode.toUpperCase() },
          },
          { starts: { less_than_equal: now } },
          { expires: { greater_than_equal: now } },
        ],
      },
    }

    try {
      const { docs } = await payload.find(query)
      if (docs && docs[0]) discount = docs[0]
    } catch (error) {
      console.error(`Error fetching discount code: ${discountCode}`, error)
    }

    return discount
  },
)

export const calculateCartDiscount = cache(
  async (discountCode: string, cartTotalCost: number): Promise<number> => {
    //attempt to fetch discount code
    const discount = await fetchDiscountCode(discountCode)
    if (!discount || discount.slug !== discountCode) return 0

    const { discountAmount, discountType } = discount

    switch (discountType) {
      case 'percentOff':
        return -(discountAmount / 100) * cartTotalCost
      case 'dollarsOff':
        if (discountAmount > cartTotalCost) return -cartTotalCost // Edge care where the discount amount is more than the cart total.
        return -discountAmount
      default:
        return 0 //not a valid type
    }
  },
)
