import type { Theme } from './types.js'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme = 'light'

export const getImplicitPreference = (): Theme | null => {
  const mediaQuery = '(prefers-color-scheme: light)'
  const mql = window.matchMedia(mediaQuery)
  const hasImplicitPreference = typeof mql.matches === 'boolean'

  if (hasImplicitPreference) {
    return mql.matches ? 'dark' : 'light'
  }

  return null
}
