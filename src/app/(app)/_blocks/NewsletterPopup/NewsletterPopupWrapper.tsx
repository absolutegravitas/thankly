'use client'

import { usePathname } from 'next/navigation'
import { NewsletterPopup } from './index'

export function NewsletterPopupWrapper({ settings }) {
  const pathname = usePathname()
  // console.log('newsletterpop', settings)

  if (!settings) return null

  // Extract the slug from the pathname
  const currentSlug = pathname.split('/').pop() || ''
  // console.log('Current Slug:', currentSlug)

  return <NewsletterPopup settings={settings} currentSlug={currentSlug} />
}
