import React from 'react'
import { clearCart, getCart } from '@app/_providers/Cart'
import { contentFormats } from '@app/_css/tailwindClasses'
import { LoaderCircleIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
// import { CartCheckout } from '../CartButtons'

export const CartSummary: React.FC<any> = ({ cart }) => {
  // console.log('cart received ', cart)

  return (
    <div className="sm:hidden basis-2/5 px-6 pb-8 border border-solid border-gray-200/90 rounded-md">
      <div className="relative flex justify-between gap-4">
        <h2
          id="summary-heading"
          className={[`${contentFormats.global} ${contentFormats.h3}`].join(' ')}
        >
          Order Summary
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            Cart Total
          </dt>
          <dd className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {cart?.totals?.orderValue.toLocaleString('en-AU', {
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
            {cart?.totals?.thanklys.toLocaleString('en-AU', {
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
            {cart?.totals?.shipping.toLocaleString('en-AU', {
              style: 'currency',
              currency: 'AUD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>
        <p
          className={[
            'justify-end text-right',
            contentFormats.global,
            contentFormats.italic,
            contentFormats.text,
          ].join(' ')}
        >
          {'inclusive of taxes'}
        </p>
      </div>
    </div>
  )
}
