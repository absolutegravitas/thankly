import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  url: 'https://www.thankly.co',

  siteName: 'Thankly',
  title: 'Thankly | The easiest way to say thanks',
  description: `Create, Personalise & Send cards and curated gifts for your friends, family, work or business. Saying thanks has never been this easy.`,
  images: [
    {
      url: '/images/og-image.png',
    },
  ],
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
