import { Page, Product } from '@payload-types'

type PageReference = {
  value: string | Page
  relationTo: 'pages'
}

type ProductsReference = {
  value: string | Product
  relationTo: 'products'
}
export type LinkType = string | 'reference' | 'custom' | null
export type Reference = PageReference | ProductsReference | null | any

type GenerateSlugType = {
  type?: LinkType | null
  url?: string | null
  reference?: Reference | null | undefined
}

export const generateHref = (args: GenerateSlugType): string => {
  const { reference, url, type } = args

  switch (type) {
    case 'custom':
      if (!url) return ''

      // Check if URL starts with a slash
      if (url.startsWith('/')) return url

      // Check if URL starts with "http://" or "https://"
      if (url.startsWith('http://') || url.startsWith('https://')) return url

      // Check if URL starts with "www."
      if (url.startsWith('www.')) return `http://${url}`

      // Check if URL matches a pattern for relative URLs (e.g., "shop")
      if (url.match(/^[a-zA-Z0-9-]+$/)) return `/${url}`

      // Check if URL matches a pattern for relative URLs with a trailing slash (e.g., "shop/")
      if (url.match(/^[a-zA-Z0-9-]+\/$/)) return `/${url}`

      // By default, treat as an external URL
      return `http://${url}`

    case 'reference':
      if (!reference) return ''
      if (reference.relationTo === 'products') return `/shop/${reference.value.slug}`
      else return `/${reference.value.slug}`
  }
  return ''
}
