import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media } from '@/payload-types'

export type Props = ExtractBlockProps<'mediaGrid'>

export const MediaGrid = ({ mediaGridFields }: Props) => {
  const { colsMobile, colsMedium, colsLarge, colsXLarge, cols2XLarge } = mediaGridFields

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
      <div className="flex flex-grow flex-wrap p-4 pt-0 max-w-6xl">
        {mediaGridFields.items?.map((item, index) => (
          <div key={index} className={`flex flex-col ${widthSettings} px-3`}>
            <div className="flex justify-center items-start">
              <Image
                className="object-cover"
                src={item.image ? (item.image as Media).url : ''}
                alt={item.image ? (item.image as Media).alt : ''}
                width={1000}
                height={1000}
              />
            </div>
            <div className="text-center text-xs md:text-sm">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MediaGrid
