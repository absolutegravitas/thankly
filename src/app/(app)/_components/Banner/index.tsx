import * as React from 'react'

import { CheckIcon } from '@app/_icons/CheckIcon'
import { Reusable } from '@payload-types'
// import { RichText } from '../RichText'
import { RichText } from '@app/_blocks/RichText'
import classes from './index.module.scss'

import { ExtractBlockProps } from '@/utilities/extractBlockProps'

export type Props = {
  // type?: Extract<Reusable['layout'][0], { blockType: 'banner' }>['bannerFields']['type']
  type?: ExtractBlockProps<'banner'>['bannerFields']['type']

  // content?: Extract<Reusable['layout'][0], { blockType: 'banner' }>['bannerFields']['content']
  content?: ExtractBlockProps<'banner'>['bannerFields']['content']

  children?: React.ReactNode
  checkmark?: boolean
  icon?: 'checkmark'
  margin?: boolean
  marginAdjustment?: any
}

const Icons = {
  checkmark: CheckIcon,
}

export const Banner: React.FC<Props> = ({
  content,
  children,
  icon,
  type = 'default',
  checkmark,
  margin = true,
  marginAdjustment = {},
}) => {
  let Icon = icon && Icons[icon]
  if (!Icon && checkmark) Icon = Icons.checkmark

  return (
    <div
      className={[classes.banner, 'banner', type && classes[type], !margin && classes.noMargin]
        .filter(Boolean)
        .join(' ')}
      style={marginAdjustment}
    >
      {Icon && <Icon className={classes.icon} />}

      {content && <RichText content={content} />}
      {children && <div className={classes.children}>{children}</div>}
    </div>
  )
}
