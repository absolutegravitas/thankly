import { ShippingMethod } from '../../_blocks/Cart/cart-types'

export interface PostageOption {
  id: ShippingMethod
  name: string
  description: string
  price: number
}
//temporary for form building (TODO: work out actual calcs and payloadcms storage)
export const postageOptions: PostageOption[] = [
  // {
  //   id: 'standardMail',
  //   name: 'Standard Shipping',
  //   description: 'Estimated delivery in 5-7 business days',
  //   price: 4.99,
  // },
  // {
  //   id: 'expressMail',
  //   name: 'Express Shipping',
  //   description: 'Estimated delivery in 2-3 business days',
  //   price: 9.99,
  // },
  {
    id: 'standardParcel',
    name: 'Standard Shipping',
    description: 'Estimated delivery in 5-7 business days',
    price: 9.9,
  },
  {
    id: 'expressParcel',
    name: 'Express Shipping',
    description: 'Estimated delivery in 2-3 business days',
    price: 14.9,
  },
]

export function getPostageName(postageId: string | null | undefined): string | undefined {
  if (!postageId) return undefined
  const option = postageOptions.find((option) => option.id === postageId)
  return option ? option.name : undefined
}
