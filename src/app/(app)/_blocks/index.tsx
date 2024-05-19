import dynamic from 'next/dynamic'
import classes from '@app/_blocks/RichText/index.module.scss'

const Banner = dynamic(() => import('./Banner'))
const Callout = dynamic(() => import('./Callout'))
const CallToAction = dynamic(() => import('./CallToAction'))
const CardGrid = dynamic(() => import('./CardGrid'))
const Content = dynamic(() => import('./Content'))
const ContentGrid = dynamic(() => import('./ContentGrid'))
const FormBlock = dynamic(() => import('./FormBlock'))
const HoverCards = dynamic(() => import('./HoverCards'))
const HoverHighlights = dynamic(() => import('./HoverHighlights'))
const LinkGrid = dynamic(() => import('./LinkGrid'))
const LogoGrid = dynamic(() => import('./LogoGrid'))
const MediaBlock = dynamic(() => import('./MediaBlock'))
const MediaContent = dynamic(() => import('./MediaContent'))
const MediaContentAccordion = dynamic(() => import('./MediaContentAccordion'))
const Pricing = dynamic(() => import('./Pricing'))
const Reusable = dynamic(() => import('./Reusable'))
const Slider = dynamic(() => import('./Slider'))
const Steps = dynamic(() => import('./Steps'))
const StickyHighlights = dynamic(() => import('./StickyHighlights'))
const RichText = dynamic(() => import('./RichText'))
const Hero = dynamic(() => import('./Hero'))

export type AdditionalBlockProps = {
  blockIndex: number
  locale: string
}

const blockComponents = {
  banner: Banner,
  // callout: Callout, // causes stack error recursion
  cta: CallToAction,
  hero: Hero,
  cardGrid: CardGrid,
  content: Content,
  contentGrid: ContentGrid,
  formBlock: FormBlock,
  hoverCards: HoverCards,
  // hoverHighlights: HoverHighlights, // breaks page call stack exceeded
  linkGrid: LinkGrid,
  // logoGrid: LogoGrid, // images don't load, busy page
  // mediaBlock: MediaBlock, // call stack exceeded
  // mediaContent: MediaContent,
  // mediaContentAccordion: MediaContentAccordion,
  // pricing: Pricing,
  reuse: Reusable,
  slider: Slider,
  steps: Steps,
  stickyHighlights: StickyHighlights,
  RichText: RichText,
}
const Blocks = ({ blocks, locale }: any) => {
  // console.log('blocks //', JSON.stringify(blocks))

  return (
    <>
      {blocks?.map((block: any, ix: number) => {
        // console.log('type //', block.type)

        //create switch statement for block.type
        switch (block.type) {
          case 'paragraph':
            return (
              <RichText
                key={ix}
                content={{ root: { ...block } }}
                className={`${classes.content} py-6`}
              />
            )
          case 'block':
            if (block.fields && block.fields.blockType) {
              // @ts-ignore
              const BlockComponent = blockComponents[block.fields.blockType] ?? null
              return BlockComponent ? (
                <BlockComponent key={ix} {...block.fields} blockIndex={ix} locale={locale} />
              ) : null
            }
            break
          default:
            break
        }
      })}
    </>
  )
}

export default Blocks
