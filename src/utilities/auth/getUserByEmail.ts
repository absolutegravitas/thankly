import { AdapterUser } from "next-auth/adapters";
import { BrightConsoleLog } from "../brightConsoleLog";
import { toAdapterUser, USER_COLLECTION } from "./helperFunctions";

export async function getUserByEmail(payload : any, email : string) : Promise<AdapterUser | null> {
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
}