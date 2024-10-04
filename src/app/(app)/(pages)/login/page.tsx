import React from 'react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/account')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <LoginForm />
    </div>
  )
}
