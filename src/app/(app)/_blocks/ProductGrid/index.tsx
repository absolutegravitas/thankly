'use client'

import React, { CSSProperties, useState } from 'react'

import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { Product } from '@payload-types'

import classes from './index.module.scss'
import { ProductCard } from '../../_components/cards/ProductCard'

// ported from squaregrid block

export type ProductGridProps = {
  products: Product[] // Array of products
  padding?: PaddingProps
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const [index, setIndex] = useState(0)
  // console.log('products for grid --', products)

  const productLength = products?.length ?? 0
  const hasProducts = Array.isArray(products) && productLength > 0
  const excessLength = productLength > 4 ? 8 - productLength : 4 - productLength

  const wrapperStyle: CSSProperties = {
    '--excess-length-large': excessLength,
    '--excess-length-mid': productLength % 2 === 0 ? 0 : 1,
  } as CSSProperties

  return (
    <BlockWrapper
      settings={{ settings: { theme: 'light' } }}
      // padding={{ ...padding, top: 'large' }}
      className={[classes.ProductGrid].filter(Boolean).join(' ')}
    >
      {/* <BackgroundGrid zIndex={1} /> */}
      <Gutter>
        {hasProducts && (
          <div className={classes.cards}>
            <div
              className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}
              style={wrapperStyle}
            >
              {products?.map((product, index) => {
                return (
                  <div
                    key={index}
                    className={'cols-4 cols-s-8'}
                    onMouseEnter={() => setIndex(index + 1)}
                    onMouseLeave={() => setIndex(0)}
                  >
                    <ProductCard className={classes.card} {...product} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default ProductGrid