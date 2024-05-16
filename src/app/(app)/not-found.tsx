import type { Metadata } from 'next'

import { ErrorMessage } from '@app/_components/ErrorMessage'
import { Footer } from '@app/_components/Footer'
import { Header } from '@app/_components/Header'
import { fetchSettings } from '@app/_queries/fetchSettings'
import { TopBar } from '@app/_components/TopBar'

export default async function NotFound() {
  const settings = await fetchSettings()
  // console.log('settings // ', settings)

  return (
    <>
      {settings?.topBar && <TopBar {...settings?.topBar} />}
      {settings?.menu && <Header {...settings?.menu} />}
      <div>
        <ErrorMessage /> this doesnt work
        {settings?.footer && <Footer {...settings?.footer}></Footer>}
      </div>
    </>
  )
}
