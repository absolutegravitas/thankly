'use client'

import { useState, useMemo } from 'react'
import { Facebook, Instagram, Linkedin } from 'lucide-react'

import { Setting } from '@payload-types'
import NewsletterForm from '../NewsletterForm'

export const Footer: React.FC<Setting> = (props) => {
  const { footer, newsletterPopup } = props
  const { columns } = footer
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:space-x-12">
        <div className="space-y-8 md:w-1/3 order-2 md:order-1">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold font-['leaguespartan'] tracking-tighter">thankly</h2>
            <p className="text-sm text-gray-600 my-2">
              {newsletterPopup.footerDescription ||
                'Well done, you made it down here. Be in the loop on the latest offers, new arrivals, and receive a cheeky 10% off on your first purchase! 🎉'}
            </p>
            {newsletterPopup && <NewsletterForm newsletterProps={newsletterPopup} />}
          </div>
        </div>
        <nav className="mb-8 md:mb-0 order-1 md:order-2 md:w-1/2">
          <div
            className={`grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns?.length || 4}`}
          >
            {columns?.map(({ label: column, items }, i) => {
              return (
                <div key={i}>
                  <h3 className="font-semibold mb-4">{column}</h3>
                  <ul className="space-y-2 text-sm">
                    {items?.map(({ link }, j) => (
                      <li key={`link-${i}-${j}`}>
                        <a href={link.url} className="text-gray-600 hover:text-gray-900">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </nav>
      </div>
      <div className="mt-2 pr-4 flex justify-center md:justify-end space-x-6">
        <a
          href="https://www.facebook.com/thankly.co"
          className="text-gray-900 hover:text-gray-600"
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="h-6 w-6" />
        </a>
        <a
          href="https://www.instagram.com/thankly.co/"
          className="text-gray-900 hover:text-gray-600"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="h-6 w-6" />
        </a>
        <a
          href="https://www.linkedin.com/company/thankly-co"
          className="text-gray-900 hover:text-gray-600"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="h-6 w-6" />
        </a>
      </div>
      <div className="mt-2 pt-4 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          © {currentYear} Thankly. All rights reserved. ABN 84 662 101 859
        </div>
      </div>
    </footer>
  )
}
