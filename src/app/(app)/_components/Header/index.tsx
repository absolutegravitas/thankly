'use client'
import * as React from 'react'
import { useScrollInfo } from '@faceless-ui/scroll-info'
// import { TopBar } from '@app/_components/TopBar'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'

import cn from '@/utilities/cn'

export const Header: React.FC<any> = ({
  menu,
  // topBar
}: any) => {
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(true)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) return null

  return (
    // <div data-theme={headerTheme}>
    <header
      className={
        cn()
        // 'fixed top-0 flex items-center w-full z-40 transition-colors duration-300 max-w-full',
        // 'before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full #before:bg-white before:backdrop-blur-md before:opacity-100 before:z-[-1] before:transition-opacity before:duration-500 before:ease-out',
        // 'after:content-[""] after:block after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[-1] after:opacity-100 after:transition-opacity after:duration-500 after:ease-out',
        // headerTheme && 'themeIsSet',
        // hideBackground && 'hideBackground',
        // isMobileNavOpen && 'mobileNavOpen border-b border-neutral-300',
        // [
        //   headerTheme && [
        //     'before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full #before:bg-white before:backdrop-blur-md before:opacity-100 before:z-[-1] before:transition-opacity before:duration-500 before:ease-out',
        //     'after:content-[""] after:block after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[-1] after:opacity-100 after:transition-opacity after:duration-500 after:ease-out',
        //   ],
        // ],
        // 'sm:[&>*:before,&>*:after]:transition-opacity sm:[&>*:before,&>*:after]:duration-200 sm:[&>*:before,&>*:after]:ease-in-out',
        // [hideBackground && ['before:opacity-0', 'after:opacity-0']],
        // [isMobileNavOpen && ['before:opacity-100', 'after:opacity-100']],
      }
    >
      {/* {topBar && <TopBar {...topBar} />} */}
      <DesktopNav tabs={menu?.tabs} hideBackground={hideBackground} />
      <MobileNav tabs={menu?.tabs} />
    </header>
    // </div>
  )
}
