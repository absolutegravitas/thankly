import React from 'react'

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { BrightConsoleLog } from '@/utilities/brightConsoleLog'
import { createDate } from '@/utilities/isWithinExperationDate'

const AuthTestPage = async () => {
  const config = await configPromise
  const payload: any = await getPayloadHMR({ config })

  const { docs } = await await payload.find({
    collection: 'users',
    where: { email: { equals: 'alexanderbowes@gmail.com' } },
    depth: 0,
    limit: 1,
  })

  // //query
  // const { docs } = await payload.find({
  //   collection: 'users',
  //   depth: 2,
  //   where: {
  //     and: [
  //       // { email: { equals: 'alexanderbowes@gmail.com' } },
  //       { 'accounts.provider': { equals: 'NotARealProvider' } },
  //       { '.provider': { equals: 'NotARealProvider' } },
  //       // { accounts: { contains: 'NotARealProvider' } },
  //       // { 'accounts.providerAccountId': { equals: '1234567890' } },
  //     ],
  //   },
  // })

  const date = new Date(Date.now())

  const session = await (
    await payload
  ).create({
    collection: 'sessions',
    data: {
      sessionToken: '5f23eef2-0067-4afa-a0bb-a8511b21eed3',
      user: parseInt('11'),
      expires: date.toISOString(),
    },
  })

  // console.log(docs[0])
  // console.log('ACCOUNTS:', results[0].accounts)

  return <div>AuthTestPage</div>
}

export default AuthTestPage
