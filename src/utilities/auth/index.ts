// import NextAuth from 'next-auth'
// import { getPayloadHMR } from '@payloadcms/next/utilities'
// import configPromise from '@payload-config'
// import { PayloadAdapter } from './adapter'

// import GoogleProvider from "next-auth/providers/google";
// import LinkedIn from 'next-auth/providers/linkedin'
// import Facebook from 'next-auth/providers/facebook'
// // import Resend from "next-auth/providers/resend"

// async function getPayload() {
//   const config = await configPromise
//   const payload: any = await getPayloadHMR({ config })
//   return payload
// }

// export const handlers = NextAuth({
//   adapter: PayloadAdapter(getPayload()),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID!,
//       clientSecret: process.env.GOOGLE_SECRET!
//     }),
//     LinkedIn({
//       clientId: process.env.LINKEDIN_ID!,
//       clientSecret: process.env.LINKEDIN_SECRET!,
//     }),
//     Facebook({
//       clientId: process.env.FACEBOOK_ID!,
//       clientSecret: process.env.FACEBOOK_SECRET!,
//     }),
//     // Resend({
//     //   apiKey: process.env.RESEND_KEY,
//     //   from: 'no-reply@thankly.co',
//     // }),
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       console.log(user);
//       session.user.id = user.id;
//       return session;
//     },
//     // async signIn({ user, account, profile, email, credentials }) {
//     //   return true
//     // },
//     // async session({ session, user, token }) {
//     //   return {
//     //     ...session,
//     //     user: {
//     //       ...session.user,
//     //       id: token.sub
//     //     }
//     //   }
//     // },
//     // async jwt({ token, user, account, profile, isNewUser }) {
//     //   return token
//     // }
//   },
//   // session: {
//   //   strategy: 'jwt',
//   // },
// })
