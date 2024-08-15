import { AdapterUser } from "next-auth/adapters";
import { BrightConsoleLog } from "../brightConsoleLog";
import { DEFAULT_USER_ROLE, splitName, toAdapterUser, USER_COLLECTION } from "./helperFunctions";
import { User } from "@/payload-types";

export async function createUser(payload : any, user: Omit<AdapterUser, "id">) : Promise<AdapterUser> {
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
}