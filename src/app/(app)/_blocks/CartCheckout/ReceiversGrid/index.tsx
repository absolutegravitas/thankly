import React, { useState, useEffect, useCallback, useTransition } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'
import { MapPinIcon, MessageSquareTextIcon, SendIcon, UsersIcon } from 'lucide-react'
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

const InputField: React.FC<{
  icon: React.ReactNode
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  placeholder: string
  type?: string
  error?: string
}> = React.memo(({ icon, value, onChange, onBlur, placeholder, type = 'text', error }) => (
  <div className="mt-2">
    <div className="relative flex items-center">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
        aria-invalid={!!error}
        aria-describedby={error ? `${placeholder}-error` : undefined}
      />
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-600" id={`${placeholder}-error`}>
        {error}
      </p>
    )}
  </div>
))

const ShippingMethodDropdown: React.FC<{
  value: ShippingMethod
  onChange: (value: ShippingMethod) => void
  onBlur: () => void
  error?: string
}> = React.memo(({ value, onChange, onBlur, error }) => (
  <div className="mt-2">
    <div className="relative flex items-center">
      <SendIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value as ShippingMethod)}
        onBlur={onBlur}
        className="text-gray-400 peer block w-full border-0 bg-gray-50 py-1.5 pl-10 focus:ring-0 sm:text-sm sm:leading-6"
        aria-invalid={!!error}
        aria-describedby={error ? 'shipping-method-error' : undefined}
      >
        <option value="" disabled>
          Select shipping method
        </option>
        <option value="standardMail">Standard Mail</option>
        <option value="expressMail">Express Mail</option>
        <option value="standardParcel">Standard Parcel</option>
        <option value="expressParcel">Express Parcel</option>
      </select>
    </div>
    {error && (
      <p className="mt-2 text-sm text-red-600" id="shipping-method-error">
        {error}
      </p>
    )}
  </div>
))

export const ReceiversGrid: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateReceiver, removeReceiver, copyReceiver, addReceiver } = useCart()
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

  useEffect(() => {
    console.log('ReceiversGrid rendered with item:', item)
  }, [item])

  if (!item) return null

  return (
    <>
      <div className="px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
        {item.receivers?.map((receiver: Receiver, index: number) => (
          <div
            key={receiver.id}
            className="relative flex flex-col justify-between rounded-sm border border-solid hover:shadow-xl hover:delay-75 duration-150 p-6 aspect-square"
          >
            <div>
              <div className="flex flex-row justify-between items-center pb-3">
                <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
                  {`#${(index + 1).toString().padStart(2, '0')}`}
                </span>
                <div className="flex justify-end items-center gap-x-3">
                  <CopyReceiverIcon cartItemId={item.id} receiverId={receiver.id} />
                  <RemoveReceiverIcon
                    cartItemId={item.id}
                    receiverId={receiver.id}
                    removeReceiver={removeReceiver}
                  />
                </div>
              </div>

              <div className="mt-2">
                <div className="relative flex items-center">
                  <MessageSquareTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <textarea
                    value={receiver.message || ''}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/[^a-zA-Z0-9.,!? \n]/g, '')
                      handleFieldChange(item.id, receiver.id, 'message', newValue)
                    }}
                    onBlur={() => handleFieldBlur(receiver.id, 'message', receiver.message)}
                    placeholder="Enter your message"
                    className="font-body peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                    style={{ lineHeight: '1.5', height: '6em' }}
                    maxLength={400}
                    aria-invalid={!!errors[`${receiver.id}-message`]}
                    aria-describedby={
                      errors[`${receiver.id}-message`] ? 'message-error' : undefined
                    }
                  />
                </div>
                {errors[`${receiver.id}-message`] && (
                  <p className="mt-2 text-sm text-red-600" id="message-error">
                    {errors[`${receiver.id}-message`]}
                  </p>
                )}
              </div>

              <InputField
                icon={
                  <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                }
                value={receiver.name || ''}
                onChange={(value) => handleFieldChange(item.id, receiver.id, 'name', value)}
                onBlur={() => handleFieldBlur(receiver.id, 'name', receiver.name)}
                placeholder="Enter receiver's first name"
                error={errors[`${receiver.id}-name`]}
              />

              <div className="mt-2">
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <input
                    type="text"
                    value={receiver.addressLine1 || ''}
                    onChange={(e) => handleAddressInput(item.id, receiver.id, e.target.value)}
                    placeholder="Enter address"
                    className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    aria-invalid={!!errors[`${receiver.id}-addressLine1`]}
                    aria-describedby={
                      errors[`${receiver.id}-addressLine1`] ? 'address-error' : undefined
                    }
                  />
                </div>
                {errors[`${receiver.id}-addressLine1`] && (
                  <p className="mt-2 text-sm text-red-600" id="address-error">
                    {errors[`${receiver.id}-addressLine1`]}
                  </p>
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

              <ShippingMethodDropdown
                value={receiver.shippingMethod}
                onChange={(value) =>
                  handleFieldChange(item.id, receiver.id, 'shippingMethod', value)
                }
                onBlur={() =>
                  handleFieldBlur(receiver.id, 'shippingMethod', receiver.shippingMethod || '')
                }
                error={errors[`${receiver.id}-shippingMethod`]}
              />
            </div>

            {/* <div className="pt-4 text-right">
              <div>
                <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                  {`Cost: ${receiver.totals.receiverThankly.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}`}
                </span>
              </div>
              <div>
                <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                  {receiver.totals.receiverShipping.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
                {receiver.totals.receiverTotal.toLocaleString('en-AU', {
                  style: 'currency',
                  currency: 'AUD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div> */}
          </div>
        ))}
      </div>
      <div className="basis-1/4 flex pb-3 px-3 gap-4">
        <AddReceiverButton productId={item.product.id} addReceiver={addReceiver} />
      </div>
    </>
  )
}

// 'use client'

// import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react'
// import { contentFormats } from '@app/_css/tailwindClasses'
// import { useCart } from '@app/_providers/Cart'
// import { MapPinIcon, MessageSquareTextIcon, SendIcon, UsersIcon } from 'lucide-react'
// import { AddReceiverButton, CopyReceiverIcon, RemoveReceiverIcon } from './ReceiverActions'
// import { addressAutocomplete } from './addressAutocomplete'

// type ShippingMethod =
//   | 'free'
//   | 'standardMail'
//   | 'expressMail'
//   | 'standardParcel'
//   | 'expressParcel'
//   | null

// export const ReceiversGrid: React.FC<{ item: any }> = ({ item }) => {
//   const { updateReceiver, removeReceiver, copyReceiver, addReceiver } = useCart()

//   useEffect(() => {
//     console.log('ReceiversGrid rendered with item:', item)
//   }, [item])

//   if (!item) return null

//   const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})
//   const [isPending, startTransition] = useTransition()

//   const handleAddressInput = async (receiverId: string, value: string) => {
//     startTransition(async () => {
//       const suggestions = await addressAutocomplete(value)
//       setAddressSuggestions(suggestions)
//     })
//   }

//   const validateField = (field: string, value: string) => {
//     if (!value.trim()) {
//       return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
//     }
//     // Remove the check for commas in the address
//     return ''
//   }

//   return (
//     <>
//       <div className="px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
//         {item?.receivers?.map((receiver: any, index: number) => {
//           useEffect(() => {
//             console.log(`Receiver ${index} rendered:`, receiver)
//           }, [receiver, index])
//           console.log(`Rendering receiver ${index}:`, receiver)

//           const inputRef = useRef<HTMLInputElement>(null)

//           return (
//             <div
//               key={receiver.id}
//               className="relative flex flex-col justify-between rounded-sm border border-solid hover:shadow-xl #hover:scale-105 #hover:bg-neutral-200 hover:delay-75 duration-150 p-6 aspect-square"
//             >
//               <div>
//                 <div className="flex flex-row justify-between items-center pb-3">
//                   <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
//                     {`#${(index + 1).toString().padStart(2, '0')}`}
//                   </span>
//                   <div className="flex justify-end items-center gap-x-3">
//                     <CopyReceiverIcon cartItemId={item.id} receiverId={receiver.id} />
//                     <RemoveReceiverIcon
//                       cartItemId={item.id}
//                       receiverId={receiver.id}
//                       removeReceiver={removeReceiver}
//                     />
//                   </div>
//                 </div>

//                 {/* receiver message */}
//                 <div className="mt-2">
//                   <div className="relative flex items-center">
//                     <MessageSquareTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <textarea
//                       value={receiver.message || ''}
//                       onChange={(e) => {
//                         const newValue = e.target.value.replace(/[^a-zA-Z0-9.,!? \n]/g, '')
//                         updateReceiver(item.id, receiver.id, { message: newValue })
//                       }}
//                       onBlur={() =>
//                         setErrors((prev) => ({
//                           ...prev,
//                           [`${receiver.id}-message`]: validateField(
//                             'message',
//                             receiver.message || '',
//                           ),
//                         }))
//                       }
//                       placeholder="Enter your message"
//                       className="font-body peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
//                       style={{ lineHeight: '1.5', height: '6em' }}
//                       maxLength={400}
//                     />
//                   </div>
//                   {errors[`${receiver.id}-message`] && (
//                     <p className="mt-2 text-sm text-red-600">{errors[`${receiver.id}-message`]}</p>
//                   )}
//                 </div>

//                 {/* receiver name */}
//                 <div className="mt-2">
//                   <div className="relative flex items-center">
//                     <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                     <input
//                       type="text"
//                       value={receiver.name || ''}
//                       onChange={(e) =>
//                         updateReceiver(item.id, receiver.id, { name: e.target.value })
//                       }
//                       onBlur={() =>
//                         setErrors((prev) => ({
//                           ...prev,
//                           [`${receiver.id}-name`]: validateField('first name', receiver.name || ''),
//                         }))
//                       }
//                       placeholder="Enter receiver's first name"
//                       className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                   {errors[`${receiver.id}-name`] && (
//                     <p className="mt-2 text-sm text-red-600">{errors[`${receiver.id}-name`]}</p>
//                   )}
//                 </div>

//                 <div className="mt-2">
//                   <div className="relative">
//                     <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
//                     <input
//                       type="text"
//                       value={receiver.addressLine1 || ''}
//                       onChange={(e) => {
//                         updateReceiver(item.id, receiver.id, { addressLine1: e.target.value })
//                         handleAddressInput(receiver.id, e.target.value)
//                       }}
//                       placeholder="Enter address"
//                       className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
//                     />
//                   </div>
//                   {addressSuggestions.length > 0 && (
//                     <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                       {addressSuggestions.map((suggestion, index) => (
//                         <div
//                           key={index}
//                           className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
//                           onClick={() => {
//                             const fullAddress = `${suggestion.addressLabel}, ${suggestion.city}, ${suggestion.state} ${suggestion.postalCode}`
//                             updateReceiver(item.id, receiver.id, {
//                               addressLine1: suggestion.addressLabel,
//                               city: suggestion.city,
//                               state: suggestion.state,
//                               postcode: suggestion.postalCode,
//                             })
//                             setAddressSuggestions([])
//                           }}
//                         >
//                           <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
//                           {suggestion.addressLabel}, {suggestion.city}, {suggestion.state}{' '}
//                           {suggestion.postalCode}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* shipping method */}
//                 <div className="mt-2">
//                   <div className="relative flex items-center">
//                     <SendIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

//                     <select
//                       value={receiver.shippingMethod || ''}
//                       onChange={(e) => {
//                         const selectedMethod = e.target.value as ShippingMethod
//                         if (
//                           // selectedMethod  === 'free' ||
//                           selectedMethod === 'standardMail' ||
//                           selectedMethod === 'expressMail' ||
//                           selectedMethod === 'standardParcel' ||
//                           selectedMethod === 'expressParcel'
//                         ) {
//                           updateReceiver(item.id, receiver.id, { shippingMethod: selectedMethod })
//                         } else {
//                           updateReceiver(item.id, receiver.id, { shippingMethod: null })
//                         }
//                       }}
//                       onBlur={() =>
//                         setErrors((prev) => ({
//                           ...prev,
//                           [`${receiver.id}-shippingMethod`]: validateField(
//                             'shipping method',
//                             receiver.shippingMethod || '',
//                           ),
//                         }))
//                       }
//                       className="text-gray-400 peer block w-full border-0 bg-gray-50 py-1.5 pl-10  focus:ring-0 sm:text-sm sm:leading-6"
//                     >
//                       <option value="" disabled>
//                         Select shipping method
//                       </option>
//                       <option value="standardMail">Standard Mail</option>
//                       <option value="expressMail">Express Mail</option>
//                       <option value="standardParcel">Standard Parcel</option>
//                       <option value="expressParcel">Express Parcel</option>
//                     </select>
//                   </div>
//                   {errors[`${receiver.id}-shippingMethod`] && (
//                     <p className="mt-2 text-sm text-red-600">
//                       {errors[`${receiver.id}-shippingMethod`]}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="pt-4  text-right">
//                 <div>
//                   <span className={[contentFormats.global, contentFormats.text].join(' ')}>
//                     {`Cost: ${(receiver.totals.receiverThankly || 0).toLocaleString('en-AU', {
//                       style: 'currency',
//                       currency: 'AUD',
//                       minimumFractionDigits: 0,
//                       maximumFractionDigits: 2,
//                     })}`}
//                   </span>
//                 </div>
//                 <div>
//                   <span className={[contentFormats.global, contentFormats.text].join(' ')}>
//                     {(receiver.totals.receiverShipping || 0).toLocaleString('en-AU', {
//                       style: 'currency',
//                       currency: 'AUD',
//                       minimumFractionDigits: 0,
//                       maximumFractionDigits: 2,
//                     })}
//                   </span>
//                 </div>
//                 <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
//                   {(receiver.totals.receiverTotal || 0).toLocaleString('en-AU', {
//                     style: 'currency',
//                     currency: 'AUD',
//                     minimumFractionDigits: 0,
//                     maximumFractionDigits: 2,
//                   })}
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//       <div className="basis-1/4 flex pb-3 px-3 gap-4">
//         <AddReceiverButton productId={item.product.id} addReceiver={addReceiver} />
//       </div>
//     </>
//   )
// }
