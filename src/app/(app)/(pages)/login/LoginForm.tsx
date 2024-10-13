'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/app/(app)/_components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaLinkedin } from 'react-icons/fa'
import { BsFacebook } from 'react-icons/bs'
import Link from 'next/link'

export default function LoginForm() {
  const handleProviderSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/account' })
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" className="mx-auto h-40 w-40">
          <g
            transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path
              d="M2930 3142 c-6 -2 -10 -172 -10 -478 l0 -474 95 0 95 0 0 110 c0 61
3 110 6 110 3 0 55 -49 116 -110 l110 -110 189 0 189 0 2 233 3 232 59 -105
c33 -58 81 -143 107 -189 28 -49 45 -89 40 -95 -4 -6 -49 -91 -100 -189 l-92
-177 116 0 115 0 51 103 c28 56 93 181 144 277 166 315 245 468 245 474 0 3
-50 6 -111 6 l-110 0 -57 -122 c-32 -68 -62 -134 -68 -147 -10 -23 -16 -14
-90 122 l-79 147 -87 0 -88 0 0 190 c0 105 -3 190 -7 190 -5 1 -46 2 -93 3
l-85 2 -3 -193 -2 -192 -108 0 -107 0 -95 -95 c-52 -52 -98 -95 -102 -95 -5 0
-8 128 -8 285 0 265 -1 285 -17 286 -10 0 -48 1 -86 2 -37 1 -72 1 -77 -1z
m600 -652 c0 -121 -3 -220 -8 -220 -4 0 -57 49 -117 110 l-109 109 109 111
c60 60 113 110 117 110 4 0 8 -99 8 -220z"
            />
            <path
              d="M1010 2950 l0 -190 -55 0 -55 0 0 105 0 105 -100 0 -100 0 0 -105 0
-105 -40 0 -40 0 0 -75 0 -75 39 0 40 0 3 -147 c3 -131 6 -153 27 -196 17 -34
34 -53 64 -68 44 -23 71 -25 274 -14 l131 7 4 180 3 180 37 34 c28 25 47 34
74 34 91 0 104 -32 104 -255 l0 -175 100 0 100 0 0 77 0 77 28 -45 c37 -56 56
-73 117 -100 74 -33 166 -30 233 6 29 16 52 32 52 37 0 4 5 8 10 8 6 0 10 -13
10 -30 l0 -30 95 0 95 0 0 285 0 286 -97 -3 c-95 -3 -98 -4 -97 -25 1 -24 -10
-30 -22 -12 -15 26 -99 52 -164 52 -105 0 -187 -46 -236 -129 l-27 -46 -13 37
c-24 72 -85 116 -188 136 -61 11 -116 -2 -173 -42 l-43 -30 0 220 0 221 -95 0
-95 0 0 -190z m-1 -487 c0 -101 -3 -141 -9 -125 -8 20 -14 22 -44 17 -48 -10
-56 11 -56 144 l0 111 55 0 55 0 -1 -147z m969 139 c70 -21 109 -112 79 -184
-39 -92 -180 -103 -230 -19 -25 42 -23 121 5 156 35 45 90 62 146 47z"
            />
            <path
              d="M2594 2766 c-23 -7 -58 -26 -78 -41 l-36 -27 0 31 0 31 -95 0 -95 0
0 -285 0 -285 94 0 94 0 4 181 3 181 37 34 c28 25 47 34 74 34 91 0 104 -32
104 -255 l0 -175 100 0 100 0 0 198 c0 108 -5 214 -11 235 -29 105 -182 179
-295 143z"
            />
          </g>
        </svg>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign Up or Login to your Account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 #shadow #sm:rounded-lg sm:px-10">
          <div>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('facebook')}
                className="w-full flex items-center justify-center py-3 text-base font-medium"
              >
                <BsFacebook className="mr-3 h-6 w-6 text-[#1877F2]" />
                Sign in with Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('google')}
                className="w-full flex items-center justify-center py-3 text-base font-medium"
              >
                <FcGoogle className="mr-3 h-6 w-6" />
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProviderSignIn('linkedin')}
                className="w-full flex items-center justify-center py-3 text-base font-medium"
              >
                <FaLinkedin className="mr-3 h-6 w-6 text-[#0A66C2]" />
                Sign in with LinkedIn
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            We use this info to allow you to manage your orders and other information with us. See
            our{' '}
            <Link href="/privacy" className="font-medium underline">
              Privacy Policy{' '}
            </Link>
            for details.
          </p>
        </div>
      </div>
    </div>
  )
}
