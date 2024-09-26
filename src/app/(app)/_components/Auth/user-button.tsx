import { Button } from './ui/button'
import Avatar from 'boring-avatars'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { CMSLink } from '../CMSLink'
import { LogInIcon } from 'lucide-react'

export default function UserButton() {
  //fetch session data
  const { status, data: session } = useSession()

  //check if image available
  const hasProfileImage = session?.user.image !== null && session?.user.image.length > 0

  return (
    <>
      {status !== 'loading' && (
        <div className="flex items-center px-2">
          {status === 'unauthenticated' || session === null ? (
            <div
              className="cursor-pointer flex gap-1 justify-between hover:cursor-pointer no-underline hover:no-underline  rounded-sm transition   text-neutral-800 bg-white hover:font-medium"
              onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
            >
              <span>Sign In</span>
              <LogInIcon />
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="inline-flex items-center justify-center p-0 w-fit h-fit bg-transparent border-none">
                  {!hasProfileImage && (
                    <Avatar name={session?.user.name} variant="beam" size={26} />
                  )}
                  {hasProfileImage && (
                    <div
                      className="relative rounded-full overflow-hidden"
                      // style={{ width: 26, height: 26 }}
                    >
                      <Image
                        src={session?.user.image}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        width={20}
                        height={20}
                      />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-neutral-100 mt-2 w-52 border border-solid  shadow-md rounded-sm px-6 py-6"
                align="end"
                forceMount
              >
                {status === 'authenticated' && (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium leading-none">
                          {session?.user.name}
                        </span>
                        <span className="text-xs leading-none text-muted-foreground">
                          {session?.user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="flex items-center justify-center p-2">
                      <CMSLink
                        data={{
                          label: 'Sign Out',
                          type: 'custom',
                          url: '#',
                        }}
                        look={{
                          theme: 'light',
                          type: 'button',
                          size: 'medium',
                          width: 'full',
                          variant: 'blocks',
                        }}
                        actions={{
                          onClick: () => signOut({ callbackUrl: window.location.href }),
                        }}
                        // className="!bg-green !text-white"
                      />
                      {/* <Button
                      onClick={() => signOut({ callbackUrl: window.location.href })}
                      className="w-full text-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300"
                    >
                      Sign Out
                    </Button> */}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </>
  )
}
