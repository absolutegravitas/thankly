/**
 * @file utilities/extractBlockProps.ts
 * @description This file contains a utility function that extracts block properties from a given page layout based on the provided block type. It also defines a type for extracting block props from a given block component.
 * @module utilities
 */

/*
Code Clarification:
- The code defines a utility function 'extractBlockProps' that takes a 'Page' object and a 'blockType' as input.
- It checks if the 'page.layout.root' exists and returns 'undefined' if it doesn't.
- It then searches for a child block in the layout that matches the provided 'blockType'.
- If a matching block is found, it casts the block to a specific type 'ExtractBlockProps<T>' and returns it.
- If no matching block is found, it returns 'undefined'.
- The 'ExtractBlockProps' type is a utility type that extracts the return type of the corresponding block component function from the 'BlockComponents' object, based on the provided type 'T'.
- This allows for type-safe extraction of block properties based on the block type, enabling better type safety and developer experience when working with block components.
*/

import { Page } from '@payload-types'
import { blockComponents } from '@app/_components/RenderBlocks'

type BlockComponents = typeof blockComponents

function extractBlockProps<T extends keyof BlockComponents>( // This line defines a type alias 'BlockComponents' for the 'blockComponents' object imported from '@app/_components/RenderBlocks'. It ensures type safety when working with the block components.
  page: Page,
  blockType: T,
): ExtractBlockProps<T> | undefined { // This is a generic function that takes a 'page' of type 'Page' and a 'blockType' of type 'T' (which extends the keys of 'BlockComponents'). It returns an object of type 'ExtractBlockProps<T>' or 'undefined' if no matching block is found.
  const layout = page.layout?.root
  if (!layout) return undefined // This line checks if the 'page.layout.root' exists. If not, it returns 'undefined'.

  const block = layout.children.find((child) => child.blockType === blockType)
  if (!block) return undefined // This line searches for a child block in the layout that matches the provided 'blockType'. If no matching block is found, it returns 'undefined'.

  return block as ExtractBlockProps<T> // If a matching block is found, it casts the block to the type 'ExtractBlockProps<T>' and returns it.
}

export type ExtractBlockProps<T extends keyof BlockComponents> = ReturnType<BlockComponents[T]> // This is a utility type that extracts the return type of the corresponding block component function from 'BlockComponents' for the given type 'T'. It allows for type-safe extraction of block properties based on the block type.
