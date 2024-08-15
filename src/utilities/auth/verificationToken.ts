import { VerificationToken } from "next-auth/adapters";
import { BrightConsoleLog } from "../brightConsoleLog";
import { USER_COLLECTION } from "./helperFunctions";
import { createUser } from "./createUser";

export async function createVerificationToken(payload : any, { identifier, expires, token } : any) : Promise<undefined | null | VerificationToken> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: createVerificationToken input:', 'identifier:', identifier, 'expires:', expires, 'token:', token) : undefined;
  //fetch user
  const { docs } = await (
    await payload
  ).find({
    collection: USER_COLLECTION,
    where: { email: { equals: identifier } }
  })
  const user = docs[0]

  //If user doesn't exist, then create one
  if(!user) {
    //create user
    BrightConsoleLog(`PayloadAdapter: createVerificationToken output: User ${identifier} not found.`)
    const user = await createUser(payload, {
      email: identifier,
      emailVerified: null
    })
  } else if (user.status !== 'active')
  {
    BrightConsoleLog(`PayloadAdapter: createVerificationToken output: User ${identifier} found but is inactive.`)
    return null;
  }
  
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
}

export async function useVerificationToken(payload : any, { identifier, token } : any) : Promise<null | VerificationToken> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: useVerificationToken input:', 'identifier:', identifier, 'token:', token) : undefined;
  //fetch user
  const { docs } = await (
    await payload
  ).find({
    collection: USER_COLLECTION,
    where: { email: { equals: identifier } }
  })
  const user = docs[0]
  
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
  if (filteredToken.length === 0) {
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
  console.log("filteredToken:",filteredToken[0]);
  return filteredToken[0];
}