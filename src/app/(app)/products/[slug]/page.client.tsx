'use client'
import React from 'react'

import { useLivePreview } from '@payloadcms/live-preview-react'

import { Product } from '@payload-types'
import Blocks from '@app/_blocks'

export const ProductTemplate: React.FC<{ product: Product }> = ({ product }) => {
  // const { data } = useLivePreview({
  //   serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  //   depth: 2,
  //   initialData: product,
  // })

  // const { layout } = data
  // console.log('pagedata // ', JSON.stringify(page))
  // use pagedata to render basic content or blocks client side
  // console.log('pagedata //', JSON.stringify(page?.layout?.root?.children))

  return (
    <React.Fragment>
      <Blocks
        blocks={product?.layout?.root?.children}
        // locale="en"
        // disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'titleOnly'}
      />
    </React.Fragment>
  )
}
