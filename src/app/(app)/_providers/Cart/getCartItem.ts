import { Cart } from "@/payload-types";

/**
 * Finds a cart item by its ID
 * @param {Object} cart - The shopping cart object
 * @param {string} itemId - The ID of the item to find
 * @returns {Object|undefined} The found cart item or undefined if not found
 */
function getCartItem(cart: Cart, itemId: string) {
  if (!cart || !cart.items || !Array.isArray(cart.items)) {
    return undefined;
  }

  return cart.items.find(item => item.id === itemId);
}

export default getCartItem;