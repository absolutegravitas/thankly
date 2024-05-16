import 'server-only'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { unstable_cache } from 'next/cache'
import type { Page } from '@payload-types'
import { notFound } from 'next/navigation'
import ensurePath from '@app/_utilities/ensurePath'

const next = { revalidate: 600 }

export const getPage = async (
  path: string | string[],
  draft: boolean = false,
): Promise<Page | null> => {
  if (!path) path = '/home' //'/'
  if (Array.isArray(path)) path = path.join('/')
  if (path !== '/home') path = ensurePath(path).replace(/\/$/, '')

  const payload = await getPayloadHMR({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { path: { equals: path } },
    depth: 3,
  })
  if (docs?.length === 0) {
    notFound()
  }
  const page = docs?.at(0)
  return page || null
}

// export async function getPage(slug: string, draft: boolean = false) {
//   // payload find gets every goddamn field so this wont work for pages with a lot of blocks
//   const page = await payload.find({
//     collection: 'pages',
//     limit: 1,
//     where: { slug: { equals: slug } },
//     draft: draft,
//     depth: 1,
//     // showHiddenFields: true,
//   })
//   console.log('page ', page.docs.length)
//   if (page.docs.length === 0) return null
//   else return page.docs[0]
//   // graphql
// }

export const getPages = async (): Promise<
  Array<{ breadcrumbs: Page['breadcrumbs']; slug: string }>
> => {
  const { data, errors } = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql?pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    next,
    body: JSON.stringify({
      query: PAGES,
    }),
  }).then((res) => res.json())

  if (errors) {
    console.error(JSON.stringify(errors)) // eslint-disable-line no-console
    throw new Error()
  }

  return data.Pages.docs
}

export const PAGES = `
  query Pages {
    Pages(limit: 300, where: { slug: { not_equals: "cloud" } }) {
      docs {
        slug
        breadcrumbs {
          url
          label
        }
      }
    }
  }
`
