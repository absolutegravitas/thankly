import * as React from 'react'
import { QuoteIcon } from '@app/_icons/QuoteIcon'
import { formatDate } from '@app/_utilities/format-date-time'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// type Props = NonNullable<
//   Extract<Page['layout'][0], { blockType: 'slider' }>['sliderFields']['quoteSlides']
// >[0] & {
//   isActive: boolean
// }

import { ExtractBlockProps } from '@app/_utilities/extractBlockProps'
export type Props = ExtractBlockProps<'slider'>['sliderFields']['quoteSlides'] & {
  isActive: boolean
}

export const QuoteCard: React.FC<Props> = ({ quote, leader, author, role, isActive }) => {
  if (!quote) return null
  return (
    <div className={[classes.quoteCard, isActive && classes.isActive].filter(Boolean).join(' ')}>
      <div className={classes.leader}>{leader}</div>
      <h3 className={classes.quote}>
        {quote}
        <span className={classes.closingQuote}>”</span>
      </h3>
      <div className={classes.meta}>
        <p className={classes.author}>{author}</p>
        <p className={classes.role}>{role}</p>
      </div>
    </div>
  )
}
