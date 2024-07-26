import React from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { getPaddingClasses } from '@app/_css/tailwindClasses'

const SubPageHeaderSkeleton = () => (
  <div className="mb-12">
    <div className="bg-gray-300 h-10 w-2/3 mb-4 rounded"></div>
    <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
    <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
  </div>
)

const ContentSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    <div className="md:col-span-2">
      <div className="bg-gray-300 h-6 w-1/3 mb-4 rounded"></div>
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
      ))}
      <div className="bg-gray-200 h-48 w-full my-6 rounded"></div>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
      ))}
    </div>
    <div>
      <div className="bg-gray-300 h-6 w-1/2 mb-4 rounded"></div>
      <div className="bg-gray-200 h-32 w-full mb-4 rounded"></div>
      <div className="bg-gray-200 h-10 w-full rounded"></div>
    </div>
  </div>
)

export default function LoadingSubPage() {
  return (
    <div className="bg-white">
      <BlockWrapper
        settings={{ settings: { theme: 'light' } }}
        className={getPaddingClasses('hero')}
      >
        <Gutter>
          <SubPageHeaderSkeleton />
          <ContentSkeleton />
        </Gutter>
      </BlockWrapper>
    </div>
  )
}
