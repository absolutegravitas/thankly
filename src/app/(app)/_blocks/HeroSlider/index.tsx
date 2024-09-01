'use client'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@app/_components/ui/button'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import DynamicHtml from '@app/_components/DynamicHtml'
import { useMediaQuery } from 'react-responsive'

export type HeroSliderProps = ExtractBlockProps<'heroSlider'>

interface HeroItem {
  desktopImageUrl: string
  mobileImageUrl: string
  content: string
  buttonText: string
  buttonLink: string
}

interface SliderItem {
  desktopImage: {
    url: string
    alt: string
  }
  mobileImage: {
    url: string
    alt: string
  }
  htmlContent: string
  buttonLink: ButtonLink
}

interface ButtonLink {
  label: string
  type: string
  url: string
}

function useImageCycle(images: HeroItem[], interval: number) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images, interval])

  return [currentIndex, setCurrentIndex] as const
}

export default function HeroSlider({ slider }: HeroSliderProps) {
  console.log('slider', slider)
  const heroItems = slider.map((item: SliderItem) => ({
    desktopImageUrl: item.desktopImage.url,
    mobileImageUrl: item.mobileImage.url,
    content: item.htmlContent,
    buttonText: item.buttonLink.label,
    buttonLink: item.buttonLink.url,
  }))
  const [height, setHeight] = useState('90vh')
  const [currentIndex, setCurrentIndex] = useImageCycle(heroItems, 8000)
  const isMobile = useMediaQuery({ maxWidth: 639 })

  const updateHeight = useCallback(() => {
    if (isMobile) {
      // Set height to approximate height of a cell phone (e.g., 100vh)
      setHeight('100vh')
    } else {
      const vh = window.innerHeight * 0.01 * 0.9
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      setHeight(`${window.innerHeight * 0.9}px`)
    }
  }, [isMobile])

  useEffect(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [updateHeight])

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {heroItems.map((item: HeroItem, index: number) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${isMobile ? item.mobileImageUrl : item.desktopImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
            <div className="absolute bottom-16 left-16 max-w-6xl text-white">
              <div className="text-5xl font-bold mb-6 leading-tight">
                <DynamicHtml htmlContent={item.content} />
              </div>
              <Button asChild size="lg" className="mt-4">
                <a href={item.buttonLink}>{item.buttonText}</a>
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
        {heroItems.map((_: HeroItem, index: number) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
