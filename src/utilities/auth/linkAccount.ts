import { AdapterAccount } from "next-auth/adapters";
import { BrightConsoleLog } from "../brightConsoleLog";
import { toPayloadAccount, USER_COLLECTION } from "./helperFunctions";
import { getPayloadUserByAccount } from "./getUserByAccount";

export async function linkAccount(payload : any, account : AdapterAccount) : Promise<AdapterAccount | null | undefined> {
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
}

export async function unlinkAccount(payload : any, { providerAccountId, provider } : any) : Promise<AdapterAccount | undefined> {
  process.env.AUTH_VERBOSE ? BrightConsoleLog('PayloadAdapter: unlinkAccount input:', 'providerAccountId:', providerAccountId, 'provider', provider) : undefined;
  const user = await getPayloadUserByAccount({ payload, providerAccountId, provider })
  
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
}