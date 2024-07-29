'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type HoverCardsProps = Extract<Page['layout'][0], { blockType: 'hoverCards' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type HoverCardsProps = ExtractBlockProps<'hoverCards'> //& { padding: PaddingProps }

const Card: React.FC<{
  leader: number
  card: NonNullable<HoverCardsProps['hoverCardsFields']['cards']>[number]
  setHover: Dispatch<SetStateAction<number>>
}> = ({ card, leader, setHover }) => {
  // console.log('hovercards //', card)

  return (
    <div
      className={classes.cardWrapper}
      onMouseEnter={() => setHover(++leader)}
      onMouseLeave={() => setHover(1)}
    >
      <CMSLink
        className={classes.card}
        data={{ ...card.link }}
        // {...card.link}
      >
        <p className={classes.leader}>0{leader}</p>
        <div className={classes.cardContent}>
          <h3 className={classes.cardTitle}>{card.title}</h3>
          <p className={classes.description}>{card.description}</p>
        </div>
        <ArrowIcon className={classes.arrow} />
      </CMSLink>
    </div>
  )
}

export const HoverCards: React.FC<HoverCardsProps> = (props) => {
  const {
    hoverCardsFields: { richText, cards, settings },
  } = props
  // console.log('hovercardsfoelds //', props)

  const [activeGradient, setActiveGradient] = useState(1)
  const gradients = [1, 2, 3, 4]
  const hasCards = Array.isArray(cards) && cards.length > 0

  return (
    <BlockWrapper
      className={[getPaddingClasses('hoverCards'), classes.wrapper].filter(Boolean).join(' ')}
    >
      <BackgroundGrid zIndex={1} />
      {/* <div className={classes.noiseWrapper}>
        {gradients.map((gradient) => {
          return (
            <Image
              key={gradient}
              alt=""
              className={[classes.bg, activeGradient === gradient && classes.activeBg]
                .filter(Boolean)
                .join(' ')}
              width={1920}
              height={946}
              src={`/images/gradients/${gradient}.jpg`}
            />
          )
        })}
      </div> */}
      <Gutter>
        <div className={[classes.introWrapper, 'grid'].filter(Boolean).join(' ')}>
          {richText && (
            <RichText
              className={[classes.richText, 'cols-12 cols-m-8'].filter(Boolean).join(' ')}
              content={richText}
            />
          )}
        </div>

        {hasCards && (
          <div className={classes.cards}>
            <div className={['grid', classes.cardsWrapper].filter(Boolean).join(' ')}>
              <BackgroundGrid className={classes.backgroundGrid} ignoreGutter />
              {cards.map((card, index) => {
                return (
                  <div key={index} className={'cols-4 cols-s-8'}>
                    <Card card={card} leader={++index} setHover={setActiveGradient} />
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
export default HoverCards
