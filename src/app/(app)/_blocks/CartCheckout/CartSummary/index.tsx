import React from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { DollarSignIcon, ShoppingCartIcon } from 'lucide-react'
import { CMSLink } from '@app/_components/CMSLink'
import { getCart } from '@app/_providers/Cart/actions'
import { Cart } from '@/payload-types'

export const CartSummary: React.FC<any> = async () => {
  let cart: Cart | null = null
  cart = await getCart()

  // console.log('order summary cart --', cart)

  return (
    <div className=" border border-solid border-neutral-400 pb-8 px-8 relative flex flex-col justify-between min-h-full">
      <div>
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
              {`Cart Total (inclusive of taxes)`}
            </dt>
            <dd className={[contentFormats.global, contentFormats.text, `font-semibold`].join(' ')}>
              {cart?.totals?.cartTotal !== undefined && cart?.totals?.cartTotal !== null
                ? cart.totals.cartTotal.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                : 'N/A'}
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>All Thanklys</dt>
            <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
              {cart?.totals?.cartThanklys !== undefined && cart?.totals?.cartThanklys !== null
                ? cart.totals?.cartThanklys.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                : 'N/A'}
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className={[contentFormats.global, contentFormats.text].join(' ')}>
              Total Shipping
            </dt>
            <dd className={[contentFormats.global, contentFormats.text].join(' ')}>
              {cart?.totals?.cartShipping !== undefined && cart?.totals?.cartShipping !== null
                ? cart.totals?.cartShipping.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                : 'N/A'}
            </dd>
          </div>
        </div>
      </div>

      <div className=" mt-auto flex justify-end pt-5">
        <CMSLink
          className="cursor-pointer"
          data={{
            label: 'Checkout',
            type: 'custom',
            url: '/shop/checkout',
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
        />
      </div>
    </div>
  )
}
