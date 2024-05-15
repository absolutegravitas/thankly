import 'server-only'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import { GlobalSetting } from '@payload-types'

export const getGlobals = unstable_cache(
  async (): Promise<GlobalSetting | null> => {
    const payload = await getPayloadHMR({ config: await configPromise })
    const settings = await payload.findGlobal({ slug: 'globalSettings', depth: 1 })
    return settings || null
  },
  ['settings'],
  { revalidate: 60, tags: ['settings'] },
)

export default getGlobals
