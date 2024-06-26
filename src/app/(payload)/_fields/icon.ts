import type { Field, FieldHook } from 'payload'
import deepMerge from 'deepmerge'
import * as LucideIcons from 'lucide-react'

const iconOptions = Object.entries(LucideIcons)
  .filter(([key, value]) => typeof value === 'function')
  .map(([key]) => ({
    value: key,
    label: key.replace(/([a-z])([A-Z])/g, '$1 $2'),
  }))

type IconField = (overrides?: Partial<Field>) => Field

const iconField: IconField = (overrides = {}) => {
  return deepMerge<Field, Partial<Field>>(
    {
      type: 'select',
      name: 'icon',
      label: 'Icon',
      options: iconOptions,
    },
    overrides,
  )
}

export default iconField
