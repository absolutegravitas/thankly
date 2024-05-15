'use client'

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { BannerBlock } from '@web/_blocks/Banner'
import { Callout } from '@web/_blocks/Callout'
import { CallToAction } from '@web/_blocks/CallToAction'
import { CardGrid } from '@web/_blocks/CardGrid'
import { ContentBlock } from '@web/_blocks/Content'
import { ContentGrid } from '@web/_blocks/ContentGrid'
import { FormBlock } from '@web/_blocks/FormBlock'
import { HoverCards } from '@web/_blocks/HoverCards'
import { HoverHighlights } from '@web/_blocks/HoverHighlights'
import { LinkGrid } from '@web/_blocks/LinkGrid'
import { LogoGrid } from '@web/_blocks/LogoGrid'
import { MediaBlock } from '@web/_blocks/MediaBlock'
import { MediaContent } from '@web/_blocks/MediaContent'
import { MediaContentAccordion } from '@web/_blocks/MediaContentAccordion'
import { Pricing } from '@web/_blocks/Pricing'
import { ReusableContentBlock } from '@web/_blocks/ReusableContent'
import { Slider } from '@web/_blocks/Slider'
import { Steps } from '@web/_blocks/Steps'
import { StickyHighlights } from '@web/_blocks/StickyHighlights'

import { toKebabCase } from '@web/_utilities/to-kebab-case'

import { PaddingProps, Settings } from '@web/_components/BlockWrapper'
import { getFieldsKeyFromBlock } from '@web/_components/RenderBlocks/utilities'
import { Page, Reusable } from '@payload-types'
import { useThemePreference } from '@web/_providers/Theme'
import { Theme } from '@web/_providers/Theme/types'

// type ReusableContentBlockType = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

import { ExtractBlockProps } from '@web/_utilities/extractBlockProps'
type ReusableContentBlockType = ExtractBlockProps<'reusableContentBlock'>

export const blockComponents: any = {
  banner: BannerBlock,
  callout: Callout,
  cardGrid: CardGrid,
  content: ContentBlock,
  contentGrid: ContentGrid,
  cta: CallToAction,
  form: FormBlock,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  linkGrid: LinkGrid,
  logoGrid: LogoGrid,
  mediaBlock: MediaBlock,
  mediaContent: MediaContent,
  mediaContentAccordion: MediaContentAccordion,
  pricing: Pricing,
  reusableContentBlock: ReusableContentBlock,
  slider: Slider,
  steps: Steps,
  stickyHighlights: StickyHighlights,
}

export type BlocksProp = ReusableContentBlockType // | Reusable['layout'][0]

type Props = {
  blocks: BlocksProp[]
  disableOuterSpacing?: true
  // hero?: Page['hero']
  disableGutter?: boolean
  disableGrid?: boolean
  // heroTheme?: Page['hero']['theme']
  layout?: 'page' | 'post'
  customId?: string | null
}

export const RenderBlocks: React.FC<Props> = (props) => {
  const {
    blocks,
    disableOuterSpacing,
    disableGutter,
    disableGrid,
    // hero,
    layout,
    customId,
  } = props
  // const heroTheme = hero?.type === 'home' ? 'dark' : hero?.theme
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()
  const [docPadding, setDocPadding] = React.useState(0)
  const docRef = React.useRef<HTMLDivElement>(null)

  // This is needed to avoid hydration errors when the theme is not yet available
  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const paddingExceptions = useMemo(
    () => [
      'banner',
      'blogContent',
      'blogMarkdown',
      'code',
      'reusableContentBlock',
      'caseStudyParallax',
    ],
    [],
  )

  const getPaddingProps = useCallback(
    (block: (typeof blocks)[number], index: number) => {
      const isFirst = index === 0
      const isLast = index + 1 === blocks.length

      const theme = themeState

      let topPadding: PaddingProps['top']
      let bottomPadding: PaddingProps['bottom']

      let previousBlock = !isFirst ? blocks[index - 1] : null
      let previousBlockKey, previousBlockSettings

      let nextBlock =
        index + 1 < blocks.length ? blocks[Math.min(index + 1, blocks.length - 1)] : null
      let nextBlockKey, nextBlockSettings

      let currentBlockSettings: Settings = block[getFieldsKeyFromBlock(block)]?.settings
      let currentBlockTheme

      currentBlockTheme = currentBlockSettings?.theme ?? theme

      if (previousBlock) {
        previousBlockKey = getFieldsKeyFromBlock(previousBlock)
        previousBlockSettings = previousBlock[previousBlockKey]?.settings
      }

      if (nextBlock) {
        nextBlockKey = getFieldsKeyFromBlock(nextBlock)
        nextBlockSettings = nextBlock[nextBlockKey]?.settings
      }

      // If first block in the layout, add top padding based on the hero
      if (isFirst) {
        // if (heroTheme) {
        //   topPadding = heroTheme === currentBlockTheme ? 'small' : 'large'
        // } else {
        topPadding = theme === currentBlockTheme ? 'small' : 'large'
        // }
      } else {
        if (previousBlockSettings?.theme) {
          topPadding = currentBlockTheme === previousBlockSettings?.theme ? 'small' : 'large'
        } else {
          topPadding = theme === currentBlockTheme ? 'small' : 'large'
        }
      }

      if (nextBlockSettings?.theme) {
        bottomPadding = currentBlockTheme === nextBlockSettings?.theme ? 'small' : 'large'
      } else {
        bottomPadding = theme === currentBlockTheme ? 'small' : 'large'
      }

      if (isLast) bottomPadding = 'large'

      if (paddingExceptions.includes(block.blockType)) bottomPadding = 'large'

      return {
        top: topPadding ?? undefined,
        bottom: bottomPadding ?? undefined,
      }
    },
    [
      themeState,
      // heroTheme,
      blocks,
      paddingExceptions,
    ],
  )

  React.useEffect(() => {
    if (docRef.current?.offsetWidth === undefined) return
    setDocPadding(layout === 'post' ? Math.round(docRef.current?.offsetWidth / 8) - 2 : 0)
  }, [docRef.current?.offsetWidth, layout])

  const marginAdjustment = {
    marginLeft: `${docPadding / -1}px`,
    marginRight: `${docPadding / -1}px`,
    paddingLeft: docPadding,
    paddingRight: docPadding,
  }

  if (hasBlocks) {
    return (
      <Fragment>
        <div ref={docRef} id={customId ?? undefined}>
          {blocks.map((block, index) => {
            const { blockName, blockType } = block

            if (blockType && blockType in blockComponents) {
              const Block = blockComponents[blockType]

              if (Block) {
                return (
                  <Block
                    key={index}
                    id={toKebabCase(blockName)}
                    {...block}
                    padding={getPaddingProps(block, index)}
                    marginAdjustment={{
                      ...marginAdjustment,
                      ...(blockType === 'banner' ? { paddingLeft: 32, paddingRight: 32 } : {}),
                    }}
                    disableGutter={disableGutter}
                    disableGrid={disableGrid}
                  />
                )
              }
            }
            return null
          })}
        </div>
      </Fragment>
    )
  }

  return null
}
