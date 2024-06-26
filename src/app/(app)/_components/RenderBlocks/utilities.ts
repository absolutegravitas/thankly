import type { BlocksProp } from '@app/_components/RenderBlocks'

/**
 * Get the key of the fields from the block
 */
export function getFieldsKeyFromBlock(block: BlocksProp): string {
  if (!block) return ''

  const keys = Object.keys(block)

  const key = keys.find((value) => {
    return value.endsWith('Fields')
  })

  return key ?? ''
}
