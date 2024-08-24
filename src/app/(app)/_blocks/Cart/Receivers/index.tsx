'use client'

import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useCart } from '@/app/(app)/_providers/Cart'
import { MapPinIcon, MessageSquareTextIcon, SendIcon, UserIcon, UsersIcon } from 'lucide-react'

import { addressAutocomplete } from './addressAutocomplete'
import { debounce, update } from 'lodash'
import { Cart, Product } from '@/payload-types'
import { Field, Label, Switch } from '@headlessui/react'
import { Radio, RadioGroup } from '@headlessui/react'
import cn from '@/utilities/cn'

import { ReceiversMobile } from './ReceiversMobile'
import { ReceiversDesktop } from './ReceiversDesktop'
import { AddReceiver } from './ReceiverActions'
import { CartItem } from '../cart-types'

export const shippingOptions = [
  { name: 'Standard Mail', value: 'standardMail', productType: 'card', cost: true },
  { name: 'Express Mail', value: 'expressMail', productType: 'card', cost: true },
  { name: 'Standard Parcel', value: 'standardParcel', productType: 'gift', cost: true },
  { name: 'Express Parcel', value: 'expressParcel', productType: 'gift', cost: true },
]

// export interface Receiver {
//   id: string
//   message: string
//   name: string
//   delivery: {
//     address?: {
//       formattedAddress?: string | null
//       addressLine1?: string | null
//       addressLine2?: string | null
//       json?:
//         | {
//             [k: string]: unknown
//           }
//         | unknown[]
//         | string
//         | number
//         | boolean
//         | null
//     }
//     shippingMethod: ShippingMethod
//   }
//   totals: {
//     cost: number
//     shipping: number
//     subTotal: number
//   }
//   errors: JSON
// }

// export interface CartItem {
//   id: string
//   product: Product
//   receivers: Receiver[]
// }

export interface ValidationErrors {
  name?: string
  message?: string
  formattedAddress?: string
  addressLine1?: string
  shippingMethod?: string
}

export type ShippingMethod =
  | 'standardMail'
  | 'expressMail'
  | 'standardParcel'
  | 'expressParcel'
  | null

export const Receivers: React.FC<{ item: CartItem }> = ({ item }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Adjust the breakpoint as needed
    }

    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <>{isMobile ? <ReceiversMobile {...item} /> : <ReceiversDesktop {...item} />}</>
}
