'use client'

import { useTransition } from 'react'
import { BlockWrapper } from './_components/BlockWrapper'
import { Button } from './_components/Button'
import { CMSLink } from './_components/CMSLink'
import { Gutter } from './_components/Gutter'
import { contentFormats } from './_css/tailwindClasses'
import { useRouter } from 'next/navigation'

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
          <div className="align-middle justify-center text-center">
            <Button
              url="/shop"
              label={'Thankly Shop'}
              appearance={'default'}
              fullWidth
              data-theme={'light'}
              icon="chevron"
              onClick={async () => {
                startTransition(async () => {
                  router.push('/shop')
                })
              }}
            />

            <Button
              url="/"
              label={'Home'}
              appearance={'default'}
              fullWidth
              data-theme={'light'}
              icon="chevron"
              onClick={() => {
                startTransition(async () => {
                  router.push('/')
                })
              }}
            />
          </div>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
