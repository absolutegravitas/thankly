'use server'

import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { User } from '@/payload-types'

export async function fetchUserDetails(userId: string): Promise<Partial<User>> {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      orgName: user.orgName,
      orgId: user.orgId,
      website: user.website,
      email: user.email,
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
    throw new Error('Failed to fetch user details')
  }
}

export async function updateUserDetails(userId: string, data: Partial<User>): Promise<void> {
  const config = await configPromise
  let payload: any = await getPayloadHMR({ config })

  try {
    await payload.update({
      collection: 'users',
      id: userId,
      data: data,
    })
  } catch (error) {
    console.error('Error updating user details:', error)
    throw new Error('Failed to update user details')
  }
}
