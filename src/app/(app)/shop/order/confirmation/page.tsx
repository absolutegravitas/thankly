'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useStripe } from '@stripe/react-stripe-js'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import { Gutter } from '@app/_components/Gutter'
import { contentFormats, getPaddingClasses } from '@app/_css/tailwindClasses'
import cn from '@/utilities/cn'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const stripe = useStripe()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = searchParams.get('payment_intent_client_secret')

    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            setPaymentStatus('Payment succeeded!')
            break
          case 'processing':
            setPaymentStatus('Your payment is processing.')
            break
          case 'requires_payment_method':
            setPaymentError('Your payment was not successful, please try again.')
            break
          default:
            setPaymentError('Something went wrong.')
            break
        }
      })
    }
  }, [stripe, searchParams])

  return (
    <BlockWrapper className={getPaddingClasses('hero')}>
      <Gutter>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className={cn(contentFormats.global, contentFormats.h1, 'mb-6')}>
            Order Confirmation
          </h1>
          {paymentStatus && (
            <p className={cn(contentFormats.global, contentFormats.p, 'text-green-600 mb-4')}>
              {paymentStatus}
            </p>
          )}
          {paymentError && (
            <p className={cn(contentFormats.global, contentFormats.p, 'text-red-600 mb-4')}>
              {paymentError}
            </p>
          )}
          <p className={cn(contentFormats.global, contentFormats.p, 'mb-6')}>
            Thank you for your order. We'll send a confirmation email with your order details.
          </p>
          <Link
            href="/"
            className={cn(
              contentFormats.global,
              contentFormats.a,
              'inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700',
            )}
          >
            Return to Home
          </Link>
        </div>
      </Gutter>
    </BlockWrapper>
  )
}
