'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/app/(app)/_components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/(app)/_components/ui/form'
import { Input } from '@/app/(app)/_components/ui/input'
import { User } from '@/payload-types'
import { signOut } from 'next-auth/react'
import { fetchUserDetails, updateUserDetails } from './userActions'
import { useToast } from '@/app/(app)/_hooks/use-toast'
import { debounce } from 'lodash'
import { addressAutocomplete } from '@/app/(app)/_blocks/Cart/Receivers/addressAutocomplete'
import { SearchIcon, MapPinIcon, Loader2 } from 'lucide-react'

const formSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  orgName: z.string().optional(),
  orgId: z
    .string()
    .refine((val) => val === '' || isValidABN(val) || isValidACN(val), {
      message: 'Please enter a valid Australian ABN or ACN',
    })
    .optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  contactNumber: z
    .string()
    .regex(/^(\+61|0)?[2-9]\d{8}$/, 'Please enter a valid Australian phone number')
    .optional()
    .transform((val) => (val ? formatPhoneNumber(val) : val)),
  billingAddress: z.object({
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Postcode is required'),
  }),
})

export default function GeneralSettings({ user }: { user: Partial<User> }) {
  const { toast } = useToast()
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [addressInputValue, setAddressInputValue] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [showAddressSearchMenu, setShowAddressSearchMenu] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      orgName: '',
      orgId: '',
      website: '',
      contactNumber: '',
      billingAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postcode: '',
      },
    },
  })

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails(user.id as unknown as string)
        form.reset({
          firstName: userDetails.firstName || '',
          lastName: userDetails.lastName || '',
          orgName: userDetails.orgName || '',
          orgId: userDetails.orgId || '',
          website: userDetails.website || '',
          contactNumber: userDetails.contactNumber || '',
          billingAddress: {
            addressLine1: userDetails.billingAddress?.addressLine1 || '',
            addressLine2: userDetails.billingAddress?.addressLine2 || '',
            city: userDetails.billingAddress?.city || '',
            state: userDetails.billingAddress?.state || '',
            postcode: userDetails.billingAddress?.postcode || '',
          },
        })
        setEmail(userDetails.email || '')
        setAddressInputValue(userDetails.billingAddress?.addressLine1 || '')
      } catch (error) {
        console.error('Error fetching user details:', error)
        toast({
          title: 'Error',
          description: 'Failed to load user details',
          variant: 'destructive',
        })
      }
    }

    loadUserDetails()
  }, [user.id, form, toast])

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      const suggestions = await addressAutocomplete(value)
      setAddressSuggestions(suggestions)
      setShowAddressSearchMenu(true)
    }, 300),
    [],
  )

  const handleAddressInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setAddressInputValue(newValue)
    form.setValue('billingAddress.addressLine1', newValue)

    if (event.target.value.trim().length >= 3) {
      debouncedSearch(newValue)
    } else {
      setShowAddressSearchMenu(false)
    }
  }

  const handleSuggestedAddressSelection = (suggestion: any) => {
    setAddressInputValue(suggestion.formattedAddress)
    form.setValue('billingAddress.addressLine1', suggestion.addressLabel)
    form.setValue('billingAddress.city', suggestion.city)
    form.setValue('billingAddress.state', suggestion.stateCode)
    form.setValue('billingAddress.postcode', suggestion.postalCode)
    setShowAddressSearchMenu(false)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      await updateUserDetails(user.id as unknown as string, values)
      toast({
        title: 'Success',
        description: 'Your details have been successfully updated.',
        variant: 'default',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error updating user details:', error)
      toast({
        title: 'Error',
        description: 'Failed to update your details. Please try again.',
        variant: 'destructive',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input value={email} disabled />
          </FormControl>
          <FormDescription>
            Your email address cannot be changed. Please contact us if you need to update it.
          </FormDescription>
        </FormItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. 0412345678 or +61412345678"
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    field.onChange(formatted)
                  }}
                />
              </FormControl>
              <FormDescription>Enter an Australian mobile or landline number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormItem>
            <FormLabel>Billing Address</FormLabel>
            <p className="text-sm text-muted-foreground mb-2">
              We'll use this address on future orders and tax invoices.
            </p>
            <FormControl>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="Start typing the billing address"
                  value={addressInputValue}
                  className="pl-10 pr-4 py-2 rounded-md focus:border-primary focus:ring-primary"
                  onChange={handleAddressInputChange}
                />
              </div>
            </FormControl>
            {showAddressSearchMenu && (
              <div className="mt-2">
                <ul className="max-h-48 overflow-y-auto bg-background rounded-md shadow-lg">
                  {addressSuggestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        className="flex items-center px-4 py-2 hover:bg-muted w-full text-left"
                        onClick={() => handleSuggestedAddressSelection(suggestion)}
                      >
                        <MapPinIcon className="w-5 h-5 mr-2 text-muted-foreground" />
                        <div className="text-sm">{suggestion.formattedAddress}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <FormMessage />
          </FormItem>

          <FormField
            control={form.control}
            name="billingAddress.addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="billingAddress.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingAddress.postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <Button className="rounded-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {`Updating...`}
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
          <Button
            className="rounded-full"
            type="button"
            variant="destructive"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function formatPhoneNumber(input: string): string {
  // Remove all non-digit characters
  const cleaned = input.replace(/\D/g, '')

  // Check if it's a mobile number (starting with 04 or 4)
  const isMobile = cleaned.startsWith('04') || cleaned.startsWith('4')

  // Format the number
  if (isMobile) {
    if (cleaned.length === 9) {
      return `0${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
    }
  } else {
    // Landline number
    if (cleaned.length === 9) {
      return `0${cleaned.slice(0, 1)} ${cleaned.slice(1, 5)} ${cleaned.slice(5)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`
    }
  }

  // If the number doesn't match expected formats, return the original input
  return input
}

export function isValidABN(abn: string): boolean {
  // Remove all non-digit characters
  const cleanedABN = abn.replace(/[^0-9]/g, '')

  // Check if the ABN is 11 digits long
  if (cleanedABN.length !== 11) {
    return false
  }

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
  let sum = 0

  // Subtract 1 from the first digit
  const adjustedABN = [(parseInt(cleanedABN[0]) - 1).toString(), ...cleanedABN.slice(1)]

  // Calculate the weighted sum
  for (let i = 0; i < 11; i++) {
    sum += parseInt(adjustedABN[i]) * weights[i]
  }

  // Check if the sum is divisible by 89
  return sum % 89 === 0
}

export function isValidACN(acn: string): boolean {
  // Remove all non-digit characters
  const cleanedACN = acn.replace(/[^0-9]/g, '')

  // Check if the ACN is 9 digits long
  if (cleanedACN.length !== 9) {
    return false
  }

  const weights = [8, 7, 6, 5, 4, 3, 2, 1]
  let sum = 0

  // Calculate the weighted sum
  for (let i = 0; i < 8; i++) {
    sum += parseInt(cleanedACN[i]) * weights[i]
  }

  // Calculate the check digit
  const remainder = sum % 10
  const checkDigit = remainder === 0 ? 0 : 10 - remainder

  // Compare the calculated check digit with the last digit of the ACN
  return checkDigit === parseInt(cleanedACN[8])
}
