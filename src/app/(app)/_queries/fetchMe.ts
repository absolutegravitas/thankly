import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { User } from '@/payload-types'
// import { ME_QUERY } from './graphql/me'
import { payloadToken } from './token'

export const fetchMe = async (args?: {
  nullUserRedirect?: string
  userRedirect?: string
}): Promise<{
  user: User
  token?: string
}> => {
  const { nullUserRedirect, userRedirect } = args || {}
  const cookieStore = cookies()
  const token = cookieStore.get(payloadToken)?.value

  const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['user'] },
    body: JSON.stringify({
      // query: ME_QUERY,
    }),
  })

  const json = await meUserReq.json()

  const user = json?.data?.meUser?.user

  if (userRedirect && meUserReq.ok && user) {
    redirect(userRedirect)
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect)
  }

  return {
    user,
    token,
  }
}
