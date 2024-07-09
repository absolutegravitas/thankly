'use client'

import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'
import { MapPinIcon, MessageSquareTextIcon, SendIcon, UserIcon, UsersIcon } from 'lucide-react'
import { AddReceiverButton, CopyReceiverIcon, RemoveReceiverIcon } from './ReceiverActions'
import { addressAutocomplete } from './addressAutocomplete'
import { debounce } from 'lodash'

interface Receiver {
  id: string
  message: string
  name: string
  addressLine1: string
  city: string
  state: string
  postcode: string
  shippingMethod: ShippingMethod
  totals: {
    receiverThankly: number
    receiverShipping: number
    receiverTotal: number
  }
}

interface CartItem {
  id: string
  product: {
    id: string
  }
  receivers: Receiver[]
}

type ShippingMethod = 'standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

type FieldName =
  | 'message'
  | 'name'
  | 'addressLine1'
  | 'city'
  | 'state'
  | 'postcode'
  | 'shippingMethod'

export const ReceiversGrid: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateReceiver, removeReceiver } = useCart()
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isPending, startTransition] = useTransition()

  const validateField = useCallback((field: FieldName, value: string) => {
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }
    return ''
  }, [])

  const handleFieldChange = useCallback(
    (cartItemId: string, receiverId: string, field: FieldName, value: string | any) => {
      updateReceiver(cartItemId, receiverId, { [field]: value })
      setErrors((prev) => ({ ...prev, [`${receiverId}-${field}`]: '' }))
    },
    [updateReceiver],
  )

  const handleFieldBlur = useCallback(
    (receiverId: string, field: FieldName, value: string) => {
      setErrors((prev) => ({
        ...prev,
        [`${receiverId}-${field}`]: validateField(field, value),
      }))
    },
    [validateField],
  )

  const debouncedAddressInput = useCallback(
    debounce(async (value: string) => {
      try {
        const suggestions = await addressAutocomplete(value)
        setAddressSuggestions(suggestions)
      } catch (error) {
        console.error('Error fetching address suggestions:', error)
        setAddressSuggestions([])
      }
    }, 300),
    [],
  )

  const handleAddressInput = useCallback(
    (cartItemId: string, receiverId: string, value: string) => {
      handleFieldChange(cartItemId, receiverId, 'addressLine1', value)
      startTransition(() => {
        debouncedAddressInput(value)
      })
    },
    [handleFieldChange, debouncedAddressInput],
  )

  const handleAddressSuggestionClick = useCallback(
    (cartItemId: string, receiverId: string, suggestion: any) => {
      updateReceiver(cartItemId, receiverId, {
        addressLine1: suggestion.addressLabel,
        city: suggestion.city,
        state: suggestion.state,
        postcode: suggestion.postalCode,
      })
      setAddressSuggestions([])
    },
    [updateReceiver],
  )

  if (!item) return null

  return (
    <div className="px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
      {item.receivers?.map((receiver: Receiver, index: number) => (
        <div
          key={receiver.id}
          className="relative flex flex-col justify-between rounded-sm border border-solid hover:shadow-xl hover:delay-75 duration-150 p-6 aspect-square"
        >
          <div>
            {/* heading / title / actions */}
            <div className="flex flex-row justify-between items-center pb-3">
              <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
                {`#${(index + 1).toString().padStart(2, '0')}`}
              </span>
              <div className="flex justify-end items-center gap-x-3">
                <CopyReceiverIcon cartItemId={item.product.id} receiverId={receiver.id} />
                <RemoveReceiverIcon
                  cartItemId={item.product.id}
                  receiverId={receiver.id}
                  removeReceiver={removeReceiver}
                />
              </div>
            </div>
            {/* fields */}
            <div className="isolate -space-y-px rounded-md shadow-sm">
              {/* receiver */}
              <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 ">
                <label htmlFor="name" className="block text-xs font-medium text-gray-900">
                  <UserIcon className="mr-1 h-5 w-5 #text-gray-400" strokeWidth={1.2} />
                  {`Name (full name + business helps with delivery)`}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  className="!font-body block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
                  onChange={(value) => handleFieldChange(item.id, receiver.id, 'name', value)}
                  onBlur={() => handleFieldBlur(receiver.id, 'name', receiver.name)}
                />
              </div>

              {/* message */}
              <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 ">
                <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                  <MessageSquareTextIcon
                    className="mr-1 h-5 w-5 #text-gray-400"
                    strokeWidth={1.2}
                  />
                  {`Your Message (about ~60-100 words)`}
                </label>
                <textarea
                  id="message"
                  name="message"
                  maxLength={400}
                  placeholder="Enter your message"
                  aria-invalid={!!errors[`${receiver.id}-message`]}
                  aria-describedby={errors[`${receiver.id}-message`] ? 'message-error' : undefined}
                  className="font-body text-sm block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400  focus:outline-none focus:ring-0 sm:text-sm sm:leading-snug"
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^a-zA-Z0-9.,!? \n]/g, '')
                    handleFieldChange(item.id, receiver.id, 'message', newValue)
                  }}
                  onBlur={() => handleFieldBlur(receiver.id, 'message', receiver.message)}
                />
                {errors[`${receiver.id}-message`] && (
                  <span className="mt-2 text-sm text-red-600" id="message-error">
                    {errors[`${receiver.id}-message`]}
                  </span>
                )}
              </div>

              {/* address */}
              <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 ">
                <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                  <MapPinIcon className="mr-1 h-5 w-5 #text-gray-400" strokeWidth={1.2} />
                  {`Shipping Address`}
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Enter address"
                  // value={receiver.addressLine1 || ''}
                  className="!font-body block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400  focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
                  onChange={(e) => handleAddressInput(item.id, receiver.id, e.target.value)}
                  aria-invalid={!!errors[`${receiver.id}-addressLine1`]}
                  aria-describedby={
                    errors[`${receiver.id}-addressLine1`] ? 'address-error' : undefined
                  }
                />
                {errors[`${receiver.id}-addressLine1`] && (
                  <span className="mt-2 text-sm text-red-600" id="address-error">
                    {errors[`${receiver.id}-addressLine1`]}
                  </span>
                )}
                {addressSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {addressSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                        onClick={() =>
                          handleAddressSuggestionClick(item.id, receiver.id, suggestion)
                        }
                      >
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        {suggestion.addressLabel}, {suggestion.city}, {suggestion.state}{' '}
                        {suggestion.postalCode}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* shipping method */}
              <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 ">
                <label htmlFor="job-title" className="block text-xs font-medium text-gray-900">
                  <SendIcon className="mr-1 h-5 w-5 #text-gray-400" strokeWidth={1.2} />
                  {`Shipping Method`}
                </label>

                <select
                  id="shipping-method"
                  name="shipping-method"
                  className="pt-2 pb-3 !font-body !text-sm block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-0 sm:text-sm sm:leading-6"
                  onChange={(value) =>
                    handleFieldChange(item.id, receiver.id, 'shippingMethod', value)
                  }
                  onBlur={() =>
                    handleFieldBlur(receiver.id, 'shippingMethod', receiver.shippingMethod || '')
                  }
                >
                  <option className="text-xs" value="standardMail">
                    Standard Mail
                  </option>
                  <option className="text-xs" value="expressMail">
                    Express Mail
                  </option>
                  <option className="text-xs" value="standardParcel">
                    Standard Parcel
                  </option>
                  <option className="text-xs" value="expressParcel">
                    Express Parcel
                  </option>
                </select>

                <span className="text-xs italic font-body leading-tight">{`FREE shipping for Orders greater than $150. Discount applied at checkout.`}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-right">
            <div>
              <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                {`Cost: ${
                  receiver.totals.receiverThankly.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }) || 0
                }`}
              </span>
            </div>
            <div>
              <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                {`Shipping: ${
                  receiver.totals.receiverShipping === undefined
                    ? '(needs address)'
                    : receiver.totals.receiverShipping?.toLocaleString('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      }) || 0
                }`}
              </span>
            </div>
            <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
              {`Subtotal: ${
                receiver.totals.receiverTotal.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }) || 0
              }`}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
