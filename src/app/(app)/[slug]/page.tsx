import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Page } from '@payload-types'
// import { staticHome } from '../../../payload/seed/home-static'
import { fetchPage, fetchPages } from '@app/_queries'

import { generateMeta } from '@/utilities/generateMeta'
import { PageTemplate } from './page.client'

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()
  let page: Page | null = null

  try {
    page = await fetchPage(slug)
  } catch (error) {
    console.error('Failed to fetch page:', error)
    return notFound()
  }

  if (
    !page ||
    typeof page !== 'object' ||
    (Object.keys(page).length === 0 && page.constructor === Object)
  ) {
    return notFound()
  }

  return (
    <Suspense fallback="Loading...">
      <PageTemplate page={page} />
    </Suspense>
  )
}

export async function generateStaticParams() {
  try {
    const pagesData = await fetchPages()
    const pages = pagesData?.pages || [] // Extract pages from the data or default to an empty array
    return pages.map(({ slug }) => slug)
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  try {
    page = await fetchPage(slug)
  } catch (error) {
    console.error('Failed to fetch page:', error)
    return {}
  }

  // if (!page && slug === 'home') {
  //   page = staticHome
  // }

  return generateMeta({ doc: page })
}
