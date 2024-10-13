'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/_components/ui/dialog'
import { Button } from '@app/_components/ui/button'
import { Media, Page, Product } from '@/payload-types'
import ReCAPTCHA from 'react-google-recaptcha'
import { z } from 'zod'
import { X } from 'lucide-react'
import Link from 'next/link'
import { format, subYears } from 'date-fns'

// Define the validation schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  isBusiness: z.boolean(),
  birthday: z.string().refine((date) => {
    const eighteenYearsAgo = subYears(new Date(), 18)
    return new Date(date) <= eighteenYearsAgo
  }, 'You must be 18 years or older to subscribe'),
})

type FormData = z.infer<typeof formSchema>

interface NewsletterPopupSettings {
  enabled: boolean
  title: string
  description: string
  image: Media
  retailListId: string
  businessListId: string
  displayOn: Array<{
    relationTo: 'pages' | 'products'
    value: Page | Product
  }>
  delayInSeconds: number
  submitMessage: string
  submitButtonText: string
  suppressUntil: number
  collapsedText: string
  businessCheckboxText: string
}

interface NewsletterPopupProps {
  settings: NewsletterPopupSettings
  currentSlug: string
}

export function NewsletterPopup({ settings, currentSlug }: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    isBusiness: false,
    birthday: '',
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')

  useEffect(() => {
    const popupClosed = localStorage.getItem('newsletterPopupClosed')

    if (!popupClosed && shouldDisplayOnCurrentPage()) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setIsMinimized(false)
      }, settings.delayInSeconds * 1000)

      return () => clearTimeout(timer)
    }
  }, [currentSlug, settings.delayInSeconds])

  const shouldDisplayOnCurrentPage = () => {
    return settings.displayOn.some((item) => {
      const itemSlug = 'slug' in item.value ? item.value.slug : null
      return itemSlug === currentSlug
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(true)
    localStorage.setItem('newsletterPopupClosed', 'true')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recaptchaToken) {
      setSubmitMessage('Please complete the reCAPTCHA')
      return
    }

    try {
      formSchema.parse(formData)
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors as Partial<FormData>)
        return
      }
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const listId = formData.isBusiness ? settings.businessListId : settings.retailListId

      console.log('Submitting to Brevo:', {
        ...formData,
        listId,
      })

      const response = await fetch(`https://api.brevo.com/v3/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: formData.email,
          attributes: {
            FIRSTNAME: formData.firstName,
            LASTNAME: formData.lastName,
            CUSTOMER_TYPE: formData.isBusiness ? 'business' : 'retail',
            BIRTHDAY: formData.birthday,
          },
          listIds: [parseInt(listId)],
          updateEnabled: true,
        }),
      })

      if (response.status === 204 || response.ok) {
        setSubmitMessage(settings.submitMessage)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          isBusiness: false,
          birthday: '',
        })
        await handleClose() // Close the popup and set the cookie after successful submission
      } else {
        const errorText = await response.text()
        console.error('Brevo API error:', errorText)
        setSubmitMessage(`Error: ${errorText || 'Something went wrong'}`)
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitMessage('An error occurred. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMinimize = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }

  const handleMaximize = () => {
    setIsMinimized(false)
    setIsOpen(true)
  }

  if (!settings.enabled) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-6xl     max-w-[90vw] sm:p-8 p-4 overflow-hidden m-4">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              {settings.image && (
                <Image
                  src={settings.image.url}
                  alt={settings.image.alt}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="w-full md:w-1/2 p-6">
              <DialogHeader>
                <DialogTitle>{settings.title}</DialogTitle>
                {/* <button onClick={handleClose} className="absolute top-2 right-2">
                  <X className="h-4 w-4" />
                </button> */}
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">{settings.description}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isBusiness"
                      checked={formData.isBusiness}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm">{settings.businessCheckboxText}</label>
                  </div>
                  {errors.isBusiness && <p className="text-red-500 text-sm">{errors.isBusiness}</p>}
                  <div>
                    <label className="block text-sm mb-1">
                      {`Let's celebrate you too! When's your birthday? (18+ only)`}
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      max={format(subYears(new Date(), 18), 'yyyy-MM-dd')}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday}</p>}

                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={(token) => setRecaptchaToken(token as string)}
                  />
                  <Button type="submit" disabled={isSubmitting || !recaptchaToken}>
                    {isSubmitting ? 'Subscribing...' : settings.submitButtonText || 'Subscribe'}
                  </Button>
                </form>
                {submitMessage && (
                  <p className="text-sm text-center text-thankly-green">{submitMessage}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  By subscribing, you agree to our{' '}
                  <Link href="/privacy" className="underline">
                    Privacy Policy
                  </Link>
                  . We respect your privacy and will never share your information.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isMinimized && (
        <button
          onClick={handleMaximize}
          className="fixed bottom-4 left-4 bg-[#557755] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-[#557755]/80 transition-colors z-50"
        >
          <span className="cursor-pointer text-xs text-center">
            {settings.collapsedText || `Sign Up`}
          </span>
        </button>
      )}
    </>
  )
}
