import * as React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { useGetHeroPadding } from '../Hero/useGetHeroPadding'
export type ContentGridProps = ExtractBlockProps<'contentGrid'> & { padding: PaddingProps }

type CellsProps = ContentGridProps['contentGridFields'] & {
  className?: string
}

const Cells: React.FC<CellsProps> = ({ cells, className, showNumbers, style: styleFromProps }) => {
  const style = styleFromProps ?? 'gridBelow'

  return (
    <div
      className={[classes.cellGrid, 'grid', style === 'gridBelow' ? 'cols-16 cols-m-8' : 'cols-8']
        .filter(Boolean)
        .join(' ')}
    >
      {cells?.map((cell: any, i: any) => {
        return (
          <div
            className={[classes.cell, style === 'sideBySide' ? 'cols-8' : 'cols-4 cols-s-8']
              .filter(Boolean)
              .join(' ')}
            key={i}
          >
            {showNumbers && <p className={classes.leader}>0{++i}</p>}
            <RichText className={classes.cellRichText} content={cell.content} />
          </div>
        )
      })}
    </div>
  )
}

export const ContentGrid: React.FC<ContentGridProps> = (props) => {
  const {
    contentGridFields: { settings, style: styleFromProps, content, links },
  } = props || {}

  const padding = useGetHeroPadding(settings.theme, props)

  const hasLinks = Array.isArray(links) && links.length > 0
  const style = styleFromProps ?? 'gridBelow'

  return (
    <BlockWrapper settings={settings} padding={{ ...padding, top: 'large' }}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter className={[classes.wrapper, classes[style], 'grid'].filter(Boolean).join(' ')}>
        <div
          className={[
            classes.topContent,
            classes[style],
            'grid',
            style === 'sideBySide' ? 'cols-8 ' : 'cols-16 cols-m-8',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content && (
            <RichText
              className={[
                classes.richText,
                style === 'sideBySide' ? 'cols-12 flex flex-col' : 'cols-8',
              ]
                .filter(Boolean)
                .join(' ')}
              content={content}
            />
          )}

          {hasLinks && (
            <div
              className={[
                classes.linksWrapper,
                style === 'sideBySide'
                  ? 'flex flex-row gap-3 cols-8'
                  : 'flex flex-row gap-3 px-4 md:px-8 #cols-4 items-end justify-end justify-items-end md:col-span-7 #start-12 #cols-l-4 cols-m-8 #start-m-1',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {links.map(({ link }, index) => {
                return (
                  <CMSLink
                    key={index}
                    data={{ ...link }}
                    look={{
                      theme: 'light',
                      type: 'button',
                      size: 'medium',
                      width: 'normal',
                      variant: 'blocks',
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>

        <Cells {...props.contentGridFields} />
      </Gutter>
    </BlockWrapper>
  )
}
export default ContentGrid
