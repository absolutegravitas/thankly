import { Cart, Product } from "@/payload-types"

export type CartItem = NonNullable<Cart['items']>[number]
export type Receiver = NonNullable<Cart['receivers']>[number]
export type GiftCard = NonNullable<CartItem['giftCard']>
export type ShippingMethod = ('standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel')
export type CartTotals = NonNullable<Cart['totals']>
export type ProductPlus = Product & { inCart: boolean; starRating: number}
