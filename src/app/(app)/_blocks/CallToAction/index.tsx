'use client'
import React from 'react'
import { ArrowIcon } from '@app/_icons/ArrowIcon'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BackgroundScanline } from '@app/_components/BackgroundScanline'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
// import CreatePayloadApp from '@app/_components/CreatePayloadApp'
import { Gutter } from '@app/_components/Gutter'
// import { RichText } from '@app/_blocks/RichText'
import { RichText } from '@app/_blocks/RichText'

import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type CallToActionProps = Extract<Page['layout'][0], { blockType: 'cta' }> & {
//   padding?: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { useGetHeroPadding } from '../Hero/useGetHeroPadding'
export type CallToActionProps = ExtractBlockProps<'cta'> & { padding: PaddingProps }

export const CallToAction: React.FC<CallToActionProps> = (props) => {
  // console.log('cta block data //', JSON.stringify(props))
  const {
    ctaFields: { content, links, settings },
  } = props
  const padding = useGetHeroPadding(settings.theme, props)

  const hasLinks = links && links.length > 0

  // console.log('content for richText // ', JSON.stringify(content))
  return (
    <BlockWrapper settings={settings} padding={padding}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter className={classes.callToAction}>
        <div className={[classes.wrapper].filter(Boolean).join(' ')}>
          <div
            className={[classes.container, 'grid grid-cols-1 md:grid-cols-2 gap-4']
              .filter(Boolean)
              .join(' ')}
          >
            <div className={[classes.contentWrapper, ''].filter(Boolean).join(' ')}>
              <RichText content={content} className={classes.content} />
            </div>
            <div
              className={
                'space-y-6 flex flex-col items-end justify-end justify-items-end flex-auto px-4 md:px-8'
              }
            >
              {hasLinks &&
                links.map(({ link, type: ctaType }: any, index: any) => {
                  const type = ctaType ?? 'link'

                  return (
                    <React.Fragment>
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
                    </React.Fragment>
                  )
                })}
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
export default CallToAction
