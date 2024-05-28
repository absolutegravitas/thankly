import dynamic from 'next/dynamic'
import classes from '@app/_blocks/RichText/index.module.scss'

const Banner = dynamic(() => import('./Banner'))
const Callout = dynamic(() => import('./Callout'))
const CallToAction = dynamic(() => import('./CallToAction'))
const CardGrid = dynamic(() => import('./CardGrid'))
const Content = dynamic(() => import('./Content'))
const ContentGrid = dynamic(() => import('./ContentGrid'))
const FormBlock = dynamic(() => import('./FormBlock'))
const Hero = dynamic(() => import('./Hero'))
const HoverCards = dynamic(() => import('./HoverCards'))
const HoverHighlights = dynamic(() => import('./HoverHighlights'))
const LinkGrid = dynamic(() => import('./LinkGrid'))
const LogoGrid = dynamic(() => import('./LogoGrid'))
const MediaBlock = dynamic(() => import('./MediaBlock'))
const MediaContent = dynamic(() => import('./MediaContent'))
const MediaContentAccordion = dynamic(() => import('./MediaContentAccordion'))
const Pricing = dynamic(() => import('./Pricing'))
const Reusable = dynamic(() => import('./Reusable'))
const RichText = dynamic(() => import('./RichText'))
const Slider = dynamic(() => import('./Slider'))
const Statement = dynamic(() => import('./Statement'))

const Steps = dynamic(() => import('./Steps'))
const StickyHighlights = dynamic(() => import('./StickyHighlights'))

export type AdditionalBlockProps = {
  blockIndex: number
  locale: string
}

const blockComponents = {
  // pricing: Pricing,
  banner: Banner,
  callout: Callout,
  cardGrid: CardGrid,
  content: Content,
  contentGrid: ContentGrid,
  cta: CallToAction,
  form: FormBlock,
  hero: Hero,
  hoverCards: HoverCards,
  hoverHighlights: HoverHighlights,
  linkGrid: LinkGrid,
  logoGrid: LogoGrid,
  mediaBlock: MediaBlock,
  mediaContent: MediaContent,
  mediaContentAccordion: MediaContentAccordion,
  reuse: Reusable,
  RichText: RichText,
  slider: Slider,
  steps: Steps,
  statement: Statement,
  stickyHighlights: StickyHighlights,
}
const Blocks = ({ blocks, locale }: any) => {
  // console.log('blocks //', JSON.stringify(blocks))

  return (
    <>
      {blocks?.map((block: any, ix: number) => {
        console.log('type //', block.type)

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
