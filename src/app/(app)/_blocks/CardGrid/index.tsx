'use client'

import React, { CSSProperties, useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { SquareCard } from '@app/_components/cards/SquareCard'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type CardGridProps = Extract<Page['layout'][0], { blockType: 'cardGrid' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type CardGridProps = ExtractBlockProps<'cardGrid'> & { padding: PaddingProps }

export const CardGrid: React.FC<CardGridProps> = (props) => {
  const {
    cardGridFields: { content, cards, links, settings, revealDescription },
  } = props

  const [index, setIndex] = useState(0)

  const cardLength = cards?.length ?? 0
  const hasCards = Array.isArray(cards) && cardLength > 0
  const hasLinks = Array.isArray(links) && links.length > 0
  const excessLength = cardLength > 4 ? 8 - cardLength : 4 - cardLength

  const wrapperStyle: CSSProperties = {
    '--excess-length-large': excessLength,
    '--excess-length-mid': cardLength % 2 === 0 ? 0 : 1,
  } as CSSProperties

  return (
    <BlockWrapper
      settings={settings}
      className={[getPaddingClasses('cardGrid'), classes.cardGrid].filter(Boolean).join(' ')}
    >
      {/* <BackgroundGrid zIndex={1} /> */}
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {content && (
            <div
              className={[classes.richTextWrapper, 'grid grid-cols-1 md:grid-cols-2 gap-4']
                .filter(Boolean)
                .join(' ')}
            >
              <div className={[classes.richText, ''].filter(Boolean).join(' ')}>
                <RichText content={content} />
              </div>

              <div
                className={
                  'space-y-6 flex flex-col items-end justify-end justify-items-end flex-auto px-4 md:px-8'
                }
              >
                {hasLinks &&
                  links.map(({ link }: any, index: any) => {
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
                          // className="grow"
                        />
                      </React.Fragment>
                    )
                  })}
              </div>

              {/* {hasLinks && (
                <div
                  className={[classes.linksWrapper, 'cols-4 start-13 cols-l-4 cols-m-8 start-m-1']
                    .filter(Boolean)
                    .join(' ')}
                >
                  {links.map(({ link }, index) => {
                    return (
                      <CMSLink
                        {...link}
                        key={index}
                        appearance="default"
                        fullWidth
                        buttonProps={{
                          icon: 'arrow',
                          hideHorizontalBorders: false,
                          hideBottomBorderExceptLast: true,
                        }}
                      />
                    )
                  })}
                </div>
              )} */}
            </div>
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            {/* <div className={classes.margins}>
              <BackgroundScanline enableBorders={true} className={classes.marginLeft} />
              <BackgroundScanline enableBorders={true} className={classes.marginRight} />
            </div> */}
            <div
              className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}
              style={wrapperStyle}
            >
              {cards.map((card, index) => {
                const { title, description, enableLink, link } = card
                return (
                  <div
                    key={index}
                    className={'cols-4 cols-s-8'}
                    onMouseEnter={() => setIndex(index + 1)}
                    onMouseLeave={() => setIndex(0)}
                  >
                    <SquareCard
                      leader={(index + 1).toString().padStart(2, '0')}
                      className={classes.card}
                      title={title}
                      description={description}
                      enableLink={enableLink}
                      link={link}
                      revealDescription={revealDescription}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default CardGrid
