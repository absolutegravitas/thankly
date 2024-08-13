import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import { RichText } from '@app/_blocks/RichText'
import { Reusable } from '@payload-types'

import { contentFormats, getPaddingClasses } from '../../_css/tailwindClasses'

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
        className="relative"
        style={{
          marginRight: marginAdjustment.marginRight,
          marginLeft: marginAdjustment.marginLeft,
        }}
      >
        {disableGutter ? (
          <Media
            resource={media}
            className={`${position === 'wide' ? '-ml-[calc(var(--gutter-h)/-2)] w-[calc(100%+var(--gutter-h))]' : ''}`}
          />
        ) : (
          <Gutter className="relative">
            <Media
              resource={media}
              className={`${position === 'wide' ? '-ml-[calc(var(--gutter-h)/-2)] w-[calc(100%+var(--gutter-h))]' : ''}`}
            />

            {caption && (
              <div className="grid">
                <div
                  className={`${contentFormats.alignCenter} pt-5`}
                >
                  <small className={contentFormats.smallText}>
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