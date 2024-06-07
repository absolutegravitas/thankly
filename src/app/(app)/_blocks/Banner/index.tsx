import React from 'react'

import { Banner, Props as BannerProps } from '@app/_components/Banner'
import { Gutter } from '@app/_components/Gutter'
import { Reusable } from '@payload-types'
import { BlockWrapper, PaddingProps } from '@app/_components/BlockWrapper'

// export type BannerBlockProps = Extract<Reusable['layout'][0], { blockType: 'banner' }>

import { ExtractBlockProps } from '@/utilities/extractBlockProps'
export type BannerBlockProps = ExtractBlockProps<'banner'>

export const BannerBlock: React.FC<{
  bannerFields: BannerBlockProps['bannerFields']
  marginAdjustment?: boolean
  disableGutter?: boolean
}> = ({ bannerFields, disableGutter, marginAdjustment }) => {
  // console.log('banner block', bannerFields)
  const bannerProps: BannerProps = {
    type: bannerFields.type,
    content: bannerFields.content,
    icon: bannerFields.addCheckmark ? 'checkmark' : undefined,
    marginAdjustment: marginAdjustment,
  }

  return (
    <React.Fragment>
      {disableGutter ? (
        <Banner {...bannerProps} />
      ) : (
        <Gutter>
          <div className={'grid'}>
            <div className={'cols-8 start-5 cols-m-6 start-m-2 cols-s-8 start-s-1'}>
              <Banner {...bannerProps} />
            </div>
          </div>
        </Gutter>
      )}
    </React.Fragment>
  )
}

export default BannerBlock
