/**
 * @file index.tsx
 * @module RenderBlocks
 * @description Renders dynamic content blocks for a responsive ecommerce website
 * @overview
 * This file contains the RenderBlocks component, which is responsible for rendering various content blocks
 * in a Next.js 14 and PayloadCMS-based ecommerce website. It imports and manages different block components,
 * handles theme-based padding, and provides a flexible structure for rendering content. The component
 * uses TypeScript for type safety and implements server-side rendering for optimal performance.
 */

'use client'

import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { BannerBlock } from '@app/_blocks/Banner'
import { Callout } from '@app/_blocks/Callout'
import { CallToAction } from '@app/_blocks/CallToAction'
import { CardGrid } from '@app/_blocks/CardGrid'
import { ContentBlock } from '@app/_blocks/Content'
import { ContentGrid } from '@app/_blocks/ContentGrid'
// import { FormBlock } from '@app/_blocks/FormBlock'
import { HoverCards } from '@app/_blocks/HoverCards'
import { HoverHighlights } from '@app/_blocks/HoverHighlights'
import { LinkGrid } from '@app/_blocks/LinkGrid'
import { LogoGrid } from '@app/_blocks/LogoGrid'
import { MediaBlock } from '@app/_blocks/MediaBlock'
import { MediaContent } from '@app/_blocks/MediaContent'
import { MediaContentAccordion } from '@app/_blocks/MediaContentAccordion'
import { Pricing } from '@app/_blocks/Pricing'
import { ReusableContentBlock } from '@app/_blocks/Reusable'
import { Slider } from '@app/_blocks/Slider'
import { Steps } from '@app/_blocks/Steps'
import { StickyHighlights } from '@app/_blocks/StickyHighlights'

import { toKebabCase } from '@/utilities/to-kebab-case'

import { PaddingProps, Settings } from '@app/_components/BlockWrapper'
import { getFieldsKeyFromBlock } from '@app/_components/RenderBlocks/utilities'
import { Page, Reusable } from '@payload-types'
import { useThemePreference } from '@app/_providers/Theme'
import { Theme } from '@app/_providers/Theme/types'

// type ReusableContentBlockType = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
type ReusableContentBlockType = ExtractBlockProps<'reusableContentBlock'>

export const blockComponents: any = {
  banner: BannerBlock,
  callout: Callout,
  cardGrid: CardGrid,
  content: ContentBlock,
  contentGrid: ContentGrid,
  cta: CallToAction,
  // form: FormBlock,
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
      // 'blogContent',
      // 'blogMarkdown',
      // 'code',
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
    [themeState, blocks, paddingExceptions],
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
      <React.Fragment>
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
      </React.Fragment>
    )
  }

  return null
}
