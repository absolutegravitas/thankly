import React from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'

const ProductCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="bg-gray-300 h-48 w-full mb-4"></div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="bg-gray-300 h-6 w-2/3 rounded"></div>
        <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
      </div>
      <div className="bg-gray-300 h-4 w-3/4 mb-4 rounded"></div>
      <div className="bg-gray-300 h-10 w-full rounded"></div>
      <div className="mt-2 bg-gray-300 h-4 w-1/2 rounded"></div>
    </div>
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
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </Gutter>
        </BlockWrapper>
      </div>
    </div>
  )
}
