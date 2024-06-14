import React, { Suspense } from 'react'
import { Cart } from '@/payload-types'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { CartEmpty } from '@app/_blocks/CartCheckout/CartEmpty'
import { getCart } from '@app/_components/ProductActions/actions'
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
        padding={{ top: 'large', bottom: 'large' }}
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
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-1">
            {leader && (
              <div className={[contentFormats.global, `uppercase`].join(' ')}>{leader}</div>
            )}
            {heading && (
              <h3 className={['flex justify-between space-x-5 #pb-6 !my-0'].join(' ')}>
                {heading}
              </h3>
            )}
          </div>
          <div className="col-start-5 col-span-3">
            <div className="flex flex-row gap-4">
              <CartButtons />
            </div>
          </div>
        </div>

        <div className="pt-6 grid grid-cols-5 gap-6">
          <Suspense fallback={<Loading />}>
            <CartClient cart={cart} />
          </Suspense>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
