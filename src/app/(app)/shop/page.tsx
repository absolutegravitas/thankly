import React from 'react'
import { draftMode } from 'next/headers'
import { fetchShopList } from '@app/_queries/products'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductGrid from '@app/_blocks/ProductGrid'
import { BlockWrapper } from '../_components/BlockWrapper'
import { contentFormats, getPaddingClasses } from '../_css/tailwindClasses'
import { Gutter } from '../_components/Gutter'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const { isEnabled: isDraftMode } = draftMode()
  let products = null

  try {
    products = await fetchShopList()
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return notFound()
  }

  if (!products || products.length === 0) {
    return (
      <BlockWrapper className={getPaddingClasses('hero')}>
        <Gutter>
          <div className="flex flex-col md:flex-row">
            <div className="sm:basis-3/6 md:basis-3/6 lg:basis-4/6 flex align-middle items-center justify-middle pb-3 pt-6 sm:pt-0">
              <span
                className={[
                  contentFormats.global,
                  contentFormats.p,
                  'tracking-tighter sm:tracking-tight text-2xl sm:text-3xl font-medium',
                ].join(' ')}
              >
                Thankly Shop
              </span>
            </div>
            <div className="sm:basis-1/2 md:basis-1/2 lg:basis-2/6 flex items-center justify-end pb-3 gap-4">
              {/* <CartButtons /> */}
            </div>
          </div>
          <p className="mt-4 text-gray-500">There are no products in the shop.</p>
        </Gutter>
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="flex flex-col md:flex-row">
          <div className="sm:basis-3/6 md:basis-3/6 lg:basis-4/6 flex align-middle items-center justify-middle pb-6 pt-6 sm:pt-0">
            <span
              className={[
                contentFormats.global,
                contentFormats.p,
                'tracking-tighter sm:tracking-tight text-2xl sm:text-3xl font-medium',
              ].join(' ')}
            >
              Thankly Shop
            </span>
          </div>
          <div className="sm:basis-1/2 md:basis-1/2 lg:basis-2/6 flex items-center justify-end pb-3 gap-4">
            {/* <CartButtons /> */}
          </div>
        </div>
        <ProductGrid products={products} />
      </Gutter>
    </BlockWrapper>
  )
}
