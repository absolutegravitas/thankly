import React from 'react'

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { BrightConsoleLog } from '@/utilities/brightConsoleLog'

const AuthTestPage = async () => {
  const config = await configPromise
  const payload: any = await getPayloadHMR({ config })

  //query
  const { docs } = await payload.find({
    collection: 'users',
    depth: 2,
    where: {
      and: [
        // { email: { equals: 'alexanderbowes@gmail.com' } },
        { 'accounts.provider': { equals: 'NotARealProvider' } },
        { '.provider': { equals: 'NotARealProvider' } },
        // { accounts: { contains: 'NotARealProvider' } },
        // { 'accounts.providerAccountId': { equals: '1234567890' } },
      ],
    },
  })

  console.log(docs[0])
  // console.log('ACCOUNTS:', results[0].accounts)

  return <div>AuthTestPage</div>
}

export default AuthTestPage
