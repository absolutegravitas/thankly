import { useEffect, useMemo, useState } from 'react'

import type { PaddingProps, Settings } from '@app/_components/BlockWrapper'
import type { BlocksProp } from '@app/_components/RenderBlocks'
import { getFieldsKeyFromBlock } from '@app/_components/RenderBlocks/utilities'
import type { Page } from '@payload-types'
import { useThemePreference } from '@app/_providers/Theme'
import type { Theme } from '@app/_providers/Theme/types'

export const useGetHeroPadding = (theme: Page['theme'], block?: BlocksProp): PaddingProps => {
  const { theme: themeFromContext } = useThemePreference()
  const [themeState, setThemeState] = useState<Theme>()

  useEffect(() => {
    if (themeFromContext) setThemeState(themeFromContext)
  }, [themeFromContext])

  const padding = useMemo((): PaddingProps => {
    let topPadding: PaddingProps['top'] = 'hero'
    let bottomPadding: PaddingProps['bottom'] = 'large'

    if (!block) return { top: topPadding, bottom: bottomPadding }

    let blockKey = getFieldsKeyFromBlock(block)
    let blockSettings: Settings = block[blockKey]?.settings

    if (theme) {
      // Compare with the block value otherwise compare with theme context
      if (blockSettings) {
        bottomPadding = theme === blockSettings?.theme ? 'small' : 'large'
      } else {
        bottomPadding = theme === themeState ? 'small' : 'large'
      }
    } else {
      if (blockSettings) {
        bottomPadding = themeState === blockSettings?.theme ? 'small' : 'large'
      }
    }

    return {
      top: topPadding,
      bottom: bottomPadding,
    }
  }, [themeState, theme, block])

  return padding
}
