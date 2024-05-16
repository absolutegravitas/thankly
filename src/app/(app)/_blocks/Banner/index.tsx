import React from 'react'

import { Banner, Props as BannerProps } from '@app/_components/Banner'
import { Gutter } from '@app/_components/Gutter'
import { Reusable } from '@payload-types'

export type BannerBlockProps = {
  id: string
  blockName: string
  blockType: 'banner'
  bannerFields: {
    type: string
    content: {
      root: {
        type: string
        format: string
        indent: number
        version: number
        children: {
          type: string
          format: string
          indent: number
          version: number
          children: {
            mode: string
            text: string
            type: string
            style: string
            detail: number
            format: number
            version: number
          }[]
          direction: string
          textFormat: number
        }[]
        direction: string
      }
    }
    settings: Record<string, any>
    addCheckmark: boolean
  }
  format: string
  version: number
  marginAdjustment?: boolean
  disableGutter?: boolean
}

export const BannerBlock: React.FC<{
  bannerFields: BannerBlockProps['bannerFields']
  marginAdjustment?: boolean
  disableGutter?: boolean
}> = ({ bannerFields, disableGutter, marginAdjustment }) => {
  const bannerProps: BannerProps = {
    type: bannerFields.type,
    content: bannerFields.content,
    icon: bannerFields.addCheckmark ? 'checkmark' : undefined,
    marginAdjustment: marginAdjustment,
  }

  return (
    <>
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
    </>
  )
}

export default BannerBlock
