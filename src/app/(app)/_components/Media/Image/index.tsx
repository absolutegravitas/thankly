'use client'

import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image'

import { breakpoints } from '@app/_css/cssVariables'
import { Props } from '../types'

import classes from './index.module.scss'

export const ImageComponent: React.FC<Props> = (props) => {
  const {
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    sizes: sizesFromProps,
    resource,
    priority,
    fill,
    src: srcFromProps,
    alt: altFromProps,
    width: widthFromProps,
    height: heightFromProps,
  } = props

  const [isLoading, setIsLoading] = useState(true)

  let width: number | undefined | null = widthFromProps
  let height: number | undefined | null = heightFromProps
  let alt = altFromProps
  let src: StaticImageData | string | undefined | null = srcFromProps

  const hasDarkModeFallback =
    resource?.darkModeFallback &&
    typeof resource.darkModeFallback === 'object' &&
    resource.darkModeFallback !== null &&
    typeof resource.darkModeFallback.filename === 'string'

  if (!src && resource && typeof resource !== 'string') {
    width = resource.width
    height = resource.height
    alt = resource.alt
    src = `${process.env.NEXT_PUBLIC_SERVER_URL}${resource.url}`
  }

  // NOTE: this is used by the browser to determine which image to download at different screen sizes
  const sizes =
    sizesFromProps ||
    Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value}px`)
      .join(', ')

  const baseClasses = [
    isLoading && classes.placeholder,
    classes.image,
    imgClassName,
    hasDarkModeFallback && classes.hasDarkModeFallback,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <React.Fragment>
      <Image
        className={`${baseClasses} ${classes.themeLight}`}
        src={src || ''}
        alt={alt || ''}
        onClick={onClick}
        onLoad={() => {
          setIsLoading(false)
          if (typeof onLoadFromProps === 'function') {
            onLoadFromProps()
          }
        }}
        fill={fill}
        width={!fill ? width ?? undefined : undefined}
        height={!fill ? height ?? undefined : undefined}
        sizes={sizes}
        priority={priority}
      />
      {hasDarkModeFallback &&
        typeof resource.darkModeFallback === 'object' &&
        resource.darkModeFallback !== null && (
          <Image
            className={`${baseClasses} ${classes.themeDark}`}
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/${resource.darkModeFallback.filename}`}
            alt={alt || ''}
            onClick={onClick}
            onLoad={() => {
              setIsLoading(false)
              if (typeof onLoadFromProps === 'function') {
                onLoadFromProps()
              }
            }}
            fill={fill}
            width={!fill ? width ?? undefined : undefined}
            height={!fill ? height ?? undefined : undefined}
            sizes={sizes}
            priority={priority}
          />
        )}
    </React.Fragment>
  )
}
