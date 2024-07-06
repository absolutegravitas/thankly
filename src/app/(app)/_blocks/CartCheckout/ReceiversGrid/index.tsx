'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'
import { debounce } from 'lodash'
import { CircleAlert, MapPinIcon, MessageSquareTextIcon, SendIcon, UsersIcon } from 'lucide-react'
import { AddReceiverButton, CopyReceiverIcon, RemoveReceiverIcon } from './ReceiverActions'

declare global {
  interface Window {
    initAutocomplete: () => void
    google: typeof google
    initMap?: () => void // Add this line
  }
}

if (typeof window !== 'undefined') {
  window.initAutocomplete = () => {
    // This function will be called when the script loads
    console.log('Google Maps API loaded')
  }
}

export const ReceiversGrid: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null
  const { updateReceiver, removeReceiver, copyReceiver, addReceiver } = useCart()
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const isGoogleMapsLoaded = useGoogleMapsApi()
  // console.log('cart item receivers --', JSON.stringify(item?.receivers || null))
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})
  const handleInputChange = useCallback(
    (productId: string, receiverId: string, field: string, value: string) => {
      updateReceiver(productId, receiverId, { [field]: value })
      if (field === 'addressLine1') {
        setInputValues((prev) => ({ ...prev, [`${receiverId}-address`]: value }))
      }
      setErrors((prev) => ({ ...prev, [`${receiverId}-${field}`]: '' }))
    },
    [updateReceiver],
  )

  const debouncedHandleInputChange = useCallback(debounce(handleInputChange, 300), [
    handleInputChange,
  ])

  const initAutocomplete = useCallback(
    (input: HTMLInputElement, productId: string, receiverId: string) => {
      if (!isGoogleMapsLoaded || !input) return

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ['address'],
          componentRestrictions: { country: 'AU' },
          fields: ['address_components', 'formatted_address'],
        })

        autocomplete.addListener('place_changed', () => {
          setIsLoading((prev) => ({ ...prev, [receiverId]: true }))
          const place = autocomplete.getPlace()
          if (place.address_components) {
            const addressComponents = place.address_components
            const streetNumber =
              addressComponents.find((component: any) => component.types.includes('street_number'))
                ?.long_name || ''
            const streetName =
              addressComponents.find((component: any) => component.types.includes('route'))
                ?.long_name || ''
            const city =
              addressComponents.find((component: any) => component.types.includes('locality'))
                ?.long_name || ''
            const state =
              addressComponents.find((component: any) =>
                component.types.includes('administrative_area_level_1'),
              )?.short_name || ''
            const postcode =
              addressComponents.find((component: any) => component.types.includes('postal_code'))
                ?.long_name || ''

            const fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${postcode}`
            updateReceiver(productId, receiverId, {
              addressLine1: `${streetNumber} ${streetName}`,
              city,
              state,
              postcode,
            })
            setInputValues((prev) => ({ ...prev, [`${receiverId}-address`]: fullAddress }))
          }
          setIsLoading((prev) => ({ ...prev, [receiverId]: false }))
        })
      } catch (error) {
        console.error('Error initializing autocomplete:', error)
      }
    },
    [isGoogleMapsLoaded, updateReceiver, setIsLoading, setInputValues],
  )

  useEffect(() => {
    if (window.google && window.google.maps) return

    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => {
          resolve()
        }
        document.head.appendChild(script)
      })
    }

    loadGoogleMapsScript().then(() => {
      console.log('Google Maps API loaded')
    })
  }, [])

  useEffect(() => {
    if (!isGoogleMapsLoaded) return

    const inputs = document.querySelectorAll<HTMLInputElement>('.address-input')
    inputs.forEach((input) => {
      const productId = input.dataset.productId
      const receiverId = input.dataset.receiverId
      if (productId && receiverId) {
        initAutocomplete(input, productId, receiverId)
      }
    })
  }, [isGoogleMapsLoaded, initAutocomplete])

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!window.google?.maps?.places) {
        console.log('Google Maps API not yet loaded, retrying in 1 second')
        setTimeout(initializeAutocomplete, 1000)
        return
      }

      const inputs = document.querySelectorAll<HTMLInputElement>('.address-input')
      inputs.forEach((input) => {
        const productId = input.dataset.productId
        const receiverId = input.dataset.receiverId
        if (productId && receiverId) {
          initAutocomplete(input, productId, receiverId)
        }
      })
    }

    initializeAutocomplete()
  }, [initAutocomplete])

  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }
    return ''
  }

  function useGoogleMapsApi() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
      if (window.google && window.google.maps) {
        setIsLoaded(true)
        return
      }

      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true)
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }, [])

    return isLoaded
  }

  return (
    <>
      <div className="px-6 pt-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-4">
        {item?.receivers?.map((receiver: any, index: number) => {
          const inputRef = useRef<HTMLInputElement>(null)

          return (
            <div
              key={receiver.id}
              className="relative flex flex-col justify-between rounded-sm border border-solid hover:scale-105 hover:bg-neutral-200 hover:delay-75 duration-150 p-6 aspect-square"
            >
              <div>
                <div className="flex flex-row justify-between items-center pb-3">
                  <span className={[contentFormats.p, 'font-semibold basis-3/4'].join(' ')}>
                    {`#${(index + 1).toString().padStart(2, '0')}`}
                  </span>
                  <div className="flex basis-3/4 justify-end items-center gap-x-3">
                    <CopyReceiverIcon
                      cartItemId={item.id}
                      receiverId={receiver.id}
                      copyReceiver={copyReceiver}
                    />
                    <RemoveReceiverIcon
                      cartItemId={item.id}
                      receiverId={receiver.id}
                      removeReceiver={removeReceiver}
                    />
                  </div>
                </div>

                {/* receiver message */}
                <div className="mt-2">
                  <div className="relative flex items-center">
                    <MessageSquareTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <textarea
                      value={receiver.message || ''}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/[^a-zA-Z0-9.,!? \n]/g, '')
                        debouncedHandleInputChange(item.id, receiver.id, 'message', newValue)
                      }}
                      onBlur={() =>
                        setErrors((prev) => ({
                          ...prev,
                          [`${receiver.id}-message`]: validateField(
                            'message',
                            receiver.message || '',
                          ),
                        }))
                      }
                      placeholder="Enter your message"
                      className="font-body peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      style={{ lineHeight: '1.5', height: '6em' }}
                      maxLength={400}
                    />
                  </div>
                  {errors[`${receiver.id}-message`] && (
                    <p className="mt-2 text-sm text-red-600">{errors[`${receiver.id}-message`]}</p>
                  )}
                </div>

                {/* receiver first name */}
                <div className="mt-2">
                  <div className="relative flex items-center">
                    <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={receiver.firstName || ''}
                      onChange={(e) =>
                        debouncedHandleInputChange(
                          item.id,
                          receiver.id,
                          'firstName',
                          e.target.value,
                        )
                      }
                      onBlur={() =>
                        setErrors((prev) => ({
                          ...prev,
                          [`${receiver.id}-firstName`]: validateField(
                            'first name',
                            receiver.firstName || '',
                          ),
                        }))
                      }
                      placeholder="Enter receiver's first name"
                      className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors[`${receiver.id}-firstName`] && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors[`${receiver.id}-firstName`]}
                    </p>
                  )}
                </div>

                {/* receiver last name */}
                <div className="mt-2">
                  <div className="relative flex items-center">
                    <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={receiver.lastName || ''}
                      onChange={(e) =>
                        debouncedHandleInputChange(item.id, receiver.id, 'lastName', e.target.value)
                      }
                      onBlur={() =>
                        setErrors((prev) => ({
                          ...prev,
                          [`${receiver.id}-lastName`]: validateField(
                            'last name',
                            receiver.lastName || '',
                          ),
                        }))
                      }
                      placeholder="Enter receiver's last name"
                      className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors[`${receiver.id}-lastName`] && (
                    <p className="mt-2 text-sm text-red-600">{errors[`${receiver.id}-lastName`]}</p>
                  )}
                </div>

                {/* receiver address */}
                <div className="mt-2">
                  <div className="relative flex items-center">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValues[`${receiver.id}-address`] || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        setInputValues((prev) => ({ ...prev, [`${receiver.id}-address`]: value }))
                        debouncedHandleInputChange(item.id, receiver.id, 'addressLine1', value)
                      }}
                      onBlur={() =>
                        setErrors((prev) => ({
                          ...prev,
                          [`${receiver.id}-address`]: validateField(
                            'address',
                            inputValues[`${receiver.id}-address`] || '',
                          ),
                        }))
                      }
                      placeholder="Enter address"
                      className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 address-input"
                      data-product-id={item.id}
                      data-receiver-id={receiver.id}
                    />
                    {isLoading[receiver.id] && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="animate-spin">⌛</span>
                      </div>
                    )}
                  </div>
                  {errors[`${receiver.id}-address`] && (
                    <p className="mt-2 text-sm text-red-600">{errors[`${receiver.id}-address`]}</p>
                  )}
                </div>

                {/* shipping method */}
                <div className="mt-2">
                  <div className="relative flex items-center">
                    <SendIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

                    <select
                      value={receiver.shippingMethod || ''}
                      onChange={(e) =>
                        debouncedHandleInputChange(
                          item.id,
                          receiver.id,
                          'shippingMethod',
                          e.target.value,
                        )
                      }
                      onBlur={() =>
                        setErrors((prev) => ({
                          ...prev,
                          [`${receiver.id}-shippingMethod`]: validateField(
                            'shipping method',
                            receiver.shippingMethod || '',
                          ),
                        }))
                      }
                      className="text-gray-400 peer block w-full border-0 bg-gray-50 py-1.5 pl-10  focus:ring-0 sm:text-sm sm:leading-6"
                    >
                      <option value="" disabled>
                        Select shipping method
                      </option>
                      <option value="standardMail">Standard Mail</option>
                      <option value="registeredMail">Registered Mail</option>
                      <option value="expressMail">Express Mail</option>
                      <option value="standardParcel">Standard Parcel</option>
                      <option value="expressParcel">Express Parcel</option>
                    </select>
                  </div>
                  {errors[`${receiver.id}-shippingMethod`] && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors[`${receiver.id}-shippingMethod`]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-auto text-right">
                <div>
                  <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                    {`Cost: ${(receiver.totals.receiverThankly || 0).toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}`}
                  </span>
                </div>
                <div>
                  <span className={[contentFormats.global, contentFormats.text].join(' ')}>
                    {(receiver.totals.receiverShipping || 0).toLocaleString('en-AU', {
                      style: 'currency',
                      currency: 'AUD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className={[contentFormats.global, contentFormats.h6].join(' ')}>
                  {(receiver.totals.receiverTotal || 0).toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="basis-1/4 flex pb-3 px-3 gap-4">
        <AddReceiverButton productId={item.product.id} addReceiver={addReceiver} />
      </div>
    </>
  )
}
