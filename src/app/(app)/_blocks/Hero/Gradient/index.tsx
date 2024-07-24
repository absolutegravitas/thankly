'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'

import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type GradientHeroProps = ExtractBlockProps<'fields'>

export const GradientHero: React.FC<GradientHeroProps> = ({
  content,
  images,
  fullBackground,
  links,
  description,
  theme: themeFromProps,
  enableBreadcrumbsBar,
  firstContentBlock,
}) => {
  const theme = fullBackground ? 'dark' : themeFromProps

  return (
    <BlockWrapper settings={{ theme }} className={getPaddingClasses('standard')}>
      {Boolean(fullBackground) && (
        <Media
          className={[classes.bgFull, enableBreadcrumbsBar ? classes.hasBreadcrumbsEnabled : '']
            .filter(Boolean)
            .join(' ')}
          src="/images/background-shapes.webp"
          alt=""
          width={1920}
          height={1080}
          priority
        />
      )}
      {/* <BackgroundGrid className={classes.backgroundGrid} zIndex={0} /> */}
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              classes.sidebar,
              fullBackground && classes.hasFullBackground,
              `cols-6`,
              'cols-m-8 start-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <RichText content={content} className={[classes.richText].filter(Boolean).join(' ')} />
            <div className={classes.contentWrapper}>
              <RichText
                content={description}
                className={[classes.description].filter(Boolean).join(' ')}
              />

              <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
                {Array.isArray(links) &&
                  links.map(({ link }, i) => {
                    return (
                      <CMSLink
                        key={i}
                        data={{ ...link }}
                        look={{
                          theme: 'light',
                          type: 'button',
                          size: 'medium',
                          width: 'normal',
                          variant: 'blocks',
                          icon: {
                            content: <ChevronRightIcon strokeWidth={1.25} />,
                            iconPosition: 'right',
                          },
                        }}
                      />
                      // <CMSLink
                      //   key={i}
                      //   {...link}
                      //   buttonProps={{
                      //     hideHorizontalBorders: false,
                      //   }}
                      //   className={[classes.link, 'cols-12 start-1'].filter(Boolean).join(' ')}
                      // />
                    )
                  })}
              </div>
            </div>
          </div>
          {!Boolean(fullBackground) && (
            <Media
              className={[classes.bgSquare, 'cols-8 start-9 start-m-1'].filter(Boolean).join(' ')}
              src="/images/gradient-square.jpg"
              alt=""
              width={800}
              height={800}
              priority
            />
          )}
          <div
            className={[classes.media, 'cols-9 start-8 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            {images && Array.isArray(images) && <MediaParallax media={images} priority />}
          </div>
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}

export default GradientHero
