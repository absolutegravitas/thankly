'use client'

import { useState, useMemo } from 'react'
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

export const NewsletterForm: React.FC<Setting['newsletterPopup']> = (props) => {
  const [showLastName, setShowLastName] = useState(false)
  const [showBirthDate, setShowBirthDate] = useState(false)
  const [showCorporateOffers, setShowCorporateOffers] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLastName(e.target.value.length > 0)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowBirthDate(e.target.value.length > 0)
    setShowCorporateOffers(e.target.value.length > 0)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Implement form submission logic
    console.log('Form submitted')
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

  return (
    <div className="space-y-8 md:w-1/3 order-2 md:order-1">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold font-['leaguespartan'] tracking-tighter">thankly</h2>
        <p className="text-sm text-gray-600 mt-2">
          Well done, you made it down here. Be in the loop on the latest offers, new arrivals, and
          receive a cheeky 10% off on your first purchase! 🎉
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="First name"
            className={`w-full ${showLastName ? 'w-1/2' : ''}`}
            onChange={handleFirstNameChange}
            required
            aria-required="true"
          />
          {showLastName && <Input type="text" placeholder="Last name" className="w-1/2" />}
        </div>
        <Input
          type="email"
          placeholder="Email"
          className="w-full"
          onChange={handleEmailChange}
          required
          aria-required="true"
        />
        {showBirthDate && (
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
              <Select>
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
        )}
        {showCorporateOffers && (
          <div className="flex items-center space-x-2">
            <Checkbox id="corporate-offers" />
            <Label htmlFor="corporate-offers" className="text-sm text-gray-600">
              Interested in the latest corporate offers?
            </Label>
          </div>
        )}
        <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
          Join the Thankly loop
        </Button>
        <p className="text-xs text-gray-500 text-center">No spam, unsubscribe anytime.</p>
      </form>
    </div>
  )
}

export default NewsletterForm
