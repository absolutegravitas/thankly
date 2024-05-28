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

export type LinkType = 'reference' | 'custom' | null
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

// import React from 'react'
// import Link from 'next/link'

// import { Page, Product } from '@payload-types'
// // eslint-disable-next-line import/no-cycle
// import { Button, ButtonProps } from '../Button'
// import { buttonFormats } from '../../_css/tailwindClasses'

// type PageReference = {
//   value: string | Page
//   relationTo: 'pages'
// }

// type ProductsReference = {
//   value: string | Product
//   relationTo: 'products'
// }

// export type LinkType = 'reference' | 'custom' | null
// export type Reference = PageReference | ProductsReference | null

// export type CMSLinkType = {
//   type?: LinkType | null
//   newTab?: boolean | null
//   reference?: Reference | null | any
//   url?: string | null
//   label?: string | null
//   appearance?:
//     | 'default'
//     | 'primary'
//     | 'secondary'
//     | 'text'
//     | null
//     | undefined
//     | ''
//     // for frontend driven picks
//     | 'default'
//     | 'contentDark'
//     | 'contentLight'
//     | 'contentTransparentDark'
//     | 'contentTransparentLight'
//     | 'heroDark'
//     | 'heroLight'
//     | 'heroTransparentDark'
//     | 'heroTransparentLight'
//     | 'productDark'
//     | 'productLight'
//     | 'productTransparentDark'
//     | 'productTransparentLight'

//     // for backend driven picks
//     | 'links'
//     | 'content'
//     | 'hero'
//     | 'product'
//     | 'cart'
//     | 'checkout'
//     | 'order'
//     | 'account'
//     | 'login'
//     | 'register'
//     | 'reset'
//     | 'pagination'
//   children?: React.ReactNode
//   fullWidth?: boolean
//   mobileFullWidth?: boolean
//   className?: string
//   icon?: boolean
//   size?: null | undefined | '' | 'extrasmall' | 'small' | 'medium' | 'large'
//   width?: null | undefined | '' | 'narrow' | 'wide' | 'full'
//   style?: null | undefined | '' | 'dark' | 'light' | 'transparentLight' | 'transparentDark'
//   iconPosition?: 'left' | 'right' | null | undefined
//   onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
//   onMouseEnter?: () => void
//   onMouseLeave?: () => void
//   buttonProps?: ButtonProps
// }

// type GenerateSlugType = {
//   type?: LinkType | null
//   url?: string | null
//   reference?: Reference | null
// }
// const generateHref = (args: GenerateSlugType): string => {
//   const { reference, url, type } = args
//   if ((type === 'custom' || type === undefined) && url) {
//     return `//${url}`
//   }

//   if (type === 'reference' && reference?.value && typeof reference.value !== 'string') {
//     if (reference.relationTo === 'pages') {
//       return `/${reference.value.slug}`
//     }

//     if (reference.relationTo === 'products') {
//       return `/products/${reference.value.slug}`
//     }
//   }

//   return ''
// }

// export const CMSLink: React.FC<CMSLinkType> = ({
//   type,
//   url,
//   newTab,
//   reference,
//   label,
//   appearance,
//   children,
//   className: classNameFromProps,
//   icon,
//   iconPosition,
//   size,
//   width,
//   style,
//   onClick,
//   onMouseEnter,
//   onMouseLeave,
//   fullWidth = false,
//   mobileFullWidth = false,
//   buttonProps: buttonPropsFromProps,
// }) => {
//   const href = generateHref({ type, url, reference }) || url || ''
//   const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

//   // merge class names
//   let className = [classNameFromProps].filter(Boolean).join(' ')
//   className = [
//     className, // additional classes passed in
//     buttonFormats.global,

//     // size
//     size === 'large' && buttonFormats.large,
//     (size === null || size === undefined || size === 'medium') && buttonFormats.medium,
//     size === 'small' && buttonFormats.small,
//     size === 'extrasmall' && buttonFormats.extrasmall,

//     // width
//     width === 'narrow' && buttonFormats.narrow,
//     (width === null || width === undefined || width === 'wide') && buttonFormats.wide,
//     width === 'full' && buttonFormats.full,

//     // style
//     style === 'dark' && buttonFormats.dark,
//     style === 'light' && buttonFormats.light,
//     style === 'transparentLight' && buttonFormats.transparentLight,
//     style === 'transparentDark' && buttonFormats.transparentDark,

//     // appearance
//     (appearance === null || appearance === undefined) && buttonFormats.default,
//     appearance === 'links' && buttonFormats.links,
//     appearance === 'content' && buttonFormats.content,
//     appearance === 'hero' && buttonFormats.hero,
//     appearance === 'product' && buttonFormats.product,
//     appearance === 'checkout' && buttonFormats.checkout,
//     appearance === 'cart' && buttonFormats.cart,
//     appearance === 'pagination' && buttonFormats.pagination,

//     // appearance from front end
//     appearance === 'default' && buttonFormats.links,

//     appearance === 'contentDark' && [buttonFormats.content, buttonFormats.dark].join(' '),
//     appearance === 'contentLight' && [buttonFormats.content, buttonFormats.light].join(' '),
//     appearance === 'contentTransparentDark' &&
//       [buttonFormats.content, buttonFormats.transparentDark].join(' '),
//     appearance === 'contentTransparentLight' &&
//       [buttonFormats.content, buttonFormats.transparentLight].join(' '),

//     appearance === 'heroDark' && [buttonFormats.hero, buttonFormats.dark].join(' '),
//     appearance === 'heroLight' && [buttonFormats.hero, buttonFormats.light].join(' '),
//     appearance === 'heroTransparentDark' &&
//       [buttonFormats.hero, buttonFormats.transparentDark].join(' '),
//     appearance === 'heroTransparentLight' &&
//       [buttonFormats.hero, buttonFormats.transparentLight].join(' '),

//     appearance === 'productDark' && [buttonFormats.product, buttonFormats.dark].join(' '),
//     appearance === 'productLight' && [buttonFormats.product, buttonFormats.dark].join(' '),
//     appearance === 'productTransparentDark' &&
//       [buttonFormats.product, buttonFormats.transparentDark].join(' '),
//     appearance === 'productTransparentLight' &&
//       [buttonFormats.product, buttonFormats.transparentLight].join(' '),
//   ].join(' ')

//   // if (!href) return null

//   if (!href) {
//     return (
//       <span
//         className={className}
//         onClick={onClick}
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//       >
//         {label}
//         {children}
//       </span>
//     )
//   }

//   return (
//     <Link
//       href={href}
//       onClick={onClick} // Pass onClick handler
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//       className={className}
//       scroll={true}
//       {...newTabProps}
//     >
//       {label && label} {children && children}
//       {/* {!icon && appearance != 'links' && (
//         <ArrowRightIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
//       )} */}
//     </Link>
//   )

// if (!appearance) {
//   const hrefIsLocal = ['tel:', 'mailto:', '/'].some((prefix) => href.startsWith(prefix))

//   if (!hrefIsLocal && href !== '#') {
//     try {
//       const objectURL = new URL(href)
//       if (objectURL.origin === process.env.NEXT_PUBLIC_SERVER_URL) {
//         href = objectURL.href.replace(process.env.NEXT_PUBLIC_SERVER_URL, '')
//       }
//     } catch (e) {
//       // Do not throw error if URL is invalid
//       // This will prevent the page from building
//       console.log(`Failed to format url: ${href}`, e) // eslint-disable-line no-console
//     }
//   }

//   const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

//   if (href.indexOf('/') === 0) {
//     return (
//       <Link
//         href={href}
//         {...newTabProps}
//         className={className}
//         onClick={onClick}
//         onMouseEnter={onMouseEnter}
//         onMouseLeave={onMouseLeave}
//         prefetch={false}
//       >
//         {label && label}
//         {children && children}
//       </Link>
//     )
//   }

//   return (
//     <a
//       href={href}
//       {...newTabProps}
//       className={className}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//       onClick={onClick}
//     >
//       {label && label}
//       {children && children}
//     </a>
//   )
// }

// const buttonProps: ButtonProps = {
//   ...buttonPropsFromProps,
//   newTab,
//   href,
//   appearance,
//   label,
//   onClick,
//   onMouseEnter,
//   onMouseLeave,
//   fullWidth,
//   mobileFullWidth,
// }

// if (appearance === 'default') {
//   buttonProps.icon = 'arrow'
// }

// return <Button {...buttonProps} className={`${className} no-underline`} el="link" />
// }
