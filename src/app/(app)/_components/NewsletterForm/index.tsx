'use client'

import { useState, useMemo, useEffect } from 'react'
import { Input } from '@app/_components/ui/input'
import { Button } from '@app/_components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/_components/ui/select'
import { Label } from '@app/_components/ui/label'
import { ScrollArea } from '@app/_components/ui/scroll-area'
import { Checkbox } from '@app/_components/ui/checkbox'
import { Setting } from '@payload-types'
import ReCAPTCHA from 'react-google-recaptcha'
import { z } from 'zod'

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string(),
  email: z.string().email('Invalid email address'),
  isBusiness: z.boolean(),
  birthday: z.string(),
})

type FormData = z.infer<typeof formSchema>

interface Props {
  onSubmit?: () => void
  hiddenFields?: boolean
  newsletterProps: Setting['newsletterPopup']
}

export const NewsletterForm: React.FC<Props> = ({
  onSubmit = () => {},
  hiddenFields = true,
  newsletterProps,
}) => {
  const [showLastName, setShowLastName] = useState(!hiddenFields)
  const [showExtraFormItems, setShowExtraFormItems] = useState(!hiddenFields)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    isBusiness: false,
    birthday: '',
  })

  // Helper function to format the month into two digits (01, 02, etc.)
  const formatMonth = (month: string | null) => {
    const monthIndex = months.indexOf(month?.charAt(0).toUpperCase() + (month?.slice(1) || '')) + 1
    return monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`
  }

  // Helper function to build the birthday string
  const updateBirthday = (month: string | null, day: string | null) => {
    if (month && day) {
      const formattedMonth = formatMonth(month)
      const formattedDay = day.padStart(2, '0') // Ensure day is two digits
      const birthdayString = `0000-${formattedMonth}-${formattedDay}` // Default year is 0000
      setFormData((prev) => ({ ...prev, birthday: birthdayString }))
    }
  }

  // Use effect to update birthday whenever month or day changes
  useEffect(() => {
    updateBirthday(selectedMonth, selectedDay)
  }, [selectedMonth, selectedDay])

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLastName(e.target.value.length > 0)
    handleInputChange(e)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowExtraFormItems(e.target.value.length > 0)
    handleInputChange(e)
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getDaysInMonth = (month: string | null) => {
    switch (month) {
      case 'february':
        return 29 // Assuming leap year
      case 'april':
      case 'june':
      case 'september':
      case 'november':
        return 30
      default:
        return 31
    }
  }

  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(selectedMonth)
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  }, [selectedMonth])

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

    console.log(newsletterProps)

    try {
      const listId = formData.isBusiness
        ? newsletterProps.businessListId
        : newsletterProps.retailListId

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
        setSubmitMessage(newsletterProps.submitMessage)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          isBusiness: false,
          birthday: '',
        })

        //rehide fields (if applicable)
        if (hiddenFields) {
          setShowExtraFormItems(false)
          setShowLastName(false)
        }

        //tell parent that form has submitted ok
        await onSubmit()
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

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="flex space-x-2">
          <Input
            type="text"
            name="firstName"
            placeholder="First name"
            className={`w-full ${showLastName ? 'w-1/2' : ''}`}
            onChange={handleFirstNameChange}
            value={formData.firstName}
            required
            aria-required="true"
          />
          {showLastName && (
            <Input
              type="text"
              name="lastName"
              placeholder="Last name"
              className="w-1/2"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          )}
        </div>
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full"
          onChange={handleEmailChange}
          value={formData.email}
          required
          aria-required="true"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        {showExtraFormItems && (
          <>
            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-sm text-gray-600">
                <span role="img" aria-label="Birthday cake" className="mr-2">
                  🎂
                </span>
                Let's celebrate you too. Tell us your birthday! (optional)
              </Label>
              <div className="flex space-x-2">
                <Select onValueChange={(value) => setSelectedMonth(value.toLowerCase())}>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toLowerCase()}>
                          {month}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setSelectedDay(value)}>
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {days.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isBusiness"
                name="isBusiness"
                checked={formData.isBusiness}
                onChange={handleInputChange}
              />
              <Label htmlFor="isBusiness" className="text-sm text-gray-600">
                Interested in the latest corporate offers?
              </Label>
            </div>
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token as string)}
              />
            )}
          </>
        )}
        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
          Join the Thankly loop
        </Button>
        <p className="text-xs text-gray-500 text-center">No spam, unsubscribe anytime.</p>
      </form>
      {submitMessage && <p className="text-sm text-center text-thankly-green">{submitMessage}</p>}
    </>
  )
}

export default NewsletterForm
