import * as React from 'react'
import { IconProps } from '../types'
import classes from '../index.module.scss'

export const CartIcon: React.FC<IconProps> = (props) => {
  const { color, size, className, bold, rotation } = props

  return (
    <svg
      className="font-bold mb-2 h-auto w-6 "
      strokeWidth={2.5}
      version="1.0"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="800px"
      height="800px"
      viewBox="0 0 64 64"
      enableBackground="new 0 0 64 64"
      xmlSpace="preserve"
    >
      <polygon
        fill="none"
        stroke="#000000"
        strokeWidth={3}
        strokeMiterlimit={10}
        points="44,18 54,18 54,63 10,63 10,18 20,18 "
      />
      <path
        fill="none"
        stroke="#000000"
        strokeWidth={3}
        strokeMiterlimit={10}
        d="M22,24V11c0-5.523,4.477-10,10-10s10,4.477,10,10v13"
      />
    </svg>
  )
}
