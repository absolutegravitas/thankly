import { ReceiverCart } from '@/utilities/receiverCarts'
import { ShippingMethod } from '../../_blocks/Cart/cart-types'
import { Product } from '@/payload-types'
import { isMetroPostcode } from './shippingCalcs'

export interface PostageOption {
  id: ShippingMethod
  name: string
  description: string
  price: number
}
//temporary for form building (TODO: work out actual calcs and payloadcms storage)
export const metroParcelPostageOptions: PostageOption[] = [
  {
    id: 'standardParcel',
    name: 'Free Metro Shipping',
    description: 'Estimated delivery in 5-7 business days',
    price: 0,
  },
  {
    id: 'expressParcel',
    name: 'Express Shipping',
    description: 'Estimated delivery in 1-3 business days',
    price: 19.95,
  },
]

export const parcelPostageOptions: PostageOption[] = [
  {
    id: 'standardParcel',
    name: 'Standard Shipping',
    description: 'Estimated delivery in 5-7 business days',
    price: 10.95,
  },
  {
    id: 'expressParcel',
    name: 'Express Shipping',
    description: 'Estimated delivery in 1-3 business days',
    price: 19.95,
  },
]

export const mailPostageOptions: PostageOption[] = [
  {
    id: 'standardMail',
    name: 'Free Standard Mail',
    description: 'Estimated delivery in 5-7 business days',
    price: 0,
  },
  {
    id: 'expressMail',
    name: 'Express Mail',
    description: 'Estimated delivery in 1-3 business days',
    price: 9,
  },
]

export function getPostageName(
  postageId: string | null | undefined,
  postageOptions: PostageOption[],
): string | undefined {
  if (!postageId) return undefined
  const option = postageOptions.find((option) => option.id === postageId)
  return option ? option.name : undefined
}

export function getPostageOptions(receiverCart: ReceiverCart): PostageOption[] {
  //check if any cartItems is a gift
  const hasGifts = receiverCart.items.some(
    (item) => (item.product as Product).productType === 'gift',
  )
  //check if receiver address is metro
  const isMetro = isMetroPostcode(receiverCart.address.postcode)
  // return correct postage options
  if (hasGifts) {
    if (isMetro) return metroParcelPostageOptions
    return parcelPostageOptions
  }
  return mailPostageOptions
}
