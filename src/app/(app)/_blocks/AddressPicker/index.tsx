import React, { useState } from 'react'
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

interface Address {
  id: number
  name: string
  address1: string
  address2: string
  city: string
  state: string
  postcode: string
}

export default function AddressPicker(): JSX.Element {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false)

  const addresses: Address[] = [
    {
      id: 1,
      name: 'John Doe',
      address1: '123 Main St',
      address2: 'Apt 456',
      city: 'Sydney',
      state: 'NSW',
      postcode: '2000',
    },
    {
      id: 2,
      name: 'Jane Smith',
      address1: '456 Oak Rd',
      address2: '',
      city: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      address1: '789 Elm St',
      address2: 'Suite 789',
      city: 'Brisbane',
      state: 'QLD',
      postcode: '4000',
    },
  ]

  const handleAddressSelect = (address: Address): void => {
    setSelectedAddress(address)
  }

  const handleAddNewAddress = (): void => {
    setShowAddressModal(true)
  }

  const handleCloseAddressModal = (): void => {
    setShowAddressModal(false)
  }

  const handleSaveNewAddress = (newAddress: Address): void => {
    console.log('New address:', newAddress)
    setShowAddressModal(false)
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
                    <p className="font-medium">{selectedAddress.name}</p>
                    <p className="text-gray-500 text-sm">
                      {selectedAddress.address1}, {selectedAddress.city}, {selectedAddress.state}{' '}
                      {selectedAddress.postcode}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-400">Select an address</span>
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
                    <p className="font-medium">{address.name}</p>
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
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter name" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Enter city" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
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
                <Input id="postcode" placeholder="Enter postcode" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={handleCloseAddressModal}>
                Cancel
              </Button>
              <Button onClick={() => handleSaveNewAddress({} as Address)}>Save Address</Button>
            </DialogFooter>
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
