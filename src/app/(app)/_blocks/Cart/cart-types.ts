import { Cart } from "@/payload-types"

export type CartItem = NonNullable<Cart['items']>[number]
export type Receiver = NonNullable<Cart['receivers']>[number]
export type GiftCard = NonNullable<CartItem['giftCard']>