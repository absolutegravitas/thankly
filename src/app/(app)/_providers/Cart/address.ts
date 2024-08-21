import { defaultMaxListeners } from "events"


//Addres type is used to track unique recipient addresses for the cart form logic
export type Address = {
  formattedAddress: string
  json: JSON
}

export type AddressAction =
  | {
      type: 'ADD_ADDRESS'
      payload: { address: Address }
  }

  //helper function to check if address already exists
  const addressExists = ( searchAddress: Address, addresses: Address[] ) : boolean => {
    return addresses.some(address => 
      address.formattedAddress === searchAddress.formattedAddress &&
      JSON.stringify(address.json) === JSON.stringify(searchAddress.json)
    );
  }

  const addressSort = (addresses: Address[]): Address[] => {
    return [...addresses].sort((a, b) => 
      a.formattedAddress.localeCompare(b.formattedAddress)
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

