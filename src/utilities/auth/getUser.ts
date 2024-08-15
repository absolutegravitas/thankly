import { AdapterUser } from "next-auth/adapters";
import { toAdapterUser, USER_COLLECTION } from "./helperFunctions";
import { BrightConsoleLog } from "../brightConsoleLog";

export async function getUser(payload : any, id : string) : Promise<AdapterUser | null> {
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
}