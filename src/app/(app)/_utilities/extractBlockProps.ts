import { Page } from '@payload-types'
import { blockComponents } from '@web/_components/RenderBlocks'

type BlockComponents = typeof blockComponents

function extractBlockProps<T extends keyof BlockComponents>(
  page: Page,
  blockType: T,
): ExtractBlockProps<T> | undefined {
  const layout = page.layout?.root
  if (!layout) return undefined

  const block = layout.children.find((child) => child.blockType === blockType)
  if (!block) return undefined

  return block as ExtractBlockProps<T>
}

export type ExtractBlockProps<T extends keyof BlockComponents> = ReturnType<BlockComponents[T]>
