import React from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { DollarSignIcon, ChevronUpIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { getCart } from '@/app/(app)/_providers/Cart/cartActions'
import { Cart } from '@/payload-types'
import { CartButtons } from '../CartButtons'

export const CartSummary: React.FC<any> = (cart) => {
  // let cart: Cart | null = await getCart()
  // if (!cart) return null

  return (
    <div className=" fixed bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto bg-gray-50 shadow-lg lg:shadow-none lg:bg-white border-t border-gray-200 lg:border-t-0">
      <div className="lg:hidden">
        <details className="group">
          <summary className="flex justify-between items-center p-4 cursor-pointer list-none bg-white">
            <span className="text-lg font-semibold">Order Summary</span>
            <span className={`${contentFormats.global} ${contentFormats.h3} group-open:hidden`}>
              {cart.totals.cartTotal.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            <ChevronUpIcon className="ml-2 group-open:rotate-180 transition-transform" />
          </summary>

          <div className="p-4 bg-white">
            <OrderSummaryContent cart={cart} />
          </div>
        </details>
      </div>

      <div className="hidden lg:block">
        <h2 id="summary-heading" className={`${contentFormats.global} ${contentFormats.h3} mb-6`}>
          Order Summary
        </h2>
        <OrderSummaryContent cart={cart} />
      </div>

      <div className="mt-4 lg:mt-8 p-4 lg:p-0">
        <CMSLink
          className="block w-full"
          data={{
            label: 'Checkout',
            type: 'custom',
            url: `/shop/checkout?cartId=${cart.id}`,
          }}
          look={{
            theme: 'dark',
            type: 'button',
            size: 'large',
            width: 'full',
            variant: 'blocks',
            icon: {
              content: <DollarSignIcon strokeWidth={1.25} />,
              iconPosition: 'right',
            },
          }}
        />
        <CartButtons />
      </div>
    </div>
  )
}

const OrderSummaryContent: React.FC<{ cart: Cart }> = ({ cart }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <dt className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
        {`Cart Total (inclusive of taxes)`}
      </dt>
      <dd className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
        {cart.totals.cartTotal.toLocaleString('en-AU', {
          style: 'currency',
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </dd>
    </div>

    <div className="flex items-center justify-between">
      <dt className={[contentFormats.global, contentFormats.text].join(' ')}>All Thanklys</dt>
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
      <dt className={[contentFormats.global, contentFormats.text].join(' ')}>Total Shipping</dt>
      <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
        {cart.totals.cartShipping?.toLocaleString('en-AU', {
          style: 'currency',
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}
      </dd>
    </div>

    {cart.totals.cartShipping && cart.totals.cartShipping >= 100 && (
      <div className="flex items-center justify-between">
        <dt className={[contentFormats.global, contentFormats.text].join(' ')}>
          Free Shipping (over $100)
        </dt>
        <dd className={[contentFormats.global, contentFormats.text].join(' ')}>0.00</dd>
      </div>
    )}
  </div>
)
