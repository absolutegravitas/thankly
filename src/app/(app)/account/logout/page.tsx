import { Metadata } from 'next'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { Logout } from './page_client'

export default (props: any) => {
  return <Logout {...props} />
}

export const metadata: Metadata = {
  title: 'Logout | Payload Cloud',
  description: 'Logout of Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Logout | Payload Cloud',
    url: '/logout',
  }),
}
