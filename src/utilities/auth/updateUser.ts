import { AdapterUser } from "next-auth/adapters";
import { BrightConsoleLog } from "../brightConsoleLog";
import { FIELDS_USER_IS_ALLOWED_TO_CHANGE, toAdapterUser, USER_COLLECTION } from "./helperFunctions";

export async function updateUser(payload : any, data : Partial<AdapterUser> & Pick<AdapterUser, "id">) : Promise<AdapterUser> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: updateUser input:', data) : undefined;
  //filter out data that is not allowed to be changed by the user
  const userId = data.id
  Object.keys(data).forEach((key) => {
    if (!(FIELDS_USER_IS_ALLOWED_TO_CHANGE || []).includes(key) && key in data) {
      // @ts-ignore
      delete data[key]
    }
  })

  console.log('filtered data:',data)

  const updatedUser = await (
    await payload
  ).update({
    collection: USER_COLLECTION,
    id: userId,
    // @ts-ignore
    data
  })
  console.log('docs:',updatedUser)
  if (!updatedUser) {
    throw new Error('PayloadAdapter: updateUser: no user found')
  }

  process.env.AUTH_VERBOSE ? BrightConsoleLog(`PayloadAdapter: updateUser: User ${updatedUser.id} (${updatedUser.email}) has been updated.`) : undefined

  return toAdapterUser(updatedUser)
}