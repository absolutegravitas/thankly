import { randomBytes } from "crypto"
import { defaultMaxListeners } from "events"


//Addres type is used to track unique recipient addresses for the cart form logic
// export type Address = {
//   formattedAddress: string
//   json: JSON
// }

export interface Address {
  id: string
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  postcode: string
}

export type AddressWithoutName = Omit<Address, 'firstName' | 'lastName'>

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

