import React, { CSSProperties } from 'react'

import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { Product } from '@payload-types'

import classes from './index.module.scss'
import { ProductCard } from '@app/_components/ProductCard'
import { getPaddingClasses } from '../../_css/tailwindClasses'

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
      {/* <BlockWrapper
        settings={{ settings: { theme: 'light' } }}
        className={[getPaddingClasses('hero'), 'py-16', classes.ProductGrid]
          .filter(Boolean)
          .join(' ')}
      >
        <Gutter> */}
      {hasProducts && (
        <div className={classes.cards}>
          <div
            className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}
            style={wrapperStyle}
          >
            {products?.map((product, index) => {
              return (
                <div key={index} className={'cols-4 cols-s-8'}>
                  <ProductCard className={classes.card} {...product} />
                </div>
              )
            })}
          </div>
        </div>
      )}
      {/* </Gutter>
      </BlockWrapper> */}
    </React.Fragment>
  )
}
export default ProductGrid
