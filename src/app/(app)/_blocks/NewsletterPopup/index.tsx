'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@app/_components/ui/dialog'
import { Button } from '@app/_components/ui/button'
import { Media, Page, Product, Setting } from '@/payload-types'
import ReCAPTCHA from 'react-google-recaptcha'
import { z } from 'zod'
import { X } from 'lucide-react'
import Link from 'next/link'
import { format, subYears } from 'date-fns'
import NewsletterForm from '../../_components/NewsletterForm'

interface NewsletterPopupProps {
  settings: Setting['newsletterPopup'] //NewsletterPopupSettings
  currentSlug: string
}

export function NewsletterPopup({ settings, currentSlug }: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)

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
      const itemSlug =
        'slug' in (item.value as Page | Product) ? (item.value as Page | Product).slug : null
      return itemSlug === currentSlug
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(true)
    localStorage.setItem('newsletterPopupClosed', 'true')
  }

  const handleMaximize = () => {
    setIsMinimized(false)
    setIsOpen(true)
  }

  if (!settings.enabled) return null

  return (
    <>
      {/* Overlay for the dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-1000"
          onClick={handleClose} // Allow closing the modal when clicking on the overlay
        />
      )}

      <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
        <DialogContent
          className="sm:max-w-6xl max-w-[90vw] sm:p-8 p-4 overflow-hidden m-4"
          onInteractOutside={(e) => {
            e.preventDefault()
          }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              {settings.image && (
                <Image
                  src={(settings.image as Media).url}
                  alt={(settings.image as Media).alt}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="w-full md:w-1/2 p-6">
              <DialogHeader>
                <DialogTitle>{settings.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-gray-500">{settings.description}</p>
                <NewsletterForm
                  newsletterProps={settings}
                  onSubmit={handleClose}
                  hiddenFields={false}
                />
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
