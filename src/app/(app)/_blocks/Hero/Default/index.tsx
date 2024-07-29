// This file contains the 'DefaultHero' component, which is a reusable section component for displaying a hero section with an image background, rich text content, and primary buttons. It is a client component intended to be used with Next.js 14 and the App Router.

'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'

import { Media } from '@app/_components/Media'
import { CMSLink } from '@app/_components/CMSLink'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '@app/_css/tailwindClasses'

// Type definition for the props expected by the 'DefaultHero' component
// It extends the 'ExtractBlockProps' utility type with the 'fields' property
export type DefaultHeroProps = ExtractBlockProps<'fields'>

// The 'DefaultHero' component is a React function component that takes in props of type 'DefaultHeroProps'
export const DefaultHero: React.FC<DefaultHeroProps> = ({
  description,
  theme,
  media,
  primaryButtons,
}) => {
  // The component renders a 'BlockWrapper' component with a background grid
  // The 'BlockWrapper' component applies the specified theme and padding classes
  return (
    <BlockWrapper settings={{ theme }} className={`${getPaddingClasses('hero')}`}>
      {/* The main content area of the hero section */}
      <div className="relative w-full xl:h-[900px] lg:h-[700px] md:h-[550px] h-[450px] overflow-hidden flex items-center justify-center">
        {/* The background image for the hero section */}
        <Media
          resource={media} // The media resource object containing the image data
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          priority // Indicates that this image should be prioritized for loading
          width={2560}
          height={1971}
        />
        {/* The overlay content area */}
        <div className="absolute inset-0 flex justify-center">
          <div className="text-black text-center px-12 pt-4 lg:pt-12 xl:pt-16">
            <div className="grid">
              <div className="cols-16 start-1 cols-m-8 cols-s-8">
                {/* The rich text content area */}
                <RichText className="font-logo" content={description} />
                {/* Check if primaryButtons is an array before rendering */}
                {Array.isArray(primaryButtons) && (
                  <ul className="list-none m-0 p-0 max-w-full">
                    {/* Map over the primaryButtons array and render CMSLink components */}
                    {primaryButtons.map(({ link }, i) => {
                      return (
                        <li key={i}>
                          <CMSLink
                            data={{ ...link }} // Spread the link data object as props
                            look={{
                              theme: 'light',
                              type: 'button',
                              size: 'medium',
                              width: 'wide',
                              variant: 'blocks',
                            }}
                          />
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}
