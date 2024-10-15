import React from 'react'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import DynamicHtml from '@app/_components/DynamicHtml'

export type HtmlBlockProps = ExtractBlockProps<'htmlBlock'>

export const HtmlBlock = ({ htmlContent }: HtmlBlockProps) => {
  return <DynamicHtml htmlContent={htmlContent} />
}

export default HtmlBlock
