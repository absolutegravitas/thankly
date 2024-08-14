'use client'
import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useSearchParams } from 'next/navigation'
import { TopBar } from '@app/_components/TopBar'
import { UniversalTruth } from '@app/_components/UniversalTruth'
import { Menu } from '@payload-types'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { DesktopNav } from './DesktopNav'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav'

import classes from './index.module.scss'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import UserButton from '../Auth/user-button'

export const Header: React.FC<any> = ({ menu, topBar }: any) => {
  // const { status, data: session } = useSession()
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerTheme } = useHeaderObserver()
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(true)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  React.useEffect(() => {
    if (isHydrated) {
      if (isMobileNavOpen) {
        setHideBackground(false)
      } else {
        setHideBackground(y < 30)
      }
    }
  }, [y, isMobileNavOpen, isHydrated])

  if (!isHydrated) {
    return null
  }

  return (
    <div data-theme={headerTheme}>
      <header
        className={[
          classes.header,
          classes.headerSpacing,
          hideBackground && classes.hideBackground,
          isMobileNavOpen && classes.mobileNavOpen,
          headerTheme && classes.themeIsSet,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {topBar && <TopBar {...topBar} />}
        <DesktopNav tabs={menu?.tabs} hideBackground={hideBackground} />
        <MobileNav tabs={menu?.tabs} />
        <UserButton />

        {/* {status === 'authenticated' && (
          <div>
            {session.user!.name}
            <Link href="/api/auth/signout">Logout</Link>
          </div>
        )}
        {status === 'unauthenticated' && <Link href="/api/auth/signin">Login</Link>} */}
        <React.Suspense>
          <UniversalTruth />
        </React.Suspense>
      </header>
    </div>
  )
}
