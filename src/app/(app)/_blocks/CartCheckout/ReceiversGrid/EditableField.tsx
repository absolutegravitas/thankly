'use client'

declare global {
  interface Window {
    initAutocomplete: () => void
  }
}

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { updateReceiver } from '@/app/(app)/_providers/Cart/receiverActions'
import { debounce } from 'lodash'
import { getShippingCost } from '@/app/(app)/_providers/Cart/cartActions'
type FieldType = 'text' | 'name' | 'address' | 'select' | 'textarea'
type ProductType = 'card' | 'gift'
type ShippingClass = 'mini' | 'small' | 'medium' | 'large'

interface EditableFieldProps {
  initialValue: string | { firstName: string; lastName: string }
  field: string
  cartItemId: string
  receiverId: string
  type?: FieldType
  disabled?: boolean
  productType: ProductType
  shippingClass?: ShippingClass
  getShippingCost: (
    productType: ProductType,
    shippingMethod: string | null | undefined,
    postcode: string | null | undefined,
    shippingClass?: ShippingClass,
  ) => Promise<number | null>
  updateShippingCost: (cartItemId: string, receiverId: string, shippingCost: number | null) => void
  postcode: string | null | undefined
}

const EditableField: React.FC<EditableFieldProps> = ({
  initialValue,
  field,
  cartItemId,
  receiverId,
  type = 'text',
  disabled = false,
  productType,
  shippingClass,
  getShippingCost,
  updateShippingCost,
  postcode,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState<typeof initialValue>(initialValue)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isBusy, setIsBusy] = useState(false)
  const busyClass = isBusy ? 'cursor-wait' : ''
  const placeholderAddress = 'Add delivery address here...'

  const shippingOptions =
    productType === 'card'
      ? [
          { label: 'Standard Mail', value: 'standardMail' },
          { label: 'Registered Post', value: 'registeredMail' },
        ]
      : [
          { label: 'Standard Parcel', value: 'standardParcel' },
          { label: 'Express Parcel', value: 'expressParcel' },
        ]

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (type === 'address' && isEditing) {
      loadGooglePlacesAPI()
    }
  }, [type, isEditing])

  useEffect(() => {
    if (field === 'shippingMethod' && typeof value === 'string' && value === '') {
      const defaultShippingMethod = productType === 'card' ? 'standardMail' : 'standardParcel'
      setValue(defaultShippingMethod)
    }
  }, [field, value, productType])

  const loadGooglePlacesAPI = () => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES}&libraries=places&callback=initAutocomplete`
      script.async = true
      script.defer = true

      // Assign the initAutocomplete function to the window object
      window.initAutocomplete = initAutocomplete

      document.head.appendChild(script)
    } else {
      initAutocomplete()
    }
  }

  const validateField = (
    fieldType: FieldType,
    fieldValue: string | { firstName: string; lastName: string },
  ): string | null => {
    switch (fieldType) {
      case 'name':
        if (typeof fieldValue === 'object') {
          if (!fieldValue.firstName.trim() || !fieldValue.lastName.trim()) {
            return 'First name and last name are required'
          }
          if (fieldValue.firstName.length > 50 || fieldValue.lastName.length > 50) {
            return 'Name cannot exceed 50 characters'
          }
        }
        break
      case 'address':
        if (typeof fieldValue === 'string' && fieldValue.trim().length < 10) {
          return 'Please enter a valid address'
        }
        break
      case 'text':
        if (typeof fieldValue === 'string' && fieldValue.trim().length === 0) {
          return 'This field cannot be empty'
        }
        break
      case 'select':
        if (typeof fieldValue === 'string') {
          const validOptions =
            productType === 'card'
              ? ['standardMail', 'registeredMail']
              : ['standardParcel', 'expressParcel']
          if (!validOptions.includes(fieldValue)) {
            return 'Please select a valid option'
          }
        }
        break
      case 'textarea':
        if (typeof fieldValue === 'string') {
          if (fieldValue.trim().length === 0) {
            return 'This field cannot be empty'
          }
          if (fieldValue.length > 400) {
            return 'Message cannot exceed 400 characters'
          }
        }
        break
    }
    return null
  }
  const calculateAndUpdateShipping = async (shippingMethod: string) => {
    try {
      const shippingCost = await getShippingCost(
        productType,
        shippingMethod,
        postcode,
        shippingClass,
      )
      updateShippingCost(cartItemId, receiverId, shippingCost)
    } catch (error) {
      console.error('Error calculating shipping cost:', error)
      setError('Failed to calculate shipping cost. Please try again.')
    }
  }

  const handleSave = async () => {
    if (isBusy) return
    setIsBusy(true)

    const validationError = validateField(type, value)
    if (validationError) {
      setError(validationError)
      setIsBusy(false)
      return
    }

    setIsEditing(false)
    setError(null)
    if (value !== initialValue) {
      try {
        await updateReceiver(cartItemId, receiverId, { [field]: value })
        if (field === 'shippingMethod' && typeof value === 'string') {
          await calculateAndUpdateShipping(value)
        }
      } catch (error) {
        console.error('Error saving:', error)
        setError('Failed to save. Please try again.')
      } finally {
        setIsBusy(false)
      }
    } else {
      setIsBusy(false)
    }
  }

  const handleClick = () => {
    if (!disabled && !isBusy) {
      setIsEditing(true)
      setError(null)
      if (type === 'address' && value === placeholderAddress) {
        setValue('')
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    let newValue = e.target.value
    if (type === 'textarea') {
      newValue = newValue.replace(/[^a-zA-Z0-9.,!? \n]/g, '')
    }
    setValue(newValue)
    setError(null)

    if (field === 'shippingMethod') {
      handleSave()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault()
      handleSave()
    }
  }
  const renderValue = () => {
    if (type === 'name' && typeof value === 'object') {
      return `${value.firstName} ${value.lastName}`
    }
    if (type === 'select' && typeof value === 'string') {
      return (
        value.charAt(0).toUpperCase() +
        value
          .slice(1)
          .replace(/([A-Z])/g, ' $1')
          .trim()
      )
    }
    if (type === 'textarea' && typeof value === 'string') {
      return value.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < value.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))
    }
    return value as string
  }

  //   const loadGooglePlacesAPI = () => {
  //     if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
  //       const script = document.createElement('script')
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES}&libraries=places`
  //       script.async = true
  //       script.defer = true
  //       script.onload = initAutocomplete
  //       document.head.appendChild(script)
  //     } else {
  //       initAutocomplete()
  //     }
  //   }

  //   const loadGooglePlacesAPI = () => {
  //     const script = document.createElement('script')
  //     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES}&libraries=places`
  //     script.async = true
  //     script.defer = true
  //     script.onload = initAutocomplete
  //     document.head.appendChild(script)
  //   }

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || type !== 'address') return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'AU' },
      fields: ['address_components', 'formatted_address'],
    })

    const debouncedPlaceChanged = debounce(async () => {
      setIsBusy(true)
      const place = autocomplete.getPlace()
      if (place.address_components) {
        const addressComponents = place.address_components
        const streetNumber =
          addressComponents.find((component) => component.types.includes('street_number'))
            ?.long_name || ''
        const streetName =
          addressComponents.find((component) => component.types.includes('route'))?.long_name || ''
        const city =
          addressComponents.find((component) => component.types.includes('locality'))?.long_name ||
          ''
        const state =
          addressComponents.find((component) =>
            component.types.includes('administrative_area_level_1'),
          )?.short_name || ''
        const postcode =
          addressComponents.find((component) => component.types.includes('postal_code'))
            ?.long_name || ''

        const fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${postcode}`
        setValue(fullAddress)
        // updateReceiver(cartItemId, receiverId, { address: fullAddress })
        try {
          updateReceiver(cartItemId, receiverId, { address: fullAddress })
          // Set default shipping method after address is selected
          const defaultShippingMethod = productType === 'card' ? 'standardMail' : 'standardParcel'
          await updateReceiver(cartItemId, receiverId, { shippingMethod: defaultShippingMethod })
          await calculateAndUpdateShipping(defaultShippingMethod)
        } catch (error) {
          console.error('Error saving address:', error)
          setError('Failed to save address. Please try again.')
        } finally {
          setIsBusy(false)
        }
        setIsEditing(false)
      } else {
        setIsBusy(false)
      }
    }, 500)

    autocomplete.addListener('place_changed', debouncedPlaceChanged)
  }, [
    inputRef,
    type,
    cartItemId,
    receiverId,
    setValue,
    updateReceiver,
    setIsBusy,
    productType,
    calculateAndUpdateShipping,
  ])

  useEffect(() => {
    window.initAutocomplete = initAutocomplete
  }, [initAutocomplete])

  //   const initAutocomplete = () => {
  //     if (inputRef.current && type === 'address') {
  //       const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
  //         types: ['address'],
  //         componentRestrictions: { country: 'AU' },
  //         fields: ['address_components', 'formatted_address'],
  //       })

  //       const debouncedPlaceChanged = debounce(() => {
  //         const place = autocomplete.getPlace()
  //         if (place.address_components) {
  //           const addressComponents = place.address_components
  //           const streetNumber =
  //             addressComponents.find((component) => component.types.includes('street_number'))
  //               ?.long_name || ''
  //           const streetName =
  //             addressComponents.find((component) => component.types.includes('route'))?.long_name ||
  //             ''
  //           const city =
  //             addressComponents.find((component) => component.types.includes('locality'))
  //               ?.long_name || ''
  //           const state =
  //             addressComponents.find((component) =>
  //               component.types.includes('administrative_area_level_1'),
  //             )?.short_name || ''
  //           const postcode =
  //             addressComponents.find((component) => component.types.includes('postal_code'))
  //               ?.long_name || ''

  //           const fullAddress = `${streetNumber} ${streetName}, ${city}, ${state}, ${postcode}`
  //           setValue(fullAddress)
  //           updateReceiver(cartItemId, receiverId, { address: fullAddress })
  //         }
  //       }, 500)

  //       autocomplete.addListener('place_changed', debouncedPlaceChanged)
  //     }
  //   }

  const handleBlur = async () => {
    setIsEditing(false)
    if (value !== initialValue) {
      await updateReceiver(cartItemId, receiverId, { [field]: value })
    }
  }

  const LoadingIndicator = () => (
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
      {/* Add your preferred loading indicator here */}
      <span className="animate-spin">⌛</span>
    </div>
  )

  const renderField = () => {
    if (isEditing) {
      switch (type) {
        case 'name':
          return (
            <div className="flex space-x-2">
              <input
                type="text"
                value={(value as { firstName: string; lastName: string }).firstName}
                onChange={(e) =>
                  setValue({
                    ...(value as { firstName: string; lastName: string }),
                    firstName: e.target.value,
                  })
                }
                onKeyDown={handleKeyDown}
                className={`bg-transparent outline-none w-1/2 border-b border-gray-300 ${busyClass}`}
                autoFocus
                disabled={isBusy}
              />
              <input
                type="text"
                value={(value as { firstName: string; lastName: string }).lastName}
                onChange={(e) =>
                  setValue({
                    ...(value as { firstName: string; lastName: string }),
                    lastName: e.target.value,
                  })
                }
                onKeyDown={handleKeyDown}
                disabled={isBusy}
                className={`bg-transparent outline-none w-1/2 border-b border-gray-300 ${busyClass}`}
              />
              {isBusy && <LoadingIndicator />}
            </div>
          )
        case 'address':
          return (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={value as string}
                onChange={handleChange}
                className={`bg-transparent outline-none w-full border-b border-gray-300 ${busyClass}`}
                autoFocus
                disabled={isBusy}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    // Only save if there's no active autocomplete suggestion
                    if (!document.querySelector('.pac-item-selected')) {
                      handleSave()
                    }
                  }
                }}
                placeholder="Enter your address"
              />
              {isBusy && <LoadingIndicator />}
            </div>
          )
        case 'text':
          return (
            <div className="relative">
              <input
                type="text"
                value={value as string}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`bg-transparent outline-none w-full border-b border-gray-300 ${busyClass}`}
                autoFocus
                disabled={isBusy}
              />
              {isBusy && <LoadingIndicator />}
            </div>
          )
        case 'select':
          return (
            <div className="relative">
              <select
                value={value as string}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="bg-transparent outline-none w-full border-b border-gray-300"
                autoFocus
              >
                {shippingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isBusy && <LoadingIndicator />}
            </div>
          )
        case 'textarea':
          return (
            <div className="relative">
              <textarea
                value={value as string}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSave()
                  }
                }}
                className={`bg-transparent outline-none w-full border-b border-gray-300 ${busyClass}`}
                style={{ lineHeight: '1.5', height: '6em' }}
                maxLength={400}
                autoFocus
                disabled={isBusy}
              />
              {isBusy && <LoadingIndicator />}
            </div>
          )
      }
    }

    return (
      <span className="cursor-pointer" onClick={handleClick}>
        {renderValue()}
      </span>
    )
  }

  return (
    <div onBlur={handleBlur} className="w-full">
      {renderField()}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  )
}

export default EditableField
