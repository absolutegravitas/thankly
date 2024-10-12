'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { Input } from '@/app/(app)/_components/ui/input'
import { Label } from '@/app/(app)/_components/ui/label'
import { debounce } from 'lodash'
import { addressAutocomplete } from '@/app/(app)/_blocks/Cart/Receivers/addressAutocomplete'
import { useCart } from '@/app/(app)/_providers/Cart'

interface AddressPickerLiteProps {
  onAddressChange: (address: any) => void
  initialAddress?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    postcode?: string
  }
}

export function AddressPickerLite({ onAddressChange, initialAddress }: AddressPickerLiteProps) {
  const [addressInputValue, setAddressInputValue] = useState<string>('')
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [showAddressSearchMenu, setShowAddressSearchMenu] = useState(false)
  const { updateBillingAddress } = useCart()

  useEffect(() => {
    if (initialAddress) {
      const formattedAddress =
        `${initialAddress.addressLine1}, ${initialAddress.city}, ${initialAddress.state} ${initialAddress.postcode}`.trim()
      setAddressInputValue(formattedAddress)
    }
  }, [initialAddress])

  const handleAddressInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setAddressInputValue(newValue)

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

  const handleSuggestedAddressSelection = (suggestion: any) => {
    const address = {
      addressLine1: suggestion.addressLabel || '',
      addressLine2: '',
      city: suggestion.city || '',
      state: suggestion.stateCode || '',
      postcode: suggestion.postalCode || '',
      country: suggestion.country || 'Australia', // Default to Australia if not provided
    }

    const formattedAddress = [
      address.addressLine1,
      address.city,
      address.state,
      address.postcode,
      address.country,
    ]
      .filter(Boolean)
      .join(', ')

    setAddressInputValue(formattedAddress)
    onAddressChange(address)
    setShowAddressSearchMenu(false)

    // Update the cart's billing address
    updateBillingAddress({
      address: {
        ...address,
      },
    })
  }

  return (
    <div>
      {/* <Label htmlFor="address" className="text-sm font-medium mb-2">
        Billing Address
      </Label> */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Start typing the billing address (for tax invoices)"
          value={addressInputValue}
          onChange={handleAddressInputChange}
        />
        {showAddressSearchMenu && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
            <ul className="py-1">
              {addressSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestedAddressSelection(suggestion)}
                >
                  {suggestion.formattedAddress}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
