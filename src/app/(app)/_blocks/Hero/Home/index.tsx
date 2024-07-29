// This is a React component for rendering a homepage hero section in a Next.js application with TypeScript.
// It handles various components, including a background grid, block wrapper, header theme, CMS links, media, rich text, and styles.

'use client'

// Importing necessary dependencies and components
import React, { useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { ChangeHeaderTheme } from '@app/_components/ChangeHeaderTheme'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'

import { Media } from '@app/_components/Media'
import { BlocksProp } from '@app/_components/RenderBlocks'
import { RichText } from '@app/_blocks/RichText'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '@app/_css/tailwindClasses'

// TypeScript interface defining the props for the HomeHero component
export type FormFieldsProps = ExtractBlockProps<'fields'>

// HomeHero component with TypeScript props
export const HomeHero: React.FC<
  FormFieldsProps & {
    firstContentBlock?: BlocksProp
  }
> = ({
  theme, // Theme for the component
  enableAnnouncement, // Flag to enable/disable announcement
  announcementLink, // Link for the announcement
  content, // Content for the rich text
  description, // Description for the rich text
  primaryButtons, // Primary buttons
  secondaryHeading, // Secondary heading
  secondaryDescription, // Secondary description
  secondaryButtons, // Secondary buttons
  media, // Media resource
  secondaryMedia, // Secondary media resource
  featureVideo, // Featured video
  logos, // Logos
  firstContentBlock, // First content block
  ...fields // Additional fields
}) => {
  // Refs for tracking element dimensions
  const laptopMediaRef = useRef<HTMLDivElement | null>(null)
  const mobileLaptopMediaRef = useRef<HTMLDivElement | null>(null)

  // State variables for media heights and window width
  const [laptopMediaHeight, setLaptopMediaHeight] = useState(0)
  const [mobileMediaWrapperHeight, setMobileMediaWrapperHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  // Update window width on resize
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  // Update laptop media height on render and window resize
  useEffect(() => {
    const updateElementHeights = () => {
      const renderedLaptopMediaHeight = laptopMediaRef.current
        ? laptopMediaRef.current.offsetHeight
        : 0
      setLaptopMediaHeight(renderedLaptopMediaHeight)
    }
    updateElementHeights()
    window.addEventListener('resize', updateElementHeights)

    return () => window.removeEventListener('resize', updateElementHeights)
  }, [])

  // Update mobile media wrapper height on render and window resize
  useEffect(() => {
    const updateMobileMediaWrapperHeight = () => {
      const newMobileHeight = mobileLaptopMediaRef.current
        ? mobileLaptopMediaRef.current.offsetHeight
        : 0
      setMobileMediaWrapperHeight(newMobileHeight)
    }
    updateMobileMediaWrapperHeight()
    window.addEventListener('resize', updateMobileMediaWrapperHeight)

    return () => window.removeEventListener('resize', updateMobileMediaWrapperHeight)
  }, [])

  // Calculate dynamic height based on aspect ratio
  const aspectRatio = 2560 / 1971
  const dynamicHeight = windowWidth / aspectRatio

  // Function to determine content wrapper height based on window width
  const getContentWrapperHeight = () => {
    if (windowWidth >= 1024) {
      return {
        height: `${dynamicHeight}px`,
      }
    } else if (windowWidth < 1024) {
      return {
        height: '100%',
      }
    } else {
      return {
        height: 'unset',
      }
    }
  }

  const contentWrapperHeight = getContentWrapperHeight()

  return (
    <ChangeHeaderTheme theme={theme}>
      <BlockWrapper setPadding={false} className={getPaddingClasses('hero')}>
        <div className="relative">
          <div className="absolute z-1 top-0 right-0 bottom-0 left-0 overflow-hidden min-h-[600px]">
            <div className="relative h-full">
              {typeof media === 'object' && media !== null && (
                <Media
                  ref={laptopMediaRef}
                  resource={media}
                  className="w-full absolute bottom-0 z-1 -ml-[10rem] #w-[calc(100%+10rem)] sm:-ml-[6rem] sm:w-[calc(100%+8rem)]"
                  priority
                  width={2560}
                  height={1971}
                />
              )}
            </div>
          </div>

          <div className="pt-[calc(1971/2560*100%)] sm:pt-0" style={contentWrapperHeight}>
            <Gutter className="flex flex-col items-center justify-between h-full pt-[7rem] 3xl:pt-[8rem] xl:pt-[7.5rem] lg:pt-[6.5rem] md:pt-[2rem] sm:pt-[1rem] sm:relative sm:top-0">
              <div className="flex items-start" data-theme={theme}>
                <div
                  className={[
                    'grid grid-rows-[auto,min-content] relative z-2 mt-[1rem] md:mt-[1rem]',
                    'grid',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={['cols-14 start-1'].filter(Boolean).join(' ')}>
                    {enableAnnouncement && (
                      <div className="inline-block relative px-1 mb-[2rem] overflow-hidden transition-[box-shadow] shadow-[0_0.25rem_1rem_-0.75rem_var(--theme-success-250)] animate-fade-in-up opacity-0 transform translate-y-[1rem] animate-delay-[1s] sm:mb-0">
                        <CMSLink {...announcementLink} />
                      </div>
                    )}
                    <RichText content={description} />
                    {Array.isArray(primaryButtons) && (
                      <ul
                        className={[
                          'list-none m-0 p-0 max-w-[50%] bg-[var(--theme-success-50)] border-[var(--theme-success-50)] md:max-w-full',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        {primaryButtons.map(({ link }, i) => {
                          return (
                            <li key={i}>
                              <CMSLink
                                {...link}
                                appearance="default"
                                fullWidth
                                buttonProps={{
                                  icon: 'arrow',
                                  hideHorizontalBorders: false,
                                }}
                              />
                            </li>
                          )
                        })}
                      </ul>
                    )}
                    <div
                      className="hidden md:block relative overflow-hidden w-[calc(100%+var(--gutter-h)*2)] -ml-[var(--gutter-h)]"
                      style={{ height: mobileMediaWrapperHeight }}
                    ></div>
                  </div>
                </div>
              </div>
            </Gutter>
          </div>
        </div>
      </BlockWrapper>
    </ChangeHeaderTheme>
  )
}
