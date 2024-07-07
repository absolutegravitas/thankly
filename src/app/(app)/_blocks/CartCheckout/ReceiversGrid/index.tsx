'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { contentFormats } from '@app/_css/tailwindClasses'
import { useCart } from '@app/_providers/Cart'
import { debounce } from 'lodash'
import { CircleAlert, MapPinIcon, MessageSquareTextIcon, SendIcon, UsersIcon } from 'lucide-react'
import { AddReceiverButton, CopyReceiverIcon, RemoveReceiverIcon } from './ReceiverActions'
import Radar from 'radar-sdk-js'
// import 'react-app-polyfill/stable'

export const ReceiversGrid: React.FC<{ item: any }> = ({ item }) => {
  useEffect(() => {
    Radar.initialize(process.env.NEXT_PUBLIC_RADAR_PUBLISHABLE_KEY as string, {
      cacheLocationMinutes: 10,
      desiredAccuracy: 'medium',
    })
  }, [])

  if (!item) return null
  const { updateReceiver, removeReceiver, copyReceiver, addReceiver } = useCart()
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  // console.log('cart item receivers --', JSON.stringify(item?.receivers || null))
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([])
  const [debugLogs, setDebugLogs] = useState<string[]>([])

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

  const debouncedHandleInputChange = useCallback(debounce(handleInputChange, 100), [
    handleInputChange,
  ])

  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    }
    // Remove the check for commas in the address
    return ''
  }

  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768) // Adjust this breakpoint as needed
      }

      checkIsMobile()
      window.addEventListener('resize', checkIsMobile)

      return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    return isMobile
  }
  const isMobile = useIsMobile()

  const addLog = (message: string) => {
    setDebugLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`].slice(-10)) // Keep last 10 logs
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
                  <div className="relative">
                    <div className="relative flex items-center">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValues[`${receiver.id}-address`] || ''}
                        placeholder="Enter address"
                        className="peer block w-full border-0 bg-gray-50 py-1.5 pl-10 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 address-input"
                        data-product-id={item.id}
                        data-receiver-id={receiver.id}
                        onBlur={() =>
                          setErrors((prev) => ({
                            ...prev,
                            [`${receiver.id}-address`]: validateField(
                              'address',
                              inputValues[`${receiver.id}-address`] || '',
                            ),
                          }))
                        }
                        onFocus={() => {
                          // Ensure the input is scrolled into view on mobile
                          if (inputRef.current) {
                            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }
                        }}
                        onTouchStart={() => {
                          // Ensure the input is focused on touch devices
                          if (inputRef.current) {
                            inputRef.current.focus()
                          }
                        }}
                        onChange={(e) => {
                          const value = e.target.value
                          addLog(`Input value changed: ${value}`)
                          setInputValues((prev) => ({ ...prev, [`${receiver.id}-address`]: value }))

                          if (value.length > 2) {
                            console.log('Initiating Radar autocomplete')
                            addLog('Initiating Radar autocomplete')
                            setIsLoading((prev) => ({ ...prev, [receiver.id]: true }))
                            Radar.autocomplete({
                              query: value,
                              countryCode: 'AU',
                              limit: 5,
                            })
                              .then((result) => {
                                addLog(`Autocomplete results: ${result}`)

                                if (result.addresses && result.addresses.length > 0) {
                                  setAutocompleteResults(result.addresses)
                                } else {
                                  setAutocompleteResults([])
                                }
                                setIsLoading((prev) => ({ ...prev, [receiver.id]: false }))
                              })
                              .catch((err) => {
                                addLog(`Radar autocomplete error: ${err.message}`)
                                setAutocompleteResults([])
                                setIsLoading((prev) => ({ ...prev, [receiver.id]: false }))
                              })
                          } else {
                            setAutocompleteResults([])
                          }

                          debouncedHandleInputChange(item.id, receiver.id, 'addressLine1', value)
                        }}
                      />

                      {isLoading[receiver.id] && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <span className="animate-spin">⌛</span>
                        </div>
                      )}
                    </div>
                    {(autocompleteResults.length > 0 || isMobile) && (
                      <div
                        className={`relative z-50 ${isMobile ? 'fixed inset-x-0 bottom-0 bg-white' : ''}`}
                      >
                        <div className="absolute #z-10 left-0 right-0 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {autocompleteResults.map((address, index) => (
                            <li
                              key={index}
                              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                              onClick={() => {
                                const fullAddress = `${address.addressLabel}, ${address.city}, ${address.state} ${address.postalCode}`
                                setInputValues((prev) => ({
                                  ...prev,
                                  [`${receiver.id}-address`]: fullAddress,
                                }))
                                updateReceiver(item.id, receiver.id, {
                                  addressLine1: address.addressLabel,
                                  city: address.city,
                                  state: address.state,
                                  postcode: address.postalCode,
                                })
                                setAutocompleteResults([])
                                setErrors((prev) => ({ ...prev, [`${receiver.id}-address`]: '' }))
                              }}
                            >
                              <div className="flex items-center">
                                <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <span>
                                  {address.addressLabel}, {address.city}, {address.state}{' '}
                                  {address.postalCode}
                                </span>
                              </div>
                            </li>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors[`${receiver.id}-address`] && (
                    <p className="mt-2 text-sm text-red-600">{errors[`${receiver.id}-address`]}</p>
                  )}
                  <div className="mt-8 p-4 bg-gray-100 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Debug Logs</h3>
                    <ul className="text-sm font-mono">
                      {debugLogs.map((log, index) => (
                        <li key={index} className="mb-1">
                          {log}
                        </li>
                      ))}
                    </ul>
                  </div>
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
