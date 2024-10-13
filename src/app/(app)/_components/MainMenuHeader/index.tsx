/**
 * v0 by Vercel.
 * @see https://v0.dev/t/zB8XLVMSL82
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import Link from 'next/link'
import { Sheet, SheetTrigger, SheetContent } from '@app/_components/ui/sheet'
import { Button } from '@app/_components/ui/button'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import SideCart from '../SideCart'

// export default function MainMenuHeader() {
export const MainMenuHeader: React.FC<any> = ({ menu }: any) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 100)
      setScrollY(currentScrollY)
    }

    // Set initial scroll position
    handleScroll()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // <header
  //   className={`flex h-16 w-full items-center justify-between  px-4 md:px-6 transition-all duration-300 ease-in-out'
  //     // ${!isScrolled ? 'bg-background' : 'bg-transparent'}`}
  // >

  return (
    <header
      className={`flex h-16 w-full items-center justify-between px-4 md:px-6
        ${!isHomePage || isScrolled ? 'bg-white text-black border-b-grey-500 border-b border-solid' : 'bg-background text-white border-b-0'}
        ${isHomePage ? 'absolute w-screen transition-colors duration-300 ease-in-out' : ''}`}
    >
      <Link
        href="/"
        className="text-3xl font-bold font-['leaguespartan'] tracking-tighter"
        prefetch={false}
      >
        thankly
      </Link>
      <div className="flex items-center gap-6">
        <nav className="hidden items-center gap-6 md:flex">
          {(menu?.tabs || []).map((tab: any, tabIndex: any) => {
            return (
              <Link
                key={tabIndex}
                href={tab.link.url}
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                prefetch={false}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center ml-12 h-4">
          <Link
            href="/account"
            className="text-muted-foreground transition-colors hover:text-foreground mr-2"
            prefetch={false}
          >
            <UserIcon className="h-6 w-6" />
            <span className="sr-only">Login</span>
          </Link>
          <SideCart />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`md:hidden border-none bg-transparent`}
              >
                <MenuIcon
                  className={`h-6 w-6
     
                  `}
                />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-2 py-6">
                {(menu?.tabs || []).map((tab: any, tabIndex: any) => {
                  return (
                    <Link
                      key={tabIndex}
                      href={tab.link.url}
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      prefetch={false}
                    >
                      {tab.label}
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
