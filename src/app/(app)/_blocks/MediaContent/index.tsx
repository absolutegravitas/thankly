import * as React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
// import { Button } from '@app/_components/Button'
import { CMSLink } from '@app/_components/CMSLink'

import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type MediaContentProps = Extract<Page['layout'][0], { blockType: 'mediaContent' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type MediaContentProps = ExtractBlockProps<'mediaContent'> & { padding: PaddingProps }

export const MediaContentBlock: React.FC<MediaContentProps> = (props) => {
  const {
    mediaContentFields: { link, images, content, alignment, enableLink, settings },
  } = props

  return (
    <Gutter>
      <div className={['grid'].filter(Boolean).join(' ')}>
        {alignment === 'mediaContent' ? (
          // media-content
          <React.Fragment>
            <div
              className={[classes.media, classes.left, 'cols-8 cols-m-8 start-1']
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
            <div
              className={[classes.content, classes.right, 'cols-6 start-11 start-m-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={content} />

              {enableLink && link && (
                <div className="block mt-8 w-2/3 md:w-full">
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
                  {/* <Button
                    {...link}
                    appearance={'default'}
                    labelStyle="mono"
                    hideHorizontalBorders
                    icon="arrow"
                    el="link"
                  /> */}
                </div>
              )}
            </div>
          </React.Fragment>
        ) : (
          // content-media
          <React.Fragment>
            <div
              className={[classes.content, classes.left, 'cols-6 start-1 cols-m-8']
                .filter(Boolean)
                .join(' ')}
            >
              <RichText content={content} />
              {enableLink && link && (
                <div className={classes.button}>
                  {/* <Button
                    {...link}
                    appearance={'default'}
                    hideHorizontalBorders
                    labelStyle="mono"
                    icon="arrow"
                    el="link"
                  /> */}
                </div>
              )}
            </div>
            <div
              className={[classes.media, classes.right, 'cols-8 start-9 cols-m-8 start-m-1']
                .filter(Boolean)
                .join(' ')}
            >
              {images?.length && images.length > 0 ? <MediaParallax media={images} /> : null}
            </div>
          </React.Fragment>
        )}
      </div>
    </Gutter>
  )
}

export const MediaContent: React.FC<MediaContentProps> = (props) => {
  const { settings } = props.mediaContentFields

  return (
    <BlockWrapper className={getPaddingClasses('mediaContent')} settings={settings}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <div className={classes.wrapper}>
        <MediaContentBlock {...props} />
      </div>
      {/* <div className={classes.background} /> */}
    </BlockWrapper>
  )
}
export default MediaContent
