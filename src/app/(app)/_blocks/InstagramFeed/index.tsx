import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media } from '@/payload-types'

export type Props = ExtractBlockProps<'mediaGrid'>

export const InstagramFeed = ({ mediaGridFields }: Props) => {
  const { colsMobile, colsMedium, colsLarge, colsXLarge, cols2XLarge } = mediaGridFields

  const columnSettings = `
    grid-cols-${colsMobile}
    md:grid-cols-${colsMedium}
    lg:grid-cols-${colsLarge}
    xl:grid-cols-${colsXLarge}
    2xl:grid-cols-${cols2XLarge}`

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-screen-xl p-4 pt-0">
        <div className={`grid ${columnSettings} gap-4`}>
          {mediaGridFields.items?.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex justify-center items-start">
                <Image
                  className="object-cover w-full h-auto"
                  src={item.image ? (item.image as Media).url : ''}
                  alt={item.image ? (item.image as Media).alt : ''}
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="text-center text-xs md:text-sm mt-2">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InstagramFeed
