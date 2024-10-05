'use client'
import CartRedirect from '@/app/(app)/_blocks/Cart/CartRedirect'
import { useCart } from '@/app/(app)/_providers/Cart'
import React, { useEffect, useState } from 'react'
import SkeletonLoader from '../skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/(app)/_components/ui/accordion'
import { useMediaQuery } from 'react-responsive'
import CartItemsTable from '@/app/(app)/_blocks/Cart/CartItemsTable'
import { ReceiverCarts, transformToReceiverCarts } from '@/utilities/receiverCarts'
import CartTotals from '@/app/(app)/_blocks/Cart/CartTotals'
import DiscountCode from '@/app/(app)/_components/DiscountCode'
import {
  PaymentForm,
  stripeElementsAppearance,
} from '@/app/(app)/_blocks/Cart/Payment/PaymentsForm'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/utilities/stripe'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/app/(app)/_components/ui/button'
import { Input } from '@/app/(app)/_components/ui/input'
import { Separator } from '@/app/(app)/_components/ui/separator'
import { FaGoogle, FaLinkedin, FaFacebook } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { fetchUserDetails } from '@/app/(app)/(pages)/account/userActions'
import { Cart, User } from '@/payload-types'

const CartPaymentPage = () => {
  const {
    cart,
    hasInitializedCart,
    cartIsEmpty,
    cartPersonalisationMissing,
    cartPostageMissing,
    setCart,
  } = useCart()
  const isMobile = useMediaQuery({ maxWidth: 639 })
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<any>(null)

  useEffect(() => {
    console.log('session -- ', session)
    console.log('cart -- ', cart)

    if (session?.user?.id) {
      fetchUserDetails(session.user.id).then(setUserDetails)

      // // Update the cart with the user ID

      // if (cart && !cart.billing?.orderedBy) {
      //   const updatedCart: Cart = {
      //     ...cart,
      //     billing: {

      //       orderedBy: session.user.id ? Number(session.user.id) : null,
      //     },
      //   }
      //   setCart(updatedCart)
      //   console.log('Updated cart with user:', updatedCart)
      // }
    }
  }, [session, cart, setCart])

  if (!hasInitializedCart) return <SkeletonLoader />
  if (cartIsEmpty || cartPersonalisationMissing || cartPostageMissing) return <CartRedirect />

  const receiverCarts = transformToReceiverCarts(cart)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.refresh()
    }
  }

  const handleProviderSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/cart/payment' })
  }

  const OrderSummary: React.FC<{ receiverCarts: ReceiverCarts }> = ({ receiverCarts }) => {
    return (
      <>
        {receiverCarts.receivers?.map((receiverCart, index) => (
          <CartItemsTable
            key={receiverCart.id || index}
            receiverCart={receiverCart}
            showDetails={true}
            showDeliveryAddress={true}
          />
        ))}
      </>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="basis-1/2 px-6">
        {status === 'authenticated' && userDetails ? (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {userDetails.firstName}!</h2>
            <p>Email: {userDetails.email}</p>

            <p>{`You're already logged in so simply pay and your order will be placed.`}</p>
          </div>
        ) : (
          <div className="mb-6">
            <p className="#text-2xl font-bold mb-4">
              Login to manage your orders and account with us.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
            <div className="mt-6">
              <Separator className="my-4">
                <span className="px-2 text-sm text-gray-500">Or continue with</span>
              </Separator>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleProviderSignIn('google')}
                  className="w-full"
                >
                  <FaGoogle className="mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleProviderSignIn('linkedin')}
                  className="w-full"
                >
                  <FaLinkedin className="mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleProviderSignIn('facebook')}
                  className="w-full"
                >
                  <FaFacebook className="mr-2" />
                  Facebook
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="link" onClick={() => signIn('email')}>
                Sign in with Email
              </Button>
            </div>
          </div>
        )}
        <Elements
          stripe={stripePromise}
          options={{
            amount: cart.totals.total * 100,
            mode: 'payment',
            currency: 'aud',
          }}
        >
          <PaymentForm />
        </Elements>
      </div>
      <div className="basis-1/2 bg-thankly-palegreen">
        <form>
          {isMobile ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="cart">
                <AccordionTrigger className="w-full">
                  <div className="flex items-center gap-2 flex-1 px-2">
                    <span className="flex-grow text-left text-lg font-bold">Summary of order</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <OrderSummary receiverCarts={receiverCarts} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-lg font-bold">Summary of order</span>
              </div>
              <OrderSummary receiverCarts={receiverCarts} />
            </div>
          )}
          <div className="pb-4 px-4">
            <DiscountCode />
          </div>
          <div className="pb-4 px-4">
            <CartTotals cart={cart} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default CartPaymentPage
