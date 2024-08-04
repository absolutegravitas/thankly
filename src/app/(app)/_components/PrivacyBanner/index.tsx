'use client'

import * as React from 'react'
import Link from 'next/link'

import { usePrivacy } from '@app/_providers/Privacy'

import { CMSLink } from '../CMSLink'
import { CheckCheckIcon, XIcon } from 'lucide-react'

export const PrivacyBanner: React.FC = () => {
  const [closeBanner, setCloseBanner] = React.useState(false)
  const [animateOut, setAnimateOut] = React.useState(false)

  const { showConsent, updateCookieConsent } = usePrivacy()

  const handleCloseBanner = () => {
    setAnimateOut(true)
  }

  React.useEffect(() => {
    if (animateOut) {
      setTimeout(() => {
        setCloseBanner(true)
      }, 300)
    }
  }, [animateOut])

  if (!showConsent || closeBanner) {
    return null
  }

  return (
    <React.Fragment>
      <div
        className={[
          'fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)] transition-transform duration-300 border border-neutral-300 dark:border-neutral-600',
          animateOut && 'translate-y-full',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            'flex flex-col justify-between items-center relative bg-neutral-100 dark:bg-neutral-800',
            'px-6 py-4 sm:px-4 sm:py-4 lg:px-8 lg:py-6',
            'md:flex-row',
          ]
            .join(' ')
            .trim()}
        >
          <p className="m-0 font-body font-light tracking-tight leading-snug prose-em:font-extrabold dark:text-neutral-300">
            {`We use cookies, subject to your consent, to analyze the use of our website and to ensure
            you get the best experience. Read our `}
            <Link
              href="/privacy"
              className="text-inherit no-underline hover:opacity-80 transition duration-200"
              prefetch={false}
            >
              cookie policy
            </Link>{' '}
            for more information.
          </p>

          <div className="flex flex-row py-4 sm:py-4 gap-1 dark:text-neutral-300">
            <div className="">
              <CMSLink
                data={{
                  label: 'Accept',
                }}
                look={{
                  theme: 'light',
                  type: 'button',
                  size: 'small',
                  width: 'full',
                  variant: 'blocks',
                  icon: {
                    content: <CheckCheckIcon strokeWidth={1.25} />,
                    iconPosition: 'right',
                  },
                }}
                actions={{
                  onClick: () => {
                    updateCookieConsent(false, true)
                    handleCloseBanner()
                  },
                }}
              />
            </div>
            <div className="">
              <CMSLink
                data={{
                  label: 'Dismiss',
                }}
                look={{
                  theme: 'light',
                  type: 'button',
                  size: 'small',
                  width: 'full',
                  variant: 'blocks',
                  icon: {
                    content: <XIcon className="!ml-0" strokeWidth={1.25} />,
                    iconPosition: 'right',
                  },
                }}
                actions={{
                  onClick: () => {
                    updateCookieConsent(true, false)
                    handleCloseBanner()
                  },
                }}
              />{' '}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
