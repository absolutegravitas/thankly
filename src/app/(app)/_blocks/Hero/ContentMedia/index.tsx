'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'

import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '@/app/(app)/_css/tailwindClasses'
export type ContentMediaHeroProps = ExtractBlockProps<'fields'>

export const ContentMediaHero: React.FC<ContentMediaHeroProps> = ({
  content,
  media,
  links,
  description,
  theme,
  firstContentBlock,
}) => {
  return (
    <BlockWrapper settings={{ theme }} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter>
        <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.sidebar, `cols-4`, 'cols-m-8 start-1'].filter(Boolean).join(' ')}
          >
            <RichText content={content} className={[classes.richText].filter(Boolean).join(' ')} />

            <div className={[classes.linksWrapper].filter(Boolean).join(' ')}>
              <RichText
                content={description}
                className={[classes.description].filter(Boolean).join(' ')}
              />

              {Array.isArray(links) &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
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
          {typeof media === 'object' && media !== null && (
            <div
              className={[classes.mediaWrapper, `start-7`, `cols-10`, 'cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              <div className={classes.media}>
                <Media
                  resource={media}
                  sizes={`100vw, (max-width: 1920px) 75vw, (max-width: 1024px) 100vw`}
                />
              </div>
            </div>
          )}
        </div>
        <div className={classes.defaultHero}></div>
      </Gutter>
    </BlockWrapper>
  )
}

export default ContentMediaHero
