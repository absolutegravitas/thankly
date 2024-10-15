import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@app/_components/ui/carousel'

export type Props = ExtractBlockProps<'mediaSlider'>

export const MediaSlider = ({ mediaSliderFields }: Props) => {
  const { visibleMobile, visibleMedium, visibleLarge, visibleXLarge, visible2XLarge } =
    mediaSliderFields
  const countToTailwind = (count: number) => {
    if (count === 1) return 'full'
    return `1/${count}`
  }
  const basisClass = `
  basis-${countToTailwind(visibleMobile)}
  md:basis-${countToTailwind(visibleMedium)}
  lg:basis-${countToTailwind(visibleLarge)}
  xl:basis-${countToTailwind(visibleXLarge)}
  2xl:basis-${countToTailwind(visible2XLarge)}`
  const wClass = basisClass.replaceAll('basis', 'w')

  console.log(basisClass)

  return (
    <div className="w-full justify-center">
      <Carousel className="w-full">
        <CarouselContent>
          {mediaSliderFields.slides.map((slide, index) => (
            <CarouselItem key={index} className={basisClass}>
              <div className={`p-1 items-center ${wClass}`}>
                <div className="h-full items-center">
                  <Image
                    src={slide.image ? (slide.image as Media).url : ''}
                    alt={slide.image ? (slide.image as Media).alt : ''}
                    width={48}
                    height={48}
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="text-center text-xs md:text-sm whitespace-normal break-words">
                  {slide.text}
                </p>
              </div>
              {/* </div> */}
            </CarouselItem>
          ))}
        </CarouselContent>
        {mediaSliderFields.showArrows && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  )
}

export default MediaSlider
