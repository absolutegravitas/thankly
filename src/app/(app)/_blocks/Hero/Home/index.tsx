'use client'

import React, { useEffect, useRef, useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { ChangeHeaderTheme } from '@app/_components/ChangeHeaderTheme'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { LogoShowcase } from '@app/_blocks/Hero/Home/LogoShowcase'

import { Media } from '@app/_components/Media'
import { BlocksProp } from '@app/_components/RenderBlocks'
// import { RichText } from '@app/_components/RichText'
import { Page } from '@payload-types'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type FormFieldsProps = ExtractBlockProps<'fields'>

export const HomeHero: React.FC<
  FormFieldsProps & {
    firstContentBlock?: BlocksProp
  }
> = ({
  theme,
  enableAnnouncement,
  announcementLink,
  content,
  description,
  primaryButtons,
  secondaryHeading,
  secondaryDescription,
  secondaryButtons,
  media,
  secondaryMedia,
  featureVideo,
  logos,
  firstContentBlock,
  ...fields
}) => {
  const laptopMediaRef = useRef<HTMLDivElement | null>(null)
  const mobileLaptopMediaRef = useRef<HTMLDivElement | null>(null)
  const [laptopMediaHeight, setLaptopMediaHeight] = useState(0)
  const [mobileMediaWrapperHeight, setMobileMediaWrapperHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateWindowSize)
    updateWindowSize()

    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

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

  const aspectRatio = 2560 / 1971
  const dynamicHeight = windowWidth / aspectRatio

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
      <BlockWrapper
        setPadding={false}
        settings={{ theme: theme }}
        className={getPaddingClasses('hero')}
      >
        <div className={classes.homeHero}>
          <div className={classes.background}>
            <div className={classes.imagesContainerWrapper}>
              {typeof media === 'object' && media !== null && (
                <Media
                  ref={laptopMediaRef}
                  resource={media}
                  className={classes.laptopMedia}
                  priority
                  width={2560}
                  height={1971}
                />
              )}
            </div>
          </div>
          <div className={classes.contentWrapper} style={contentWrapperHeight}>
            <Gutter className={classes.content}>
              <div className={classes.primaryContentWrap} data-theme={theme}>
                <div className={[classes.primaryContent, 'grid'].filter(Boolean).join(' ')}>
                  <div className={['cols-8 start-1'].filter(Boolean).join(' ')}>
                    {enableAnnouncement && (
                      <div className={classes.announcementLink}>
                        <CMSLink {...announcementLink} />
                      </div>
                    )}
                    <RichText className={classes.richTextHeading} content={content} />
                    <RichText className={[classes.richTextDescription]} content={description} />
                    {Array.isArray(primaryButtons) && (
                      <ul className={[classes.primaryButtons].filter(Boolean).join(' ')}>
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
                    {/* Mobile media - only rendered starting at mid-break */}
                    <div
                      className={classes.mobileMediaWrapper}
                      style={{ height: mobileMediaWrapperHeight }}
                    >
                      {typeof media === 'object' && media !== null && (
                        <Media
                          ref={mobileLaptopMediaRef}
                          resource={media}
                          className={classes.laptopMedia}
                        />
                      )}
                    </div>
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
