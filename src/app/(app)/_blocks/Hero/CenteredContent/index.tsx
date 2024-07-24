'use client'

import React from 'react'
import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Breadcrumbs } from '@app/_components/Breadcrumbs'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'

import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { ChevronRightIcon } from 'lucide-react'
import { getPaddingClasses } from '@app/_css/tailwindClasses'
export type CenteredContentProps = ExtractBlockProps<'fields'>

export const CenteredContent: React.FC<CenteredContentProps> = ({
  content,
  links,
  breadcrumbs,
  theme,
  firstContentBlock,
}) => {
  return (
    <BlockWrapper settings={{ theme }} className={getPaddingClasses('standard')}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter>
        <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.content, 'cols-8 start-5 start-m-1 cols-m-8']
              .filter(Boolean)
              .join(' ')}
          >
            <div className={classes.richText}>
              <RichText content={content} />
            </div>

            <div className={[classes.links].filter(Boolean).join(' ')}>
              {Array.isArray(links) &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      key={i}
                      data={{ ...link }}
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
                    // <CMSLink
                    //   key={i}
                    //   {...link}
                    //   buttonProps={{
                    //     hideHorizontalBorders: false,
                    //     hideBottomBorderExceptLast: true,
                    //   }}
                    // />
                  )
                })}
            </div>
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}

export default CenteredContent
