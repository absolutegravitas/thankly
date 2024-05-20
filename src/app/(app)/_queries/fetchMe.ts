import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { User } from '@payload-types'
export const payloadCloudToken = 'payload-cloud-token'

export const fetchMe = async (args?: {
  nullUserRedirect?: string
  userRedirect?: string
}): Promise<{
  user: User
  token?: string
}> => {
  const { nullUserRedirect, userRedirect } = args || {}
  const cookieStore = cookies()
  const token = cookieStore.get(payloadCloudToken)?.value

  const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    next: { tags: ['user'] },
    body: JSON.stringify({
      query: ME_QUERY,
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

export const USER = `
  id
  name
  email
  roles
  teams {
    team {
      id
      name
      slug
      stripeCustomerID
    }
    roles
  }
`

export const ME_QUERY = `query {
  meUser {
    user {
      ${USER}
    }
    exp
  }
}`
