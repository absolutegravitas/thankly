'use client'

import { useState, useEffect, useRef } from 'react'
import { Star } from 'lucide-react'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import DynamicHtml from '../../_components/DynamicHtml'
import StarRating from '../../_components/StarRating'

// const reviews = [
//   { id: 1, body: 'Excellent service! Highly recommended.', author: 'Alice Johnson', rating: 5 },
//   { id: 2, body: 'Great product quality. Will buy again.', author: 'Bob Smith', rating: 4 },
//   { id: 3, body: 'Fast shipping and good customer support.', author: 'Charlie Brown', rating: 5 },
//   { id: 4, body: 'Decent experience overall.', author: 'Diana Ross', rating: 3 },
//   { id: 5, body: 'Love the variety of products offered.', author: 'Ethan Hunt', rating: 5 },
//   { id: 6, body: 'Good value for money.', author: 'Fiona Apple', rating: 4 },
//   {
//     id: 7,
//     body: 'Impressive selection and easy to navigate.',
//     author: 'George Clooney',
//     rating: 5,
//   },
//   {
//     id: 8,
//     body: 'Had a small issue but it was quickly resolved.',
//     author: 'Hannah Montana',
//     rating: 4,
//   },
//   {
//     id: 9,
//     body: 'Consistently good experiences with this company.',
//     author: 'Ian McKellen',
//     rating: 5,
//   },
// ]

export type ReviewShowcaseProps = ExtractBlockProps<'reviewShowcase'>

export function ReviewShowcase({ htmlHeading, reviews }: ReviewShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        return nextIndex >= reviews.length ? 0 : nextIndex
      })
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = isMobile
        ? containerRef.current.offsetWidth
        : containerRef.current.offsetWidth / 3
      containerRef.current.scrollTo({
        left: currentIndex * scrollAmount,
        behavior: 'smooth',
      })
    }
  }, [currentIndex, isMobile])

  return (
    <div className="flex justify-center">
      <section className="w-full max-w-screen-xl pt-8 pb-12 px-4 md:px-6 lg:px-8 bg-[#e8f0eb]">
        <div className="text-xl font-bold mb-8 text-center md:text-left px-3">
          <DynamicHtml htmlContent={htmlHeading || ''} />
        </div>
        <div className="relative overflow-hidden" ref={containerRef}>
          <div className="flex">
            {reviews.map((review) => (
              <div key={review.id} className="w-full md:w-1/3 flex-shrink-0 px-3">
                <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
                  <div className="flex items-center py-2 min-h-5">
                    <StarRating rating={review.starRating} />
                  </div>
                  <p className="text-gray-600 mb-4 font-semibold">{review.title}</p>
                  <p className="text-gray-600 mb-4 flex-grow">{review.body}</p>
                  <p className="text-sm text-gray-400 mt-auto">
                    {review.reviewer ? `- ${review.reviewer.name}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ReviewShowcase
