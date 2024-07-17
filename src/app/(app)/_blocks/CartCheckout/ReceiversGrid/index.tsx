'use client'

import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'
import { MapPinIcon, MessageSquareTextIcon, SendIcon, UserIcon, UsersIcon } from 'lucide-react'
import { AddReceiverButton, CopyReceiverIcon, RemoveReceiverIcon } from './ReceiverActions'
import { addressAutocomplete } from './addressAutocomplete'
import { debounce, update } from 'lodash'
import { Cart, Product } from '@/payload-types'
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
  totals: {
    receiverThankly: number
    receiverShipping: number
    receiverTotal: number
  }
}

interface CartItem {
  id: string
  product: Product
  receivers: Receiver[]
}

type ShippingMethod = 'standardMail' | 'expressMail' | 'standardParcel' | 'expressParcel' | null

export const ReceiversGrid: React.FC<{ item: CartItem }> = ({ item }) => {
  const { cart, updateReceiver, removeReceiver } = useCart()
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isPending, startTransition] = useTransition()
  const [formattedAddresses, setFormattedAddresses] = useState<{ [key: string]: string }>({})
  const [names, setNames] = useState<{ [key: string]: string }>({})
  const [messages, setMessages] = useState<{ [key: string]: string }>({})

  const [isManualEntry, setIsManualEntry] = useState<{ [key: string]: boolean }>({})
  const [selectedShipping, setSelectedShipping] = useState<{
    [key: string]: (typeof shippingOptions)[0]
  }>(() => {
    const initialShipping: { [key: string]: (typeof shippingOptions)[0] } = {}
    item.receivers?.forEach((receiver) => {
      let selectedOption: (typeof shippingOptions)[0]
      if (receiver.shippingMethod) {
        selectedOption =
          shippingOptions.find((option) => option.value === receiver.shippingMethod) ||
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

      // Apply the same logic as in onChange
      updateReceiver(item.product.id, receiver.id, {
        ['shippingMethod']: selectedOption.value as ShippingMethod,
      })
    })
    return initialShipping
  })

  useEffect(() => {
    const currentItem = cart.items?.find((cartItem) => cartItem.id === item.id)
    console.log('Current Item in Cart:', currentItem)
  }, [cart, item.id])

  useEffect(() => {
    const initialManualEntry: { [key: string]: boolean } = {}
    const initialShipping: { [key: string]: (typeof shippingOptions)[0] } = {}
    const initialAddresses: { [key: string]: string } = {}
    const initialNames: { [key: string]: string } = {}
    const initialMessages: { [key: string]: string } = {}

    item.receivers?.forEach((receiver) => {
      initialManualEntry[receiver.id] = !!receiver.address?.addressLine1
      initialAddresses[receiver.id] = receiver.address?.formattedAddress || ''
      initialNames[receiver.id] = receiver.name || ''
      initialMessages[receiver.id] = receiver.message || ''

      let selectedOption: (typeof shippingOptions)[0]
      if (receiver.shippingMethod) {
        selectedOption =
          shippingOptions.find((option) => option.value === receiver.shippingMethod) ||
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

    setIsManualEntry(initialManualEntry)
    setSelectedShipping(initialShipping)
    setFormattedAddresses(initialAddresses)
    setNames(initialNames)
    setMessages(initialMessages)
  }, [item.receivers, item.product.productType])

  const debouncedAddressInput = useCallback(
    debounce(async (value: string) => {
      try {
        const suggestions = await addressAutocomplete(value)
        console.log('suggestions --', suggestions)

        setAddressSuggestions(suggestions)
      } catch (error) {
        console.error('Error fetching address suggestions:', error)
        setAddressSuggestions([])
      }
    }, 300),
    [],
  )

  const handleFormattedAddressChange = (receiverId: string, value: string) => {
    setFormattedAddresses((prev) => ({
      ...prev,
      [receiverId]: value,
    }))
    debouncedAddressInput(value)
  }

  const handleAddressSuggestionClick = useCallback(
    (cartItemId: string, receiverId: string, suggestion: any) => {
      console.log('selected suggestion --', suggestion)

      const addressFields = {
        address: {
          formattedAddress: `${suggestion.formattedAddress}`,
          addressLine2: suggestion.formattedAddress,
          json: suggestion,
        },
      }
      updateReceiver(cartItemId, receiverId, addressFields)
      setAddressSuggestions([])
    },
    [updateReceiver],
  )

  if (!item) return null

  return (
    <div className="sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
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
                  cartItemId={item.product.id}
                  receiverId={receiver.id}
                  // className="h-8 w-8 sm:h-6 sm:w-6"
                />
                <RemoveReceiverIcon
                  cartItemId={item.product.id}
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
                  className="mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm"
                  onChange={debounce((e: any) => {
                    console.log('name updated -- ', e.target.value)
                    startTransition(() => {
                      try {
                        updateReceiver(item.product.id, receiver.id, { ['name']: e.target.value })
                      } catch (error) {
                        console.error('Error copying receiver:', error)
                        //  setErrors((prev) => ({ ...prev, [`${receiverId}-${field}`]: error }))
                      }
                    })
                  }, 200)}
                  aria-invalid={!!errors[`${receiver.id}-name`]}
                  aria-describedby={
                    errors[`${receiver.id}-name`] ? `name-error-${receiver.id}` : undefined
                  }
                />
                {errors[`${receiver.id}-name`] && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`name-error-${receiver.id}`}
                  >
                    {errors[`${receiver.id}-name`]}
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
                  placeholder="It was the best of times..."
                  className="font-body mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm"
                  onChange={debounce((e: any) => {
                    console.log('message updated -- ', e.target.value)
                    startTransition(() => {
                      try {
                        updateReceiver(item.product.id, receiver.id, {
                          ['message']: e.target.value,
                        })
                      } catch (error) {
                        console.error('Error copying receiver:', error)
                      }
                    })
                  }, 200)}
                  aria-invalid={!!errors[`${receiver.id}-message`]}
                  aria-describedby={
                    errors[`${receiver.id}-message`] ? `message-error-${receiver.id}` : undefined
                  }
                />
                {errors[`${receiver.id}-message`] && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`message-error-${receiver.id}`}
                  >
                    {errors[`${receiver.id}-message`]}
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
                    id={`manual-entry-${receiver.id}`}
                    checked={isManualEntry[receiver.id] || false}
                    onChange={() => {
                      setIsManualEntry((prev) => ({
                        ...prev,
                        [receiver.id]: !prev[receiver.id],
                      }))
                      // Update the receiver data when the switch is toggled
                      updateReceiver(item.product.id, receiver.id, {
                        address: {
                          ...receiver.address,
                          addressLine1: isManualEntry[receiver.id]
                            ? null
                            : receiver.address?.addressLine1 || '',
                        },
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

                {(isManualEntry[receiver.id] || receiver?.address?.addressLine1) && (
                  <input
                    id={`addressLine1-${receiver.id}`}
                    name="addressLine1"
                    type="text"
                    placeholder="Parcel Collect / Locker / PO Box"
                    value={receiver.address?.addressLine1 || ''}
                    onChange={debounce((e: any) => {
                      const newAddressLine1 = e.target.value
                      startTransition(() => {
                        try {
                          updateReceiver(item.product.id, receiver.id, {
                            address: {
                              ...receiver.address,
                              addressLine1: newAddressLine1,
                            },
                          })
                        } catch (error) {
                          console.error('Error updating addressLine1:', error)
                        }
                      })
                    }, 200)}
                    className="block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm"
                  />
                )}
                <input
                  id={`address-${receiver.id}`}
                  name="formattedAddress"
                  type="text"
                  value={formattedAddresses[receiver.id] || ''}
                  placeholder="Enter street address"
                  onChange={(e) => handleFormattedAddressChange(receiver.id, e.target.value)}
                  className="mt-2 peer block w-full border-0 focus:outline-none border-b focus:border-b-2 border-gray-300 bg-gray-50 py-2 px-1 text-gray-900 placeholder-gray-400 focus:border-green/75 focus:ring-0 text-base sm:text-sm"
                  aria-invalid={!!errors[`${receiver.id}-formattedAddress`]}
                  aria-describedby={
                    errors[`${receiver.id}-formattedAddress`]
                      ? `address-error-${receiver.id}`
                      : undefined
                  }
                />
                {errors[`${receiver.id}-formattedAddress`] && (
                  <span
                    className="block mt-1 text-sm text-red-600"
                    id={`address-error-${receiver.id}`}
                  >
                    {errors[`${receiver.id}-formattedAddress`]}
                  </span>
                )}
                {addressSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {addressSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="relative cursor-default select-none py-3 sm:py-2 px-4 sm:px-3 text-gray-900 hover:bg-green/75 hover:text-white"
                        onClick={debounce(() => {
                          console.log('addressLine2 updated -- ', suggestion.formattedAddress)
                          startTransition(() => {
                            try {
                              updateReceiver(item.product.id, receiver.id, {
                                address: {
                                  ...receiver.address,
                                  addressLine2: suggestion.formattedAddress,
                                  formattedAddress: suggestion.formattedAddress,
                                  json: suggestion,
                                },
                              })
                              setFormattedAddresses((prev) => ({
                                ...prev,
                                [receiver.id]: suggestion.formattedAddress,
                              }))
                              setAddressSuggestions([])
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
                  value={selectedShipping[receiver.id]}
                  onChange={(selected) => {
                    setSelectedShipping((prev) => ({
                      ...prev,
                      [receiver.id]: selected,
                    }))
                    updateReceiver(item.product.id, receiver.id, {
                      ['shippingMethod']: selected.value as ShippingMethod,
                    })
                  }}
                  className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-2"
                >
                  {shippingOptions
                    .filter((option) => option.productType === item.product.productType)
                    .map((option) => (
                      <Radio
                        key={option.value}
                        value={option}
                        // disabled={!option.inStock}
                        className={cn(
                          'cursor-pointer focus:outline-none',
                          // : 'cursor-not-allowed opacity-25',
                          'flex items-center justify-center rounded-md bg-white px-3 py-3 text-sm  text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 data-[checked]:bg-green data-[checked]:text-white data-[checked]:ring-0 data-[focus]:data-[checked]:ring-2 data-[focus]:ring-2 data-[focus]:ring-green data-[focus]:ring-offset-2 data-[checked]:hover:bg-green sm:flex-1 [&:not([data-focus],[data-checked])]:ring-inset',
                        )}
                      >
                        {option.name}
                      </Radio>
                    ))}
                </RadioGroup>
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
