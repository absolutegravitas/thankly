'use client'
import { useCart } from '@/app/(app)/_providers/Cart'
import { useSession } from 'next-auth/react';

export function LinkUserToCart() {
    //fetch cart
    const { cart } = useCart();

    //fetch session data (for user id)
    const { status, data: session } = useSession()

    //if user id found
    if(session?.user.id) {
      //then fill in any missing user details in cart
      cart.billing = {
        orderedBy: parseInt(session.user.id),
        name: cart.billing?.name ?? session.user.name,
        email: cart.billing?.email ?? session.user.email,
        ...cart.billing
      } 
    }

    //TODO: How do I write this back to the cart in memory?
}