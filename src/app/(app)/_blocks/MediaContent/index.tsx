import * as React from 'react'

import { BackgroundGrid } from '@web/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@web/_components/BlockWrapper'
import { Button } from '@web/_components/Button'
import { Gutter } from '@web/_components/Gutter'
import { Media } from '@web/_components/Media'
import MediaParallax from '@web/_components/MediaParallax'
import { RichText } from '@web/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type MediaContentProps = Extract<Page['layout'][0], { blockType: 'mediaContent' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@web/_utilities/extractBlockProps'
export type MediaContentProps = ExtractBlockProps<'mediaContent'> & { padding: PaddingProps }

export const MediaContentBlock: React.FC<MediaContentProps> = ({ mediaContentFields, padding }) => {
  const { link, images, richText, alignment, enableLink, settings } = mediaContentFields

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
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button
                    {...link}
                    appearance={'default'}
                    labelStyle="mono"
                    hideHorizontalBorders
                    icon="arrow"
                    el="link"
                  />
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
              <RichText content={richText} />
              {enableLink && link && (
                <div className={classes.button}>
                  <Button
                    {...link}
                    appearance={'default'}
                    hideHorizontalBorders
                    labelStyle="mono"
                    icon="arrow"
                    el="link"
                  />
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
    <BlockWrapper padding={props.padding} settings={settings}>
      <BackgroundGrid zIndex={0} />
      <MediaContentBlock {...props} />
      <div className={classes.background} />
    </BlockWrapper>
  )
}
export default MediaContent
