// This file is responsible for rendering different types of Hero components in a Next.js 14 application with App Router and server components.
// It acts as a central hub for different Hero variations, allowing for easy management and customization of Hero components across the application.
// The code exports a single `Hero` component that dynamically renders the appropriate Hero variant based on the provided `type` prop.

// Potential performance considerations:
// - Large or complex Hero components may impact initial render time, especially on slower networks or devices.
// - Unused Hero variants are still bundled, which could increase the overall bundle size.

import React from 'react'
import { CenteredContent } from './CenteredContent'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'
import { GradientHero } from './Gradient'
import { HomeHero } from './Home'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'

// Type alias for the different Hero types available
type HeroType = 'default' | 'contentMedia' | 'home' | 'centeredContent' | 'gradient'

// Interface defining the props for the `Hero` component, extracted from the block props
export type HeroProps = ExtractBlockProps<'hero'>

// Object mapping Hero types to their respective component implementations
const heroes: Record<HeroType, React.FC<any>> = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  centeredContent: CenteredContent,
  gradient: GradientHero,
}

// `Hero` component accepting props defined by `HeroProps` interface
export const Hero: React.FC<HeroProps> = (props) => {
  // console.log('hero block', props)

  // Type assertion to ensure `fields.type` matches the `HeroType` union
  const HeroToRender = heroes[props.type as HeroType]

  // Render the appropriate Hero component based on the provided `type` prop
  // If no matching Hero component is found, nothing is rendered
  return <React.Fragment>{HeroToRender && <HeroToRender {...props} />}</React.Fragment>
}

export default Hero
