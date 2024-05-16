import type { CMSLinkType } from '@app/_components/CMSLink'
import type { Media } from '@payload-types'

export interface SharedProps {
  price?: string | null
  title?: string | null
  description?: string | null
  className?: string
}

export interface SquareCardProps extends SharedProps {
  leader?: string
  enableLink?: boolean | null
  link?: CMSLinkType
  revealDescription?: boolean | null
}

export interface ContentMediaCardProps extends SharedProps {
  media: Media | string
  href: string
  publishedOn?: string
  authors: any['authors']
  orientation?: 'horizontal' | 'vertical'
}

export interface PricingCardProps extends SharedProps {
  leader?: string
  link?: CMSLinkType
  hasPrice?: boolean | null
}

export interface DefaultCardProps extends SharedProps {
  leader?: string
  pill?: string
  media?: Media | string | null
  href?: string
  onClick?: () => void
}
