'use client'

declare global {
  interface Window {
    initAutocomplete: () => void
  }
}

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { updateReceiver } from '@/app/(app)/_providers/Cart/receiverActions'
import { debounce } from 'lodash'

type FieldType = 'text' | 'name' | 'address' | 'select' | 'textarea'

interface EditableFieldProps {
  initialValue: string | { firstName: string; lastName: string }
  field: string
  cartItemId: string
  receiverId: string
  type?: FieldType
  disabled?: boolean
}

const EditableField: React.FC<EditableFieldProps> = ({
  initialValue,
  field,
  cartItemId,
  receiverId,
  type = 'text',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState<typeof initialValue>(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isBusy, setIsBusy] = useState(false)
  const busyClass = isBusy ? 'cursor-wait' : ''

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (type === 'address' && isEditing) {
      loadGooglePlacesAPI()
    }
  }, [type, isEditing])

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

  const handleSave = async () => {
    if (isBusy) return // Prevent multiple saves
    setIsBusy(true)
    setIsEditing(false)
    if (value !== initialValue) {
      try {
        await updateReceiver(cartItemId, receiverId, { [field]: value })
      } catch (error) {
        console.error('Error saving:', error)
        // Optionally, revert to editing state or show an error message
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

    const debouncedPlaceChanged = debounce(() => {
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
        } catch (error) {
          console.error('Error saving address:', error)
          // Optionally handle the error (e.g., show an error message)
        } finally {
          setIsBusy(false)
        }
        setIsEditing(false)
      } else {
        setIsBusy(false)
      }
    }, 500)

    autocomplete.addListener('place_changed', debouncedPlaceChanged)
  }, [inputRef, type, cartItemId, receiverId, setValue, updateReceiver, setIsBusy]) // Add any other dependencies

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
                <option value="" disabled selected>
                  Select an option
                </option>
                <option value="free">Free</option>
                <option value="standardMail">Standard Mail</option>
                <option value="registeredMail">Registered Mail</option>
                <option value="expressMail">Express Mail</option>
                <option value="standardParcel">Standard Parcel</option>
                <option value="expressParcel">Express Parcel</option>
                <option value="courierParcel">Courier Parcel</option>
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
    </div>
  )
}

export default EditableField
