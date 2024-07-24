'use client'

import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type DefaultHeroProps = ExtractBlockProps<'fields'>

export const DefaultHero: React.FC<DefaultHeroProps> = ({ description, theme }) => {
  return (
    <BlockWrapper settings={{ theme: theme }} className={getPaddingClasses('hero')}>
      <Gutter>
        {/* <BackgroundGrid zIndex={0} /> */}
        <div className={classes.defaultHero}>
          <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
            <div className={[`cols-8 start-1`, `cols-m-8`, 'cols-s-8'].filter(Boolean).join(' ')}>
              <RichText className={classes.richText} content={description} />
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
