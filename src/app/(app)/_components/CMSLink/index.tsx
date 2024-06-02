import React from 'react'
import Link from 'next/link'

import { Page, Product } from '@payload-types'
// eslint-disable-next-line import/no-cycle
import { Button, ButtonProps } from '../Button'

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

export type CMSLinkType = {
  type?: LinkType | null
  newTab?: boolean | null
  reference?: Reference | null
  url?: string | null
  label?: string | null
  appearance?: 'default' | 'primary' | 'secondary' | 'text' | null
  children?: React.ReactNode
  fullWidth?: boolean
  mobileFullWidth?: boolean
  className?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  buttonProps?: ButtonProps
}

type GenerateSlugType = {
  type?: LinkType | null
  url?: string | null
  reference?: Reference | null | undefined
}

const generateHref = (args: GenerateSlugType): string => {
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

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  url,
  newTab,
  reference,
  label,
  appearance,
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
  fullWidth = false,
  mobileFullWidth = false,
  buttonProps: buttonPropsFromProps,
}) => {
  // console.log('reference', reference)

  let href = generateHref({ type, url, reference })

  if (!href) {
    return (
      <span
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label}
        {children}
      </span>
    )
  }

  if (!appearance) {
    const hrefIsLocal = ['tel:', 'mailto:'].some((prefix) => href.startsWith(prefix))

    // if (!hrefIsLocal && href !== '#') {
    //   try {
    //     const objectURL = new URL(href)
    //     if (objectURL.origin === process.env.NEXT_PUBLIC_SERVER_URL) {
    //       href = objectURL.href.replace(process.env.NEXT_PUBLIC_SERVER_URL, '')
    //     }
    //   } catch (e) {
    //     // Do not throw error if URL is invalid
    //     // This will prevent the page from building
    //     console.log(`Failed to format url: ${href}`, e) // eslint-disable-line no-console
    //   }
    // }

    const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    if (href.indexOf('/') === 0) {
      return (
        <Link
          href={href}
          {...newTabProps}
          className={className}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          prefetch={false}
        >
          {label && label}
          {children && children}
        </Link>
      )
    }

    return (
      <Link
        href={href}
        {...newTabProps}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {label && label}
        {children && children}
      </Link>
    )
  }

  const buttonProps: ButtonProps = {
    ...buttonPropsFromProps,
    newTab,
    href,
    appearance,
    label,
    onClick,
    onMouseEnter,
    onMouseLeave,
    fullWidth,
    mobileFullWidth,
  }

  if (appearance === 'default') {
    buttonProps.icon = 'arrow'
  }

  return <Button {...buttonProps} className={className} el="link" />
}
