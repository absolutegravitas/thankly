'use client'

import React, { useEffect, useRef, useState } from 'react'

// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { ChangeHeaderTheme } from '@app/_components/ChangeHeaderTheme'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { useGetHeroPadding } from '@app/_blocks/Hero/useGetHeroPadding'
import { Media } from '@app/_components/Media'
// import { RichText } from '@app/_components/RichText'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type FormFieldsProps = ExtractBlockProps<'fields'>

export const ProductBlock: React.FC<any> = (props) => {
  const { product } = props
  // console.log('product media --', JSON.stringify(product.media))
  const laptopMediaRef = useRef<HTMLDivElement | null>(null)
  const mobileLaptopMediaRef = useRef<HTMLDivElement | null>(null)
  const [laptopMediaHeight, setLaptopMediaHeight] = useState(0)
  const [mobileMediaWrapperHeight, setMobileMediaWrapperHeight] = useState(0)
  const padding = useGetHeroPadding('light', true)
  const [windowWidth, setWindowWidth] = useState(0)

  // useEffect(() => {
  //   const updateWindowSize = () => {
  //     setWindowWidth(window.innerWidth)
  //   }
  //   window.addEventListener('resize', updateWindowSize)
  //   updateWindowSize()

  //   return () => window.removeEventListener('resize', updateWindowSize)
  // }, [])

  // useEffect(() => {
  //   const updateElementHeights = () => {
  //     const renderedLaptopMediaHeight = laptopMediaRef.current
  //       ? laptopMediaRef.current.offsetHeight
  //       : 0
  //     setLaptopMediaHeight(renderedLaptopMediaHeight)
  //   }
  //   updateElementHeights()
  //   window.addEventListener('resize', updateElementHeights)

  //   return () => window.removeEventListener('resize', updateElementHeights)
  // }, [])

  // useEffect(() => {
  //   const updateMobileMediaWrapperHeight = () => {
  //     const newMobileHeight = mobileLaptopMediaRef.current
  //       ? mobileLaptopMediaRef.current.offsetHeight
  //       : 0
  //     setMobileMediaWrapperHeight(newMobileHeight)
  //   }
  //   updateMobileMediaWrapperHeight()
  //   window.addEventListener('resize', updateMobileMediaWrapperHeight)

  //   return () => window.removeEventListener('resize', updateMobileMediaWrapperHeight)
  // }, [])

  // const aspectRatio = 2560 / 1971
  // const dynamicHeight = windowWidth / aspectRatio

  // const getContentWrapperHeight = () => {
  //   if (windowWidth >= 1024) {
  //     return {
  //       height: `${dynamicHeight}px`,
  //     }
  //   } else if (windowWidth < 1024) {
  //     return {
  //       height: '100%',
  //     }
  //   } else {
  //     return {
  //       height: 'unset',
  //     }
  //   }
  // }

  // const contentWrapperHeight = getContentWrapperHeight()

  return (
    <ChangeHeaderTheme theme="light">
      <BlockWrapper setPadding={false} settings={{ theme: 'light' }} padding={padding}>
        {/* <div className={classes.bgFull}>
          <Media
            className={classes.desktopBg}
            src="/images/hero-shapes.jpg"
            alt=""
            width={1920}
            height={1644}
            priority
          />
          <Media
            className={classes.mobileBg}
            src="/images/mobile-hero-shapes.jpg"
            alt=""
            width={390}
            height={800}
            priority
          />
        </div> */}
        <div className={classes.homeHero}>
          {/* <div className={classes.background}>
            <div className={classes.imagesContainerWrapper}>
              {product.media?.map(({ mediaItem: mediaItem }: any, index: any) => {
                return (
                  <div key={index}>
                    {typeof mediaItem === 'object' && mediaItem !== null && (
                      <Media
                        ref={laptopMediaRef}
                        resource={mediaItem}
                        className={classes.laptopMedia}
                        priority
                        width={2560}
                        height={1971}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div> */}
          {/* <div className={classes.contentWrapper} style={contentWrapperHeight}> */}
          <Gutter className={classes.content}>
            <div className={classes.primaryContentWrap} data-theme="dark">
              <div className={[classes.primaryContent, 'grid'].filter(Boolean).join(' ')}>
                <div className={['cols-8 start-1'].filter(Boolean).join(' ')}>
                  <RichText className={classes.richTextHeading} content={product.title} />
                  <RichText
                    className={classes.richTextDescription}
                    content={product.meta.description}
                  />

                  <div
                    className={classes.mobileMediaWrapper}
                    style={{ height: mobileMediaWrapperHeight }}
                  >
                    {product.media?.map(({ mediaItem: mediaItem }: any, index: any) => {
                      return (
                        <div key={index}>
                          {typeof mediaItem === 'object' && mediaItem !== null && (
                            <Media
                              ref={mobileLaptopMediaRef}
                              resource={mediaItem}
                              className={classes.laptopMedia}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Gutter>
          {/* </div> */}
        </div>
        <div className={classes.paddingBottom}></div>
      </BlockWrapper>
    </ChangeHeaderTheme>
  )
}

export default ProductBlock
