import React from 'react'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import DynamicHtml from '@app/_components/DynamicHtml'

export type HeadingProps = ExtractBlockProps<'heading'>

export const Heading = ({ htmlContent }: HeadingProps) => {
  return (
    <div className="text-center w-full text-xl font-bold py-10 px-4">
      <DynamicHtml htmlContent={htmlContent} />
    </div>
  )
}

export default Heading
