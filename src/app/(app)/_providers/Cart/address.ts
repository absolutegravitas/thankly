import { randomBytes } from "crypto"
import { defaultMaxListeners } from "events"
import { z } from 'zod'
import { CartItem, Receiver } from "@app/_blocks/Cart/cart-types";

const postcodeRegex = /^\d{4}$/;
const stateAbbreviations = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;

export const AddressSchema = z.object({
  id: z.string(),
  firstName: z.string()
    .min(1, { message: "First name is required." })
    .max(100, { message: "First name must not exceed 100 characters." }),
  lastName: z.string()
    .min(1, { message: "Last name is required." })
    .max(100, { message: "Last name must not exceed 100 characters." }),
  address1: z.string()
    .min(1, { message: "Address line 1 is required." })
    .max(100, { message: "Address line 1 must not exceed 100 characters." }),
  address2: z.string()
    .max(100, { message: "Address line 2 must not exceed 100 characters." })
    .optional(),
  city: z.string()
    .min(1, { message: "City is required." })
    .max(100, { message: "City name must not exceed 100 characters." }),
  state: z.enum(stateAbbreviations, {
    errorMap: () => ({ message: "Invalid state. Must be a valid Australian state abbreviation." })
  }),
  postcode: z.string()
    .regex(postcodeRegex, { message: "Invalid postcode. Must be 4 digits." }),
});

export type Address = z.infer<typeof AddressSchema>;

export type AddressWithoutName = Omit<Address, 'firstName' | 'lastName'>

export const getReceiverAddresses = (receivers: Receiver[] | null |  undefined): Address[] => {
  if (!receivers) return [];
  return receivers.map(receiver => ({
    id: receiver.receiverId,
    firstName: receiver.firstName,
    lastName: receiver.lastName,
    address1: receiver.address.addressLine1,
    address2: receiver.address.addressLine2 || undefined,
    city: receiver.address.city,
    state: receiver.address.state as Address['state'], // Type assertion needed here
    postcode: receiver.address.postcode
  }));
};

export const getNewReceiver = (address: Address): Receiver => {
  return {
    receiverId: address.id,
    firstName: address.firstName,
    lastName: address.lastName,
    address: {
      addressLine1: address.address1,
      addressLine2: address.address2 || null,
      city: address.city,
      state: address.state,
      postcode: address.postcode
    },
  };
};

// Define a type that allows null values for all fields
export type NullableAddress = {
  [K in keyof Address]: Address[K] | null;
};

export function clearAddress(): NullableAddress {
  return {
    id: generateAddressId(),
    firstName: null,
    lastName: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    postcode: null,
  };
}

export function toValidAddress(address: NullableAddress): Partial<Address> {
  return Object.fromEntries(
    Object.entries(address)
      .filter(([_, value]) => value !== null)
  ) as Partial<Address>;
}

export function generateAddressId(): string {
  return randomBytes(16).toString('hex')
}

export const AddressText = (address: AddressWithoutName | null): string | undefined => {
  if (address === null) return undefined
  //else
  const addresslines = address.address2 ? `${address.address1} ${address.address2}` : address.address1
  return `${addresslines}, ${address.city} ${address.state} ${address.postcode}`
}

export const FullName = (address: Address): string => { 
  return `${address.firstName} ${address.lastName}`
}

export type AddressAction =
  | {
      type: 'ADD_ADDRESS'
      payload: { address: Address }
  }

  //helper function to check if address already exists
  const addressExists = ( searchAddress: Address, addresses: Address[] ) : boolean => {
    return addresses.some(address => 
      FullName(searchAddress) === FullName(address) &&
      AddressText(searchAddress) === AddressText(address)
    );
  }

  const addressSort = (addresses: Address[]): Address[] => {
    return [...addresses].sort((a, b) => 
      FullName(a).localeCompare(FullName(b))
    );
  }

  export const addressReducer = (addresses: Address[], action: AddressAction ): Address[] => {
    switch (action.type) {
      case 'ADD_ADDRESS': {
        const newAddress = action.payload.address
        return addressExists(newAddress, addresses)
        ? addresses
        : addressSort([...addresses, newAddress])
      }
      default:
        return addresses
    }
  }

