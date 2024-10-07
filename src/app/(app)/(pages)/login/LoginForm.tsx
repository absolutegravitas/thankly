'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/(app)/_components/ui/button'
import { Input } from '@/app/(app)/_components/ui/input'
import { Separator } from '@/app/(app)/_components/ui/separator'
import { FaGoogle, FaLinkedin, FaFacebook } from 'react-icons/fa'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/account')
    }
  }

  const handleProviderSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/account' })
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>

      <div className="mt-6">
        <Separator className="my-4">
          <span className="px-2 text-sm text-gray-500">Or continue with</span>
        </Separator>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => handleProviderSignIn('google')}
            className="w-full"
          >
            <FaGoogle className="mr-2" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleProviderSignIn('linkedin')}
            className="w-full"
          >
            <FaLinkedin className="mr-2" />
            LinkedIn
          </Button>
          <Button
            variant="outline"
            onClick={() => handleProviderSignIn('facebook')}
            className="w-full"
          >
            <FaFacebook className="mr-2" />
            Facebook
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button variant="link" onClick={() => signIn('email')}>
          Sign in with Email
        </Button>
      </div>
    </div>
  )
}
