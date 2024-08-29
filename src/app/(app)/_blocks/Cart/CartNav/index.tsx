'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, AlertCircle, Router } from 'lucide-react'
import { Button } from '@app/_components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@app/_components/ui/alert'
import { useCart } from '@/app/(app)/_providers/Cart'
import { cn } from '@/utilities/utils'

const initialSteps = [
  { name: 'Personalise', href: '/cart', status: 'upcoming' },
  { name: 'Postage', href: '/cart/postage', status: 'upcoming' },
  { name: 'Payment', href: '/cart/payment', status: 'upcoming' },
]

export default function CartNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showAlert, setShowAlert] = useState(false)
  const { cartPersonalisationMissing, cartPostageMissing } = useCart()
  const [steps, setSteps] = useState(initialSteps)

  useEffect(() => {
    const updatedSteps = initialSteps.map((step, index) => {
      const currentStepIndex = initialSteps.findIndex((s) => s.href === pathname)

      if (index < currentStepIndex) {
        return { ...step, status: 'complete' }
      } else if (index === currentStepIndex) {
        return { ...step, status: 'current' }
      } else {
        switch (steps[index].name) {
          case 'Postage':
            return { ...step, status: cartPersonalisationMissing ? 'upcoming' : 'complete' }
          case 'Payment':
            return {
              ...step,
              status: cartPersonalisationMissing || cartPostageMissing ? 'upcoming' : 'complete',
            }
          default:
            return { ...step, status: 'upcoming' }
        }
      }
    })

    setSteps(updatedSteps)
  }, [pathname, cartPersonalisationMissing, cartPostageMissing])

  const handleNavigation = (targetIndex: number) => {
    console.log('handleNavigation targetIndex:', targetIndex)
    const targetStep = steps[targetIndex]
    if (targetStep.status === 'upcoming') {
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000) // Hide alert after 5 seconds
    } else {
      //trigger navigation
      router.push(targetStep.href)
    }
  }

  return (
    <nav aria-label="Cart progress" className="py-0">
      <ol className="flex justify-center w-full max-w-2xl mx-auto space-x-8 ">
        {steps.map((step, index) => (
          <React.Fragment key={step.name}>
            {index > 0 && <ChevronRight className="w-6 h-6 pt-1 text-gray-400 hidden md:block" />}
            <li className="flex-shrink-0">
              <button
                className={cn(
                  'flex flex-col items-center w-full',
                  step.status === 'complete' && 'text-primary',
                  step.status === 'current' && 'text-primary font-semibold',
                  step.status === 'upcoming' && 'text-gray-400',
                )}
                onClick={() => handleNavigation(index)}
                // disabled={step.status === 'upcoming'}
              >
                <span
                  className={cn(
                    'w-7 h-7 flex items-center justify-center rounded-full mb-2 border-2 text-center',
                    step.status === 'complete' && 'border-gray-800 font-semibold',
                    step.status === 'current' && 'border-gray-800 bg-gray-800 text-white font-bold',
                    step.status === 'upcoming' && 'border-gray-200 font-semibold',
                  )}
                >
                  {index + 1}
                </span>
                {step.name}
              </button>
            </li>
          </React.Fragment>
        ))}
      </ol>
      {showAlert && (
        <div className="flex justify-center items-center">
          <Alert variant="destructive" className="mt-4 sm:w-2/3 flex items-center">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please complete the current step before proceeding.</AlertDescription>
          </Alert>
        </div>
      )}
    </nav>
  )
}
