'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@app/_components/ui/button'
import { Input } from '@app/_components/ui/input'
import { CheckCircle2, XCircle } from 'lucide-react'
import { calculateCartDiscount } from '@/utilities/PayloadQueries/discountCodes'
import { useCart } from '../../_providers/Cart'

export default function DiscountCode() {
  const { cart, applyDiscount } = useCart()
  const [discountCode, setDiscountCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: null, text: '' })
    try {
      const discountAmount = await calculateCartDiscount(discountCode, cart.totals.cost)
      if (discountAmount !== 0) {
        //apply discount to cart
        applyDiscount(discountCode, discountAmount)
        setMessage({ type: 'success', text: 'Discount code applied successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Invalid discount code. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setDiscountCode('')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (message.type) {
      const timer = setTimeout(() => {
        setMessage({ type: null, text: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevent form submission
      buttonRef.current?.click() // Trigger button click
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex space-x-2">
        <Input
          id="discountCode"
          type="text"
          value={discountCode}
          onKeyDown={handleKeyDown}
          onChange={(e) => setDiscountCode(e.target.value)}
          placeholder="Enter discount code"
          disabled={isLoading}
          className="flex-grow h-10"
          aria-label="Discount code"
        />
        <Button
          type="button"
          onClick={handleApply}
          ref={buttonRef}
          disabled={isLoading || !discountCode}
          className="h-10 px-4 py-2 rounded-full"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </div>
      {message.type && (
        <div
          className={`mt-4 p-3 rounded-md flex items-center ${
            message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}
          role="alert"
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
          )}
          <span
            className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}
          >
            {message.text}
          </span>
        </div>
      )}
    </div>
  )
}
