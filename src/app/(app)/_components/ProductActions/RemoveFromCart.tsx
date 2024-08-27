// // The 'use client' directive indicates that this file is a client-side React component.
// /**
//  * @file RemoveFromCartButton.tsx
//  * @description Defines the RemoveFromCartButton component for removing an item from the shopping cart.
//  * @overview The RemoveFromCartButton component is a client-side React component that allows users to remove a product from their shopping cart. It utilizes the useCart hook to manage the order state and the useRouter hook from Next.js for client-side navigation. The component handles the removal of the product and refreshes the page upon successful removal. It also displays an error message if the removal process encounters an error.
//  * @component
//  * @param {number} cartItemId - The ID of the order item to be removed from the cart.
//  */
// // The RemoveFromCartButton component is exported as a named export.

// 'use client'
// // The component utilizes the useTransition hook from React for managing pending states during the removal process.

// // The error state is managed using the useState hook to display error messages, if any.
// import React, { useState, useTransition } from 'react'
// // The useCart hook is used to access the removeProduct function for removing the product from the cart.
// import { CMSLink } from '@app/_components/CMSLink'
// // The useRouter hook from Next.js is used for client-side navigation and refreshing the page.
// import { XIcon, LoaderCircleIcon, TrashIcon } from 'lucide-react'
// import { useCart } from '../../_providers/Cart'
// // The handleClick function is called when the remove button is clicked. It starts a transition, sets the error state to null, removes the product using the removeProduct function from the useCart hook, and refreshes the page using the router.
// import { useRouter } from 'next/navigation'

// export function RemoveFromCartButton({ cartItemId }: { cartItemId: number }) {
//   const [isPending, startTransition] = useTransition()
//   const [error, setError] = useState<string | null>(null)
//   const { removeProduct } = useCart()
//   const router = useRouter()

//   // If an error occurs during the removal process, an error message is displayed.
//   const handleClick = () => {
//     startTransition(() => {
//       setError(null)
//       removeProduct(cartItemId)
//       router.refresh()
//       // The CMSLink component is rendered as the remove button. It is conditionally styled based on the pending state (isPending) and triggers the handleClick function when clicked. The button displays a loading icon when the removal is pending and a trash icon otherwise.
//     })
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>
//   }

//   return (
//     <CMSLink
//       data={{
//         label: '',
//         type: 'custom',
//         url: '/shop',
//       }}
//       look={{
//         theme: 'light',
//         type: 'button',
//         size: 'medium',
//         width: 'full',
//         variant: 'blocks',
//         icon: {
//           content: isPending ? (
//             <LoaderCircleIcon className="animate-spin" strokeWidth={1.25} />
//           ) : (
//             <TrashIcon className="!ml-0 justify-center" strokeWidth={1.25} />
//           ),
//           iconPosition: 'right',
//         },
//       }}
//       actions={{
//         onClick: handleClick,
//       }}
//       pending={isPending}
//     />
//   )
// }
