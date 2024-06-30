export const messages = {
  inStock: `In stock and ready to ship`,
  lowStock: `Hurry! Low Stock`,
  outOfStock: `Sorry we're sold out!`,
  removeProductBase: `This thankly is already in your cart. `,
  removeProductExtra: `Go to the Cart to add your messages and send to as many people as you'd like easily.`,
  removeProductWarning: `Removing this thankly will also remove all receivers. To change receivers and still send this thankly, go to the Cart.`,
  shippingFreeMessage: `FREE Delivery for orders over $100.`,
}

export const cartText = {
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

export const shippingPrices = {
  free: 0, // implement in future for large orders

  cards: {
    standardMail: 0,
    registeredMail: 9, // "domestic letters from auspost medium @$6.65" https://auspost.com.au/sending/letters-australia/letter-tracking
    // expressMail: 12, // medium c5 @ $8.85 https://auspost.com.au/sending/letters-australia/express-post
  },

  gifts: {
    size: {
      // https://auspost.com.au/sending/parcels-australia/parcel-post
      // mini pouch, prepaid satchels 355 x 225mm // https://auspost.com.au/sending/parcels-australia/parcel-post#postage
      // sendle https://try.sendle.com/en-au/250g-sendle-pouch

      mini: 10,
      small: 10,
      medium: 15,
      large: 20,
    },

    surcharge: {
      metro: 0,
      expressParcel: 10,
      regional: 15,
      remote: 20,
    },
  },
}
