'use client'

import { useTransition } from 'react'
import { BlockWrapper } from './_components/BlockWrapper'
import { CMSLink } from './_components/CMSLink'
import { Gutter } from './_components/Gutter'
import { contentFormats } from './_css/tailwindClasses'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, HomeIcon, ShoppingCartIcon } from 'lucide-react'
import { ShoppingBagIcon } from '@app/_icons/ShoppingBagIcon'

export default function NotFound() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <BlockWrapper
      settings={{ settings: { theme: 'light' } }}
      padding={{ top: 'large', bottom: 'small' }}
      // className={[classes.ProductGrid].filter(Boolean).join(' ')}
    >
      <Gutter>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-3/4">
          <div className="justify-center text-center">
            <h2
              className={[
                contentFormats.global,
                contentFormats.text,
                'font-normal tracking-tighter',
              ].join(' ')}
            >
              Page not found
            </h2>
          </div>
          <div className="space-y-6 flex flex-col items-end justify-end justify-items-end flex-auto px-4 md:px-0 ">
            <CMSLink
              data={{
                label: 'Thankly Shop',
                type: 'custom',
                url: '/shop',
              }}
              look={{
                theme: 'light',
                type: 'button',
                size: 'medium',
                width: 'wide',
                variant: 'blocks',
                icon: {
                  content: <ShoppingCartIcon strokeWidth={1.25} />,
                  iconPosition: 'right',
                },
              }}
              actions={{
                onClick: async () => {
                  startTransition(async () => {
                    router.push('/shop')
                  })
                },
              }}
            />

            <CMSLink
              data={{
                label: 'Thankly Home',
                type: 'custom',
                url: '/',
              }}
              look={{
                theme: 'light',
                type: 'button',
                size: 'medium',
                width: 'wide',
                variant: 'blocks',
                icon: {
                  content: <HomeIcon strokeWidth={1.25} />,
                  iconPosition: 'right',
                },
              }}
              actions={{
                onClick: async () => {
                  startTransition(async () => {
                    router.push('/')
                  })
                },
              }}
            />
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
