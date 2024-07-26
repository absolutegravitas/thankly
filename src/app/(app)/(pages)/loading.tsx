import React from 'react'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { getPaddingClasses } from '@app/_css/tailwindClasses'

const HeroSkeleton = () => <div className="animate-pulse bg-gray-200 h-96 w-full mb-12"></div>

const FeaturedSectionSkeleton = () => (
  <div className="mb-16">
    <div className="bg-gray-300 h-8 w-1/3 mb-6 rounded"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-gray-200 h-64 rounded-lg"></div>
      ))}
    </div>
  </div>
)

const ContentBlockSkeleton = () => (
  <div className="mb-16">
    <div className="bg-gray-300 h-6 w-1/4 mb-4 rounded"></div>
    <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
    <div className="bg-gray-200 h-4 w-5/6 mb-2 rounded"></div>
    <div className="bg-gray-200 h-4 w-4/5 rounded"></div>
  </div>
)

export default function LoadingHomePage() {
  return (
    <div className="bg-white">
      <BlockWrapper
        settings={{ settings: { theme: 'light' } }}
        className={getPaddingClasses('hero')}
      >
        <Gutter>
          <HeroSkeleton />
          <FeaturedSectionSkeleton />
          <ContentBlockSkeleton />
          <FeaturedSectionSkeleton />
        </Gutter>
      </BlockWrapper>
    </div>
  )
}
