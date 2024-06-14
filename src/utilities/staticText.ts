export const messages = {
  inStock: `In stock and ready to ship`,
  lowStock: `Hurry! Low Stock`,
  outOfStock: `Sorry we're sold out!`,
  removeProductBase: `This thankly is already in your cart. `,
  removeProductExtra: `Go to the Cart to add your messages and send to as many people as you'd like easily.`,
  removeProductWarning: `Removing this thankly will also remove all receivers. To change receivers and still send this thankly, go to the Cart.`,
  shippingFreeMessage: `FREE Delivery for orders over $100.`,
}

export const cartStaticText = {
  leader: `Checkout`,
  heading: `Your Cart`,
  receiverMessage: `Send thanklys to as many people as you like. Click / tap on the fields to edit your message, delivery address and other details.`,
  shippingMessage: `Allow VIC (5 business days), Interstate (6-8 business days) due to AusPost letter delivery changes. `,
  // sendTo: `Sending this thankly to:`,
}

export const deliveryMethods = [
  { id: 'free', title: 'Free', turnaround: '4–10 business days', price: 0, checked: false },

  {
    id: 'standard',
    title: 'Standard',
    turnaround: '4–10 business days',
    price: 5,
    checked: true,
  },
  { id: 'express', title: 'Express', turnaround: '2–5 business days', price: 16, checked: false },
]
