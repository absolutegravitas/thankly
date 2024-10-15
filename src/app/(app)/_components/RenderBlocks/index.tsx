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

import { Heading } from '@app/_blocks/Heading'
import { HoverCards } from '@app/_blocks/HoverCards'
import { HoverHighlights } from '@app/_blocks/HoverHighlights'
import { HtmlBlock } from '@app/_blocks/HtmlBlock'
import { LinkGrid } from '@app/_blocks/LinkGrid'
import { LogoGrid } from '@app/_blocks/LogoGrid'
import { MediaBlock } from '@app/_blocks/MediaBlock'
import { MediaContent } from '@app/_blocks/MediaContent'
import { MediaContentAccordion } from '@app/_blocks/MediaContentAccordion'
import { ReusableContentBlock } from '@app/_blocks/Reusable'
import { Slider } from '@app/_blocks/Slider'
import { Steps } from '@app/_blocks/Steps'

import { toKebabCase } from '@/utilities/to-kebab-case'

import { PaddingProps, Settings } from '@app/_components/BlockWrapper'
import { getFieldsKeyFromBlock } from '@app/_components/RenderBlocks/utilities'
import { Page, Reusable } from '@payload-types'

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
  heading: Heading,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  htmlBlock: HtmlBlock,
  linkGrid: LinkGrid,
  logoGrid: LogoGrid,
  mediaBlock: MediaBlock,
  mediaContent: MediaContent,
  mediaContentAccordion: MediaContentAccordion,
  reusableContentBlock: ReusableContentBlock,
  slider: Slider,
  steps: Steps,
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
  const [docPadding, setDocPadding] = React.useState(0)
  const docRef = React.useRef<HTMLDivElement>(null)

  const paddingExceptions = useMemo(() => ['banner', 'reusableContentBlock'], [])

  const getPaddingProps = useCallback(
    (block: (typeof blocks)[number], index: number) => {
      const isFirst = index === 0
      const isLast = index + 1 === blocks.length

      let topPadding: PaddingProps['top']
      let bottomPadding: PaddingProps['bottom']

      let previousBlock = !isFirst ? blocks[index - 1] : null
      let previousBlockKey, previousBlockSettings

      let nextBlock =
        index + 1 < blocks.length ? blocks[Math.min(index + 1, blocks.length - 1)] : null
      let nextBlockKey, nextBlockSettings

      let currentBlockSettings: Settings = block[getFieldsKeyFromBlock(block)]?.settings

      if (previousBlock) {
        previousBlockKey = getFieldsKeyFromBlock(previousBlock)
        previousBlockSettings = previousBlock[previousBlockKey]?.settings
      }

      if (nextBlock) {
        nextBlockKey = getFieldsKeyFromBlock(nextBlock)
        nextBlockSettings = nextBlock[nextBlockKey]?.settings
      }

      // If first block in the layout, add top padding based on the hero
      if (isLast) bottomPadding = 'large'

      if (paddingExceptions.includes(block.blockType)) bottomPadding = 'large'

      return {
        top: topPadding ?? undefined,
        bottom: bottomPadding ?? undefined,
      }
    },
    [, blocks, paddingExceptions],
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
