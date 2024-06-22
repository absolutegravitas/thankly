import React, { useTransition } from 'react'
import {
  CheckIcon,
  ChevronsRightIcon,
  CrossIcon,
  FrownIcon,
  LoaderCircleIcon,
  MessageCircleWarningIcon,
  PlusIcon,
  SendHorizonalIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { addProduct, removeProduct } from '@app/_providers/Cart/actions'
// import { Button } from '@app/_components/Button'
import { useRouter } from 'next/navigation'
import { CMSLink } from '@app/_components/CMSLink'
import { messages } from '@/utilities/staticText'

export function ProductActions({ product, hidePerks, hideRemove }: any) {
  const { stockOnHand, inCart } = product
  // console.log('product block props -- ', product)
  // console.log('hidePerks -- ', hidePerks)
  // console.log('hideRemove -- ', hideRemove)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isRouting, startRouting] = useTransition()

  if (isRouting) {
    return (
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-4 sm:py-4 flex items-center">
          <LoaderCircleIcon
            className="animate-spin h-8 w-8 flex-shrink-0 text-green"
            strokeWidth={1.25}
            ria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">{`Working...please wait`}</div>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="sm:flex pt-2 items-center justify-center space-x-2">
        <div className="py-4 sm:py-4 flex items-center">
          <LoaderCircleIcon
            className="animate-spin h-8 w-8 flex-shrink-0 text-green"
            strokeWidth={1.25}
            ria-hidden="true"
          />
          <div className="ml-2 text-sm text-gray-500">{`Working...please wait`}</div>
        </div>
      </div>
    ) // Show a loading indicator while the transition is in progress
  } else {
    if (stockOnHand === 0) {
      return (
        <div className="sm:flex pt-2 items-center justify-center space-x-2">
          <div className="py-1 sm:py-2 flex items-center">
            <FrownIcon
              className="h-8 w-8 flex-shrink-0 text-green"
              strokeWidth={1.25}
              ria-hidden="true"
            />
            <div className="ml-2 text-sm text-gray-500">
              {`We're Sorry! This thankly is currently out of stock. `}
              <br className="sm:block hidden" />
              <Link href="/shop">{`Back to Shop`} &#8594;</Link>
            </div>
          </div>
        </div>
      )
    }

    if (stockOnHand != 0) {
      if (inCart === true) {
        return (
          <React.Fragment>
            {!hideRemove && (
              <div className="sm:flex pt-2 items-center justify-center space-x-2">
                <div className="py-4 sm:py-4 flex items-center">
                  <CheckIcon
                    className="h-8 w-8 flex-shrink-0 text-green"
                    strokeWidth={1.25}
                    ria-hidden="true"
                  />
                  <div className="ml-2 text-sm text-gray-500">
                    {messages.removeProductBase}
                    {messages.removeProductExtra}
                  </div>
                </div>
              </div>
            )}

            <React.Fragment>
              <div className="py-4 sm:py-4 flex gap-1">
                <div className="flex-auto w-full">
                  <CMSLink
                    data={{
                      label: 'View in Cart',
                      type: 'custom',
                      url: '/shop/cart',
                    }}
                    look={{
                      theme: 'light',
                      type: 'button',
                      size: 'medium',
                      width: 'full',
                      variant: 'blocks',
                      icon: {
                        content: <ChevronsRightIcon strokeWidth={1.25} />,
                        iconPosition: 'right',
                      },
                    }}
                    actions={{
                      onClick: async () => {
                        startTransition(async () => {
                          router.push('/shop/cart')
                        })
                      },
                    }}
                  />
                </div>
                <div className="flex-initial w-1/4">
                  <CMSLink
                    data={{
                      label: '',
                      type: 'custom',
                      url: '/shop',
                    }}
                    look={{
                      theme: 'light',
                      type: 'button',
                      size: 'medium',
                      width: 'full',
                      variant: 'blocks',
                      icon: {
                        content: <XIcon className="!ml-0" strokeWidth={1.25} />,
                        iconPosition: 'right',
                      },
                    }}
                    actions={{
                      onClick: async () => {
                        startTransition(async () => {
                          await removeProduct(product.id)
                          window.location.reload()
                        })
                      },
                    }}
                  />{' '}
                </div>
              </div>
            </React.Fragment>
            {!hideRemove && (
              <div className="sm:flex pt-2 items-center justify-center space-x-2">
                <div className="py-1 sm:py-2 flex items-center">
                  <MessageCircleWarningIcon
                    className="h-8 w-8 flex-shrink-0 text-green"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  <div className="ml-2 text-sm text-gray-500">{messages.removeProductWarning}</div>
                </div>
              </div>
            )}
          </React.Fragment>
        )
      } else {
        return (
          <React.Fragment>
            <div className="py-4 sm:py-4 flex gap-1">
              <div className="flex-auto w-full">
                <CMSLink
                  data={{
                    label: 'Add to Cart',
                    type: 'custom',
                    url: '/shop/cart',
                  }}
                  look={{
                    theme: 'light',
                    type: 'button',
                    size: 'medium',
                    width: 'full',
                    variant: 'blocks',
                    icon: {
                      content: <PlusIcon strokeWidth={1.25} />,
                      iconPosition: 'right',
                    },
                  }}
                  actions={{
                    onClick: async () => {
                      await addProduct(product)
                      startRouting(async () => {
                        router.push('/shop/cart')
                      })
                    },
                  }}
                />
              </div>
            </div>

            {!hidePerks && (
              <div className="#hidden sm:flex pt-2 items-center justify-center space-x-2">
                <div className="py-1 sm:py-2 flex items-center">
                  <SendHorizonalIcon
                    className="h-5 w-5 flex-shrink-0 text-green"
                    aria-hidden="true"
                  />
                  <div className="ml-2 text-sm text-gray-500">{messages.shippingFreeMessage}</div>
                </div>
                <div className="py-1 sm:py-2 flex items-center">
                  <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                  <div className="ml-2 text-sm text-gray-500">{messages.inStock}</div>
                </div>
              </div>
            )}
          </React.Fragment>
        )
      }
    }
  }
}
