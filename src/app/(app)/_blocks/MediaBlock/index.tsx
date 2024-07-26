import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import { Reusable } from '@payload-types'

import classes from './index.module.scss'
import { getPaddingClasses } from '../../_css/tailwindClasses'

// type Props = Extract<Reusable['layout'][0], { blockType: 'mediaBlock' }> & {
//   padding: PaddingProps
//   disableGrid?: boolean
// }

export const MediaBlock: React.FC<any & { disableGutter?: boolean; marginAdjustment?: any }> = (
  props,
) => {
  const { mediaBlockFields, disableGutter, marginAdjustment = {}, disableGrid = false } = props
  const { media, caption, position, settings } = mediaBlockFields

  if (typeof media === 'string') return null

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('mediaBlock')}>
      <div
        className={classes.mediaBlock}
        style={{
          marginRight: marginAdjustment.marginRight,
          marginLeft: marginAdjustment.marginLeft,
        }}
      >
        {disableGutter ? (
          <Media
            resource={media}
            className={[classes.mediaResource, classes[`position--${position}`]]
              .filter(Boolean)
              .join(' ')}
          />
        ) : (
          <Gutter className={classes.mediaWrapper}>
            <Media
              resource={media}
              className={[classes.mediaResource, classes[`position--${position}`]]
                .filter(Boolean)
                .join(' ')}
            />

            {caption && (
              <div className={['grid'].filter(Boolean).join(' ')}>
                <div
                  className={[classes.caption, 'cols-8 start-5 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <small>
                    <RichText content={caption} />
                  </small>
                </div>
              </div>
            )}
          </Gutter>
        )}
      </div>
    </BlockWrapper>
  )
}
export default MediaBlock
