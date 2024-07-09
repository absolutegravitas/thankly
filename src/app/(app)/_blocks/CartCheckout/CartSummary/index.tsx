import React, { useEffect } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { DollarSignIcon, ChevronUpIcon, MailWarningIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { Cart } from '@/payload-types'
import { CartButtons } from '../CartButtons'
import { cartText } from '@/utilities/refData'
import Link from 'next/link'
import cn from '@/utilities/cn'
import { useRouter } from 'next/navigation'

export const CartSummary: React.FC<{ cart: Cart }> = ({ cart }) => {
  if (!cart || !cart.totals) {
    return null // or return a loading state or placeholder
  }

  return (
    <div id="summary-heading" className="scroll-py-28 scroll-mt-24">
      <h2 className={`${contentFormats.global} ${contentFormats.h3} mb-6`}>Order Summary</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <dt className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
            {`Total (inc. taxes)`}
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
      </div>

      <div className="mt-4 lg:mt-8 p-4 lg:p-0">
        <CMSLink
          className="block w-full !bg-green !text-white"
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

        {/* Notices */}
        <div className={cn(contentFormats.global, contentFormats.text, `!mt-0 text-sm py-4`)}>
          {/* {product.productType != 'card' && ( */}
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
          {/* )} */}
        </div>

        <CartButtons />
      </div>
      <div className="sm:hidden z-50">
        <MobileOrderSummary cartTotal={cart.totals.cartTotal} />
      </div>
    </div>
  )
}

const MobileOrderSummary = ({ cartTotal }: any) => {
  return (
    <Link
      href="#summary-heading"
      scroll={true}
      className="no-underline fixed bottom-4 right-4 bg-green text-white rounded-md px-8 p-3 shadow-2xl flex flex-col items-center cursor-pointer"
    >
      <span className={cn(contentFormats.global, contentFormats.text, 'mt-1')}>
        {`Order Total: `}
        {cartTotal.toLocaleString('en-AU', {
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
  )
}
