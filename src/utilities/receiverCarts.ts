import { CartItem, Receiver } from "@/app/(app)/_blocks/Cart/cart-types";
import { Cart } from "@/payload-types";

export interface ReceiverCart extends Receiver {
  items: CartItem[];
}

export interface ReceiverCarts {
  receivers?: ReceiverCart[];
}

export function transformToReceiverCarts(cart: Cart): ReceiverCarts {
  if (!cart.items || !cart.receivers) return {}; // if no items or receivers, return empty object.
  const itemsByReceiverId = cart.items.reduce((grouped, item) => {
    if (item.receiverId) {
      //If we haven't seen this receiver ID before, create a new empty array for it.
      if (!grouped[item.receiverId]) {
        grouped[item.receiverId] = [];
      }
      //push cart item into the receivercart
      grouped[item.receiverId].push(item);
    }
    return grouped;
  }, {} as Record<string, CartItem[]>);

  const receiversWithItems = cart.receivers
    .filter(receiver => itemsByReceiverId[receiver.receiverId]?.length > 0)
    .map(receiver => ({
      ...receiver,
      items: itemsByReceiverId[receiver.receiverId] || []
    }));

  return {
    receivers: receiversWithItems
  };
}