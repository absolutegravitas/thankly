import React from 'react'

import { Page } from '@payload-types'
import { Step } from './Step'

import classes from './index.module.scss'

// type Props = Extract<Page['layout'][0], { blockType: 'steps' }>

import { ExtractBlockProps } from '@web/_utilities/extractBlockProps'
export type Props = ExtractBlockProps<'steps'>

export const Steps: React.FC<Props> = ({ stepsFields }) => {
  const { steps } = stepsFields

  return (
    <ul className={classes.steps}>
      {steps.map((step: any, i: any) => {
        return <Step key={i} i={i} {...step} />
      })}
    </ul>
  )
}

export default Steps
