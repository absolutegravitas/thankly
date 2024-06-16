import React from 'react'

import { IconProps } from '../types'

import classes from '../index.module.scss'

export const ShoppingBagIcon: React.FC<IconProps> = (props) => {
  const { color, rotation, size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 15 16"
      xmlns="http://www.w3.org/2000/svg"
      className={[
        className,
        classes.icon,
        color && classes[color],
        size && classes[size],
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <polygon
        fill="none"
        // stroke="#000000"
        // stroke-width="2"
        stroke-miterlimit="10"
        className={classes.stroke}
        points="44,18 54,18 54,63 10,63 10,18 20,18 "
      />
      <path
        fill="none"
        stroke="#000000"
        stroke-width="1"
        stroke-miterlimit="10"
        // className={classes.stroke}
        d="M22,24V11c0-5.523,4.477-10,10-10s10,4.477,10,10v13"
      />
    </svg>
  )
}
