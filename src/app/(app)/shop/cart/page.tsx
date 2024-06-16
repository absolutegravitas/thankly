import React, { Suspense } from 'react'
import { Cart } from '@/payload-types'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { CartEmpty } from '@app/_blocks/CartCheckout/CartEmpty'
import { getCart } from '@app/_providers/Cart'
import { cartStaticText } from '@/utilities/staticText'
import { contentFormats } from '@app/_css/tailwindClasses'
import { CartButtons } from '../../_blocks/CartCheckout/CartButtons'
// import CartClient from './page.client'
import Loading from './loading'
const CartClient = React.lazy(() => import('./page.client'))

export default async function CartPage() {
  let cart: Cart | null = null
  cart = await getCart()

  if (!cart) {
    console.log('Cart not found or is empty...')
    return (
      <BlockWrapper
        // settings={{ settings: { theme: 'light' } }}
        padding={{ top: 'small', bottom: 'large' }}
      >
        <Gutter>
          <CartEmpty />
        </Gutter>
      </BlockWrapper>
    )
  }

  // console.log('/cart cart found ', JSON.stringify(cart))
  const { leader, heading } = cartStaticText

  return (
    <BlockWrapper
      // settings={{ settings: { theme: 'light' } }}
      padding={{ top: 'large', bottom: 'small' }}
    >
      <Gutter>
        <div className="flex flex-col md:flex-row">
          <div className="basis-1/4 flex align-middle items-center justify-middle pb-3">
            {heading && (
              <span
                className={[
                  contentFormats.global,
                  contentFormats.p,
                  'tracking-tighter sm:tracking-tight text-3xl font-medium',
                ].join(' ')}
              >
                {heading}
              </span>
            )}
          </div>
          <div className="basis-3/4 items-end justify-items-end w-3/4">
            <div className="flex flex-row gap-4 items-end justify-items-end">
              <CartButtons />
            </div>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <CartClient cart={cart} />
        </Suspense>
      </Gutter>
    </BlockWrapper>
  )
}
