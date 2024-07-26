import React, { CSSProperties } from 'react'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Product } from '@payload-types'
import { ProductCard } from '@app/_components/ProductCard'

export type ProductGridProps = {
  products: Product[]
  padding?: PaddingProps
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  // console.log('productGrid', products)
  const productLength = products?.length ?? 0
  const hasProducts = Array.isArray(products) && productLength > 0
  const excessLength = productLength > 4 ? 8 - productLength : 4 - productLength
  const wrapperStyle: CSSProperties = {
    '--excess-length-large': excessLength,
    '--excess-length-mid': productLength % 2 === 0 ? 0 : 1,
  } as CSSProperties

  return (
    <React.Fragment>
      {hasProducts && (
        <div className="relative px-4 py-8 sm:px-6 lg:px-8 #bg-gray-100 dark:bg-neutral-900">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 relative"
            style={wrapperStyle}
          >
            {products?.map((product, index) => {
              return (
                <div key={index} className="w-full">
                  <ProductCard
                    className="h-full relative  dark:bg-neutral-800 overflow-hidden transition-all duration-300 ease-in-out  hover:-translate-y-1"
                    {...product}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default ProductGrid
