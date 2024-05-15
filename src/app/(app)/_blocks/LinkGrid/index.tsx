'use client'

import React, { useState } from 'react'

import { BackgroundGrid } from '@web/_components/BackgroundGrid'
import { BlockSpacing } from '@web/_components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@web/_components/BlockWrapper'
import { CMSLink } from '@web/_components/CMSLink'
import { Gutter } from '@web/_components/Gutter'
import { LineDraw } from '@web/_components/LineDraw'
import { ArrowIcon } from '@web/_icons/ArrowIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// export type LinkGridProps = Extract<Page['layout'][0], { blockType: 'linkGrid' }> & {
//   padding?: PaddingProps
// }

type Fields = Exclude<any['linkGridFields'], undefined>

type Props = Exclude<Fields['links'], undefined | null>[number]['link']

const LinkGridItem: React.FC<Props> = (props) => {
  return (
    <CMSLink {...props} className={classes.link}>
      <ArrowIcon size="large" className={classes.arrow} />
    </CMSLink>
  )
}

export const LinkGrid: React.FC<
  any & {
    // LinkGridProps & {
    className?: string
  }
> = (props) => {
  const { className, linkGridFields, padding } = props

  const links = linkGridFields?.links
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockWrapper
      className={[className, classes.linkGrid].filter(Boolean).join(' ')}
      padding={padding}
      settings={linkGridFields?.settings}
    >
      <BackgroundGrid zIndex={0} />
      <Gutter>
        {hasLinks && (
          <div className={classes.links}>
            {links.map((link, index) => {
              return (
                <LinkGridItem
                  key={index}
                  {...(link?.link || {
                    label: 'Untitled',
                  })}
                />
              )
            })}
          </div>
        )}
      </Gutter>
    </BlockWrapper>
  )
}
export default LinkGrid
