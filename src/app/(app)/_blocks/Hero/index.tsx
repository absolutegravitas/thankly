import React from 'react'
import { CenteredContent } from './CenteredContent'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'
// import { FormHero } from './FormHero'
import { GradientHero } from './Gradient'
import { HomeHero } from './Home'
import { ThreeHero } from './Three'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'

type HeroType =
  | 'default'
  | 'contentMedia'
  | 'home'
  // | 'form'
  | 'centeredContent'
  | 'gradient'
  | 'three'

export type HeroProps = ExtractBlockProps<'hero'>

const heroes: Record<HeroType, React.FC<any>> = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  // form: FormHero,
  centeredContent: CenteredContent,
  gradient: GradientHero,
  three: ThreeHero,
}

export const Hero: React.FC<HeroProps> = (props) => {
  // console.log('hero block', props)

  // Type assertion to ensure fields.type is HeroType
  const HeroToRender = heroes[props.type as HeroType]

  return <React.Fragment>{HeroToRender && <HeroToRender {...props} />}</React.Fragment>
}

export default Hero

// export const Hero: React.FC<{
//   page: Page
//   // firstContentBlock?: BlocksProp
// }> = (props) => {
//    // console.log('hero //', props)
//   const {
//     page: {
//       // hero,
//       breadcrumbs,
//       // hero: { type },
//     },
//     firstContentBlock,
//   } = props

//   const HeroToRender = heroes[type] as any

//   if (HeroToRender) {
//     return (
//       <React.Fragment>
//         {/* <BreadcrumbsBar hero={hero} breadcrumbs={breadcrumbs} /> */}

//         <HeroToRender
//           {...hero}
//           firstContentBlock={firstContentBlock}
//           // breadcrumbs={breadcrumbs}
//         />
//       </React.Fragment>
//     )
//   }

//   return null
// }
