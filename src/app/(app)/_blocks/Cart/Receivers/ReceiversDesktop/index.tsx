'use client'

import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useCart } from '@/app/(app)/_providers/Cart'
import {
  CheckIcon,
  ChevronDown,
  MapPinIcon,
  MessageCircleWarningIcon,
  MessageSquareTextIcon,
  SendIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import { AddReceiver, CopyReceiver, RemoveReceiver } from '../ReceiverActions'
import { addressAutocomplete } from '../addressAutocomplete'
import { debounce, update } from 'lodash'
import { Cart, Product } from '@/payload-types'
import { Field, Label, Switch } from '@headlessui/react'
import { Radio, RadioGroup } from '@headlessui/react'
import cn from '@/utilities/cn'
import { CartItem, Receiver, ValidationErrors, shippingOptions, ShippingMethod } from '..'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { cartPageText } from '@/utilities/referenceText'

export const ReceiversDesktop = (item: CartItem) => {
  const { cart, updateReceiver, removeReceiver } = useCart()

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
    const currentItem = cart.items?.find((cartItem) => cartItem.id === item.id)
    console.log('Current Item in Cart:', currentItem)
  }, [cart, item.id])

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
    <>
      <div className="">
        <div className="relative flex justify-between gap-x-3 p-3  ">
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="sm:flex sm:flex-col">
              <p className="my-0 text-sm font-semibold leading-6 text-gray-900">Receivers</p>
              <p className="my-0 text-xs leading-5 text-gray-500">{cartPageText.receiverMessage}</p>
            </div>
          </div>
          <div className="flex shrink-0  gap-x-4 items-end">
            <div className="sm:flex sm:flex-col sm:items-end">
              {/* <p className="my-0 text-sm leading-6 text-gray-900">{`Total for this Thankly: ${
              item.totals.subTotal.toLocaleString('en-AU', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }) || 0
            }`}</p>
            <p className="my-0 text-xs leading-5 text-gray-500">{`Sending to ${item.receivers.length} ${item.receivers.length === 1 ? 'person' : 'people'}`}</p> */}
            </div>
            <div className="sm:flex sm:flex-col sm:items-end"></div>
            <AddReceiver productId={item.product.id} />
          </div>
        </div>
        <div className="relative flex flex-col justify-between #gap-x-3 p-3  ">
          <div className="space-y-4">
            {/* Header */}
            <div className="hidden sm:flex text-sm font-semibold text-gray-900 bg-gray-100 ">
              <div className="flex-1 p-3">Name & Message</div>
              <div className="flex-1 p-3">Address</div>
              <div className="flex-1 p-3 ">Shipping</div>
              <div className="w-32 p-3">Cost</div>
              <div className="w-24 p-3">Actions</div>
            </div>

            {/* Receivers list */}
            {item.receivers?.map((receiver, index) => (
              <div
                key={receiver.id}
                className="flex flex-col sm:flex-row bg-white shadow-sm hover:bg-neutral-50"
              >
                {/* Name & Message */}
                <div className="flex-1 p-3 space-y-2 w-full">
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-3 font-semibold text-sm ">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900 w-full">
                        <input
                          id={`name-${receiver.id}`}
                          name="name"
                          type="text"
                          placeholder="Jane Smith"
                          value={names[receiver.id] || ''}
                          className={cn(
                            'peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 px-1  placeholder-gray-400 focus:border-green/75 focus:ring-0 text-sm',
                            validationErrors[receiver.id]?.name && 'border-red-500',
                          )}
                          onChange={(e) => handleNameChange(receiver.id, e.target.value)}
                          aria-invalid={!!validationErrors[receiver.id]?.name}
                          aria-describedby={
                            validationErrors[receiver.id]?.name
                              ? `name-error-${receiver.id}`
                              : undefined
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
                      <div className="text-sm text-gray-500  w-full">
                        {/* <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email
                          </label>
                          <div className="relative mt-2 rounded-md shadow-sm">
                            <textarea
                              defaultValue="adamwathan"
                              id="email"
                              name="email"
                              placeholder="you@example.com"
                              aria-invalid="true"
                              aria-describedby="email-error"
                              className="block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <MessageCircleWarningIcon
                                aria-hidden="true"
                                className="h-5 w-5 text-red-500"
                              />
                            </div>
                          </div>
                          <p id="email-error" className="mt-2 text-sm text-red-600">
                            Not a valid email address.
                          </p>
                        </div> */}
                        <textarea
                          id={`message-${receiver.id}`}
                          name="message"
                          value={messages[receiver.id] || ''}
                          maxLength={400}
                          rows={3}
                          placeholder="Add a message with your thankly here..."
                          className={cn(
                            'font-body peer tracking-tight block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 px-1  placeholder-gray-400 focus:border-green/75 focus:ring-0  sm:text-sm',
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
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex-1 p-3 space-y-2 w-full">
                  <div className="text-sm text-gray-500">
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
                            'block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 px-1  placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm',
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
                  </div>
                  <div className="text-sm text-gray-900">
                    <input
                      id={`address-${receiver.id}`}
                      name="formattedAddress"
                      type="text"
                      value={formattedAddresses[receiver.id] || ''}
                      placeholder="Enter street address"
                      onChange={(e) => handleFormattedAddressChange(receiver.id, e.target.value)}
                      className={cn(
                        'peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 px-1  placeholder-gray-400 focus:border-green/75 focus:ring-0  sm:text-sm',
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
                      <div className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {addressSuggestions[receiver.id].map((suggestion, index) => (
                          <div
                            key={index}
                            className="relative cursor-default select-none py-3 sm:px-4 sm:px-3  hover:bg-green/75 hover:text-white"
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
                </div>

                {/* Shipping */}
                <div className="flex-1 p-3 space-y-2 w-full">
                  <RadioGroup
                    value={selectedShipping[receiver.id] || shippingOptions[0]}
                    onChange={(selected) => handleShippingMethodChange(receiver.id, selected)}
                    className={cn(
                      'flex flex-wrap gap-2',
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
                            'cursor-pointer focus:outline-none',
                            'px-3 py-2 text-sm rounded-md',
                            'bg-white text-gray-900 ring-1 ring-gray-300',
                            'hover:bg-gray-50',
                            'data-[checked]:bg-green data-[checked]:text-white data-[checked]:ring-0',
                            'data-[focus]:ring-2 data-[focus]:ring-green data-[focus]:ring-offset-2',
                            '[&:not([data-focus],[data-checked])]:ring-inset',
                          )}
                        >
                          {option.name.replace(' Parcel', '').replace(' Mail', '')}
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

                {/* Cost */}
                <div className="w-32 p-3 text-sm text-gray-500">
                  {`Cost: ${
                    receiver.totals.cost.toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }) || 0
                  }`}
                  <br />
                  {`Shipping: ${
                    receiver.totals.shipping
                      ? receiver.totals.shipping?.toLocaleString('en-AU', {
                          style: 'currency',
                          currency: 'AUD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })
                      : '(no address)'
                  }`}
                  <p />
                  {`Subtotal: ${
                    receiver.totals.subTotal.toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }) || 0
                  }`}
                </div>

                {/* Actions */}
                <div className="w-24 p-3 flex flex-col space-y-2 sm:items-end">
                  <div className="flex justify-end items-center gap-x-4 sm:gap-x-3">
                    <CopyReceiver cartItemId={item.product.id} receiverId={receiver.id} />
                    <RemoveReceiver
                      cartItemId={item.product.id}
                      receiverId={receiver.id}
                      removeReceiver={removeReceiver}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
