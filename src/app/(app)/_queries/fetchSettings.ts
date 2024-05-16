import 'server-only'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import { Setting } from '@payload-types'
import { LINK_FIELDS } from './shared'

// export const getGlobals = unstable_cache(
//   async (): Promise<Setting | null> => {
//     const payload = await getPayloadHMR({ config: await configPromise })
//     const settings = await payload.findGlobal({ slug: 'settings', depth: 1 })
//     return settings || null
//   },
//   ['settings'],
//   { revalidate: 60, tags: ['settings'] },
// )

// export default getGlobals

export async function fetchSettings(): Promise<Setting> {
  if (!process.env.NEXT_PUBLIC_SITE_URL) throw new Error('NEXT_PUBLIC_SITE_URL not found')

  const settings = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'users API-Key ' + process.env.PAYLOAD_API_KEY || '',
    },
    // cache: 'no-store', // requird for payload cloud, not for other self-hosted stuff
    body: JSON.stringify({ query: SETTINGS_QUERY }),
  })
    ?.then((res) => {
      if (!res.ok) throw new Error('Error fetching doc')
      return res.json()
    })
    ?.then((res) => {
      if (res?.errors) throw new Error(res?.errors[0]?.message || 'Error fetching settings')
      return res.data?.Setting
    })

  console.log('settings found', settings)
  return settings
}

const SETTINGS_QUERY = `
query {
  Setting {
    menu {
      tabs {
        label
        enableDirectLink
        enableDropdown
        link ${LINK_FIELDS({ disableAppearance: true, disableLabel: true })}
        description
        descriptionLinks {
          link ${LINK_FIELDS({ disableAppearance: true })}
        }
        items {
          style
          listLinks {
            tag
            links {
              link ${LINK_FIELDS({ disableAppearance: true })}
            }
          }
          defaultLink {
            description
            link ${LINK_FIELDS({ disableAppearance: true })}
          }
          featuredLink {
            tag
            label
            links {
              link ${LINK_FIELDS({ disableAppearance: true })}
            }
          }
        }
      }
    }

    footer {
      columns {
        label
        items {
          link ${LINK_FIELDS({ disableAppearance: true })}
        }
      }
    }

    topBar {
      content
    }
  }
  }
`
