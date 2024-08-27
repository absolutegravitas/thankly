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
import { useForm, Controller } from 'react-hook-form'
import {
  Address,
  AddressWithoutName,
  AddressText,
  NullableAddress,
  generateAddressId,
  AddressSchema,
  toValidAddress,
  clearAddress,
} from '@app/_providers/Cart/address'
import { zodResolver } from '@hookform/resolvers/zod'

interface props {
  selectedAddressId: string | null
  addresses: Address[]
  onAddAddress: (address: Address) => void
  onChange: (addressId: string) => void
}

export default function AddressPicker({
  selectedAddressId,
  addresses,
  onAddAddress,
  onChange,
}: props): JSX.Element {
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showAddressSearchMenu, setShowAddressSearchMenu] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [addressInputValue, setAddressInputValue] = useState<string>('')
  const [showGenericAddressError, setShowGenericAddressError] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    trigger,
    formState: { errors },
  } = useForm<NullableAddress>({
    resolver: zodResolver(AddressSchema),
    defaultValues: toValidAddress(clearAddress()),
  })

  // const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) || null
  const setSelectedAddress = (address: Address) => {
    onChange(address.id)
  }

  const handleSuggestedAddressSelection = (suggestion: any) => {
    const address: AddressWithoutName = {
      id: generateAddressId(),
      address1: suggestion.addressLabel,
      address2: '',
      city: suggestion.city,
      state: suggestion.stateCode,
      postcode: suggestion.postalCode,
    }

    setAddressInputValue(suggestion.formattedAddress)
    setValue('id', address.id)
    setValue('address1', address.address1)
    setValue('address2', address.address2)
    setValue('city', address.city)
    setValue('state', address.state)
    setValue('postcode', address.postcode)
    setShowAddressSearchMenu(false)
  }

  const validateMandatoryAddressFields = async () => {
    const result = await trigger(['address1', 'city', 'state', 'postcode'])
    setShowGenericAddressError(!result)
    return result
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

  const handleAddressSelect = (address: Address): void => {
    setSelectedAddress(address)
  }

  const handleAddNewAddress = (): void => {
    setShowAddressModal(true)
  }

  const handleCloseAddressModal = (): void => {
    setShowAddressModal(false)
    setShowAddressForm(false)
    setShowAddressSearchMenu(false)
    setShowGenericAddressError(false)
    setAddressSuggestions([])
    clearNewAddress()
  }

  const handleSaveNewAddress = (newAddress: Address): void => {
    setShowAddressModal(false)
  }

  const clearNewAddress = () => {
    //clear address form data
    reset(toValidAddress(clearAddress()))

    //clear address input value
    setAddressInputValue('')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await validateMandatoryAddressFields()
    //if (isValid) {
    handleSubmit(onSubmit, onError)(e)
    //}
  }

  const onSubmit = (address: NullableAddress) => {
    onAddAddress(address as Address)
    setSelectedAddress(address as Address)
    handleCloseAddressModal()
  }

  const onError = (errors: any) => {
    console.log('Form errors', errors)
  }

  return (
    <div className="w-full max-w-md">
      <div className="grid gap-2">
        <label htmlFor="delivery-address" className="font-semibold text-sm dark:text-slate-400">
          To
        </label>
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-auto text-left items-center justify-between"
              >
                {selectedAddress ? (
                  <div>
                    <p className="font-medium break-words text-wrap">
                      {selectedAddress.firstName} {selectedAddress.lastName}
                    </p>
                    <p className="text-gray-500 text-sm break-words text-wrap">
                      {AddressText(selectedAddress)}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-500 font-normal break-words text-wrap">
                    Enter recipient name and delivery address
                  </span>
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
                    <p className="text-gray-500 text-sm">{AddressText(address)}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              {addresses.length > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem onSelect={handleAddNewAddress}>
                <div className="flex items-center justify-between">
                  <span>Add New Recipient</span>
                  <PlusIcon className="h-5 w-5 text-gray-400" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {showAddressModal && (
        <Dialog open={showAddressModal} onOpenChange={handleCloseAddressModal}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Please fill in the details for your new delivery address.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter recipient's first name"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter recipient's last name"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
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
                    {showGenericAddressError && (
                      <p className="mt-2 text-sm text-red-600">Address must be entered</p>
                    )}
                  </div>
                )}
                {showAddressForm && (
                  <div>
                    <div>
                      <Label htmlFor="address">Address Line 1</Label>
                      <Input id="address" placeholder="Enter address" {...register('address1')} />
                      {errors.address1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.address1.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="address">Address Line 2</Label>
                      <Input id="address" placeholder="Enter address" {...register('address2')} />
                      {errors.address2 && (
                        <p className="mt-1 text-sm text-red-600">{errors.address2.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Enter city" {...register('city')} />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Controller
                          name="state"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange}>
                              <SelectTrigger id="state">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ACT">Australian Capital Territory</SelectItem>
                                <SelectItem value="NSW">New South Wales</SelectItem>
                                <SelectItem value="NT">Northern Territory</SelectItem>
                                <SelectItem value="QLD">Queensland</SelectItem>
                                <SelectItem value="SA">South Australia</SelectItem>
                                <SelectItem value="TAS">Tasmania</SelectItem>
                                <SelectItem value="VIC">Victoria</SelectItem>
                                <SelectItem value="WA">Western Australia</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input id="postcode" placeholder="Enter postcode" {...register('postcode')} />
                      {errors.postcode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
                      )}
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
                <Button type="submit">Save Address</Button>
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
