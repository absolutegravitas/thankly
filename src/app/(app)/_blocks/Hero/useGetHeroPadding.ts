import { useEffect, useMemo, useState } from 'react'

import type { PaddingProps, Settings } from '@app/_components/BlockWrapper'
import type { BlocksProp } from '@app/_components/RenderBlocks'
import { getFieldsKeyFromBlock } from '@app/_components/RenderBlocks/utilities'
import type { Page } from '@payload-types'
import { useThemePreference } from '@app/_providers/Theme'
import type { Theme } from '@app/_providers/Theme/types'

export const useGetHeroPadding = (theme: any, block?: BlocksProp): PaddingProps => {
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()
  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const padding = useMemo((): PaddingProps => {
    let topPadding: PaddingProps['top'] = 'hero'
    let bottomPadding: PaddingProps['bottom'] = 'large'

    let blockKey
    let blockSettings: Settings

    if (!block) {
      // console.log('no block')
      return { top: topPadding, bottom: bottomPadding }
    } else {
      blockKey = getFieldsKeyFromBlock(block)
      blockSettings = block[blockKey]?.settings
      // console.log('blockSettings', blockSettings)
    }

    if (theme) {
      // Compare with the block value otherwise compare with theme context
      if (blockSettings) {
        topPadding = theme === blockSettings?.theme ? 'small' : 'large'
        bottomPadding = theme === blockSettings?.theme ? 'small' : 'large'
      } else {
        topPadding = theme === themeState ? 'small' : 'large'
        bottomPadding = theme === themeState ? 'small' : 'large'
      }
    } else {
      if (blockSettings) {
        bottomPadding = themeState === blockSettings?.theme ? 'small' : 'large'
      }
    }
    // console.log(topPadding, bottomPadding)
    return {
      top: topPadding,
      bottom: bottomPadding,
    }
  }, [themeState, theme, block])

  return padding
}
