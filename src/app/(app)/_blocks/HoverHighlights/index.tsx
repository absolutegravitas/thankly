import React from 'react'

import { Gutter } from '@app/_components/Gutter'
import { PixelBackground } from '@app/_components/PixelBackground'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'
import { HoverHighlight } from './HoverHighlight'

import classes from './index.module.scss'

// export type HoverHighlightProps = Extract<Page['layout'][0], { blockType: 'hoverHighlights' }>
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type HoverHighlightProps = ExtractBlockProps<'hoverHighlights'>

export const HoverHighlights: React.FC<HoverHighlightProps> = (props) => {
  const {
    hoverHighlightsFields: { content, addRowNumbers, highlights, settings },
  } = props
  // console.log('hoverhighlightfields', props)
  const hasHighlights = highlights && highlights.length > 0

  return (
    <Gutter className={classes.hoverHighlights}>
      <div className={[classes.richTextGrid, 'grid'].filter(Boolean).join(' ')}>
        <div className={['cols-12'].filter(Boolean).join(' ')}>
          <RichText content={content} />
        </div>
      </div>
      <div className={classes.content}>
        {/* <div className={classes.pixelBG}>
          <PixelBackground />
        </div> */}
        {hasHighlights &&
          highlights.map((highlight: any, index: any) => {
            return (
              <HoverHighlight
                key={index}
                index={index}
                addRowNumbers={addRowNumbers}
                isLast={index < highlights.length - 1}
                {...highlight}
              />
            )
          })}
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              `cols-${addRowNumbers ? 16 : 15}`,
              `start-${addRowNumbers ? 2 : 1}`,
              'cols-m-8 start-m-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <hr className={classes.hr} />
          </div>
        </div>
      </div>
    </Gutter>
  )
}

export default HoverHighlights
