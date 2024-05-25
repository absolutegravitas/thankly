import 'server-only'
import { payload } from '@/utilities/getPayload'
import { users } from '@cms/_collections/users'
// import { COLLECTION_SLUG_USER } from '@/payload/collections/config'
import NextAuth from 'next-auth'
import { getFieldsToSign as getFieldsToSignPayload } from 'payload/auth'
import { PayloadAdapter } from './adapter'
import authConfig, { PAYLOAD_ADAPTER_CONFIG } from './config'
import { revalidateUser } from '../payload/actions'
import { User } from '@/payload-types'

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth(() => {
  return {
    adapter: PayloadAdapter(payload, PAYLOAD_ADAPTER_CONFIG),
    callbacks: {
      async jwt({ token, user }: any) {
        const userId = (token?.id || token?.sub || user?.id) as string | number
        const dbUser = await (
          await payload
        ).findByID({
          collection: 'users',
          id: userId,
        })
        const fieldsToSign = getFieldsToSignPayload({
          // @ts-ignore
          user: dbUser,
          email: dbUser.email,
          collectionConfig: users,
        })
        token = {
          ...token,
          ...(fieldsToSign || {}),
        }
        return token
      },
      async session({ session, token }: any) {
        session.user = session.user || {}
        if (!token) return session
        const fieldsToSign = getFieldsToSignPayload({
          // @ts-ignore
          user: token,
          email: session.user.email,
          collectionConfig: users,
        })

        session.user = {
          ...fieldsToSign,
          ...session.user,
          // @ts-ignore
          collection: 'users',
        }

        return session
      },
      async signIn({ user }: any) {
        revalidateUser(user as User, payload as any)
        return true
      },
    },
    ...authConfig,
  }
})
