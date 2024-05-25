import React from 'react'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Page } from '@payload-types'
import { fetchPage, fetchPages } from '@app/_queries'

import { generateMeta } from '@/utilities/generateMeta'
import { PageTemplate } from './page.client'

export default async function Page({ params: { slug = 'home' } }: any) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null
  page = await fetchPage(slug)

  // if there's no page, or page is not an object then also return not found
  if (
    !page ||
    typeof page !== 'object' ||
    (Object.keys(page).length === 0 && page.constructor === Object)
  ) {
    return notFound()
  }

  return (
    <>
      <Suspense fallback="fetching page">
        <PageTemplate page={page} />
      </Suspense>
    </>
  )
}

export async function generateStaticParams() {
  let pages: Page[] | null = null

  try {
    pages = await fetchPages()
  } catch (error) {
    console.error('fetchPages error //', error)
    return []
  }

  // console.log('pagedata found //', pages)

  // Strip all keys from pages except slug
  if (pages && pages.length > 0) {
    return pages.map(({ slug }: any) => ({ slug }))
  }

  return []
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  try {
    page = await fetchPage(slug)
  } catch (error) {
    // don't throw an error if the fetch fails
    // this is so that we can render a static home page for the demo
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // in production you may want to redirect to a 404  page or at least log the error somewhere
  }

  return generateMeta({ doc: page })
}
