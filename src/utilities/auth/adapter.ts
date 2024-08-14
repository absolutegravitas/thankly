
import type { BasePayload, CustomPayloadRequestProperties } from 'payload'
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from 'next-auth/adapters'
// import { Awaitable } from 'next-auth';
import { User } from '@/payload-types';
import { userAgent } from 'next/server';
import { createDate, isWithinExpirationDate, TimeSpan } from '../isWithinExperationDate';
import { BrightConsoleLog } from '../brightConsoleLog';

// const SESSION_STRATEGY = 'jwt' as 'jwt' | 'database'
const SESSION_MAX_AGE = 86400 //in seconds (86400 = 60 * 60 * 24 = 24 hours)
const USER_COLLECTION = 'users' as const
const SESSION_COLLECTION = 'sessions' as const
const DEFAULT_USER_ROLE = 'customer' as const
const FIELDS_USER_IS_ALLOWED_TO_CHANGE = ['name']
const PROVIDER_SEARCH_STRING_SPLITTER = '===='
// const ADMIN_ACCESS_ROLES = ['admin']


// declare module '@auth/core/adapters' {
//   // @ts-ignore
//   interface AdapterUser extends BaseAdapterUser, User {}
// }

const toAdapterUser = (payloadUser: User) : AdapterUser => ({
  ...payloadUser,
  id: String(payloadUser.id),
  email: payloadUser.email,
  image: payloadUser.imageUrl,
  emailVerified: payloadUser?.emailVerified ? new Date(payloadUser.emailVerified) : null,
  name: payloadUser.firstName + ' ' + payloadUser.lastName //TODO: Improve this logic.. why does auth not have name split??
})

function splitName(fullName: string | null | undefined): { firstName: string; lastName: string } {
  if (fullName === undefined || fullName === null || fullName.trim() === '') {
    return { firstName: '', lastName: '' };
  }

  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 1) {
    return { firstName: nameParts[0], lastName: '' };
  }
  
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  return { firstName, lastName };
}

function getProviderSearchString(providerId: string, providerAccountId: string) : string {
  return providerId + PROVIDER_SEARCH_STRING_SPLITTER + providerAccountId;
}

function splitProviderSearch(searchString: string): { providerId: string, providerAccountId: string } {
  const [providerId, providerAccountId] = searchString.split(PROVIDER_SEARCH_STRING_SPLITTER);
  return { providerId, providerAccountId };
}

const toPayloadAccount = (adapterAccount: AdapterAccount) => ({
  provider: adapterAccount.provider,
  providerAccountId: adapterAccount.providerAccountId,
  providerSearchString: getProviderSearchString(adapterAccount.provider, adapterAccount.providerAccountId)
})

const getUserByAcc = async ({
  payload,
  providerAccountId,
  provider
}: {
  payload: any
  providerAccountId: string
  provider: string
}): Promise<User | null> => {

  const provderSearchString = { providerAccountId, provider }

  try {
    const { docs } = await (
      await payload
    ).find({
      collection: USER_COLLECTION,
      depth: 1,
      limit: 1,
      where: {
        'accounts.providerSearchString': { equals: getProviderSearchString(provider, providerAccountId) }
      }
    })

    process.env.AUTH_VERBOSE ? console.error("DEBUG: payload returned was:", docs) : undefined;

    return docs.at(0) ?? null
  } catch (error) {
    console.error(`Error fetching user by account id (id=${providerAccountId})`, error)
  }
  return null
}
  
export function PayloadAdapter(payload: any, options = {}): Adapter {

  return {
    async createUser(user: Omit<AdapterUser, "id">) : Promise<AdapterUser> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: createUser input:', user) : undefined;
  
      //check if user already exists
      try {
        const { docs } = await (await payload).find({
          collection: USER_COLLECTION,
          where: {email: { equals: user.email }},
          depth: 0,
          limit: 1,
        })

        //if user exists, return that user
        if (docs.length !== 0) {
          const payloadUser = docs[0]
          const adapterUser = toAdapterUser(payloadUser);
          
          if (payloadUser.status !== 'active') {
            process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: createUser: User ${payloadUser.id} (${payloadUser.email}) already exists and is inactive.`) : undefined;
          } else {
            process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: createUser: User ${payloadUser.id} (${payloadUser.email}) already exists.`) : undefined;
          }

          return adapterUser;
        }
      } catch (error) {
        console.error(`Error fetching user: ${user.email}`, error)
      }

      //split name
      const {firstName, lastName} = splitName(user.name);

      //otherwise create user
      const newPayloadUser : User = await (await payload).create({
        collection: USER_COLLECTION,
        data: {
          email: user.email,
          firstName: firstName,
          lastName: lastName,
          password: 'password',
          roles: [DEFAULT_USER_ROLE],
          status: 'active',
        }
      })

      if (process.env.AUTH_VERBOSE) {
        BrightConsoleLog(`PayloadAdapter: createUser: User ${newPayloadUser.id} (${newPayloadUser.email}) created.`)
      }

      return toAdapterUser(newPayloadUser);
    },

    async getUser(id: string) : Promise<AdapterUser | null> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: createUser input:', id) : undefined;
      try {
        const payloadUser = await (await payload).findByID({
          collection: USER_COLLECTION,
          id: id,
          depth: 0,
        })

        //if user not found or is inactive, return null
        if (!payloadUser) {
          process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUser: User ${id} not found.`) : undefined
          return null;
        } else if (payloadUser.status !== 'active') {
          process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUser: User ${id} (${payloadUser.email}) found but is inactive`) : undefined
          return null;
        }

        //else return found user
        const user = toAdapterUser(payloadUser);
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUser: User ${user.id} (${user.email}) found.`) : undefined;

        return user;
        
      } catch (error) {
        console.error(`Error fetching user id: ${id}`, error)
      }
      // catch all return null
      return null
    },

    async getUserByEmail(email : string) : Promise<AdapterUser | null> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: getUserByEmail input:', email) : undefined;
      try {
        const { docs } = await (await payload).find({
          collection: USER_COLLECTION,
          where: { email: { equals: email }},
          depth: 0,
          limit: 1,
        })
        const payloadUser = docs[0]

        //if user not found or is inactive, return null
        if (!payloadUser) {
          process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUserByEmail: User email ${email} not found.`) : undefined
          return null;
        } else if (payloadUser.status !== 'active') {
          process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUserByEmail: User ${payloadUser.id} (${payloadUser.email}) found but is inactive`) : undefined
          return null;
        }

        //else return found user
        const user = toAdapterUser(docs[0]);
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUserByEmail: User ${user.id} (${user.email}) found.`) : undefined;
        return user;
        
      } catch (error) {
        console.error(`Error fetching user email: ${email}`, error)
      }
      // catch all return null
      return null
    },

    async getUserByAccount({ providerAccountId, provider }) : Promise<AdapterUser | null> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUserByAccount input: ProviderAccountId:${providerAccountId}, Provider:${provider}.`) : undefined
      
      //fetch user by account
      const user = await getUserByAcc({payload, providerAccountId, provider})

      if (process.env.AUTH_VERBOSE) {
        if (!user)
          BrightConsoleLog(`PayloadAdapter: getUserByAccount: User not found (ProviderAccountId:${providerAccountId}, Provider:${provider}.`)
        else if (user.status !== 'active')
          BrightConsoleLog(`PayloadAdapter: getUserByAccount: User ${user.id} (${user.email}) found but is inactive.`)
        else
          BrightConsoleLog(`PayloadAdapter: getUserByAccount: User ${user.id} (${user.email}) found.`)
      }

      return (user && user.status === 'active') ? toAdapterUser(user) : null
    },

    async updateUser(data : Partial<AdapterUser> & Pick<AdapterUser, "id">) : Promise<AdapterUser> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: updateUser input:', data) : undefined;
      //filter out data that is not allowed to be changed by the user
      const userId = data.id
      Object.keys(data).forEach((key) => {
        if (!(FIELDS_USER_IS_ALLOWED_TO_CHANGE || []).includes(key) && key in data) {
          // @ts-ignore
          delete data[key]
        }
      })

      const { docs } = await (
        await payload
      ).update({
        collection: USER_COLLECTION,
        id: userId,
        // @ts-ignore
        data
      })
      const user = docs.at(0)
      if (!user) {
        throw new Error('PayloadAdapter: updateUser: no user found')
      }

      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: updateUser: User ${user.id} (${user.email}) has been updated.`) : undefined

      return toAdapterUser(user)
    },

    async deleteUser(userId: string) : Promise<AdapterUser | null | undefined> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: deleteUser input:', userId) : undefined;
      //don't actually delete - just mark as Inactive... TODO... handle this elsewhere
      await (
        await payload
      ).update({
        collection: USER_COLLECTION,
        id: userId,
        data: {
          status: 'inactive'
        }
      })

      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: deleteUser: User ${userId} has been updated to now be inactive.`) : undefined

      return
    },

    async linkAccount(account : AdapterAccount) : Promise<AdapterAccount | null | undefined> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: linkAccount input:', account) : undefined;

      //fetch user
      const payloadUser = await (
        await payload
      ).findByID({
        collection: USER_COLLECTION,
        id: account.userId
      })

      //if user not found or is inactive, return null
      if (!payloadUser) {
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: linkAccount: User ${account.userId} not found.`) : undefined
        return null;
      } else if (payloadUser.status !== 'active') {
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: linkAccount: User ${payloadUser.id} (${payloadUser.email}) found but is inactive`) : undefined
        return null;
      }

      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: linkAccount: User ${payloadUser.id} (${payloadUser.email}) found`) : undefined

      //check if account to unlink exists, and return the adapter if it does
      //TODO: Confirm if this logic is required.
      const existingAccount = payloadUser.accounts.filter((acc : AdapterAccount) => acc.provider === account.provider && acc.providerAccountId === account.providerAccountId)
      if (existingAccount.length > 0) {
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: linkAccount: User ${payloadUser.id} (${payloadUser.email}) found but already has account for ${account.provider} linked.`) : undefined;
        return existingAccount;
      }

      //update user with the account
      const updatedUser = await (
        await payload
      ).update({
        collection: USER_COLLECTION,
        id: account.userId,
        data: {
          accounts: [...(payloadUser.accounts || []), toPayloadAccount(account)]
        }
      })
      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: linkAccount: User ${payloadUser.id} (${payloadUser.email}) now linked to provider ${account.provider}`) : undefined;

      return
    },
    
    async unlinkAccount({ providerAccountId, provider }) : Promise<AdapterAccount | undefined> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: unlinkAccount input:', 'providerAccountId:', providerAccountId, 'provider', provider) : undefined;
      const user = await getUserByAcc({ payload, providerAccountId, provider })
      
      if (process.env.AUTH_VERBOSE) {
        if (!user)
          BrightConsoleLog(`PayloadAdapter: unlinkAccount: User not found (ProviderAccountId:${providerAccountId}, Provider:${provider}.`)
        else if (user.status !== 'active')
          BrightConsoleLog(`PayloadAdapter: unlinkAccount: User ${user.id} (${user.email}) found but is inactive.`)
        else if (!Array.isArray(user?.accounts))
          BrightConsoleLog(`PayloadAdapter: unlinkAccount: User ${user.id} (${user.email}) found but is missing account links.`)
        else
          BrightConsoleLog(`PayloadAdapter: unlinkAccount: User ${user.id} (${user.email}) found.`)
      }
      
      //if user not found, is inactive, or has not account links, return null
      if (!user || user.status !== 'active' || !Array.isArray(user?.accounts)) return;

      //check if account to unlink exists, if it doesn't return null
      const filteredAccount = user.accounts.filter((account) => account.provider === provider && account.providerAccountId === providerAccountId)
      if (!filteredAccount) {
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: unlinkAccount: User ${user.id} (${user.email}) found but no account for ${provider} is linked.`) : undefined;
        return;
      }

      // update account with the account list that has account in question filtered out.
      const updatedAccounts = user.accounts.filter((account) => account.provider !== provider || account.providerAccountId !== providerAccountId)
      await (
        await payload
      ).update({
        collection: USER_COLLECTION,
        id: user.id,
        data: {
          accounts: updatedAccounts
        }
      })

      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: unlinkAccount: User ${user.id} (${user.email}) found.`) : undefined
      
      return
    },

    async createSession({ sessionToken, userId, expires }) : Promise<AdapterSession> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: createSession input: sessionToken ${sessionToken} userId: ${userId} expires: ${expires}`) : undefined;
console.log("DEBUG1")
      //fetch user to check if active first
      const user = await (
        await payload
      ).findByID({
        collection: USER_COLLECTION,
        id: userId,
        depth: 0,
      })
      console.log("DEBUG2")
      //check if user found
      if (process.env.AUTH_VERBOSE) {
        if (!user)
          BrightConsoleLog(`PayloadAdapter: createSession output: User not found.`)
        else if (user.status !== 'active')
          BrightConsoleLog(`PayloadAdapter: createSession output: User found but is inactive.`)
      }
      if(!user || user.status !== 'active') throw new Error(`Could not create session for user ${userId}. User not found or is inactive.`);
      console.log("DEBUG3")
      const session = await (
        await payload
      ).create({
        collection: SESSION_COLLECTION,
        data: {
          sessionToken:sessionToken,
          user: parseInt(userId),
          expires: expires.toISOString() 
        }
      })
      console.log("DEBUG4")
      const sessionUserId = typeof session?.user === 'string' ? session?.user : session?.user?.id
      const sessionExpires = session?.expires ? new Date(session.expires) : createDate(new TimeSpan(SESSION_MAX_AGE, 's'));
      
      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: createSession output: sessionToken ${session?.sessionToken} userId: ${sessionUserId} expires: ${sessionExpires}`) : undefined;
      console.log("DEBUG5")
      return {
        sessionToken: session?.sessionToken,
        userId: sessionUserId,
        expires: sessionExpires
      }
    },

    async getSessionAndUser(sessionToken : string) : Promise<{ session: AdapterSession; user: AdapterUser; } | null> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: getSessionAndUser input:', sessionToken) : undefined;

      const { docs: sessions } = await (
        await payload
      ).find({
        collection: SESSION_COLLECTION,
        depth: 1, // So that we get user object aswell.
        where: { sessionToken: { equals: sessionToken } }
      })
      const session = sessions.at(0)

      if (process.env.AUTH_VERBOSE) {
        if (!session)
          BrightConsoleLog(`PayloadAdapter: getSessionAndUser: Session ${sessionToken} not found.`)
        else if (!session.user || typeof session.user !== 'object')
          BrightConsoleLog(`PayloadAdapter: getSessionAndUser: User for session ${sessionToken} not found.`)
        else if (session.user.status !== 'active')
          BrightConsoleLog(`PayloadAdapter: getSessionAndUser: User ${session.user.id} (${session.user.email}) for session ${sessionToken} is inactive.`)
      }

      if (!session || !session.user || typeof session.user !== 'object' || session.user.status !== 'active') return null

      const sessionExpires = new Date(session?.expires || 0)

      if (!isWithinExpirationDate(sessionExpires)) {
        await (
          await payload
        ).delete({
          collection: SESSION_COLLECTION,
          where: { sessionToken: { equals: sessionToken } }
        })
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getSessionAndUser: Deleted expired session ${sessionToken} for user ${session.user.id} (${session.user.email}).`) : undefined
        return null
      }

      //otherwise
      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getSessionAndUser: Valid session ${sessionToken} found, expires: ${session.expires.toISOString()}`) : undefined;

      return {
        session: {
          sessionToken: session?.sessionToken,
          userId: typeof session?.user === 'string' ? session?.user : session?.user?.id,
          expires: new Date(session?.expires || 0)
        },
        user: toAdapterUser(session?.user)
      }
    },

    async updateSession({ sessionToken, expires }) : Promise<undefined | null | AdapterSession> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: updateSession input:', 'sessionToken:', sessionToken, 'expires', expires) : undefined;

      //fetch session from payload
      const { docs } = await (
        await payload
      ).find({
        collection: SESSION_COLLECTION,
        where: { sessionToken: { equals: sessionToken }}
      })
      const session = docs.at(0)
      
      //If session can not be found, return null
      if (!session || !expires) {
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: updateSession: Session ${sessionToken} not found or new expiry (${expires}) was undefined.`) : undefined;
        return null
      }

      const updatedSession = await (
        await payload
      ).update({
        collection: SESSION_COLLECTION,
        id: session.id,
        data: { expires: expires.toISOString() }
      })
      const sessionUserId = typeof updatedSession?.user === 'string' ? updatedSession?.user : updatedSession?.user?.id

      BrightConsoleLog(`PayloadAdapter: updateSession: Valid session ${sessionToken} found and has been updated.`);

      return {
        sessionToken: updatedSession?.sessionToken,
        userId: sessionUserId,
        expires: new Date(updatedSession?.expires || 0)
      }
    },

    async deleteSession(sessionToken) : Promise<void> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: deleteSession input:', 'sessionToken:', sessionToken) : undefined;
      await (
        await payload
      ).delete({
        collection: SESSION_COLLECTION,
        where: { sessionToken: { equals: sessionToken } }
      })
      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: deleteSession: Session ${sessionToken} deleted.`) : undefined;
    },    

    async createVerificationToken({ identifier, expires, token }) : Promise<undefined | null | VerificationToken> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: createVerificationToken input:', 'identifier:', identifier, 'expires:', expires, 'token:', token) : undefined;
      //fetch user
      const { docs } = await (
        await payload
      ).find({
        collection: USER_COLLECTION,
        where: { email: { equals: identifier } }
      })
      const user = docs.at(0)
      
      //check if user found
      if (process.env.AUTH_VERBOSE) {
        if (!user)
          BrightConsoleLog(`PayloadAdapter: createVerificationToken output: User ${identifier} not found.`)
        else if (user.status !== 'active')
          BrightConsoleLog(`PayloadAdapter: createVerificationToken output: User ${identifier} found but is inactive.`)
      }
      if(!user || user.status !== 'active') return null;
      
      await (
        await payload
      ).update({
        collection: USER_COLLECTION,
        id: user.id,
        data: {
          verificationTokens: [...(user?.verificationTokens || []), { identifier, token, expires: expires.toISOString() }]
        }
      })

      process.env.AUTH_VERBOSE ? BrightConsoleLog(`createVerificationToken: createVerificationToken: New verification token created for User ${user.id}.`) : undefined;

      return {
        token,
        expires,
        identifier
      }
    },

    async useVerificationToken({ identifier, token }) : Promise<null | VerificationToken> {
      process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: useVerificationToken input:', 'identifier:', identifier, 'token:', token) : undefined;
      //fetch user
      const { docs } = await (
        await payload
      ).find({
        collection: USER_COLLECTION,
        where: { email: { equals: identifier } }
      })
      const user = docs.at(0)
      
      //check if user found
      if (process.env.AUTH_VERBOSE) {
        if (!user)
          BrightConsoleLog(`PayloadAdapter: useVerificationToken output: User ${identifier} not found.`)
        else if (user.status !== 'active')
          BrightConsoleLog(`PayloadAdapter: useVerificationToken output: User ${identifier} found but is inactive.`)
      }
      if(!user || user.status !== 'active') return null;
      
      //check if token exists, if it doesn't return null
      const filteredToken = user.verificationTokens.filter((t : any) => t.identifier === identifier && t.token === t.token)
      if (!filteredToken) {
        process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: useVerificationToken: Token ${token} not found for user ${user.id} (${user.email}).`) : undefined;
        return null;
      }

      // update user with the token list that has the token in question filtered out.
      const updatedTokens = user.accounts.filter((t : any) => t.identifier !== identifier || t.token !== token)
      await (
        await payload
      ).update({
        collection: USER_COLLECTION,
        id: user.id,
        data: {
          verificationTokens: [...updatedTokens]
        }
      })
      process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: useVerificationToken: Token found and use been removed for User ${user}.`) : undefined;
      return filteredToken;
    },
  }
}