// This file contains a React component called "Callout" which is used to render a section with a quote, author information, and an optional media (e.g., images). It is designed to work with Next.js 14's App Router and server components.
// The component is a part of a larger application that likely deals with content management and rendering dynamic pages based on data fetched from a CMS (possibly Payload).

import React, { Fragment } from 'react'
import { ArrowIcon } from '@app/_icons/ArrowIcon'

import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import { QuoteIconAlt } from '@app/_icons/QuoteIconAlt'

// ExtractBlockProps is a utility function that extracts the props for a specific block type from the Page data structure.
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
// getPaddingClasses is a function that returns CSS classes related to padding based on the block type.
import { getPaddingClasses } from '../../_css/tailwindClasses'

// The CalloutProps interface defines the props expected by the Callout component.
// It extends the ExtractBlockProps utility type for the 'callout' block type, and adds an optional 'padding' prop of type PaddingProps.
export type CalloutProps = ExtractBlockProps<'callout'> & { padding?: PaddingProps }

export const Callout: React.FC<CalloutProps> = (props) => {
  // Destructure the necessary data from the props object.
  const {
    calloutFields: { content, role, author, logo, images, settings },
  } = props

  // Check if there are any images to be rendered.
  const hasImages = images?.length && images.length > 0

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('callout')}>
      <div className="relative">
        <Gutter>
          <div className="relative flex flex-col items-center pt-20 pb-20 bg-theme sm:pt-8 sm:pb-0">
            <div
              className={[
                'relative h-full flex flex-col justify-between pt-12 sm:pt-0 sm:p-8',
                hasImages
                  ? 'col-start-2 col-end-9 sm:col-start-1 sm:col-end-9'
                  : 'col-start-2 col-end-16 sm:col-start-1 sm:col-end-9',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <QuoteIconAlt className="absolute w-4.5 h-auto text-theme left-0 top-0 sm:left-8 lg:w-4" />
              <RichText content={content} className="mb-8" />
              <div className="flex items-center gap-4.8 col-span-12">
                <div className="max-w-24">
                  {logo && typeof logo !== 'string' && <Media resource={logo} />}
                </div>
                <div className="leading-none">
                  <span className="font-medium">{author}</span>
                  {role ? <span className="">{', ' + role}</span> : ''}
                </div>
              </div>
            </div>

            <div
              className={[
                'w-full mr-4 -mt-10 -mb-10 sm:mt-0 sm:mb-0 sm:mr-0',
                hasImages
                  ? 'col-start-11 col-end-17 sm:col-start-1 sm:col-end-9'
                  : '',
                hasImages
                  ? 'sm:w-calc(100% - 0.5rem) sm:-mb-4'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {hasImages ? <MediaParallax media={images} /> : null}
            </div>
          </div>
        </Gutter>
      </div>
    </BlockWrapper>
  )
}
export default Callout