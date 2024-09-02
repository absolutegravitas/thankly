import deepMerge from '@/utilities/deepMerge'

import {
  lexicalEditor,
  FixedToolbarFeature,
  BlocksFeature,
  TreeViewFeature,
  lexicalHTML,
  HTMLConverterFeature,
  HTMLConverter,
  defaultHTMLConverters,
  SerializedBlockNode,
} from '@payloadcms/richtext-lexical'

import type { RichTextField } from 'payload'

import { Banner } from '@cms/_blocks/Banner'
import { Callout } from '@cms/_blocks/Callout'
import { CallToAction } from '@cms/_blocks/CallToAction'
import { CardGrid } from '@cms/_blocks/CardGrid'
import { Content } from '@cms/_blocks/Content'
import { ContentGrid } from '@cms/_blocks/ContentGrid'
import { Form } from '@cms/_blocks/Form'
import { Hero } from '@cms/_blocks/Hero'
import { HeroSlider } from '@cms/_blocks/HeroSlider'
import { HoverCards } from '@cms/_blocks/HoverCards'
import { HoverHighlights } from '@cms/_blocks/HoverHighlights'
import { LinkGrid } from '@cms/_blocks/LinkGrid'
import { LogoGrid } from '@cms/_blocks/LogoGrid'
import { MediaBlock } from '@cms/_blocks/Media'
import { MediaContent } from '@cms/_blocks/MediaContent'
import { MediaContentAccordion } from '@cms/_blocks/MediaContentAccordion'
// import { Pricing } from '@cms/_blocks/Pricing'
import { MediaSlider } from '@cms/_blocks/MediaSlider'

import { Reuse } from '@cms/_blocks/Reuse'
import { Slider } from '@cms/_blocks/Slider'
import { Statement } from '@cms/_blocks/Statement'
import { Steps } from '@cms/_blocks/Steps'
import { StickyHighlights } from '@cms/_blocks/StickyHighlights'

// Define the ContentField type

type LayoutField = (
  overrides?: Partial<RichTextField>,
  includedBlocks?: string[], // Array of block names to include
) => RichTextField

export const layoutField: LayoutField = (
  overrides,
  includedBlocks = [
    'Banner',
    'Callout',
    'CallToAction',
    'CardGrid',
    'Content',
    'ContentGrid',
    'Form',
    'Hero',
    'HeroSlider',
    'HoverCards',
    'HoverHighlights',
    'LinkGrid',
    'LogoGrid',
    'MediaBlock',
    'MediaContent',
    'MediaContentAccordion',
    'MediaSlider',
    'Reuse',
    'Slider',
    'Statement',
    'Steps',
    'StickyHighlights',
  ],
) => {
  const fieldOverrides = { ...(overrides || {}) }
  delete fieldOverrides.admin

  // Map included block names to their respective block components
  const blocks: any[] = includedBlocks
    .map((blockName) => {
      switch (blockName) {
        case 'Banner':
          return Banner
        case 'Callout':
          return Callout
        case 'CallToAction':
          return CallToAction
        case 'CardGrid':
          return CardGrid

        case 'Content':
          return Content
        case 'ContentGrid':
          return ContentGrid
        case 'Form':
          return Form
        case 'Hero':
          return Hero
        case 'HeroSlider':
          return HeroSlider
        case 'HoverCards':
          return HoverCards
        case 'HoverHighlights':
          return HoverHighlights
        case 'LinkGrid':
          return LinkGrid
        case 'LogoGrid':
          return LogoGrid
        case 'MediaBlock':
          return MediaBlock
        case 'MediaContent':
          return MediaContent
        case 'MediaContentAccordion':
          return MediaContentAccordion
        // case 'Pricing':
        //   return Pricing
        case 'MediaSlider':
          return MediaSlider
        case 'Reuse':
          return Reuse
        case 'Slider':
          return Slider
        case 'Statement':
          return Statement
        case 'Steps':
          return Steps
        case 'StickyHighlights':
          return StickyHighlights
        default:
          return null
      }
    })
    .filter((block) => block !== null) as any[]

  return deepMerge<RichTextField>(
    {
      name: 'layout',
      type: 'richText',
      required: false,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          BlocksFeature({ blocks: blocks }),
        ],
      }),
    },
    fieldOverrides || {},
  )
}

// const BlockHtmlConverter: HTMLConverter<SerializedBlockNode> = {
//   // server side conversion of blocks to html

//   converter({ node }) {
//     // console.log('blockType', node.fields.blockType)

//     switch (node.fields.blockType) {
//       case 'p5js':
//         return `<p5>${node.fields.p5js_code}</p5>`
//       default:
//         return `<span>unknown node.</span>`
//     }
//   },
//   nodeTypes: ['block'],
// }
