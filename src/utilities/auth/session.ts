import { AdapterSession, AdapterUser } from "next-auth/adapters";
import { BrightConsoleLog } from "../brightConsoleLog";
import { SESSION_COLLECTION, SESSION_MAX_AGE, toAdapterUser, USER_COLLECTION } from "./helperFunctions";
import { createDate, isWithinExpirationDate, TimeSpan } from "../isWithinExperationDate";

export async function createSession(payload : any, { sessionToken, userId, expires } : any) : Promise<AdapterSession> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: createSession input: sessionToken ${sessionToken} userId: ${userId} expires: ${expires}`) : undefined;
  //fetch user to check if active first
  const user = await (
    await payload
  ).findByID({
    collection: USER_COLLECTION,
    id: userId,
    depth: 0,
  })
  //check if user found
  if (process.env.AUTH_VERBOSE) {
    if (!user)
      BrightConsoleLog(`PayloadAdapter: createSession output: User not found.`)
    else if (user.status !== 'active')
      BrightConsoleLog(`PayloadAdapter: createSession output: User found but is inactive.`)
  }
  if(!user || user.status !== 'active') throw new Error(`Could not create session for user ${userId}. User not found or is inactive.`);
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
  const sessionUserId = typeof session?.user === 'string' ? session?.user : session?.user?.id
  const sessionExpires = session?.expires ? new Date(session.expires) : createDate(new TimeSpan(SESSION_MAX_AGE, 's'));
  
  process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: createSession output: sessionToken ${session?.sessionToken} userId: ${sessionUserId} expires: ${sessionExpires}`) : undefined;
  return {
    sessionToken: session?.sessionToken,
    userId: sessionUserId,
    expires: sessionExpires
  }
}

export async function getSessionAndUser(payload : any, sessionToken : string) : Promise<{ session: AdapterSession; user: AdapterUser; } | null> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: getSessionAndUser input:', sessionToken) : undefined;

  const { docs: sessions } = await (
    await payload
  ).find({
    collection: SESSION_COLLECTION,
    depth: 1, // So that we get user object aswell.
    where: { sessionToken: { equals: sessionToken } }
  })
  const session = sessions[0]

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
  process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getSessionAndUser: Valid session ${sessionToken} found`) : undefined;

  return {
    session: {
      sessionToken: session?.sessionToken,
      userId: typeof session?.user === 'string' ? session?.user : session?.user?.id,
      expires: new Date(session?.expires || 0)
    },
    user: toAdapterUser(session?.user)
  }
}

export async function updateSession(payload : any, { sessionToken, expires }: any) : Promise<undefined | null | AdapterSession> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: updateSession input:', 'sessionToken:', sessionToken, 'expires', expires) : undefined;

  //fetch session from payload
  const { docs } = await (
    await payload
  ).find({
    collection: SESSION_COLLECTION,
    where: { sessionToken: { equals: sessionToken }}
  })
  const session = docs[0]
  
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
}

export async function deleteSession(payload : any, sessionToken : string) : Promise<void> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: deleteSession input:', 'sessionToken:', sessionToken) : undefined;
  await (
    await payload
  ).delete({
    collection: SESSION_COLLECTION,
    where: { sessionToken: { equals: sessionToken } }
  })
  process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: deleteSession: Session ${sessionToken} deleted.`) : undefined;
}   
