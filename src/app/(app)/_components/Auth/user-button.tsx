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

export default function UserButton() {
  const { status, data: session } = useSession()

  //check if image available
  const hasProfileImage = session?.user.image !== null && session?.user.image.length > 0

  if (status == 'authenticated') {
    console.log(session)
  }

  return (
    <>
      {status !== 'loading' && (
        <div className="flex items-center px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="inline-flex items-center justify-center p-0 w-fit h-fit bg-transparent border-none">
                {!hasProfileImage && <Avatar name={session?.user.name} variant="beam" size={26} />}
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
              className="bg-white border border-gray-200 shadow-lg rounded-md p-1"
              align="end"
              forceMount
            >
              {status === 'unauthenticated' && (
                <DropdownMenuItem className="flex items-center justify-center p-2">
                  <Button
                    // href="/api/auth/signin"
                    onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
                    className="w-full text-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300"
                  >
                    Sign In
                  </Button>
                </DropdownMenuItem>
              )}
              {status === 'authenticated' && (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session?.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="flex items-center justify-center p-2">
                    <Button
                      onClick={() => signOut({ callbackUrl: window.location.href })}
                      // href="/api/auth/signout"
                      className="w-full text-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition-colors duration-300"
                    >
                      Sign Out
                    </Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  )
}
