import { revalidatePath, unstable_cache } from 'next/cache'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { Setting } from '@payload-types'

export const fetchSettings = unstable_cache(
  async (): Promise<Setting | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let settings = null

    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    // console.log('settings -- ', settings)
    return settings
  },
  ['settings'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['settings'],
  },
)

export const fetchHeader = unstable_cache(
  async (): Promise<Setting | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let settings = null

    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
      // set settings variable to be the menu key only
      if (settings) settings = settings.menu
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    console.log('settings -- ', settings)
    return settings
  },
  ['fetchHeader'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['fetchHeader'],
  },
)

export const fetchFooter = unstable_cache(
  async (): Promise<Setting | null> => {
    const config = await configPromise
    let payload: any = await getPayloadHMR({ config })
    let settings = null

    try {
      settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
    // console.log('settings -- ', settings)
    return settings
  },
  ['fetchFooter'],
  {
    revalidate: 60, // 60 seconds
    // revalidate: 300, // 5 min
    // revalidate: 3600, // 1 hour
    // revalidate: 86400, // 1 day
    // revalidate: 604800, // 1 week
    // revalidate: 2592000, // 1 month
    // revalidate: 31536000, // 1 year

    tags: ['fetchFooter'],
  },
)
