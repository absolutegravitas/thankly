// This file contains the 'DefaultHero' component, which is a reusable section component for displaying a hero section with an image background, rich text content, and primary buttons. It is a client component intended to be used with Next.js 14 and the App Router.

// Overview:
// The 'DefaultHero' component renders a hero section with a full-width background image, rich text content, and primary buttons (links). The component receives its data from props and renders the content accordingly. It utilizes various utility components and functions from the project to handle styles, padding, and link rendering.

// Performance considerations:
// - The 'Media' component is optimized for image loading by using the 'priority' and 'width'/'height' props.
// - The 'RichText' component may have potential performance impacts depending on the complexity and size of the rich text content.
// - The rendering of primary buttons is optimized by only rendering the list when 'primaryButtons' is an array.

'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { Media } from '@app/_components/Media'
import { CMSLink } from '@app/_components/CMSLink'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '@app/_css/tailwindClasses'

// Type definition for the props expected by the 'DefaultHero' component
export type DefaultHeroProps = ExtractBlockProps<'fields'>

// The 'DefaultHero' component
export const DefaultHero: React.FC<DefaultHeroProps> = ({ description, theme, media, primaryButtons }) => {
  return (
    <BlockWrapper settings={{ theme }} className={`${getPaddingClasses('hero')}`}>
      <div className="relative w-full xl:h-[900px] lg:h-[700px] md:h-[550px] h-[450px] overflow-hidden flex items-center justify-center">
        <Media
          resource={media}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          priority
          width={2560}
          height={1971}
        />
        <div className="absolute inset-0 flex justify-center">
          <div className={`${classes.defaultHero} text-black text-center px-12 pt-4 lg:pt-12 xl:pt-16`}>
            <div className={`${classes.container} grid`}>
              <div className="cols-16 start-1 cols-m-8 cols-s-8">
                <RichText className={`${classes.richText} font-logo`} content={description} />
                {Array.isArray(primaryButtons) && (
                  <ul className={[classes.primaryButtons].filter(Boolean).join(' ')}>
                    {primaryButtons.map(({ link }, i) => {
                      return (
                        <li key={i}>
                          <CMSLink
                            data={{...link}}
                            className={[classes.primaryButton, 'border-none shadow-xl bg-white'].filter(Boolean).join(' ')}
                            look={{
                              type: 'button',
                              size: 'medium',
                              width: 'narrow',
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
  );
};