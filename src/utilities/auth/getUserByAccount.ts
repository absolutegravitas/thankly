import { AdapterUser } from "next-auth/adapters"
import { BrightConsoleLog } from "../brightConsoleLog"
import { User } from "@/payload-types"
import { getProviderSearchString, toAdapterUser, USER_COLLECTION } from "./helperFunctions"

export async function getUserByAccount(payload : any, { providerAccountId, provider } : any) : Promise<AdapterUser | null> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: getUserByAccount input: ProviderAccountId:${providerAccountId}, Provider:${provider}.`) : undefined
  
  //fetch user by account
  const user = await getPayloadUserByAccount({payload, providerAccountId, provider})

  if (process.env.AUTH_VERBOSE) {
    if (!user)
      BrightConsoleLog(`PayloadAdapter: getUserByAccount: User not found (ProviderAccountId:${providerAccountId}, Provider:${provider}.`)
    else if (user.status !== 'active')
      BrightConsoleLog(`PayloadAdapter: getUserByAccount: User ${user.id} (${user.email}) found but is inactive.`)
    else
      BrightConsoleLog(`PayloadAdapter: getUserByAccount: User ${user.id} (${user.email}) found.`)
  }

  return (user && user.status === 'active') ? toAdapterUser(user) : null
}

export const getPayloadUserByAccount = async ({
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

    return docs[0] ?? null
  } catch (error) {
    console.error(`Error fetching user by account id (id=${providerAccountId})`, error)
  }
  return null
}