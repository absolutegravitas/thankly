import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Order, Page, Product } from '@payload-types'
import { fetchPage, fetchPages } from '@app/_queries'

import { generateMeta } from '@app/_utilities/generateMeta'
import { PageTemplate } from './page.client'

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()

  const page: any = await fetchPage(slug)
  console.log('pagedata found //', page)

  // if page is null or empty object, return <></>
  return <></>
  // if (!page || (Object.keys(page).length === 0 && page.constructor === Object)) {
  //   return <></>
  // } else {
  //   return <PageTemplate page={page} />
  // }
}

// export async function generateStaticParams() {
//   const pages: any = await fetchPages()
//   console.log('pagedata found //', pages)

//   return pages && pages.length > 0 ? pages.map(({ slug }: any) => slug) : []
// }
