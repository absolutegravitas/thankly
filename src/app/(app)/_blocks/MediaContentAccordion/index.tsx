import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { Page } from '@payload-types'
import { DesktopMediaContentAccordion } from './Desktop'
import { MobileMediaContentAccordion } from './Mobile'

import classes from './index.module.scss'

// export type MediaContentAccordionProps = Extract<
//   Page['layout'][0],
//   { blockType: 'mediaContentAccordion' }
// > & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@app/_utilities/extractBlockProps'
export type MediaContentAccordionProps = ExtractBlockProps<'mediaContentAccordion'> & {
  padding: PaddingProps
}

export const MediaContentAccordion: React.FC<MediaContentAccordionProps> = ({
  mediaContentAccordionFields,
  padding,
}) => {
  const { settings } = mediaContentAccordionFields || {}

  return (
    <BlockWrapper
      settings={settings}
      padding={padding}
      className={[classes.mediaContentAccordion].filter(Boolean).join(' ')}
    >
      <Gutter>
        <BackgroundGrid zIndex={0} />
        <DesktopMediaContentAccordion
          className={classes.desktop}
          blockType="mediaContentAccordion"
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
        <MobileMediaContentAccordion
          className={classes.mobile}
          blockType="mediaContentAccordion"
          mediaContentAccordionFields={mediaContentAccordionFields}
        />
      </Gutter>
    </BlockWrapper>
  )
}
export default MediaContentAccordion