'use server'

import { z } from 'zod'
import FetchGlobal from '@/utilities/PayloadQueries/fetchGlobal'

const emailSchema = z.object({
  email: z.string().email(),
})

function isValidAustralianPhoneNumber(phoneNumber: string): {
  isValid: boolean
  type: 'mobile' | 'landline' | null
} {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '')

  // Check if it's a valid mobile number (starting with 04 or 4)
  if (/^(0?4\d{8})$/.test(cleaned)) {
    return { isValid: true, type: 'mobile' }
  }

  // Check if it's a valid landline number (8 digits, or 9 digits starting with 0)
  if (/^(0?[2378]\d{8})$/.test(cleaned)) {
    return { isValid: true, type: 'landline' }
  }

  // If it doesn't match any pattern, it's not valid
  return { isValid: false, type: null }
}

async function getRetailListId() {
  const settings = await FetchGlobal({ slug: 'settings', depth: 1 })
  console.log('settings', settings)
  return settings?.newsletterPopup?.retailListId
}

export async function addToNewsletterList(email: string, phoneNumber?: string) {
  try {
    emailSchema.parse({ email })
    const retailListId = await getRetailListId()

    if (!retailListId) {
      throw new Error('Retail list ID not found in settings')
    }

    const contactData: any = {
      email,
      listIds: [parseInt(retailListId)],
      updateEnabled: true,
    }

    if (phoneNumber) {
      const { isValid, type } = isValidAustralianPhoneNumber(phoneNumber)
      if (isValid) {
        if (type === 'mobile') {
          contactData.sms = phoneNumber
        } else {
          contactData.PHONE = phoneNumber
        }
      }
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY!,
      },
      body: JSON.stringify(contactData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Brevo API error:', errorText)
      throw new Error(errorText || 'Failed to add to newsletter list')
    }

    return { success: true }
  } catch (error) {
    console.error('Add to newsletter error:', error)
    return { success: false, error: 'Failed to add to newsletter list' }
  }
}

export async function removeFromNewsletterList(email: string) {
  try {
    emailSchema.parse({ email })

    const response = await fetch(`https://api.brevo.com/v3/contacts/${email}`, {
      method: 'DELETE',
      headers: {
        'api-key': process.env.NEXT_PUBLIC_BREVO_API_KEY!,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Brevo API error:', errorText)
      throw new Error(errorText || 'Failed to remove from newsletter list')
    }

    return { success: true }
  } catch (error) {
    console.error('Remove from newsletter error:', error)
    return { success: false, error: 'Failed to remove from newsletter list' }
  }
}
