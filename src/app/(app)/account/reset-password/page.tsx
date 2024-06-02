import { fetchMe } from '@app/_queries/fetchMe'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { ResetPassword } from './page_client'

export default async (props: any) => {
  const { user } = await fetchMe()

  if (user) {
    redirect(
      `/account?error=${encodeURIComponent('You must be logged out to reset your password')}`,
    )
  }

  return <ResetPassword {...props} />
}

export const metadata: Metadata = {
  title: 'Reset Password | Payload Cloud',
  description: 'Reset your Payload Cloud password',
  openGraph: mergeOpenGraph({
    title: 'Reset Password | Payload Cloud',
    url: '/reset-password',
  }),
}
