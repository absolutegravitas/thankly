import React from 'react'
import { CloseIcon } from '@web/_icons/CloseIcon'
import { PlusIcon } from '@web/_icons/PlusIcon'

import classes from './index.module.scss'

interface Icons {
  add: React.ElementType
  close: React.ElementType
}

const icons: Icons = {
  add: PlusIcon,
  close: CloseIcon,
}

export const CircleIconButton: React.FC<{
  className?: string
  onClick: () => void
  label: string
  icon?: keyof Icons
}> = ({ className, onClick, label, icon = 'add' }) => {
  const Icon = icons[icon]

  return (
    <button
      className={[classes.button, className].filter(Boolean).join(' ')}
      type="button"
      onClick={onClick}
    >
      <div className={classes.iconWrapper}>{Icon && <Icon size="full" />}</div>
      <span className={classes.label}>{label}</span>
    </button>
  )
}
