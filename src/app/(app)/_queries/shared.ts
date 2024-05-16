interface Args {
  disableLabel?: true
  disableAppearance?: true
}

export const LINK_FIELDS = ({ disableAppearance, disableLabel }: Args = {}): string => `{
  ${!disableLabel ? 'label' : ''}
  ${!disableAppearance ? 'appearance' : ''}
  type
  newTab
  url
  reference {
    relationTo
    value {
      ...on Page {
        slug
        breadcrumbs {
          url
        }
      }
      ...on Product {
        slug
       
      }
    }
  }
}`

export const MEDIA_FIELDS = `
mimeType
filename
width
height
alt
caption
`

export const MEDIA = `media {
  ${MEDIA_FIELDS}
}`

export const META = `meta {
  title
  image {
    ${MEDIA_FIELDS}
  }
  description
}`

export const ORDERS = `
  query Orders {
    Orders(limit: 300) {
      docs {
        id
      }
    }
  }
`

export const PRODUCTS = `
  query Products {
    Products(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PAGES = `
  query Pages {
    Pages(limit: 300, where: { slug: { not_equals: "cart" } })  {
      docs {
        slug
      }
    }
  }
`

export const PAGE = `
  query Page($slug: String, $draft: Boolean) {
    Pages(where: { AND: [{ slug: { equals: $slug }}] }, limit: 1, draft: $draft) {
      docs {
        id
        title
        hero {
          type
          richText
          
          slides {
            name
            richText
            image {
              id
              alt
              filename
              width
              height
              mimeType
            }
            links {link ${LINK_FIELDS()}}
          }
          
        }
        layout
        ${META}
      }
    }
  }
`

export const PRODUCT = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        id
        title
        shortDescription
        type
        stripeProductID
        layout
        lowStockThreshold
        stockOnHand
        priceJSON
        relatedProducts {
          id
          slug
          title
          ${META}
        }
        ${META}
      }
    }
  }
`

export const ORDER = `
  query Order($id: String ) {
    Orders(where: { id: { equals: $id}}) {
      docs {
        id
        orderNumber
        orderedBy
        items {
          product ${PRODUCT}
          title
          lowStockThreshold
          stockOnHand
          priceJSON
        }
      }
    }
  }
`

export const queryMap: Record<string, { query: string; key: string }> = {
  pages: {
    query: PAGE,
    key: 'Pages',
  },
  products: {
    query: PRODUCT,
    key: 'Products',
  },
  orders: {
    query: ORDER,
    key: 'Orders',
  },
}

export const queryMaps: Record<string, { query: string; key: string }> = {
  pages: {
    query: PAGES,
    key: 'Pages',
  },
  products: {
    query: PRODUCTS,
    key: 'Products',
  },
  orders: {
    query: ORDERS,
    key: 'Orders',
  },
}
