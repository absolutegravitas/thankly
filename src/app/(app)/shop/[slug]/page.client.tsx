'use client'
import React from 'react'

// import { useLivePreview } from '@payloadcms/live-preview-react'

import { Product } from '@payload-types'
import Blocks from '@app/_blocks'
import ProductBlock from '@app/_blocks/ProductBlock'

export const ProductTemplate: React.FC<{ product: Product }> = ({ product }) => {
  // const { data } = useLivePreview({
  //   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  //   depth: 2,
  //   initialData: product,
  // })

  // const { layout } = data

  // console.log('productData ', product)

  // console.log('product info //', JSON.stringify(product))

  // let productInfo = {}
  // if (product) {
  //   productInfo = Object.keys(product).reduce((acc: Record<string, any>, key) => {
  //     if (key !== 'layout' && key !== 'breadcrumbs' && key !== 'meta') {
  //       acc[key] = product[key]
  //     }
  //     return acc
  //   }, {})
  // }

  // generate product info and then any layout blocks added to the page
  return (
    <React.Fragment>
      <ProductBlock {...product} />
      <Blocks blocks={product?.layout?.root?.children} />
    </React.Fragment>
  )
}
