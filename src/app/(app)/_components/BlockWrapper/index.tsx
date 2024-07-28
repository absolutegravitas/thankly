'use client'

import React, { useEffect, useState } from 'react'
import { ChangeHeaderTheme } from '@app/_components/ChangeHeaderTheme'
import { Page } from '@payload-types'
import { useThemePreference } from '@app/_providers/Theme'
import { ExtractBlockProps } from '@/utilities/extractBlockProps'
import classes from './index.module.scss'

export type Settings = ExtractBlockProps<'cardGrid'>['cardGridFields']['settings']

export type PaddingProps = {
  top?: 'large' | 'medium' | 'small' | 'hero'
  bottom?: 'large' | 'medium' | 'small'
}

type Props = {
  settings?: any // Settings
  className?: string
  children: React.ReactNode
  padding?: PaddingProps
  /**
   * Controls whether or not to set the padding or just provide the css variables
   *
   * Useful for complex components that need to set padding on a child element
   */
  setPadding?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const defaultPadding: PaddingProps = {
  top: 'medium',
  bottom: 'medium',
}

export const BlockWrapper: React.FC<Props> = ({
  settings,
  className,
  children,
  padding,
  setPadding = true,
  ...rest
}) => {
  // const [themeState, setThemeState] = useState<Page['theme']>(settings?.theme)
  // const { theme: themeFromContext } = useThemePreference()
  // const theme = settings?.theme

  // useEffect(() => {
  //   if (settings?.theme) setThemeState(settings.theme)
  //   else {
  //     if (themeFromContext) setThemeState(themeFromContext)
  //   }
  // }, [settings, themeFromContext])

  const appliedPadding = {
    top: padding?.top || defaultPadding.top,
    bottom: padding?.bottom || defaultPadding.bottom,
  }

  const paddingClasses = [`py-content-${appliedPadding.top}`, `pb-content-${appliedPadding.bottom}`]

  return (
    <ChangeHeaderTheme theme={'light'}>
      <div
        className={[
          classes.blockWrapper,
          // theme && classes[`theme-${theme}`],
          ...paddingClasses,
          setPadding && classes.setPadding,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
        // {...(theme ? { 'data-theme': theme } : {})}
      >
        {children}
      </div>
    </ChangeHeaderTheme>
  )
}
