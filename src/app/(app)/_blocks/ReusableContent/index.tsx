import React from 'react'

import { RenderBlocks } from '@web/_components/RenderBlocks'
import { Page } from '@payload-types'

// export type Props = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

import { ExtractBlockProps } from '@web/_utilities/extractBlockProps'
export type Props = ExtractBlockProps<'reusableContentBlock'>

export const ReusableContentBlock: React.FC<Props> = ({ reusableContentBlockFields }) => {
  const { reusableContent, customId } = reusableContentBlockFields

  if (typeof reusableContent === 'object' && reusableContent !== null) {
    return <RenderBlocks blocks={reusableContent.layout} disableGutter customId={customId} />
  }

  return null
}

export default ReusableContentBlock
