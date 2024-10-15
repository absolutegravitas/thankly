/**
 * @file Blocks.js
 * @description Dynamic block rendering component for a NextJS application
 * @overview This file defines a Blocks component that dynamically renders various content blocks based on their type. It uses Next.js's dynamic import feature to load block components on demand, improving initial load time and performance.
 *
 * The main Blocks component takes an array of block objects and a locale string as props. It then maps through these blocks, rendering either a RichText component for paragraph types or a specific block component based on the blockType field.
 *
 * @requires next/dynamic
 * @requires react
 */

'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import all block components to enable code-splitting and improve performance
const Banner = dynamic(() => import('./Banner'))
const Callout = dynamic(() => import('./Callout'))
const CallToAction = dynamic(() => import('./CallToAction'))
const CardGrid = dynamic(() => import('./CardGrid'))
const Content = dynamic(() => import('./Content'))
const ContentGrid = dynamic(() => import('./ContentGrid'))
const Hero = dynamic(() => import('./Hero'))
const HeroSlider = dynamic(() => import('./HeroSlider'))
const HoverCards = dynamic(() => import('./HoverCards'))
const HoverHighlights = dynamic(() => import('./HoverHighlights'))
const LinkGrid = dynamic(() => import('./LinkGrid'))
const LogoGrid = dynamic(() => import('./LogoGrid'))
const MediaBlock = dynamic(() => import('./MediaBlock'))
const MediaContent = dynamic(() => import('./MediaContent'))
const MediaContentAccordion = dynamic(() => import('./MediaContentAccordion'))
const ProductShowcase = dynamic(() => import('./ProductShowcase'))
const Reusable = dynamic(() => import('./Reusable'))
const RichText = dynamic(() => import('./RichText'))
const Slider = dynamic(() => import('./Slider'))
const Steps = dynamic(() => import('./Steps'))
const StickyHighlights = dynamic(() => import('./StickyHighlights'))

// Define additional props that will be passed to each block component
export type AdditionalBlockProps = {
  blockIndex: number
  locale: string
}

// Object mapping block types to their corresponding components
const blockComponents = {
  // pricing: Pricing,
  banner: Banner,
  callout: Callout,
  cardGrid: CardGrid,
  content: Content,
  contentGrid: ContentGrid,
  cta: CallToAction,
  hero: Hero,
  heroSlider: HeroSlider,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  linkGrid: LinkGrid,
  logoGrid: LogoGrid,
  mediaBlock: MediaBlock,
  mediaContent: MediaContent,
  mediaContentAccordion: MediaContentAccordion,
  productShowcase: ProductShowcase,
  reuse: Reusable,
  RichText: RichText,
  slider: Slider,
  steps: Steps,
  stickyHighlights: StickyHighlights,
}

// Main Blocks component that renders an array of content blocks
const Blocks = ({ blocks, locale }: any) => {
  return (
    <React.Fragment>
      {blocks?.map((block: any, ix: number) => {
        // Map through each block in the blocks array
        switch (
          block.type // Switch statement to handle different block types
        ) {
          case 'paragraph':
            return (
              // Handle 'paragraph' type blocks by rendering them as RichText components
              <RichText key={ix} content={{ root: { ...block } }} />
            )
          case 'block':
            // console.log('block -- ', JSON.stringify(block))
            if (block.fields && block.fields.blockType) {
              // Handle 'block' type blocks by dynamically selecting and rendering the appropriate component
              // @ts-ignore
              const BlockComponent = blockComponents[block.fields.blockType] ?? null
              return BlockComponent ? (
                <BlockComponent key={ix} {...block.fields} blockIndex={ix} locale={locale} />
              ) : null
            }
            break
          default:
            break // Default case to handle any unrecognized block types
        }
      })}
    </React.Fragment>
  )
}

export default Blocks
