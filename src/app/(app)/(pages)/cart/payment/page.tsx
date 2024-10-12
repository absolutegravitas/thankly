'use client'
import CartRedirect from '@/app/(app)/_blocks/Cart/CartRedirect'
import { useCart } from '@/app/(app)/_providers/Cart'
import React, { useCallback, useEffect, useState } from 'react'
import SkeletonLoader from '../skeleton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/(app)/_components/ui/accordion'
import { useMediaQuery } from 'react-responsive'
import CartItemsTable from '@/app/(app)/_blocks/Cart/CartItemsTable'
import { ReceiverCarts, transformToReceiverCarts } from '@/utilities/receiverCarts'
import CartTotals from '@/app/(app)/_blocks/Cart/CartTotals'
import DiscountCode from '@/app/(app)/_components/DiscountCode'
import {
  PaymentForm,
  stripeElementsAppearance,
} from '@/app/(app)/_blocks/Cart/Payment/PaymentsForm'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '@/utilities/stripe'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/app/(app)/_components/ui/button'
import { Input } from '@/app/(app)/_components/ui/input'
import { formatPhoneNumber, isValidABN } from '@/app/(app)/(pages)/account/GeneralSettings'
import { useRouter } from 'next/navigation'
import { fetchUserDetails } from '@/app/(app)/(pages)/account/userActions'
import { FcGoogle } from 'react-icons/fc'
import { FaLinkedin } from 'react-icons/fa'
import { BsFacebook } from 'react-icons/bs'
import { addToNewsletterList, removeFromNewsletterList } from './newsletterActions'
import { AddressPickerLite } from './AddressPickerLite'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { debounce } from 'lodash' // Make sure to install lodash if not already present
import { Skeleton } from '@/app/(app)/_components/ui/skeleton'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const guestFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z
    .string()
    .regex(/^(\+61|0)?[2-9]\d{8}$/, 'Please enter a valid Australian phone number')
    .optional()
    .or(z.literal('')),
  orgName: z.string().optional(),
  orgId: z
    .string()
    .refine((val) => !val || isValidABN(val), {
      message: 'Invalid ABN',
    })
    .optional(),
  billingAddress: z.object({
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postcode: z.string().min(1, 'Postcode is required'),
    country: z.string().min(1, 'Country is required'),
  }),
})

const loggedInUserSchema = guestFormSchema.partial()

const CartPaymentPage = () => {
  const {
    cart,
    hasInitializedCart,
    cartIsEmpty,
    cartPersonalisationMissing,
    cartPostageMissing,
    setCart,
    updateBillingAddress,
    updateNewsletterSubscription,
  } = useCart()
  const isMobile = useMediaQuery({ maxWidth: 639 })
  const { data: session, status } = useSession()

  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<any>(null)
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false)
  const [newsletterError, setNewsletterError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    orgName: '',
    orgId: '',
    billingAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postcode: '',
      // country: '',
    },
  })

  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<z.infer<typeof guestFormSchema>>>({})

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserDetails(session.user.id).then((details) => {
        setUserDetails(details)
        // Populate form data with user details
        setFormData((prev) => ({
          ...prev,
          firstName: details.firstName || '',
          lastName: details.lastName || '',
          email: details.email || '',
          orgName: details.orgName || '',
          orgId: details.orgId || '',
          billingAddress: {
            addressLine1: details.billingAddress?.addressLine1 || '',
            addressLine2: details.billingAddress?.addressLine2 || '',
            city: details.billingAddress?.city || '',
            state: details.billingAddress?.state || '',
            postcode: details.billingAddress?.postcode || '',
            // country: details.billingAddress?.country || '',
          },
        }))
        // Update cart billing address
        updateBillingAddress({
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
          orgName: details.orgName,
          orgId: details.orgId,
          address: details.billingAddress,
        })
      })
    }
  }, [session, updateBillingAddress])

  useEffect(() => {
    if (formData.email) {
      localStorage.setItem('guestEmail', formData.email)
    }
  }, [formData.email])

  useEffect(() => {
    if (status === 'authenticated' && userDetails) {
      const missingInfo = !userDetails.orgName || !userDetails.orgId || !userDetails.billingAddress
      setShowAdditionalFields(missingInfo)
      if (missingInfo) {
        setFormData({
          firstName: userDetails.firstName || '',
          lastName: userDetails.lastName || '',
          email: userDetails.email || '',
          phoneNumber: userDetails.phoneNumber || '',
          orgName: userDetails.orgName || '',
          orgId: userDetails.orgId || '',
          billingAddress: userDetails.billingAddress || {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postcode: '',
            country: '',
          },
        })
      }
    }
  }, [status, userDetails])

  const validateField = useCallback((name: string, value: any) => {
    try {
      const fieldSchema = guestFormSchema.shape[name as keyof typeof guestFormSchema.shape]
      fieldSchema.parse(value)
      setFormErrors((prev) => ({ ...prev, [name]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors((prev) => ({ ...prev, [name]: error.errors[0].message }))
      }
    }
  }, [])

  const debouncedValidateField = useCallback(
    debounce((name: string, value: any) => validateField(name, value), 300),
    [validateField],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Update browser cart for non-address fields
    if (status !== 'authenticated' && !name.startsWith('billingAddress.')) {
      updateBillingAddress({
        [name]: value,
      })
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    validateField(name, value)
  }

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubscribeToNewsletter(e.target.checked)
    updateNewsletterSubscription(e.target.checked)
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="mb-4 text-center">
        <div className="flex justify-center items-center mb-2">
          <AiOutlineLoading3Quarters className="animate-spin mr-3 text-blue-500" size={24} />
          <p className="text-lg font-semibold text-gray-600">Checking if you're logged in...</p>
        </div>
        <p className="text-sm text-gray-500">Please wait a moment</p>
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
      <Skeleton className="h-32" />
    </div>
  )

  if (!hasInitializedCart) return <SkeletonLoader />
  if (cartIsEmpty || cartPersonalisationMissing || cartPostageMissing) return <CartRedirect />

  const receiverCarts = transformToReceiverCarts(cart)

  const handleProviderSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/cart/payment' })
  }

  const OrderSummary: React.FC<{ receiverCarts: ReceiverCarts }> = ({ receiverCarts }) => {
    return (
      <>
        {receiverCarts.receivers?.map((receiverCart, index) => (
          <CartItemsTable
            key={receiverCart.id || index}
            receiverCart={receiverCart}
            showDetails={true}
            showDeliveryAddress={true}
          />
        ))}
      </>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="basis-1/2 px-6">
        {status === 'loading' ? (
          <LoadingSkeleton />
        ) : status === 'authenticated' && userDetails ? (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {userDetails.firstName}!</h2>
            <p className="mb-2">
              <strong>Email:</strong> {userDetails.email}
            </p>
            {!showAdditionalFields ? (
              <>
                {userDetails.billingAddress && (
                  <p className="mb-2">
                    Billing Address: {userDetails.billingAddress?.addressLine1}
                    {userDetails.billingAddress?.addressLine2
                      ? `, ${userDetails.billingAddress?.addressLine2}`
                      : ''}
                    , {userDetails.billingAddress?.city}, {userDetails.billingAddress?.state},
                    {userDetails.billingAddress?.postcode}
                  </p>
                )}
                <p className="italic mb-2">
                  {`We'll use the billing details on your profile to check out.`}
                </p>
              </>
            ) : (
              <div className="mb-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="orgName"
                      value={formData.orgName}
                      onChange={handleInputChange}
                      placeholder="Business Name (optional)"
                    />
                    <Input
                      name="orgId"
                      value={formData.orgId}
                      onChange={handleInputChange}
                      placeholder="ABN (optional)"
                    />
                  </div>

                  <AddressPickerLite
                    onAddressChange={(address) => {
                      setFormData((prev) => ({
                        ...prev,
                        billingAddress: {
                          ...prev.billingAddress,
                          ...address,
                        },
                      }))
                    }}
                    initialAddress={formData.billingAddress}
                  />

                  <Input
                    name="billingAddress.addressLine2"
                    value={formData.billingAddress.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Address Line 2 (Optional)"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Login or Signup</h3>
              <div className="bg-white py-4 px-4">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleProviderSignIn('facebook')}
                    className="w-full flex items-center justify-center py-3 text-base font-medium"
                  >
                    <BsFacebook className="mr-3 h-6 w-6 text-[#1877F2]" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleProviderSignIn('google')}
                    className="w-full flex items-center justify-center py-3 text-base font-medium"
                  >
                    <FcGoogle className="mr-3 h-6 w-6" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleProviderSignIn('linkedin')}
                    className="w-full flex items-center justify-center py-3 text-base font-medium"
                  >
                    <FaLinkedin className="mr-3 h-6 w-6 text-[#0A66C2]" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            {status !== 'authenticated' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Checkout as Guest</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="First Name"
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="Last Name"
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="Email"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value)
                          handleInputChange({
                            target: { name: 'phoneNumber', value: formatted },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }}
                        onBlur={handleInputBlur}
                        placeholder="Phone Number (optional)"
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        name="orgName"
                        value={formData.orgName}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="Business Name (optional)"
                      />
                      {formErrors.orgName && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.orgName}</p>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        name="orgId"
                        value={formData.orgId}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        placeholder="ABN (optional)"
                      />
                      {formErrors.orgId && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.orgId}</p>
                      )}
                    </div>
                  </div>

                  <AddressPickerLite
                    onAddressChange={(address) => {
                      setFormData((prev) => ({
                        ...prev,
                        billingAddress: {
                          ...prev.billingAddress,
                          ...address,
                        },
                      }))
                    }}
                    initialAddress={formData.billingAddress}
                  />

                  <Input
                    name="billingAddress.addressLine2"
                    value={formData.billingAddress.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Address Line 2 (Optional)"
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newsletter"
                      checked={subscribeToNewsletter}
                      onChange={handleNewsletterChange}
                      className="mr-2"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-700">
                      Be in the loop. No spam we promise. See our{' '}
                      <Link href="/privacy" target="_blank" className="underline">
                        privacy policy
                      </Link>{' '}
                      for details.
                    </label>
                  </div>
                  {newsletterError && <p className="text-red-500 text-sm">{newsletterError}</p>}
                </div>
              </div>
            )}
          </>
        )}
        <Elements
          stripe={stripePromise}
          options={{
            amount: cart.totals.total * 100,
            mode: 'payment',
            currency: 'aud',
          }}
        >
          <PaymentForm guestData={formData} />
        </Elements>
      </div>
      <div className="basis-1/2 bg-thankly-palegreen">
        {isMobile ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="cart">
              <AccordionTrigger className="w-full">
                <div className="flex items-center gap-2 flex-1 px-2">
                  <span className="flex-grow text-left text-lg font-bold">Summary of order</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <OrderSummary receiverCarts={receiverCarts} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 px-2">
              <span className="text-lg font-bold">Summary of order</span>
            </div>
            <OrderSummary receiverCarts={receiverCarts} />
          </div>
        )}
        <div className="pb-4 px-4">
          <DiscountCode />
        </div>
        <div className="pb-4 px-4">
          <CartTotals cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CartPaymentPage
