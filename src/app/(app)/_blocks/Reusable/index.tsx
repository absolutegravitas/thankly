import React from 'react'
import Blocks from '@app/_blocks'

// import { RenderBlocks } from '@app/_components/RenderBlocks'
import { Page } from '@payload-types'

// export type Props = Extract<Page['layout'][0], { blockType: 'reusableContentBlock' }>

import { ExtractBlockProps } from '@app/_utilities/extractBlockProps'
export type Props = ExtractBlockProps<'reuse'>

export const ReusableContentBlock: React.FC<Props> = ({ reuseBlockFields }) => {
  console.log('reusable ', reuseBlockFields)
  const { reusable, customId } = reuseBlockFields

  if (typeof reusable === 'object' && reusable !== null) {
    return <Blocks blocks={reusable?.layout?.root?.children} />

    // <RenderBlocks blocks={reusableContent.layout} disableGutter customId={customId} />
  }

  return null
}

export default ReusableContentBlock
