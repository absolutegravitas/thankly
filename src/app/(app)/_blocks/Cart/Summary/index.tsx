// This file contains React components related to the shopping cart summary and checkout process.
// It provides the CartSummary component which displays the cart totals, discount information, and checkout/clear cart buttons.
// It also includes the SummaryItem component for rendering individual summary items and the CheckoutProcessing component for displaying a processing modal during checkout.

import React, { useEffect, useState, useTransition } from 'react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import { DollarSignIcon, MailWarningIcon, SmileIcon, XIcon, ArrowLeftIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Cart } from '@/payload-types'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { useRouter } from 'next/navigation'
import { useCart } from '@app/_providers/Cart'
import { LoaderCircleIcon } from 'lucide-react'
import { FullLogo } from '@app/_graphics/FullLogo'
import { cartText } from '@/utilities/refData'

// The CartSummary component renders the cart summary section
// It displays the total cost, shipping cost, and any applicable discounts
// It also provides buttons for proceeding to checkout or clearing the cart
export const CartSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  // If the cart or cart totals are not available, return null
  if (!cart || !cart.totals) return null

  const router = useRouter()
  const { validateCart, clearCart } = useCart()
  const [isValid, setIsValid] = useState<boolean>(true)
  const [validationMessage, setValidationMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  // Validate the cart on component mount and whenever the cart or validateCart function changes
  useEffect(() => {
    const orderValidity = validateCart()
    setIsValid(orderValidity)
    setValidationMessage(
      orderValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [cart, validateCart])

  // Handle the checkout process
  // If the cart is valid, navigate to the checkout page
  // If the cart is invalid, display an alert with the validation message
  const handleCheckout = async (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (event) event.preventDefault()
    if (isValid) {
      setIsProcessing(true)
      try {
        router.push(`/shop/checkout`)
      } catch (error) {
        console.error('Error during checkout:', error)
        setIsProcessing(false)
        alert('An error occurred during checkout. Please try again.')
      }
    } else {
      alert(validationMessage)
    }
  }

  return (
    <div id="summary-heading" className="sticky top-4 scroll-py-28 scroll-mt-24">
      <h2 className={cn(contentFormats.global, contentFormats.h3, 'mb-6')}>Cart Summary</h2>

      <div className="space-y-4">
        <SummaryItem
          label="Total (inc. taxes)"
          value={cart.totals.total + (cart.totals.discount || 0)}
          isBold
        />
        <SummaryItem label="Thanklys" value={cart.totals.cost} />
        <SummaryItem label="+ Shipping" value={cart.totals.shipping || 0} />

        {(cart.totals.discount || 0) < 0 && (
          <SummaryItem
            label={
              <span className="flex items-center">
                <SmileIcon className="mr-2" />
                Your order is over $150 so Shipping is on us!
              </span>
            }
            value={cart.totals.discount || 0}
          />
        )}
      </div>

      <div className="mt-6 space-y-4">
        {!isValid && <div className="text-red-500 text-sm">{validationMessage}</div>}

        <div className={cn(contentFormats.global, contentFormats.text, 'text-sm flex items-start')}>
          <MailWarningIcon className="mr-2 flex-shrink-0 mt-1" />
          <span>
            <span className="font-semibold">Thankly Cards: </span>
            {cartText.shippingMessage}{' '}
            <Link
              className={cn(contentFormats.global, contentFormats.a, '!text-sm')}
              href="https://auspost.com.au/about-us/supporting-communities/services-all-communities/our-future"
              target="_blank"
            >
              Learn More
            </Link>
          </span>
        </div>

        <CMSLink
          className={cn('block w-full', isValid ? '!bg-green' : '!bg-gray-400', '!text-white')}
          data={{
            label: 'Checkout',
            type: 'custom',
            url: `/shop/checkout`,
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

        <div className="flex flex-col sm:flex-row gap-4">
          <CMSLink
            data={{
              label: !isPending ? 'Clear Cart' : 'Clearing Cart... please wait',
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

      {isProcessing && <CheckoutProcessing />}
    </div>
  )
}

// The SummaryItem component renders an individual summary item with a label and value
interface SummaryItemProps {
  label: React.ReactNode
  value: number
  isBold?: boolean
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, isBold }) => (
  <div className="flex items-center justify-between">
    <dt className={cn(contentFormats.global, contentFormats.text, isBold && 'font-semibold')}>
      {label}
    </dt>
    <dd className={cn(contentFormats.global, contentFormats.text, isBold && 'font-semibold')}>
      {value.toLocaleString('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}
    </dd>
  </div>
)

// The CheckoutProcessing component displays a modal with a loading spinner during the checkout process
const CheckoutProcessing: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
    <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
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
