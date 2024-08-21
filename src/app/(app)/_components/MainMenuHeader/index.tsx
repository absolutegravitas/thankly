/**
 * v0 by Vercel.
 * @see https://v0.dev/t/zB8XLVMSL82
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import Link from 'next/link'
import { Sheet, SheetTrigger, SheetContent } from '@app/_components/ui/sheet'
import { Button } from '@app/_components/ui/button'

// export default function MainMenuHeader() {
export const MainMenuHeader: React.FC<any> = ({ menu }: any) => {
  return (
    <header className="flex h-16 w-full items-center justify-between bg-background px-4 md:px-6">
      <Link href="#" className="text-2xl font-bold font-['leaguespartan']" prefetch={false}>
        thankly
      </Link>
      <div className="flex items-center gap-6">
        <nav className="hidden items-center gap-6 md:flex">
          {(menu?.tabs || []).map((tab: any, tabIndex: any) => {
            return (
              <Link
                href={tab.link.url}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                prefetch={false}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
        <div className="flex items-center gap-4 ml-12">
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
            prefetch={false}
          >
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">Login</span>
          </Link>
          <Link
            href="#"
            className="relative text-muted-foreground transition-colors hover:text-foreground"
            prefetch={false}
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            <div
              className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground ${
                0 === 0 ? 'hidden' : ''
              }`}
            >
              {0}
            </div>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-2 py-6">
                {(menu?.tabs || []).map((tab: any, tabIndex: any) => {
                  return (
                    <Link
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

function ShoppingCartIcon(props: any) {
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
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
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
