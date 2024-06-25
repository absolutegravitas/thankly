import React, { Fragment } from 'react'
import { ArrowIcon } from '@app/_icons/ArrowIcon'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { BlockSpacing } from '@app/_components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import MediaParallax from '@app/_components/MediaParallax'
import { RichText } from '@app/_blocks/RichText'
import { QuoteIconAlt } from '@app/_icons/QuoteIconAlt'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type CalloutProps = Extract<Page['layout'][0], { blockType: 'callout' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type CalloutProps = ExtractBlockProps<'callout'> & { padding?: PaddingProps }

export const Callout: React.FC<CalloutProps> = (props) => {
  const {
    calloutFields: { content, role, author, logo, images, settings },
  } = props

  const hasImages = images?.length && images.length > 0

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid className={classes.backgroundGrid} zIndex={0} /> */}
      <div className={classes.wrapper}>
        <Gutter>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            {/* <BackgroundScanline className={classes.scanline} enableBorders crosshairs={'all'} /> */}
            <div
              className={[
                classes.contentWrapper,
                hasImages
                  ? 'cols-7 start-2 cols-m-8 start-m-1'
                  : 'cols-14 start-2 cols-m-8 start-m-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <QuoteIconAlt className={classes.quoteIcon} />
              <RichText content={content} className={[classes.content].filter(Boolean).join(' ')} />
              <div className={[classes.authorWrapper, 'cols-12'].filter(Boolean).join(' ')}>
                <div className={classes.logo}>
                  {logo && typeof logo !== 'string' && <Media resource={logo} />}
                </div>
                <div className={classes.author}>
                  <span className={classes.name}>{author}</span>
                  {role ? <span className={classes.role}>{', ' + role}</span> : ''}
                </div>
              </div>
            </div>

            <div
              className={[classes.media, 'cols-6 start-11 cols-m-8 start-m-1']
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
