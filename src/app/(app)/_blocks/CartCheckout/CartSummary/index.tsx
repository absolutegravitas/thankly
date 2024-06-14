import React from 'react'
import { Button } from '@app/_components/Button'
import { clearCart, getCart } from '@app/_components/ProductActions/actions'
import { contentFormats } from '@app/_css/tailwindClasses'
import { LoaderCircleIcon } from 'lucide-react'
import { CMSLink } from '@/app/(app)/_components/CMSLink'
import { CartCheckout } from '../CartButtons'

export const CartSummary: React.FC<any> = ({ cart }) => {
  // console.log('cart received ', cart)

  return (
    <React.Fragment>
      <div className="#border #border-solid col-start-5 h-full col-span-2 rounded-sm bg-gray-150 px-6 pb-8">
        <div className="relative flex items-center justify-between gap-4">
          <div className="">
            <h2
              id="summary-heading"
              className={[`${contentFormats.global} ${contentFormats.h3}`].join(' ')}
            >
              Order Summary
            </h2>
            <div className="justify-stretch w-full sm:mt-4 sm:pr-3">
              <CartCheckout />
            </div>
          </div>
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
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>
              Total Shipping
            </dt>
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
    </React.Fragment>
  )
}
