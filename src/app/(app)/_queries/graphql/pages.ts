import {
  ARCHIVE_BLOCK,
  CALL_TO_ACTION,
  CONTENT,
  // MEDIA_BLOCK,
  FORM_BLOCK,
  FEATURED_LOGOS_BLOCK,
  FAQ_BLOCK,
  GALLERY_BLOCK,
} from './blocks'
import { LINK_FIELDS } from './link'
import { MEDIA } from './media'
import { META } from './meta'

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
        layout {
          ${ARCHIVE_BLOCK}
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${FEATURED_LOGOS_BLOCK}
        }
        ${META}
      }
    }
  }
`
