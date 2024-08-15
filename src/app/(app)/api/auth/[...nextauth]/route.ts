import NextAuth from "next-auth"

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

import { PayloadAdapter } from '@/utilities/auth/adapter'

import GoogleProvider from "next-auth/providers/google";
import LinkedIn from 'next-auth/providers/linkedin'
import Facebook from 'next-auth/providers/facebook'

async function getPayload() {
  const config = await configPromise
  const payload: any = await getPayloadHMR({ config })
  return payload
} 

const handler = NextAuth({
  adapter: PayloadAdapter(getPayload()),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_ID!,
      clientSecret: process.env.LINKEDIN_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log("---------------------MAYBE WORK THIS TIME-------------------!!!!!!!!!!!!!!!")
      console.log("---------------------MAYBE WORK THIS TIME-------------------!!!!!!!!!!!!!!!")
      console.log("---------------------MAYBE WORK THIS TIME-------------------!!!!!!!!!!!!!!!")
      console.log(user);
      session.user.id = user.id;
      return session;
    },
  },
})

export { handler as GET, handler as POST }


