'use client'

import React from 'react'
import { CallToAction } from '@app/_blocks/CallToAction'

// import BreadcrumbsBar from '@app/_blocks/Hero/BreadcrumbsBar'
// import { DefaultHero } from '@app/_blocks/Hero/Default'

export const ErrorMessage: React.FC<{ error?: string }> = ({ error }) => {
  return (
    <>
      {/* <BreadcrumbsBar breadcrumbs={undefined} links={undefined} /> */}
      <CallToAction
        blockType="cta"
        padding={{ top: 'large', bottom: 'large' }}
        ctaFields={{
          content: {
            root: [
              {
                children: [
                  {
                    text: `${error || '404'}`,
                    underline: true,
                    forceDark: true,
                  },
                ],
                type: 'h1',
              },
              {
                children: [
                  {
                    text: 'Sorry, the page you requested cannot be found.',
                  },
                ],
              },
            ],
            direction: 'ltr',
          },
          settings: {}, // Update with your settings object structure
          links: [
            {
              link: {
                reference: undefined,
                type: 'custom',
                url: '/',
                label: 'Back To Homepage',
              },
            },
            {
              link: {
                reference: undefined,
                type: 'custom',
                url: '/shop',
                label: 'Send a Thankly',
              },
            },
          ],
        }}
      />
    </>
  )
}
