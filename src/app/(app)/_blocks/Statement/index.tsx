'use client'
import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
// import Code from '@app/_components/Code'
import { Gutter } from '@app/_components/Gutter'
import { Media } from '@app/_components/Media'
import SplitAnimate from '@app/_components/SplitAnimate'
import { Page } from '@payload-types'
import { RichText } from '@app/_blocks/RichText'

import classes from './index.module.scss'

// export type StatementProps = Extract<Page['layout'][0], { blockType: 'statement' }> & {
//   padding?: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type StatementProps = ExtractBlockProps<'statement'> & { padding: PaddingProps }

export const Statement: React.FC<StatementProps> = (props) => {
  const {
    statementFields: {
      content,
      links,
      assetType,
      media,
      code,
      mediaWidth,
      backgroundGlow,
      settings,
    },
    // padding,
  } = props

  const hasLinks = links && links.length > 0

  const mediaWidthClass =
    mediaWidth === 'small'
      ? 'cols-8 start-5 cols-m-8 start-m-1'
      : mediaWidth === 'large'
        ? 'cols-16 cols-m-8'
        : 'cols-12 start-3 cols-m-8 start-m-1'

  return (
    <BlockWrapper settings={settings} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter className={classes.statementWrap}>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.statement, 'cols-8 start-5 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <RichText content={content} className={classes.content} />
            {hasLinks && (
              <div className={[classes.links].filter(Boolean).join(' ')}>
                {links.map(({ link }: any, i: any) => {
                  return (
                    <CMSLink
                      key={i}
                      data={{ ...link }}
                      look={{
                        theme: 'light',
                        type: 'button',
                        size: 'medium',
                        width: 'wide',
                        variant: 'blocks',
                      }}
                    />
                    // <CMSLink
                    //   {...link}
                    //   key={i}
                    //   appearance="default"
                    //   fullWidth
                    //   buttonProps={{
                    //     icon: 'arrow',
                    //     hideHorizontalBorders: false,
                    //     hideBottomBorderExceptLast: true,
                    //   }}
                    // />
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div className={[classes.assetWrap, 'grid'].join(' ')}>
          {assetType === 'media'
            ? media &&
              typeof media !== 'string' && (
                <div className={mediaWidthClass}>
                  <Media
                    resource={media}
                    className={[mediaWidthClass, backgroundGlow && classes[backgroundGlow]]
                      .filter(Boolean)
                      .join(' ')}
                  />
                </div>
              )
            : code && (
                <div
                  className={[
                    backgroundGlow && classes[backgroundGlow],
                    'cols-10 start-4 cols-m-8 start-m-1',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {/* <Code className={classes.codeBlock}>{code}</Code> */}
                </div>
              )}
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

export default Statement
