import type { CartItems, Product, User } from '@payload-types'
type ExtractCartItem<T extends CartItems> = T extends (infer U)[] ? U : never
// export type CartItem = CartItems[0]
export type CartItem = ExtractCartItem<CartItems>

type CartType = User['cart']

type CartAction =
  | { type: 'SET_CART'; payload: CartType }
  | { type: 'MERGE_CART'; payload: CartType }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'DELETE_ITEM'; payload: Product }
  | { type: 'CLEAR_CART' }

export const cartReducer = (cart: CartType, action: CartAction): CartType => {
  switch (action.type) {
    case 'SET_CART': {
      return action.payload
    }

    case 'MERGE_CART': {
      const { payload: incomingCart } = action

      const syncedItems: CartItem[] = [
        ...(cart?.items || []),
        ...(incomingCart?.items || []),
      ].reduce((acc: CartItem[], item) => {
        // remove duplicates
        // const productId = typeof item.product === 'string' ? item.product : item?.product?.id
        const productId = item.product

        const indexInAcc = acc.findIndex(
          ({ product }) =>
            // typeof product === 'string' ? product === productId : product?.id === productId,
            product === productId,
        ) // eslint-disable-line function-paren-newline

        if (indexInAcc > -1) {
          acc[indexInAcc] = {
            ...acc[indexInAcc],
            // customize the merge logic here, e.g.:
            // quantity: acc[indexInAcc].quantity + item.quantity
          }
        } else {
          acc.push(item)
        }
        return acc
      }, [])

      return {
        ...cart,
        items: syncedItems,
      }
    }

    case 'ADD_ITEM': {
      // if the item is already in the cart, increase the quantity
      const { payload: incomingItem } = action

      // Check if incomingItem.product is a Product object
      const productId =
        typeof incomingItem.product === 'number' ? incomingItem.product : incomingItem?.product?.id

      // Find the index of the item in the cart
      const indexInCart = cart?.items?.findIndex(({ product }: any) => product === productId)

      let withAddedItem = [...(cart?.items || [])]

      if (indexInCart === -1) {
        // If the item is not in the cart, add it
        withAddedItem.push(incomingItem)
      }

      if (typeof indexInCart === 'number' && indexInCart > -1) {
        // If the item is already in the cart, update its properties
        withAddedItem[indexInCart] = {
          ...withAddedItem[indexInCart],
          // Update other properties as needed
        }
      }

      return { ...cart, items: withAddedItem }
    }

    case 'DELETE_ITEM': {
      const { payload: incomingProduct } = action
      const withDeletedItem = { ...cart }

      // const indexInCart = cart?.items?.findIndex(({ product }: any) =>
      //   typeof product === 'string'
      //     ? product === incomingProduct.id
      //     : product?.id === incomingProduct.id,
      // ) // eslint-disable-line function-paren-newline

      const indexInCart = cart?.items?.findIndex(
        ({ product }: any) =>
          // typeof product === 'string' && typeof incomingProduct.id === 'number'
          //   ? product === incomingProduct.id.toString()
          //   : product?.id === incomingProduct.id,
          product === incomingProduct.id.toString(),
        // : product?.id === incomingProduct.id,
      )

      if (typeof indexInCart === 'number' && withDeletedItem.items && indexInCart > -1)
        withDeletedItem.items.splice(indexInCart, 1)

      return withDeletedItem
    }

    case 'CLEAR_CART': {
      return { ...cart, items: [] }
    }

    default: {
      return cart
    }
  }
}
