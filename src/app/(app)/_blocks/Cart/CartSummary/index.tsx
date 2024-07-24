import React, { useEffect, useState, useTransition } from 'react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import {
  DollarSignIcon,
  ChevronUpIcon,
  MailWarningIcon,
  SmileIcon,
  XIcon,
  ArrowLeftIcon,
} from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Cart } from '@/payload-types'
import { cartText } from '@/utilities/refData'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { useRouter } from 'next/navigation'
import { useCart } from '@app/_providers/Cart'
import { LoaderCircleIcon } from 'lucide-react'
import { FullLogo } from '@/app/(app)/_graphics/FullLogo'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export const CartSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  if (!cart || !cart.totals) {
    return null // or return a loading state or placeholder
  }

  const router = useRouter()
  const { validateCart } = useCart()
  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const { clearCart } = useCart()

  const [billingAddress, setBillingAddress] = useState({
    formattedAddress: '',
    addressLine1: '',
    addressLine2: '',
  })

  useEffect(() => {
    const cartValidity = validateCart()
    setIsValid(cartValidity)
    setValidationMessage(
      cartValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [cart, validateCart])

  const handleCheckout = async (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (event) {
      event.preventDefault()
    }

    if (isValid) {
      setIsProcessing(true)
      console.log(`Cart is valid, let's create a draft order...`)

      try {
        // Simulate API call or any async operation
        // await new Promise((resolve) => setTimeout(resolve, 2000))
        router.push(`/shop/checkout`)
      } catch (error) {
        console.error('Error during checkout:', error)
        setIsProcessing(false)
        alert('An error occurred during checkout. Please try again.')
      }
    } else {
      console.log('Cart is invalid, errors should be displayed')
      alert(validationMessage)
    }
  }

  return (
    <div id="summary-heading" className="scroll-py-28 scroll-mt-24 basis-1/2">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} mb-6`}>Order Summary</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {`Total (inc. taxes)`}
          </dt>
          <dd className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {(cart.totals.cartTotal + (cart.totals.cartShippingDiscount || 0)).toLocaleString(
              'en-AU',
              {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              },
            )}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text].join(' ')}>Thanklys</dt>
          <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
            {cart.totals.cartThanklys.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text].join(' ')}>{`+ Shipping`}</dt>
          <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
            {cart.totals.cartShipping?.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>

        {(cart.totals.cartShippingDiscount || 0) < 0 && (
          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>
              <SmileIcon />
              {` Your order is over $150 so Shipping is on us!`}
            </dt>
            <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
              {`(${cart.totals.cartShippingDiscount?.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })})`}
            </dd>
          </div>
        )}
      </div>

      <div className="mt-4 lg:mt-8 p-4 lg:p-0">
        {!isValid && <div className="text-red-500 mt-2 text-sm">{validationMessage}</div>}

        {/* Notices */}
        <div className={cn(contentFormats.global, contentFormats.text, `!mt-0 text-sm py-4`)}>
          <React.Fragment>
            <MailWarningIcon className="mr-2" />
            <span className="font-semibold">{`Thankly Cards: `}</span>
            <span className={[contentFormats.text, `text-sm`].join(' ')}>
              {cartText.shippingMessage}
              <Link
                className={[contentFormats.global, contentFormats.a, `!text-sm`].join(' ')}
                href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
                target="_blank"
              >
                Learn More
              </Link>
            </span>
          </React.Fragment>
        </div>
        <CMSLink
          className={`block #py-6 w-full ${isValid ? '!bg-green' : '!bg-gray-400'} !text-white`}
          data={{
            label: 'Checkout',
            type: 'custom',
            url: `/shop/checkout?cartId=${cart.id}`,
          }}
          look={{
            theme: 'dark',
            type: 'button',
            size: 'medium',
            width: 'narrow',
            variant: 'blocks',
            icon: {
              content: <DollarSignIcon strokeWidth={1.25} />,
              iconPosition: 'right',
            },
          }}
          actions={{ onClick: handleCheckout }}
          pending={isProcessing}
        />

        <div className="flex flex-row gap-4 py-3">
          <CMSLink
            data={{
              label: !isPending ? 'Clear Cart' : 'Clearing Cart... please wait',
              // type: 'custom',
              // url: '/shop',
            }}
            look={{
              theme: 'light',
              type: 'button',
              size: 'small',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: <XIcon strokeWidth={1.25} />,
                iconPosition: 'right',
              },
            }}
            actions={{
              onClick: async () => {
                startTransition(async () => {
                  clearCart()
                  // revalidateCache({ path: '/shop' })
                  router.push('/shop')
                })
              },
            }}
          />

          <CMSLink
            data={{
              label: 'Continue Shopping',
              type: 'custom',
              url: '/shop',
            }}
            look={{
              theme: 'light',
              type: 'button',
              size: 'small',
              width: 'full',
              variant: 'blocks',
              icon: {
                content: <ArrowLeftIcon strokeWidth={1.25} />,
                iconPosition: 'right',
              },
            }}
          />
        </div>
      </div>
      <div className="sm:hidden flex flex-row z-50 fixed bottom-0 left-0 w-full outline-green">
        <Link
          href="#summary-heading"
          scroll={true}
          className="basis-1/2 hover:no-underline no-underline  bg-white py-2  flex flex-col items-center cursor-pointer"
        >
          <span
            className={cn(
              contentFormats.global,
              contentFormats.text,
              buttonLook.variants.blocks,
              'mt-1 text-sm',
            )}
          >
            {` Order Total: `}
            {cart.totals.cartTotal.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className={cn(contentFormats.global, contentFormats.h5, 'mt-1')}>
            {`View Summary `}
            &rarr;
          </span>
        </Link>

        <CMSLink
          className={`block w-1/2 ${isValid ? '!bg-green' : '!bg-gray-400'} !text-white`}
          data={{
            label: 'Checkout',
            type: 'custom',
            url: `/shop/checkout?cartId=${cart.id}`,
          }}
          look={{
            theme: 'dark',
            type: 'button',
            size: 'small',
            width: 'narrow',
            variant: 'blocks',
            icon: {
              content: <DollarSignIcon strokeWidth={1.25} />,
              iconPosition: 'right',
            },
          }}
          actions={{ onClick: handleCheckout }}
          pending={isProcessing}
        />
      </div>

      {isProcessing && <CheckoutProcessing />}
    </div>
  )
}

const CheckoutProcessing: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/75 bg-opacity-50">
      <div className="flex flex-col  bg-white p-8 rounded-sm shadow-xl text-center">
        <FullLogo className="h-12 w-12 mx-auto mb-4" />

        <LoaderCircleIcon
          className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4"
          strokeWidth={1.25}
          aria-hidden="true"
        />
        <h2 className="text-2xl font-semibold mb-2">Preparing Checkout</h2>
        <p className="text-gray-600 mb-4">
          Please do not close this window or click the back button.
        </p>
        <div className="text-sm text-gray-500">This may take a few moments...</div>
      </div>
    </div>
  )
}
