'use client'

import * as React from 'react'
import Link from 'next/link'

import { usePrivacy } from '@app/_providers/Privacy'

import classes from './index.module.scss'
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
        className={[classes.privacyBanner, animateOut && classes.animateOut]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={classes.contentWrap}>
          <p className={classes.content}>
            {`We use cookies, subject to your consent, to analyze the use of our website and to ensure
            you get the best experience. Read our `}
            <Link href="/privacy" className={classes.privacyLink} prefetch={false}>
              cookie policy
            </Link>{' '}
            for more information.
          </p>

          <div className="flex flex-row py-4 sm:py-4 gap-1 dark">
            <div className="">
              <CMSLink
                data={{
                  label: 'Accept',
                  // type: 'custom',
                  // url: '/shop/cart',
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
                  // type: 'custom',
                  // url: '/shop',
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
