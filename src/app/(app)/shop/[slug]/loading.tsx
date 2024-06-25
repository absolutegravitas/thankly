import React from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'

const ProductPageSkeleton = () => (
  <div className="flex space-x-4 animate-pulse">
    <div className="flex-1 space-y-6 py-1">
      <div className="h-2 bg-gray-200 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 bg-gray-200 rounded col-span-2"></div>
          <div className="h-2 bg-gray-200 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div className="w-48 h-48 bg-gray-200 rounded"></div>
  </div>
)

export default function LoadingShop() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="bg-gray-300 h-8 w-1/4 mb-8 rounded"></div>
        <BlockWrapper
          settings={{ settings: { theme: 'light' } }}
          padding={{ top: 'large', bottom: 'large' }}
        >
          <Gutter>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {[...Array(8)].map((_, index) => (
                <ProductPageSkeleton key={index} />
              ))}
            </div>
          </Gutter>
        </BlockWrapper>
      </div>
    </div>
  )
}
