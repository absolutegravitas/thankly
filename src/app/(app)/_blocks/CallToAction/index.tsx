'use client'
import React from 'react'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type CallToActionProps = ExtractBlockProps<'cta'> // & { padding: PaddingProps }

export const CallToAction: React.FC<CallToActionProps> = (props) => {
  // console.log('cta block data //', JSON.stringify(props))
  const {
    ctaFields: { content, links, settings },
  } = props

  const hasLinks = links && links.length > 0

  // console.log('content for richText // ', JSON.stringify(content))
  return (
    <BlockWrapper settings={settings} className={`${getPaddingClasses('cta')}`}>
      <Gutter className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <RichText content={content} className="prose dark:prose-invert" />
          </div>
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
