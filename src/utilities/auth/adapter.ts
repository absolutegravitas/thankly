
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from 'next-auth/adapters'
import { createDate, isWithinExpirationDate, TimeSpan } from '../isWithinExperationDate';
import { BrightConsoleLog } from '../brightConsoleLog';
import { createUser } from './createUser';
import { getUser } from './getUser';
import { getUserByEmail } from './getUserByEmail';
import { getUserByAccount } from './getUserByAccount';
import { updateUser } from './updateUser';
import { deleteUser } from './deleteUser';
import { linkAccount, unlinkAccount } from './linkAccount';
import { createSession, deleteSession, getSessionAndUser, updateSession } from './session';
import { createVerificationToken, useVerificationToken } from './verificationToken';

  
export function PayloadAdapter(payload: any, options = {}): Adapter {

  return {
    async createUser(user: Omit<AdapterUser, "id">) : Promise<AdapterUser> {
      return await createUser(payload, user)
    },
    async getUser(id: string) : Promise<AdapterUser | null> {
      return await getUser(payload, id)
    },
    async getUserByEmail(email : string) : Promise<AdapterUser | null> {
      return await getUserByEmail(payload, email)
    },
    async getUserByAccount({ providerAccountId, provider }) : Promise<AdapterUser | null> {
      return await getUserByAccount(payload, { providerAccountId, provider })
    },

    async updateUser(data : Partial<AdapterUser> & Pick<AdapterUser, "id">) : Promise<AdapterUser> {
      return await updateUser(payload, data)
    },

    async deleteUser(userId: string) : Promise<AdapterUser | null | undefined> {
      return await deleteUser(payload, userId)
    },

    async linkAccount(account : AdapterAccount) : Promise<AdapterAccount | null | undefined> {
      return await linkAccount(payload, account)
    },
    
    async unlinkAccount({ providerAccountId, provider }) : Promise<AdapterAccount | undefined> {
      return await unlinkAccount(payload, { providerAccountId, provider })
    },

    async createSession({ sessionToken, userId, expires }) : Promise<AdapterSession> {
      return await createSession(payload, {sessionToken, userId, expires})
    },

    async getSessionAndUser(sessionToken : string) : Promise<{ session: AdapterSession; user: AdapterUser; } | null> {
      return await getSessionAndUser(payload, sessionToken)
    },

    async updateSession({ sessionToken, expires }) : Promise<undefined | null | AdapterSession> {
      return await updateSession(payload, { sessionToken, expires })
    },

    async deleteSession(sessionToken) : Promise<void> {
      return await deleteSession(payload, sessionToken)
    }, 

    async createVerificationToken({ identifier, expires, token }) : Promise<undefined | null | VerificationToken> {
      return await createVerificationToken(payload, { identifier, expires, token })
    },

    async useVerificationToken({ identifier, token }) : Promise<null | VerificationToken> {
      return await useVerificationToken(payload, { identifier, token })
    },
  }
}