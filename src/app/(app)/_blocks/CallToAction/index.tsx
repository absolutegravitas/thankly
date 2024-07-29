// This file exports a React component called 'CallToAction' and a type definition 'CallToActionProps'. The component is designed to render a call-to-action section with rich text content and optional links. It is built using Next.js 14's App Router and server components, and utilizes various utility components from the project's shared components.

// Overview:
// The CallToAction component renders a BlockWrapper component with padding classes based on the block settings. Inside the BlockWrapper, it displays the rich text content in a prose-style layout. If links are provided, it renders a set of CMSLink components with a specific look and styling. The component is designed to be reusable and configurable through its props.

// Performance considerations:
// - The component renders additional CMSLink components for each link provided, which could impact performance for large numbers of links.
// - The use of tailwind classes for styling could potentially lead to larger bundle sizes, but Next.js optimizations may mitigate this issue.

'use client'
import React from 'react'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'

// Type definition for the component's props
export type CallToActionProps = ExtractBlockProps<'cta'>

// The CallToAction component
export const CallToAction: React.FC<CallToActionProps> = (props) => {
  // Destructure the required properties from the props object
  const {
    ctaFields: { content, links, settings },
  } = props

  // Check if there are any links provided
  const hasLinks = links && links.length > 0

  return (
    // Render the BlockWrapper component with padding classes based on the settings
    <BlockWrapper settings={settings} className={`${getPaddingClasses('cta')}`}>
      <Gutter className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            {/* Render the RichText component with the provided content */}
            <RichText content={content} className="prose dark:prose-invert" />
          </div>
          {/* Render the CMSLink components if any links are provided */}
          {hasLinks && (
            <div className="space-y-4 flex flex-col items-start md:items-end">
              {links.map(({ link, type: ctaType }: any, index: any) => (
                <CMSLink
                  key={index}
                  data={{ ...link }}
                  look={{
                    theme: 'light',
                    type: 'button',
                    size: 'medium',
                    width: 'wide',
                    variant: 'blocks',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
export default CallToAction
