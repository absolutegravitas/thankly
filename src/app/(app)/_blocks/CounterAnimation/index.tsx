'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import { Media } from '@/payload-types'

export type Props = ExtractBlockProps<'counterAnimation'>

export const CounterAnimation = (props: Props) => {
  const [isComplete, setIsComplete] = useState(false)
  const spring = useSpring(1000, { duration: 3000, bounce: 0 })
  const displayCount = useTransform(spring, Math.round)
  const counterRef = useRef(null)
  const isInView = useInView(counterRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView) {
      spring.set(13888)
      const timeout = setTimeout(() => setIsComplete(true), 3000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, spring])

  return (
    <div className="flex flex-col md:flex-row bg-gray-100">
      <div className="hidden md:block md:w-1/2 relative">
        {props.desktopImage && (
          <Image
            src={(props.desktopImage as Media).url ?? ''}
            alt={(props.desktopImage as Media).alt ?? ''}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="w-full md:w-1/2 bg-thankly-green flex items-center justify-center p-8 md:py-56">
        <div className="text-center" ref={counterRef}>
          <motion.h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
            <motion.span>{displayCount}</motion.span>+
          </motion.h1>
          <p className="text-xl text-white">smiles created and counting...</p>
        </div>
      </div>
    </div>
  )
}

export default CounterAnimation
