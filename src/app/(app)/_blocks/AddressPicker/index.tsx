'use client'

import React, { useCallback, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/app/(app)/_components/ui/dropdown-menu'
import { Button } from '@/app/(app)/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/(app)/_components/ui/dialog'
import { Label } from '@/app/(app)/_components/ui/label'
import { Input } from '@/app/(app)/_components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/(app)/_components/ui/select'
import Link from 'next/link'
import { debounce, fromPairs } from 'lodash'
import { addressAutocomplete } from '../Cart/Receivers/addressAutocomplete'
import { randomBytes } from 'crypto'
import { useCart } from '../../_providers/Cart'
import { useForm } from 'react-hook-form'
import { Address, AddressWithoutName, AddressText } from '@app/_providers/Cart/address'

function generateUniqueId(): string {
  return randomBytes(16).toString('hex')
}

export default function AddressPicker(): JSX.Element {
  const { addresses, addAddress } = useCart()
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showAddressSearchMenu, setShowAddressSearchMenu] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])

  const [addressInputValue, setAddressInputValue] = useState<string>('')

  const [newAddressFirstName, setNewAddressFirstName] = useState<string>('')
  const [newAddressLastName, setNewAddressLastName] = useState<string>('')
  const [newAddress, setNewAddress] = useState<AddressWithoutName | null>(null)

  const { register, handleSubmit, setValue, getValues } = useForm<Address>()

  const handleSuggestedAddressSelection = (suggestion: any) => {
    console.log('DEBUG: handleSuggestedAddressSelection input', suggestion)

    const address: AddressWithoutName = {
      id: generateUniqueId(),
      address1: suggestion.addressLabel,
      address2: '',
      city: suggestion.city,
      state: suggestion.stateCode,
      postcode: suggestion.postalCode,
    }
    setNewAddress(address)
    setAddressInputValue(suggestion.formattedAddress)

    setValue('id', generateUniqueId())
    setValue('address1', suggestion.addressLabel)
    setValue('address2', '')
    setValue('city', suggestion.city)
    setValue('state', suggestion.stateCode)
    setValue('postcode', suggestion.postalCode)

    setShowAddressSearchMenu(false)
  }

  const handleAddressInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setAddressInputValue(newValue)

    // if (newAddress === event.target.value) return
    if (event.target.value.trim().length >= 3) {
      debouncedSearch(newValue)
    } else {
      setShowAddressSearchMenu(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      const suggestions = await addressAutocomplete(value)
      setAddressSuggestions(suggestions)
      setShowAddressSearchMenu(true)
    }, 300),
    [],
  )

  // const addresses: Address[] = [
  //   {
  //     id: '1',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     address1: '123 Main St',
  //     address2: 'Apt 456',
  //     city: 'Sydney',
  //     state: 'NSW',
  //     postcode: '2000',
  //   },
  //   {
  //     id: '2',
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     address1: '456 Oak Rd',
  //     address2: '',
  //     city: 'Melbourne',
  //     state: 'VIC',
  //     postcode: '3000',
  //   },
  //   {
  //     id: '3',
  //     firstName: 'Bob',
  //     lastName: 'Johnson',
  //     address1: '789 Elm St',
  //     address2: 'Suite 789',
  //     city: 'Brisbane',
  //     state: 'QLD',
  //     postcode: '4000',
  //   },
  // ]

  const handleAddressSelect = (address: Address): void => {
    setSelectedAddress(address)
  }

  // const handleNewAddressSelect = (address: AddressWithoutName): void => {
  //   setNewAddress(address)
  // }

  const handleAddNewAddress = (): void => {
    setShowAddressModal(true)
  }

  const handleCloseAddressModal = (): void => {
    setShowAddressModal(false)
    setShowAddressForm(false)
    setShowAddressSearchMenu(false)
    setAddressSuggestions([])
    setNewAddress(null)
  }

  const handleSaveNewAddress = (newAddress: Address): void => {
    console.log('New address:', newAddress)

    setShowAddressModal(false)
  }

  const clearNewAddress = () => {
    //clear address form data
    setValue('id', generateUniqueId())
    setValue('address1', '')
    setValue('address2', '')
    setValue('city', '')
    setValue('state', '')
    setValue('postcode', '')

    //clear newaddress state
    setNewAddress(null)

    setAddressInputValue('')
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <label htmlFor="delivery-address" className="block text-sm font-medium text-gray-700">
          Delivery Address
        </label>
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full text-left flex items-center justify-between"
              >
                {selectedAddress ? (
                  <div>
                    <p className="font-medium">
                      {selectedAddress.firstName} {selectedAddress.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {selectedAddress.address1}, {selectedAddress.city}, {selectedAddress.state}{' '}
                      {selectedAddress.postcode}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a delivery address</span>
                )}
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {addresses.map((address) => (
                <DropdownMenuItem
                  key={address.id}
                  onSelect={() => handleAddressSelect(address)}
                  className={selectedAddress?.id === address.id ? 'bg-gray-100' : ''}
                >
                  <div>
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {address.address1}, {address.city}, {address.state} {address.postcode}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleAddNewAddress}>
                <div className="flex items-center justify-between">
                  <span>Add New Address</span>
                  <PlusIcon className="h-5 w-5 text-gray-400" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {showAddressModal && (
        <Dialog open={showAddressModal} onOpenChange={handleCloseAddressModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Please fill in the details for your new delivery address.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit((data) => console.log(data))}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter recipient's first name"
                      {...register('firstName')}
                      onChange={(e) => setNewAddressFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter recipient's last name"
                      {...register('lastName')}
                      onChange={(e) => setNewAddressLastName(e.target.value)}
                    />
                  </div>
                </div>
                {!showAddressForm && (
                  <div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <SearchIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Start typing the recipient's address"
                          value={addressInputValue}
                          className="pl-10 pr-4 py-2 rounded-md focus:border-primary focus:ring-primary"
                          onChange={handleAddressInputChange}
                        />
                      </div>
                    </div>
                    {showAddressSearchMenu && (
                      <div className="mt-2">
                        <ul className="max-h-48 overflow-y-auto bg-background rounded-md shadow-lg">
                          {addressSuggestions.map((suggestion, index) => (
                            <li key={index}>
                              <button
                                className="flex items-center px-4 py-2 hover:bg-muted"
                                onClick={() => handleSuggestedAddressSelection(suggestion)}
                              >
                                <MapPinIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                                <div className="text-sm">{suggestion.formattedAddress}</div>
                              </button>
                            </li>
                          ))}

                          <li
                            className="px-4 py-2 text-muted-foreground hover:bg-muted"
                            onClick={() => {
                              setShowAddressForm(true)
                              clearNewAddress()
                            }}
                          >
                            <Link href="#" prefetch={false}>
                              Can't find the recipient's address?
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {showAddressForm && (
                  <div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Enter address" {...register('address1')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Enter city" {...register('city')} />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select>
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Select state" {...register('state')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NSW">New South Wales</SelectItem>
                            <SelectItem value="VIC">Victoria</SelectItem>
                            <SelectItem value="QLD">Queensland</SelectItem>
                            <SelectItem value="SA">South Australia</SelectItem>
                            <SelectItem value="WA">Western Australia</SelectItem>
                            <SelectItem value="TAS">Tasmania</SelectItem>
                            <SelectItem value="NT">Northern Territory</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input id="postcode" placeholder="Enter postcode" {...register('postcode')} />
                    </div>
                    <div className="mt-4">
                      <Link
                        href="#"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => {
                          setShowAddressForm(false)
                          setShowAddressSearchMenu(false)
                          clearNewAddress()
                        }}
                        prefetch={false}
                      >
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to address selector
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="ghost" type="reset" onClick={handleCloseAddressModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  // onClick={() => handleSaveNewAddress({} as Address)}
                >
                  Save Address
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // You can add more specific props here if needed
}

function ChevronDownIcon(props: IconProps): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function PlusIcon(props: IconProps): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function MapPinIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function SearchIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function ArrowLeftIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}
