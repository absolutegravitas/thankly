import NextAuth from "next-auth"

import { PayloadAdapter } from '@/utilities/auth/adapter'

import GoogleProvider from "next-auth/providers/google";
import LinkedIn from 'next-auth/providers/linkedin'
import Facebook from 'next-auth/providers/facebook'
import EmailProvider from 'next-auth/providers/email';

import { sendVerificationRequest } from "@/utilities/auth/resend";
import { getPayload } from "@/utilities/PayloadQueries/getPayload";

const handler = NextAuth({
  adapter: PayloadAdapter(getPayload()),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_ID!,
      clientSecret: process.env.LINKEDIN_SECRET!,
      allowDangerousEmailAccountLinking: true,
      client: { token_endpoint_auth_method: "client_secret_post" },
      // scope: "r_liteprofile r_emailaddress",
      issuer: "https://www.linkedin.com",
      userinfo: {
        url: "https://api.linkedin.com/v2/userinfo",
      },
      // tokenUri: "https://www.linkedin.com/oauth/v2/accessToken",
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        url: "https://www.linkedin.com/oauth/v2/authorization",
        params: {
          scope: "profile email openid",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
      },
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture
        };
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_ID!,
      clientSecret: process.env.FACEBOOK_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      from: process.env.RESEND_DEFAULT_EMAIL || 'no-reply@thankly.co',
      // Custom sendVerificationRequest() function
      sendVerificationRequest: sendVerificationRequest,   
    }),
  ],
  callbacks: {
    async session({ session, user}) {
      // console.log(user);
      console.log("DEBUG: SESSION:", session, "USER:", user)
      session.user.id = user.id;
      session.user.image = user.image;
      // session.user.stripeId = user.stripeId;

      return session;
    },
  },
})

export { handler as GET, handler as POST }


