import { FORM_BLOCK } from './blocks'
import { LINK_FIELDS } from './link'

export const HEADER = `
  Header {
    announcement
    noticeBackgroundColor
    noticeForegroundColor
    menuBackgroundColor
    menuForegroundColor
    navItems {
      link ${LINK_FIELDS({ disableAppearance: true })}
		}
  }
`

export const HEADER_QUERY = `
query Header {
  ${HEADER}
}
`

export const FOOTER = `
  Footer {
    form {
      ${FORM_BLOCK}
    }
    columns {
      name
      links {id, link ${LINK_FIELDS({ disableAppearance: true })}}
    }
  }
`

export const FOOTER_QUERY = `
query Footer {
  ${FOOTER}
}
`

export const SETTINGS = `
  Settings {
    productsPage {
      slug
    }
  }
`

export const SETTINGS_QUERY = `
query Settings {
  ${SETTINGS}
}
`
