import React, { useId } from 'react'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useWindowInfo } from '@faceless-ui/window-info'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Page } from '@payload-types'
import { StickyHighlight } from './Highlight'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'stickyHighlights' }> & {
//   className?: string
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'stickyHighlights'> & {
  className?: string
  padding: PaddingProps
}

export const StickyHighlights: React.FC<Props> = ({
  stickyHighlightsFields,
  className,
  padding,
}) => {
  const { highlights, settings } = stickyHighlightsFields || {}
  const { yDirection } = useScrollInfo()
  const {
    breakpoints: { m },
  } = useWindowInfo()

  const id = useId()

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('stickyHighlights'), classes.stickyHighlights, className]
        .filter(Boolean)
        .join(' ')}
      id={id}
    >
      <Gutter>
        {/* <BackgroundGrid zIndex={0} /> */}
        {highlights?.map((highlight: any, i: any) => {
          return <StickyHighlight yDirection={yDirection} midBreak={m} key={i} {...highlight} />
        })}
      </Gutter>
    </BlockWrapper>
  )
}

export default StickyHighlights
