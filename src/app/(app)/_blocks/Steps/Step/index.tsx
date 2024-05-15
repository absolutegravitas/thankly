import React, { useEffect, useRef, useState } from 'react'
import useIntersection from '@web/_utilities/useIntersection'

import { Gutter } from '@web/_components/Gutter'
import { Label } from '@web/_components/Label'
import { RenderBlocks } from '@web/_components/RenderBlocks'
import { Page } from '@payload-types'

import classes from './index.module.scss'
import { ExtractBlockProps } from '@web/_utilities/extractBlockProps'

// type Props = Extract<Page['layout'][0], { blockType: 'steps' }>['stepsFields']['steps'][0] & {
//   i: number
// }

export type Props = ExtractBlockProps<'steps'>['stepsFields']['steps'][0] & { i: number }

export const Step: React.FC<Props> = ({ layout, i }) => {
  const ref = useRef(null)
  const { isIntersecting } = useIntersection({ ref, rootMargin: '0% 0% -25% 0%' })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isIntersecting && !hasAnimated) setHasAnimated(true)
  }, [isIntersecting, hasAnimated])

  if (layout) {
    return (
      <li
        className={[classes.step, hasAnimated && classes.animate].filter(Boolean).join(' ')}
        key={i}
        ref={ref}
      >
        <Gutter>
          <Label className={classes.label}>Step 0{i + 1}</Label>
        </Gutter>
        <RenderBlocks disableOuterSpacing blocks={layout} />
      </li>
    )
  }

  return null
}
