import React, { useEffect, useState, useTransition } from 'react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import {
  DollarSignIcon,
  ChevronUpIcon,
  MailWarningIcon,
  SmileIcon,
  ChevronDownIcon,
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
import Image from 'next/image'
import { getImageAlt, getImageUrl } from '@/utilities/getmageUrl'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export const CheckoutSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  if (!cart || !cart.totals) {
    return null // or return a loading state or placeholder
  }
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const router = useRouter()
  const { validateCart } = useCart()
  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()

  const [billingAddress, setBillingAddress] = useState({
    formattedAddress: '',
    addressLine1: '',
    addressLine2: '',
  })

  const { items: cartItems } = cart

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
    <div id="summary-heading" className="sm:basis-1/2 #order-first sm:order-last">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} !my-0 pb-6`}>Order Summary</h2>

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

        <h2 className={`${contentFormats.global} ${contentFormats.h3} mb-6 hidden sm:block`}>
          Thanklys Ordered
        </h2>

        <div className="mt-6">
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

        <div className={`space-y-4 ${isAccordionOpen ? 'block' : 'hidden'} sm:block`}>
          {cartItems?.map((item: any, index: any) => {
            const { product } = item
            const imageUrl =
              product.media && product.media.length > 0
                ? getImageUrl(product.media[0]?.mediaItem)
                : null
            const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='%23cccccc'%3E%3Crect width='100' height='100' rx='10' stroke-width='2' /%3E%3Cpath d='M20 80 L50 20 L80 80 Z' stroke-width='2' /%3E%3Ccircle cx='50' cy='50' r='20' stroke-width='2' /%3E%3C/svg%3E`
            const receiverCount = item.receivers?.length || 0
            return (
              <div key={index} className="">
                <div className="space-y-4 pb-6">
                  <div className="flex items-start sm:items-center sm:space-x-4 p-3 sm:p-0 space-x-3">
                    <Image
                      src={imageUrl || placeholderSVG}
                      alt={''}
                      priority
                      width={100}
                      height={100}
                      className="rounded-sm object-cover object-center aspect-square shadow-md"
                    />
                    <div className="flex-1 flex flex-col">
                      <span
                        className={cn(contentFormats.global, contentFormats.h4, `no-underline`)}
                      >
                        {product.title}
                      </span>
                      <span
                        className={cn(
                          contentFormats.global,
                          contentFormats.text,
                          'text-sm italic  mt-1',
                        )}
                      >
                        {`Sending this thankly to ${receiverCount} `}
                        {receiverCount === 1 ? 'person' : 'people'}
                      </span>
                      <div className="flex justify-between items-start mt-2">
                        <div className="flex-row text-left">
                          <div>
                            <span
                              className={[contentFormats.global, contentFormats.text].join(' ')}
                            >
                              {`Cost: ${
                                item.totals.itemThanklys.toLocaleString('en-AU', {
                                  style: 'currency',
                                  currency: 'AUD',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 2,
                                }) || 0
                              }`}
                            </span>
                          </div>
                          <div>
                            <span
                              className={[contentFormats.global, contentFormats.text].join(' ')}
                            >
                              {`Shipping: ${
                                item.totals.itemShipping
                                  ? item.totals.itemShipping?.toLocaleString('en-AU', {
                                      style: 'currency',
                                      currency: 'AUD',
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                    })
                                  : '(needs address)'
                              }`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* <div className="pt-6 flex items-center space-x-4">
        <label
          htmlFor={`discount-code`}
          className="flex items-center text-sm font-medium text-gray-900"
        >
          <TagIcon className="h-5 w-5 text-gray-900" strokeWidth={1.25} />
        </label>
        <input
          id={`discount-code`}
          name="discount-code"
          type="text"
          placeholder="DISCOUNT CODE"
          className={cn(
            'peer block w-full border-0 border-b border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-700 focus:border-b-2 focus:border-green/75 focus:outline-none focus:ring-0 text-base sm:text-sm',
          )}
        />
      </div> */}
    </div>
  )
}
