'use client'
import React, { useEffect, useMemo, useState } from 'react'

import { ChangeHeaderTheme } from '@app/_components/ChangeHeaderTheme'
import { Page } from '@payload-types'
import { useThemePreference } from '@app/_providers/Theme'

import classes from './index.module.scss'

// export type Settings = Extract<Page['layout'],{ blockType: 'cardGrid' }>['cardGridFields']['settings']

import { ExtractBlockProps } from '@app/_utilities/extractBlockProps'
export type Settings = ExtractBlockProps<'cardGrid'>['cardGridFields']['settings']

export type PaddingProps = {
  top?: 'large' | 'small' | 'hero'
  bottom?: 'large' | 'small'
}

type Props = {
  settings?: any //Settings
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

export const BlockWrapper: React.FC<Props> = ({
  settings,
  className,
  children,
  padding,
  setPadding = true,
  ...rest
}) => {
  const [themeState, setThemeState] = useState<Page['theme']>(settings?.theme)
  const { theme: themeFromContext } = useThemePreference()
  const theme = settings?.theme

  useEffect(() => {
    if (settings?.theme) setThemeState(settings.theme)
    else {
      if (themeFromContext) setThemeState(themeFromContext)
    }
  }, [settings, themeFromContext])

  return (
    <ChangeHeaderTheme theme={themeState ?? 'light'}>
      <div
        className={[
          classes.blockWrapper,
          theme && classes[`theme-${theme}`],
          padding?.top && classes[`padding-top-${padding?.top}`],
          padding?.bottom && classes[`padding-bottom-${padding?.bottom}`],
          setPadding && classes.setPadding,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        {children}
      </div>
    </ChangeHeaderTheme>
  )
}