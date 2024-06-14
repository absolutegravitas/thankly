import { CATEGORIES } from './categories'
import { LINK_FIELDS } from './link'
import { MEDIA, MEDIA_FIELDS } from './media'
import { META } from './meta'

export const CALL_TO_ACTION = `
...on Cta {
  blockType
  backgroundColor
  richText
  links {link ${LINK_FIELDS()}}
}
`

export const CONTENT = `
...on Content {
  blockType
  backgroundColor
  columns {
    backgroundColor
    size
    richText
    images { image { ${MEDIA_FIELDS}}}
    collapsedContent {id,title,description}
    enableLink
    link ${LINK_FIELDS()}
  }
}
`

export const FAQ_BLOCK = `
... on FaqBlock {
          blockType
          introContent
          populateByFaq: populateBy
          relationToFaq: relationTo
          groups {
            id
            title
            breadcrumbs {
              id
              label
            }
          }
          limit
          selectedDocs {
            selectedDocsRelationToFaq: relationTo
            value {
              ... on Faq {
                id
                question
                answer
              }
            }
          }
          populatedDocs {
            populatedDocsRelationToFaq: relationTo
            value {
              ... on Faq {
                id
                question
                answer
                groups {
                  id
                  title
                  breadcrumbs {
                    id
                    label
                  }
                }
              }
            }
          }
          populatedDocsTotal
        }
`

export const GALLERY_BLOCK = `
... on Gallery {
      blockType
      backgroundColor
      images {${MEDIA}}
    }
`

export const FEATURED_LOGOS_BLOCK = `
 ... on FeaturedLogos {
    blockType
    backgroundColor
    fewerItems
    id
    introContent
    logos {
      id
      links {link ${LINK_FIELDS()}}
      ${MEDIA}
    }
  }
`

export const FORM_BLOCK = `
... on FormBlock {
  blockType
  introContent
  form {
    title
    fields {
      ... on Text {
        name
        label
        width
        defaultValueString: defaultValue
        required
        id
        blockName
        blockType
      }
      ... on Textarea {
        name
        label
        width
        defaultValueString: defaultValue
        required
        id
        blockName
        blockType
      }
      ... on Select {
        name
        label
        width
        defaultValueString: defaultValue
        required
        id
        blockName
        blockType
        options {
          label
          value
          id
        }
      }
      ... on Email {
        name
        label
        width
        required
        id
        blockName
        blockType
      }
      ... on Number {
        name
        label
        width
        defaultValueFloat: defaultValue
        required
        id
        blockName
        blockType
      }
      ... on Checkbox {
        name
        label
        width
        defaultValueBoolean: defaultValue
        required
        id
        blockName
        blockType
      }
      ... on Message {
        message
        id
        blockName
        blockType
      }
    }
    submitButtonLabel
    confirmationType
    confirmationMessage
    redirect {
      
      type
      reference {
        relationTo
        value {
        __typename
        }
      }
      url
    }
    emails {
      id
      emailTo
      cc
      bcc
      replyTo
      emailFrom
      subject
      message
    }
  }
} 
`

export const MEDIA_BLOCK = `
...on MediaBlock {
  blockType
  backgroundColor
  position
  ${MEDIA}
}
`

export const PRODUCT_FEATURES_BLOCK = `
... on ProductFeatures {
  blockType
  blockName
  
  id
  introContent
  productFeatures {
    id
    heading
    content
  }
}
`

export const ARCHIVE_BLOCK = `
...on Archive {
  blockType
  backgroundColor
  introContent
  populateBy
  relationTo
  showPagination
  ${CATEGORIES}
  limit
  selectedDocs {
    relationTo
    value {
      ...on Product {
        id
        slug
        title
        lowStockThreshold
        stockOnHand
        priceJSON
      }
    }
  }
  populatedDocs {
    relationTo
    value {
      ...on Product {
        id
        slug
        title
        lowStockThreshold
        stockOnHand
        priceJSON
        ${CATEGORIES}
        ${META}
      }
    }
  }
  populatedDocsTotal
}
`
