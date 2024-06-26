import { fetchMe } from '@app/_queries/fetchMe'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ForgotPassword } from './page_client'

export default async (props: any) => {
  const { user } = await fetchMe()

  if (user) {
    redirect(
      `/account?error=${encodeURIComponent('You must be logged out to reset your password')}`,
    )
  }

  return <ForgotPassword {...props} />
}

export const metadata: Metadata = {
  title: 'Forgot Password | Payload Cloud',
  description: 'If you forgot your password, reset it',
  openGraph: mergeOpenGraph({
    title: 'Forgot Password | Payload Cloud',
    url: '/forgot-password',
  }),
}
