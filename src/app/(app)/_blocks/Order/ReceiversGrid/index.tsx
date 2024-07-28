'use client'

import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useOrder } from '@app/_providers/Order'
import { MapPinIcon, MessageSquareTextIcon, SendIcon, UserIcon, UsersIcon } from 'lucide-react'
import { AddReceiverButton, CopyReceiverIcon, RemoveReceiverIcon } from './ReceiverActions'
import { addressAutocomplete } from './addressAutocomplete'
import { debounce, update } from 'lodash'
import { Order, Product } from '@/payload-types'
import { Field, Label, Switch } from '@headlessui/react'
import { Radio, RadioGroup } from '@headlessui/react'
import cn from '@/utilities/cn'

const shippingOptions = [
  { name: 'Standard Mail', value: 'standardMail', productType: 'card', cost: true },
  { name: 'Express Mail', value: 'expressMail', productType: 'card', cost: true },
  { name: 'Standard Parcel', value: 'standardParcel', productType: 'gift', cost: true },
  { name: 'Express Parcel', value: 'expressParcel', productType: 'gift', cost: true },
]

interface Receiver {
  id: string
  message: string
  name: string
  delivery: {
    address?: {
      formattedAddress?: string | null
      addressLine1?: string | null
      addressLine2?: string | null
      json?:
        | {
            [k: string]: unknown
          }
        | unknown[]
        | string
        | number
        | boolean
        | null
    }
    shippingMethod: ShippingMethod
  }
  totals: {
    cost: number
    shipping: number
    subTotal: number
  }
  errors: JSON
}

interface OrderItem {
  id: string
  product: Product
  receivers: Receiver[]
}

interface ValidationErrors {
  name?: string
  message?: string
  formattedAddress?: string
  addressLine1?: string
  shippingMethod?: string
}

type ShippingMethod = 'standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

export const ReceiversGrid: React.FC<{ item: OrderItem }> = ({ item }) => {
  const { order, updateReceiver, removeReceiver } = useOrder()

  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<{ [key: string]: JSON }>({})
  const [names, setNames] = useState<{ [key: string]: string }>({})
  const [messages, setMessages] = useState<{ [key: string]: string }>({})
  const [poBoxFlags, setPoBoxFlags] = useState<{ [key: string]: boolean }>({})
  const [addressesLine1, setLine1Addresses] = useState<{ [key: string]: string }>({})
  const [formattedAddresses, setFormattedAddresses] = useState<{ [key: string]: string }>({})
  const [addressSuggestions, setAddressSuggestions] = useState<{ [key: string]: any[] }>({})
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: ValidationErrors }>({})

  const [selectedShipping, setSelectedShipping] = useState<{
    [key: string]: (typeof shippingOptions)[0]
  }>(() => {
    const initialShipping: { [key: string]: (typeof shippingOptions)[0] } = {}
    item.receivers?.forEach((receiver) => {
      let selectedOption: (typeof shippingOptions)[0]
      if (receiver.delivery?.shippingMethod) {
        selectedOption =
          shippingOptions.find((option) => option.value === receiver.delivery?.shippingMethod) ||
          shippingOptions[0]
      } else {
        selectedOption =
          item.product.productType === 'gift'
            ? shippingOptions.find((option) => option.value === 'standardParcel') ||
              shippingOptions[2]
            : shippingOptions.find((option) => option.value === 'standardMail') ||
              shippingOptions[0]
      }
      initialShipping[receiver.id] = selectedOption
    })
    return initialShipping
  })

  const validateReceiver = useCallback(
    (receiver: Receiver, poBoxFlag: boolean): ValidationErrors => {
      const errors: ValidationErrors = {}

      if (!receiver.name) {
        errors.name = 'Name is required'
      } else if (receiver.name.length < 2) {
        errors.name = 'Name must be at least 2 characters long'
      } else if (receiver.name.length > 100) {
        errors.name = 'Name must be at most 100 characters long'
      } else if (!/^[a-zA-Z\s'-]+$/.test(receiver.name)) {
        errors.name = 'Name contains invalid characters'
      }

      if (!receiver.message) {
        errors.message = 'Message is required'
      } else if (!/^[a-zA-Z0-9\s.,!?'-]+$/.test(receiver.message)) {
        errors.message = 'Message contains invalid characters'
      }

      if (!receiver.delivery?.address?.formattedAddress) {
        errors.formattedAddress = 'Address is required'
      } else if (!receiver.delivery?.address?.json) {
        errors.formattedAddress = 'Please select an address from the suggestions'
      }

      if (poBoxFlag && !receiver.delivery?.address?.addressLine1) {
        errors.addressLine1 = 'PO Box / Parcel Collect details are required'
      }

      if (!receiver.delivery?.shippingMethod) {
        errors.shippingMethod = 'Shipping method is required'
      }

      return errors
    },
    [],
  )

  useEffect(() => {
    const newValidationErrors: { [key: string]: ValidationErrors } = {}
    item.receivers?.forEach((receiver) => {
      newValidationErrors[receiver.id] = validateReceiver(
        receiver,
        poBoxFlags[receiver.id] || false,
      )
    })
    setValidationErrors(newValidationErrors)
  }, [item.receivers, poBoxFlags, validateReceiver])

  useEffect(() => {
    const currentItem = order.items?.find((orderItem) => orderItem.id === item.id)
    console.log('Current Item in Cart:', currentItem)
  }, [order, item.id])

  useEffect(() => {
    const initialErrors: { [key: string]: JSON } = {}
    const initialNames: { [key: string]: string } = {}
    const initialMessages: { [key: string]: string } = {}

    const initialPoBoxFlags: { [key: string]: boolean } = {}
    const initialLine1Addresses: { [key: string]: string } = {}
    const initialFormattedAddresses: { [key: string]: string } = {}

    const initialShipping: { [key: string]: (typeof shippingOptions)[0] } = {}

    item.receivers?.forEach((receiver) => {
      initialErrors[receiver.id] = receiver.errors || {}
      initialNames[receiver.id] = receiver.name || ''
      initialMessages[receiver.id] = receiver.message || ''
      initialLine1Addresses[receiver.id] = receiver.delivery?.address?.addressLine1 || ''
      initialFormattedAddresses[receiver.id] = receiver.delivery?.address?.formattedAddress || ''

      let selectedOption: (typeof shippingOptions)[0]
      if (receiver.delivery?.shippingMethod) {
        selectedOption =
          shippingOptions.find((option) => option.value === receiver.delivery?.shippingMethod) ||
          shippingOptions[0]
      } else {
        selectedOption =
          item.product.productType === 'gift'
            ? shippingOptions.find((option) => option.value === 'standardParcel') ||
              shippingOptions[2]
            : shippingOptions.find((option) => option.value === 'standardMail') ||
              shippingOptions[0]
      }
      initialShipping[receiver.id] = selectedOption
    })

    setErrors(initialErrors)
    setNames(initialNames)
    setMessages(initialMessages)
    setLine1Addresses(initialLine1Addresses)
    setFormattedAddresses(initialFormattedAddresses)
    setSelectedShipping(initialShipping)

    // Initialize poBoxFlags only if it's empty
    setPoBoxFlags((prev) => {
      if (Object.keys(prev).length === 0) {
        const initialPoBoxFlags: { [key: string]: boolean } = {}
        item.receivers?.forEach((receiver) => {
          initialPoBoxFlags[receiver.id] = !!receiver.delivery?.address?.addressLine1
        })
        return initialPoBoxFlags
      }
      return prev
    })
  }, [item.receivers, item.product.productType])

  const debouncedAddressInput = useCallback(
    debounce(async (receiverId: string, value: string) => {
      try {
        const suggestions = await addressAutocomplete(value)
        setAddressSuggestions((prev) => ({ ...prev, [receiverId]: suggestions }))
      } catch (error) {
        console.error('Error fetching address suggestions:', error)
        setAddressSuggestions((prev) => ({ ...prev, [receiverId]: [] }))
      }
    }, 300),
    [],
  )

  const handleNameChange = (receiverId: string, value: string) => {
    setNames((prev) => ({ ...prev, [receiverId]: value }))
    updateReceiver(item.product.id, receiverId, { name: value })
  }

  const handleMessageChange = (receiverId: string, value: string) => {
    setMessages((prev) => ({ ...prev, [receiverId]: value }))
    updateReceiver(item.product.id, receiverId, { message: value })
  }

  const handleFormattedAddressChange = useCallback(
    (receiverId: string, value: string) => {
      setFormattedAddresses((prev) => ({
        ...prev,
        [receiverId]: value,
      }))
      debouncedAddressInput(receiverId, value)
    },
    [debouncedAddressInput],
  )

  const clearSuggestionsForReceiver = (receiverId: string) => {
    setAddressSuggestions((prev) => ({
      ...prev,
      [receiverId]: [],
    }))
  }

  const handleShippingMethodChange = useCallback(
    (receiverId: string, selected: (typeof shippingOptions)[0]) => {
      setSelectedShipping((prev) => ({
        ...prev,
        [receiverId]: selected,
      }))
      updateReceiver(item.product.id, receiverId, {
        delivery: {
          shippingMethod: selected.value as ShippingMethod,
        },
      })
    },
    [item.product.id, updateReceiver],
  )

  if (!item) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-3 pt-6 sm:px-6 md:px-6">
      {item.receivers?.map((receiver: Receiver, index: number) => (
        <div
          key={receiver.id}
          className="relative flex flex-col justify-between rounded-sm border border-solid hover:shadow-xl hover:delay-75 duration-150 p-6 aspect-square"
        >
          <div className="space-y-8 sm:space-y-10">
            {/* heading / title / actions */}
            <div className="flex flex-row justify-between items-center">
              <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
                {`#${(index + 1).toString().padStart(2, '0')}`}
              </span>
              <div className="flex justify-end items-center gap-x-4 sm:gap-x-3">
                <CopyReceiverIcon
                  orderItemId={item.product.id}
                  receiverId={receiver.id}
                  // className="h-8 w-8 sm:h-6 sm:w-6"
                />
                <RemoveReceiverIcon
                  orderItemId={item.product.id}
                  receiverId={receiver.id}
                  removeReceiver={removeReceiver}
                  // className="h-8 w-8 sm:h-6 sm:w-6"
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* receiver */}
              <div>
                <label
                  htmlFor={`name-${receiver.id}`}
                  className="block text-sm font-medium text-gray-900"
                >
                  <UserIcon className="inline-block mr-1 h-5 w-5 text-gray-400" strokeWidth={1.2} />
                  Name
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`A full name and any business name helps with delivery`}
                </span>
                <input
                  id={`name-${receiver.id}`}
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={names[receiver.id] || ''}
                  className={cn(
                    'mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                    validationErrors[receiver.id]?.name && 'border-red-500',
                  )}
                  onChange={(e) => handleNameChange(receiver.id, e.target.value)}
                  aria-invalid={!!validationErrors[receiver.id]?.name}
                  aria-describedby={
                    validationErrors[receiver.id]?.name ? `name-error-${receiver.id}` : undefined
                  }
                />
                {validationErrors[receiver.id]?.name && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`name-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].name}
                  </span>
                )}
              </div>

              {/* message */}
              <div>
                <label
                  htmlFor={`message-${receiver.id}`}
                  className="block text-sm font-medium text-gray-900"
                >
                  <MessageSquareTextIcon
                    className="inline-block mr-1 h-5 w-5 text-gray-400"
                    strokeWidth={1.2}
                  />
                  Message
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`Write a personal message for the recipient (60-100 words)`}
                </span>
                <textarea
                  id={`message-${receiver.id}`}
                  name="message"
                  value={messages[receiver.id] || ''}
                  maxLength={400}
                  rows={5}
                  placeholder="Add a message with your thankly here..."
                  className={cn(
                    'font-body mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                    validationErrors[receiver.id]?.message && 'border-red-500',
                  )}
                  onChange={(e) => handleMessageChange(receiver.id, e.target.value)}
                  aria-invalid={!!validationErrors[receiver.id]?.message}
                  aria-describedby={
                    validationErrors[receiver.id]?.message
                      ? `message-error-${receiver.id}`
                      : undefined
                  }
                />
                {validationErrors[receiver.id]?.message && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`message-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].message}
                  </span>
                )}
              </div>

              {/* address */}
              <div>
                <label
                  htmlFor={`address-${receiver.id}`}
                  className="block text-sm font-medium text-gray-900"
                >
                  <MapPinIcon
                    className="inline-block mr-1 h-5 w-5 text-gray-400"
                    strokeWidth={1.2}
                  />
                  Address
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`Provide the complete shipping address. `}
                </span>

                <Field className="flex items-center py-2">
                  <Switch
                    checked={poBoxFlags[receiver.id] ?? false}
                    onChange={() => {
                      setPoBoxFlags((prev) => {
                        const newState = { ...prev, [receiver.id]: !prev[receiver.id] }
                        updateReceiver(item.product.id, receiver.id, {
                          delivery: {
                            address: {
                              ...receiver.delivery?.address,
                              addressLine1: newState[receiver.id] ? '' : null,
                            },
                          },
                        })
                        return newState
                      })
                    }}
                    className="group relative inline-flex h-5 w-10 sm:h-5 sm:w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 data-[checked]:bg-green"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-4.5 w-4 sm:h-4.5 sm:w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-4 sm:group-data-[checked]:translate-x-3.5"
                    />
                  </Switch>
                  <Label as="span" className="ml-3 text-xs">
                    <span className="font-semibold text-gray-500">{` Sending to AusPost Parcel Collect / Locker / PO Box?`}</span>{' '}
                  </Label>
                </Field>

                {(poBoxFlags[receiver.id] || addressesLine1[receiver.id]) && (
                  <>
                    <input
                      id={`addressLine1-${receiver.id}`}
                      name="addressLine1"
                      type="text"
                      placeholder="Parcel Collect / Locker / PO Box"
                      value={addressesLine1[receiver.id] || ''}
                      onChange={(e) => {
                        const newAddressLine1 = e.target.value
                        setLine1Addresses((prev) => ({
                          ...prev,
                          [receiver.id]: newAddressLine1,
                        }))
                        updateReceiver(item.product.id, receiver.id, {
                          delivery: {
                            address: {
                              ...receiver.delivery?.address,
                              addressLine1: newAddressLine1,
                            },
                          },
                        })
                      }}
                      className={cn(
                        'block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                        validationErrors[receiver.id]?.addressLine1 && 'border-red-500',
                      )}
                      aria-invalid={!!validationErrors[receiver.id]?.addressLine1}
                      aria-describedby={
                        validationErrors[receiver.id]?.addressLine1
                          ? `addressLine1-error-${receiver.id}`
                          : undefined
                      }
                    />
                    {validationErrors[receiver.id]?.addressLine1 && (
                      <span
                        className="block mt-1 text-sm text-red-600"
                        id={`addressLine1-error-${receiver.id}`}
                      >
                        {validationErrors[receiver.id].addressLine1}
                      </span>
                    )}
                  </>
                )}
                <input
                  id={`address-${receiver.id}`}
                  name="formattedAddress"
                  type="text"
                  value={formattedAddresses[receiver.id] || ''}
                  placeholder="Enter street address"
                  onChange={(e) => handleFormattedAddressChange(receiver.id, e.target.value)}
                  className={cn(
                    'mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
                    validationErrors[receiver.id]?.formattedAddress && 'border-red-500',
                  )}
                  aria-invalid={!!validationErrors[receiver.id]?.formattedAddress}
                  aria-describedby={
                    validationErrors[receiver.id]?.formattedAddress
                      ? `address-error-${receiver.id}`
                      : undefined
                  }
                />
                {validationErrors[receiver.id]?.formattedAddress && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`address-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].formattedAddress}
                  </span>
                )}
                {addressSuggestions[receiver.id]?.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {addressSuggestions[receiver.id].map((suggestion, index) => (
                      <div
                        key={index}
                        className="relative cursor-default select-none py-3 sm:py-2 px-4 sm:px-3 text-gray-900 hover:bg-green/75 hover:text-white"
                        onClick={debounce(() => {
                          startTransition(() => {
                            try {
                              updateReceiver(item.product.id, receiver.id, {
                                delivery: {
                                  address: {
                                    addressLine2: suggestion.formattedAddress,
                                    formattedAddress: suggestion.formattedAddress,
                                    json: suggestion,
                                  },
                                },
                              })
                              setFormattedAddresses((prev) => ({
                                ...prev,
                                [receiver.id]: suggestion.formattedAddress,
                              }))
                              clearSuggestionsForReceiver(receiver.id)
                            } catch (error) {
                              console.error('Error saving address:', error)
                            }
                          })
                        }, 200)}
                      >
                        <MapPinIcon className="inline-block h-5 w-5 text-gray-400 mr-2" />
                        {suggestion.addressLabel}, {suggestion.city}, {suggestion.state}{' '}
                        {suggestion.postalCode}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* shipping method */}
              <div>
                <label
                  htmlFor="shipping-method"
                  className="block text-sm font-medium text-gray-900"
                >
                  <SendIcon className="inline-block mr-1 h-5 w-5 text-gray-400" strokeWidth={1.2} />
                  Shipping
                </label>
                <span className="block mt-1 text-xs text-gray-500">
                  {`Choose your preferred shipping method. FREE shipping for orders over $150.
        Discount applied at checkout.`}
                </span>

                <RadioGroup
                  value={selectedShipping[receiver.id] || shippingOptions[0]}
                  onChange={(selected) => handleShippingMethodChange(receiver.id, selected)}
                  className={cn(
                    'mt-2 grid grid-cols-2 gap-3 sm:grid-cols-2 leading-tighter',
                    validationErrors[receiver.id]?.shippingMethod && 'border-red-500',
                  )}
                >
                  {shippingOptions
                    .filter((option) => option.productType === item.product.productType)
                    .map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        className={cn(
                          'cursor-pointer focus:outline-none leading-tighter',
                          'flex items-center justify-center rounded-md bg-white px-3 py-3 text-sm  text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 data-[checked]:bg-green data-[checked]:text-white data-[checked]:ring-0 data-[focus]:data-[checked]:ring-2 data-[focus]:ring-2 data-[focus]:ring-green data-[focus]:ring-offset-2 data-[checked]:hover:bg-green sm:flex-1 [&:not([data-focus],[data-checked])]:ring-inset',
                        )}
                      >
                        {option.name}
                      </Radio>
                    ))}
                </RadioGroup>
                {validationErrors[receiver.id]?.shippingMethod && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`shipping-error-${receiver.id}`}
                  >
                    {validationErrors[receiver.id].shippingMethod}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 text-right">
            <div>
              <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                {`Cost: ${
                  receiver.totals.cost.toLocaleString('en-AU', {
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
                  receiver.totals.shipping
                    ? receiver.totals.shipping?.toLocaleString('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })
                    : '(needs address)'
                }`}
              </span>
            </div>
            <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
              {`Subtotal: ${
                receiver.totals.subTotal.toLocaleString('en-AU', {
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
