import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media } from '@/payload-types'

export type Props = ExtractBlockProps<'mediaSlider'>

export const MediaSlider = ({ mediaSliderFields }: Props) => {
  const { colsMobile, colsMedium, colsLarge, colsXLarge, cols2XLarge } = mediaSliderFields
  const { pxMobile, pxMedium, pxLarge, pxXLarge, px2XLarge } = mediaSliderFields

  const countToTailwind = (count: number) => {
    if (count === 1) return 'full'
    return `1/${count}`
  }

  const widthSettings = `
    w-${countToTailwind(colsMobile)}
    md:w-${countToTailwind(colsMedium)}
    lg:w-${countToTailwind(colsLarge)}
    xl:w-${countToTailwind(colsXLarge)}
    2xl:w-${countToTailwind(cols2XLarge)}`

  return (
    <div className="flex justify-center">
      <div className="flex flex-grow flex-wrap p-4 max-w-6xl border">
        {mediaSliderFields.slides?.map((slide, index) => (
          <div key={index} className={`flex flex-col ${widthSettings} px-3`}>
            <div className="flex justify-center items-start">
              <Image
                className="object-cover"
                src={slide.image ? (slide.image as Media).url : ''}
                alt={slide.image ? (slide.image as Media).alt : ''}
                width={1000}
                height={1000}
              />
            </div>
            <div className="text-center">{slide.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MediaSlider
