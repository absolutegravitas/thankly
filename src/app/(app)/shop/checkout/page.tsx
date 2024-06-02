import React, { Fragment } from 'react'
// import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { Metadata } from 'next'

import { Gutter } from '@app/_components/Gutter'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { RenderParams } from '@app/_components/RenderParams'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage({ searchParams }: any) {
  // const templates = await fetchTemplates()

  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      {/* <NewProjectBlock templates={templates} teamSlug={teamSlug} /> */}
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'New Project | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'New Project | Payload Cloud',
    url: '/new',
  }),
}
