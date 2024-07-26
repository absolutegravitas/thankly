import React from 'react'

import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { Page } from '@payload-types'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'content' }> & {
//   padding: PaddingProps
// }

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { getPaddingClasses } from '../../_css/tailwindClasses'
export type Props = ExtractBlockProps<'content'> & { padding: PaddingProps }

const Columns: React.FC<Props> = (props) => {
  const { contentFields } = props
  const { layout, columnOne, columnTwo, columnThree, settings } = contentFields

  switch (layout) {
    case 'oneColumn': {
      return (
        <div className={'cols-12 cols-m-8'}>
          <RichText content={columnOne} />
        </div>
      )
    }

    case 'twoColumns':
    case 'halfAndHalf':
    case 'twoThirdsOneThird': {
      let col1Cols = 6
      let col2Cols = 6

      if (layout === 'halfAndHalf') {
        col1Cols = 8
        col2Cols = 8
      }

      if (layout === 'twoThirdsOneThird') {
        col1Cols = 11
        col2Cols = 5
      }

      return (
        <React.Fragment>
          <div className={`cols-${col1Cols} cols-m-8`}>
            <RichText content={columnOne} />
          </div>
          <div className={`cols-${col2Cols} cols-m-8`}>
            <RichText content={columnTwo} />
          </div>
        </React.Fragment>
      )
    }

    case 'threeColumns': {
      return (
        <React.Fragment>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnOne} />
          </div>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnTwo} />
          </div>
          <div className={'cols-5 cols-m-8'}>
            <RichText content={columnThree} />
          </div>
        </React.Fragment>
      )
    }

    default: {
      return null
    }
  }
}

export const ContentBlock: React.FC<Props> = (props) => {
  // console.log('content props', props)
  const {
    contentFields: { useLeadingHeader, leadingHeader, settings },
    padding,
  } = props

  // console.log(props)
  // return <React.Fragment></React.Fragment>
  return (
    <BlockWrapper className={getPaddingClasses('content')} settings={settings}>
      {/* <BackgroundGrid zIndex={0} /> */}
      <Gutter className={classes.contentBlock}>
        {useLeadingHeader && <RichText className={classes.leadingHeader} content={leadingHeader} />}
        <div className={'grid'}>
          <Columns {...props} />
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
export default ContentBlock
