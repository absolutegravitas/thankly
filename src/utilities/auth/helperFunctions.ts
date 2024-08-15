import { User } from "@/payload-types";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";

export const SESSION_MAX_AGE = 86400 //in seconds (86400 = 60 * 60 * 24 = 24 hours)
export const USER_COLLECTION = 'users' as const
export const SESSION_COLLECTION = 'sessions' as const
export const DEFAULT_USER_ROLE = 'customer' as const
export const FIELDS_USER_IS_ALLOWED_TO_CHANGE = ['name', 'emailVerified']
export const PROVIDER_SEARCH_STRING_SPLITTER = '===='

export const toAdapterUser = (payloadUser: User) : AdapterUser => ({
  ...payloadUser,
  id: String(payloadUser.id),
  email: payloadUser.email,
  image: payloadUser.imageUrl,
  emailVerified: payloadUser?.emailVerified ? new Date(payloadUser.emailVerified) : null,
  name: payloadUser.firstName + ' ' + payloadUser.lastName //TODO: Improve this logic.. why does auth not have name split??
})

export function splitName(fullName: string | null | undefined): { firstName: string; lastName: string } {
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

export function getProviderSearchString(providerId: string, providerAccountId: string) : string {
  return providerId + PROVIDER_SEARCH_STRING_SPLITTER + providerAccountId;
}

export function splitProviderSearch(searchString: string): { providerId: string, providerAccountId: string } {
  const [providerId, providerAccountId] = searchString.split(PROVIDER_SEARCH_STRING_SPLITTER);
  return { providerId, providerAccountId };
}

export const toPayloadAccount = (adapterAccount: AdapterAccount) => ({
  provider: adapterAccount.provider,
  providerAccountId: adapterAccount.providerAccountId,
  providerSearchString: getProviderSearchString(adapterAccount.provider, adapterAccount.providerAccountId)
})