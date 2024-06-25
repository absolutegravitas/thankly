'use client'

import React, { useState } from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockSpacing } from '@app/_components/BlockSpacing'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { LineDraw } from '@app/_components/LineDraw'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { Page } from '@payload-types'

import classes from './index.module.scss'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '../../_css/tailwindClasses'

// export type LinkGridProps = Extract<Page['layout'][0], { blockType: 'linkGrid' }> & {
//   padding?: PaddingProps
// }

type Fields = Exclude<any['linkGridFields'], undefined>

type Props = Exclude<Fields['links'], undefined | null>[number]['link']

const LinkGridItem: React.FC<Props> = (props) => {
  // console.log('lnkGrid', props)
  return (
    <React.Fragment>
      <CMSLink
        data={{ ...props }}
        look={{
          theme: 'light',
          type: 'button',
          size: 'medium',
          width: 'normal',
          variant: 'blocks',
          icon: {
            content: <ChevronRightIcon strokeWidth={1.25} />,
            iconPosition: 'right',
          },
        }}
      />
      {/* <CMSLink {...props} className={classes.link}>
        <ArrowIcon size="large" className={classes.arrow} />
      </CMSLink> */}
    </React.Fragment>
  )
}

export const LinkGrid: React.FC<
  any & {
    // LinkGridProps & {
    className?: string
  }
> = (props) => {
  const { className, linkGridFields } = props
  const { settings } = linkGridFields
  const links = linkGridFields?.links
  const hasLinks = Array.isArray(links) && links.length > 0

  return (
    <BlockWrapper
      className={[getPaddingClasses('standard'), className, classes.linkGrid]
        .filter(Boolean)
        .join(' ')}
      settings={linkGridFields?.settings}
    >
      {/* <BackgroundGrid zIndex={0} /> */}
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
