import React, { useState } from 'react'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Button } from '../../_components/ui/button'
import { IconProps } from '../../_icons/types'
import RichText from '../RichText'

export type BannerBlockProps = ExtractBlockProps<'banner'>

export const BannerBlock: React.FC<{
  bannerFields: BannerBlockProps['bannerFields']
}> = ({ bannerFields }) => {
  // console.log('bannerFields:', bannerFields)
  const { content, type, addCheckmark } = bannerFields

  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="w-full bg-thankly-green text-white py-4 px-6 flex items-center justify-center">
      <div className="text-center">{content && <RichText content={content} />}</div>
      {addCheckmark && (
        <div className="absolute right-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-thankly-lightgreen focus:bg-thankly-lightgreen"
            onClick={handleClose}
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default BannerBlock

function XIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
