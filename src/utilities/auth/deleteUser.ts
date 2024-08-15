import { AdapterUser } from "next-auth/adapters";
import { USER_COLLECTION } from "./helperFunctions";
import { BrightConsoleLog } from "../brightConsoleLog";

export async function deleteUser(payload : any, userId: string) : Promise<AdapterUser | null | undefined> {
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
}