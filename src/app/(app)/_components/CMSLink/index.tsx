import React from 'react'
import Link from 'next/link'
import { Page, Product } from '@/payload-types'

import cn from '@/utilities/cn'
import { generateHref } from '@/utilities/generateHref'

import { buttonLook } from '@app/_css/tailwindClasses'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import classes from './index.module.scss'

export type CMSLinkType = {
  data?: {
    label?: string
    type?: 'custom' | 'reference' | string | null
    reference?: {
      value: string | Page | Product
      relationTo: 'pages' | 'products'
    }
    url?: string
    newTab?: boolean
  }
  children?: React.ReactNode

  className?: string
  look?: {
    theme?: 'dark' | 'light'
    type?: 'button' | 'link' | 'submit'
    size?: keyof (typeof buttonLook)['sizes']
    width?: keyof (typeof buttonLook)['widths']
    variant?: keyof (typeof buttonLook)['variants']
    icon?: {
      content: React.ReactNode
      iconPosition?: 'left' | 'right'
    }
  }

  actions?: {
    onClick?: (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
  }
}

export const CMSLink: React.FC<CMSLinkType & { pending?: boolean }> = ({
  data,
  children,
  className,
  look,
  actions,
  pending,
}) => {
  // validate inputs
  if (!data) return null // Handle case where data is undefined

  const { label, type, reference, url, newTab } = data
  const href = generateHref({ type, url, reference })
  if (!href && data.type) return null

  const newTabProps = newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  let classNames = [
    className, // classes passed in
    buttonLook.base,
    cn(
      look?.theme === 'dark' ? 'dark' : 'light',
      look?.size && look.type !== 'link' && buttonLook.sizes[look.size],
      look?.width && look.type !== 'link' && buttonLook.widths[look.width],
      look?.type !== 'link' && buttonLook.variants['base'],
      look?.variant && buttonLook.variants[look.variant],
    ),
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
  ) => {
    if (actions?.onClick) {
      actions.onClick(event as React.MouseEvent<HTMLAnchorElement, MouseEvent>)
    }
  }

  const renderContent = () => (
    <>
      {look?.icon?.content && look.icon.iconPosition === 'left' && (
        <span className="mr-2">{look.icon.content}</span>
      )}
      {children || label}
      {look?.icon?.content && look.icon.iconPosition === 'right' && (
        <span className={data.label === '' || !data?.label ? `sm:ml-0 ml-2` : `ml-2`}>
          {look.icon.content}
        </span>
      )}
      {!look?.icon && <span className="mr-2">{<ChevronRightIcon strokeWidth={1.25} />}</span>}
    </>
  )

  if ((look?.type === 'button' || look?.type === 'submit') && actions?.onClick) {
    return (
      <button className={classNames} onClick={handleClick} disabled={pending} {...newTabProps}>
        {/* {renderContent()} */}
        {pending ? 'processing...' : renderContent()}
      </button>
    )
  } else {
    return (
      <Link href={href} className={classNames} {...newTabProps}>
        {renderContent()}
      </Link>
    )
  }
}
