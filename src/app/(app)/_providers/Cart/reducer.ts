// This file contains utility types, interfaces, and a reducer function for managing a shopping cart in a Next.js 14 application with server components.
// It handles various actions such as adding/removing products, updating receivers (recipients), calculating totals, and managing shipping methods.

// Import type definitions for Cart and Product
import type { Cart, Product } from '@/payload-types'
import { shippingPrices } from '@/utilities/referenceText'
import { isMetroPostcode, isRegionalPostcode, isRemotePostcode } from './shippingCalcs'
import { upsertPayloadCart } from './upsertPayloadCart'
import { deletePayloadCart } from './deletePayloadCart'
import { debounce } from 'lodash' // You'll need to install lodash if not already present
import { uuid } from '@/utilities/uuid'
import { CartItem, Receiver, GiftCard } from '@app/_blocks/Cart/cart-types'

// Create a debounced version of the upsertPayloadCart function
const debouncedUpsertPayloadCart = debounce(upsertPayloadCart, 1000)

// Union type for different cart actions
export type CartAction =
  | {
      type: 'ADD_CART_ITEM'
      payload: { product: number | Product; price: number }
    }
  | {
      type: 'REMOVE_CART_ITEM'
      // payload: { productId: number | string }
      payload: { cartItemId: string }
    }
    | {
      type: "UPDATE_QUANTITY"
      payload: { cartItemId: string; quantity: number }
    }
  | {
      type: "UPDATE_MESSAGE"
      payload: { cartItemId: string; giftCard: GiftCard }
    }
  | {
      type: 'ADD_RECEIVER'
      payload: {
        receiver: Receiver;
      }
    }
  | {
      type: 'LINK_RECEIVER'
      payload: { cartItemId: string, receiverId: string }
    }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'CLEAR_CART' }

// Helper function to get the product ID from a CartItem
const getProductId = (product: CartItem['product']): string | number => {
  return typeof product === 'object' ? product.id : product
}

// Cart reducer function to handle different actions
export const cartReducer = (cart: Cart, action: CartAction): Cart => {
  let updatedCart: Cart

  switch (action.type) {
    case 'ADD_CART_ITEM': {
      const { product, price } = action.payload

      // add a new product to existing cart
      const newItem: CartItem = {
        itemId: uuid(),
        quantity: 1,
        product: product,
        price: price,
        giftCard: {
          message: '',
          writingStyle: 'regular'
        }
      }
      const updatedItems = [...(cart.items || []), newItem]

      let cartToReturn = {
        ...cart,
        items: updatedItems,
      }

      cartToReturn = {
        ...cartToReturn,
        totals: calculateCartTotals(cart)
      }

      // // upsert the server cart
      // debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
    }

    case 'UPDATE_QUANTITY': {
      const { cartItemId, quantity } = action.payload
      const updatedItems =
        cart.items?.map((item) => {
          if (item.itemId === cartItemId ) {
            return {...item, quantity: quantity};
          }
          return item;
        });

      let cartToReturn = {
        ...cart,
        items: updatedItems,
      }

      cartToReturn = {
        ...cartToReturn,
        totals: calculateCartTotals(cart)
      }

      return cartToReturn;
    }

    case 'UPDATE_MESSAGE': {
      const { cartItemId, giftCard } = action.payload
      const updatedItems =
        cart.items?.map((item) => {
          if (item.itemId === cartItemId ) {
            
            return {...item, giftCard: giftCard };
          }
          return item;
        });

      const cartToReturn = {
        ...cart,
        items: updatedItems,
      }
      console.log("cartToReturn",cartToReturn)
      return cartToReturn;
    }

    case 'REMOVE_CART_ITEM': {
      const { cartItemId } = action.payload
      const updatedItems = cart.items?.filter(
        (item) => item.itemId !== cartItemId
      ) as CartItem[]

      let cartToReturn = {
        ...cart,
        items: updatedItems,
      }

      cartToReturn = {
        ...cartToReturn,
        totals: calculateCartTotals(cart)
      }
    
      // // upsert the server cart
      // console.log('product added, upsert cart -- ')
      // debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
    }

    case 'ADD_RECEIVER': {
      const { receiver } = action.payload
        
      const cartToReturn = {
        ...cart,
        receivers: [...(cart.receivers || []), receiver]
      }

      // // upsert the server cart
      // console.log('product added, upsert cart -- ')
      // debouncedUpsertPayloadCart(cartToReturn)

      return cartToReturn
    }

    case 'LINK_RECEIVER': {
      const { cartItemId, receiverId } = action.payload
      
      const updatedItems =
      cart.items?.map((item) => {
        if (item.itemId === cartItemId ) {
          return {...item, receiverId: receiverId};
        }
        return item;
      });

      const cartToReturn = {
        ...cart,
        items: updatedItems,
      }

      return cartToReturn;
    }

    case 'CLEAR_CART': {
      // also clear / delete the cart on payloadCMS
      deletePayloadCart(cart)
      return { ...cart, items: [], totals: { total: 0, cost: 0, shipping: 0 } }
    }

    case 'SET_CART': {
      return action.payload
    }

    default: {
      return cart
    }
  }
}

// Function to calculate the totals for the entire cart
const calculateCartTotals = (cart: Cart): Cart['totals'] => {
  const { items, receivers } = cart
  let totals = {total: 0, cost: 0, shipping: 0}
  
  //add up prices across cart items
  if (items) {
    items.forEach((item) => {
      if (item.price) {
        totals.cost = totals.cost + (item.price * item.quantity)
      }
    })
  }


  //add up shipping across receivers
  if (receivers) {
    receivers.forEach((receiver) => {
      if (receiver.delivery && receiver.delivery.shippingPrice) {
        totals.shipping = totals.shipping + receiver.delivery.shippingPrice
      }
    })
  }

  //calculatte grand total
  totals.total = totals.cost + totals.shipping;

  return totals;
}
