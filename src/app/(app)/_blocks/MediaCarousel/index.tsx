import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media } from '@/payload-types'
import { Carousel, CarouselContent, CarouselItem } from '../../_components/ui/carousel'

export type Props = ExtractBlockProps<'mediaGrid'>

export const MediaCarousel = ({ mediaCarouselFields }: Props) => {
  const { columnsMobile, columnsDesktop } = mediaCarouselFields
  return (
    <div className="flex justify-center">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full max-w-screen-xl"
      >
        <CarouselContent className="-ml-4">
          {mediaCarouselFields.items?.map((item, index) => (
            <CarouselItem
              key={index}
              className={`pl-4 md:pl-6 flex-grow-0 flex-shrink-0 basis-1/${columnsMobile} md:basis-1/${columnsDesktop}`}
            >
              <div className="aspect-square relative">
                <Image
                  className="object-contain"
                  src={item.image?.url || ''}
                  alt={item.image?.alt || ''}
                  fill
                  sizes="(max-width: 768px) 25vw, 8.33vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default MediaCarousel
