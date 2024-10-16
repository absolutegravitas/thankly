import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media } from '@/payload-types'
import { Carousel, CarouselContent, CarouselItem } from '../../_components/ui/carousel'

export type Props = ExtractBlockProps<'mediaGrid'>

export const MediaCarousel = ({ mediaCarouselFields }: Props) => {
  return (
    <div className="flex justify-center">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="flex justify-center">
          {mediaCarouselFields.items?.map((item, index) => (
            <CarouselItem key={index} className="flex-none">
              <Image
                className={`w-auto object-cover ${mediaCarouselFields.imageTailwind ?? ''}`}
                src={item.image ? (item.image as Media).url : ''}
                alt={item.image ? (item.image as Media).alt : ''}
                height={200}
                width={200}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default MediaCarousel
