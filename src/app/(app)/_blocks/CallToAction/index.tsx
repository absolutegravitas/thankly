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
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <div className={[classes.contentWrapper, 'cols-7 cols-m-8'].filter(Boolean).join(' ')}>
              {/* <RichText content={richText.root.children} className={classes.content} /> */}
              <RichText content={content} className={classes.content} />
            </div>
            <div
              className={[classes.linksContainer, 'cols-8 start-9 cols-m-8 start-m-1 grid']
                .filter(Boolean)
                .join(' ')}
            >
              {/* <BackgroundScanline
                className={[classes.scanline, 'cols-16 start-5 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
                crosshairs={['top-left', 'bottom-left']}
              />

              <CrosshairIcon className={[classes.crosshairTopLeft].filter(Boolean).join(' ')} />
              <CrosshairIcon className={[classes.crosshairBottomRight].filter(Boolean).join(' ')} /> */}

              {hasLinks && (
                <div className={[, classes.links, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}>
                  {links.map(({ link, type: ctaType }: any, index: any) => {
                    const type = ctaType ?? 'link'

                    return (
                      <CMSLink
                        {...link}
                        key={index}
                        appearance={'default'}
                        // width={'wide'}
                        // size={'medium'}
                        // icon={false}
                        buttonProps={{
                          appearance: 'default',
                          size: 'large',
                          hideHorizontalBorders: false,
                          hideBottomBorderExceptLast: true,
                          forceBackground: true,
                        }}
                        className={[classes.button].filter(Boolean).join(' ')}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
export default CallToAction
