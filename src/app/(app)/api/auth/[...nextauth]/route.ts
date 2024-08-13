// old logic... commented out so that I can build up again and better understand it (alecaz)
// import { handlers } from '@/utilities/auth'
// export const { GET, POST } = handlers

import NextAuth from "next-auth"

// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'

// import { PayloadAuthAdapter } from '@/adapters/payloadAuthAdapter'

import GoogleProvider from "next-auth/providers/google";
import LinkedIn from 'next-auth/providers/linkedin'
import Facebook from 'next-auth/providers/facebook'

// const payload = async () => {
//   const config = await configPromise;
//   const payload = await getPayloadHMR({ config });
//     // console.log("payload --",payload)
//   return payload
// }

const handler = NextAuth({
  
  // adapter: PayloadAuthAdapter(),
  
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
  ]
})

export { handler as GET, handler as POST }