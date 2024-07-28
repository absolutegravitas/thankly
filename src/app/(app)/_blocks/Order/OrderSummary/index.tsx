import React, { useEffect, useState, useTransition } from 'react'
import { buttonLook, contentFormats } from '@app/_css/tailwindClasses'
import { DollarSignIcon, MailWarningIcon, SmileIcon, XIcon, ArrowLeftIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Order } from '@/payload-types'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { useRouter } from 'next/navigation'
import { useOrder } from '@app/_providers/Order'
import { LoaderCircleIcon } from 'lucide-react'
import { FullLogo } from '@app/_graphics/FullLogo'
import { orderText } from '@/utilities/refData'

export const OrderSummary: React.FC<{ order: Order }> = ({ order }) => {
  if (!order || !order.totals) return null

  const router = useRouter()
  const { validateOrder, clearOrder } = useOrder()
  const [isValid, setIsValid] = useState(true)
  const [validationMessage, setValidationMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const orderValidity = validateOrder()
    setIsValid(orderValidity)
    setValidationMessage(
      orderValidity ? '' : 'Please complete all receiver details before proceeding to checkout.',
    )
  }, [order, validateOrder])

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
      <h2 className={cn(contentFormats.global, contentFormats.h3, 'mb-6')}>Order Summary</h2>

      <div className="space-y-4">
        <SummaryItem
          label="Total (inc. taxes)"
          value={order.totals.total + (order.totals.discount || 0)}
          isBold
        />
        <SummaryItem label="Thanklys" value={order.totals.cost} />
        <SummaryItem label="+ Shipping" value={order.totals.shipping || 0} />

        {(order.totals.discount || 0) < 0 && (
          <SummaryItem
            label={
              <span className="flex items-center">
                <SmileIcon className="mr-2" />
                Your order is over $150 so Shipping is on us!
              </span>
            }
            value={order.totals.discount || 0}
          />
        )}
      </div>

      <div className="mt-6 space-y-4">
        {!isValid && <div className="text-red-500 text-sm">{validationMessage}</div>}

        <div className={cn(contentFormats.global, contentFormats.text, 'text-sm flex items-start')}>
          <MailWarningIcon className="mr-2 flex-shrink-0 mt-1" />
          <span>
            <span className="font-semibold">Thankly Cards: </span>
            {orderText.shippingMessage}{' '}
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
                  clearOrder()
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

const SummaryItem: React.FC<{ label: React.ReactNode; value: number; isBold?: boolean }> = ({
  label,
  value,
  isBold,
}) => (
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
