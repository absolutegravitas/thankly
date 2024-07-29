import React, { useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'

// Import format constants
import {
  IS_BOLD,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_UNDERLINE,
  IS_CODE,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_ALIGN_LEFT,
  IS_ALIGN_CENTER,
  IS_ALIGN_RIGHT,
  IS_ALIGN_JUSTIFY,
  IS_ALIGN_START,
  IS_ALIGN_END,
} from './RichTextNodeFormat'

// Types
type SerializedLexicalNode = {
  children?: SerializedLexicalNode[]
  direction: string
  format: number
  indent?: string | number
  type: string
  version: number
  style?: string
  mode?: string
  text?: string
  [other: string]: any
}

type TextComponentProps = {
  children: React.ReactNode
  format: number
}

// Utility functions
const getLinkForDocument = (doc: any, locale?: string): string => {
  let path = doc?.path
  if (!path || path.startsWith('/home') || path === '/' || path === '') path = '/'
  return `/${locale}${path}`
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

const calculateAspectRatio = (width: number, height: number): string => {
  const divisor = gcd(width, height)
  return `${width / divisor}x${height / divisor}`
}

// Memoized components
const MemoizedTextComponent = React.memo(({ children, format }: TextComponentProps) => {
  const formatFunctions: { [key: number]: (child: React.ReactNode) => React.ReactElement } =
    useMemo(
      () => ({
        [IS_BOLD]: (child) => <strong>{child}</strong>,
        [IS_ITALIC]: (child) => <em>{child}</em>,
        [IS_STRIKETHROUGH]: (child) => <del>{child}</del>,
        [IS_UNDERLINE]: (child) => <u>{child}</u>,
        [IS_CODE]: (child) => <code>{child}</code>,
        [IS_SUBSCRIPT]: (child) => <sub>{child}</sub>,
        [IS_SUPERSCRIPT]: (child) => <sup>{child}</sup>,
      }),
      [],
    )

  const formattedText = useMemo(() => {
    return Object.entries(formatFunctions).reduce((formattedText, [key, formatter]) => {
      return format & Number(key) ? formatter(formattedText) : formattedText
    }, children)
  }, [children, format, formatFunctions])

  return <>{formattedText}</>
})

const MemoizedSerializedLink = React.memo(
  ({
    node,
    locale,
    children,
  }: {
    node: SerializedLexicalNode
    locale: string
    children: React.ReactNode
  }) => {
    const { doc, url, newTab, linkType } = node.fields as any
    const document = doc?.value
    const href = linkType === 'custom' ? url : getLinkForDocument(document, locale)
    const target = newTab ? '_blank' : undefined

    return (
      <Link
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    )
  },
)

// Custom hooks
const useNodeClassNames = (node: SerializedLexicalNode) => {
  return useMemo(() => {
    const attributes: Record<string, any> = {}
    if (!node) return attributes

    let classNames = ''

    if (typeof node.format === 'number') {
      if (node.format & IS_ALIGN_CENTER) classNames += 'text-center '
      if (node.format & IS_ALIGN_LEFT) classNames += 'text-left '
      if (node.format & IS_ALIGN_RIGHT) classNames += 'text-right '
      if (node.format & IS_ALIGN_JUSTIFY) classNames += 'text-justify '
    }

    if (classNames.length > 0) attributes.className = classNames.trim()

    const indent = parseInt(`${node?.indent || 0}`)
    if (!isNaN(indent) && indent !== 0) {
      attributes.style = { '--indent': `${indent * 10}px` } as React.CSSProperties
      attributes.className = `${attributes.className ?? ''} ml-[--indent]`.trim()
    }

    return attributes
  }, [node])
}

// Main component
const LexicalContent: React.FC<{
  childrenNodes: SerializedLexicalNode[]
  locale: string
  className?: string
  lazyLoadImages?: boolean
}> = ({ childrenNodes, locale, lazyLoadImages = false }) => {
  const renderNode = useCallback(
    (node: SerializedLexicalNode, index: number): React.ReactNode => {
      if (!node) return null
      const attributes = useNodeClassNames(node)

      switch (node.type) {
        case 'text':
          return (
            <MemoizedTextComponent key={index} format={node.format}>
              {Object.keys(attributes).length > 0 ? (
                <span {...attributes}>{node?.text || ''}</span>
              ) : (
                node?.text || ''
              )}
            </MemoizedTextComponent>
          )
        case 'linebreak':
          return <br key={index} />
        case 'link':
          return (
            <MemoizedSerializedLink key={index} node={node} locale={locale}>
              {node.children ? (
                <LexicalContent
                  childrenNodes={node.children}
                  locale={locale}
                  lazyLoadImages={lazyLoadImages}
                />
              ) : null}
            </MemoizedSerializedLink>
          )
        case 'list':
          const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
          attributes.className = clsx(
            attributes.className,
            'mb-4 pl-8',
            ListTag === 'ol' ? 'list-decimal' : 'list-disc',
          )
          return (
            <ListTag key={index} {...attributes}>
              {node.children ? (
                <LexicalContent
                  childrenNodes={node.children}
                  locale={locale}
                  lazyLoadImages={lazyLoadImages}
                />
              ) : null}
            </ListTag>
          )
        case 'listitem':
          return (
            <li key={index} {...attributes}>
              {node.children ? (
                <LexicalContent
                  childrenNodes={node.children}
                  locale={locale}
                  lazyLoadImages={lazyLoadImages}
                />
              ) : null}
            </li>
          )
        case 'heading':
          const HeadingTag = `h${node.tag}` as keyof JSX.IntrinsicElements
          return (
            <HeadingTag key={index} {...attributes}>
              {node.children ? (
                <LexicalContent
                  childrenNodes={node.children}
                  locale={locale}
                  lazyLoadImages={lazyLoadImages}
                />
              ) : null}
            </HeadingTag>
          )
        case 'quote':
          return (
            <blockquote key={index} {...attributes}>
              {node.children ? (
                <LexicalContent
                  childrenNodes={node.children}
                  locale={locale}
                  lazyLoadImages={lazyLoadImages}
                />
              ) : null}
            </blockquote>
          )
        case 'upload':
          const upload = node?.value
          if (!upload) return null
          const imageAspectRatio = calculateAspectRatio(upload.width, upload.height)
          return (
            <Image
              key={index}
              width={upload.width}
              height={upload.height}
              src={upload?.url}
              loading={lazyLoadImages ? 'lazy' : 'eager'}
              fetchPriority={lazyLoadImages ? 'low' : 'high'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="max-w-[calc(100%+40px)] translate-x-[-20px]"
              alt={upload?.alt || upload.filename}
              blurDataURL={upload?.blurDataURL}
              placeholder={upload?.blurDataURL ? 'blur' : 'empty'}
            />
          )
        default:
          if (!node.children || node.children.length === 0) return <br key={index} />
          return (
            <p key={index} {...attributes}>
              <LexicalContent
                childrenNodes={node.children}
                locale={locale}
                lazyLoadImages={lazyLoadImages}
              />
            </p>
          )
      }
    },
    [locale, lazyLoadImages],
  )

  const renderedChildren = useMemo(() => {
    if (!Array.isArray(childrenNodes)) return null
    return childrenNodes.map(renderNode)
  }, [childrenNodes, renderNode])

  return <>{renderedChildren}</>
}

export default React.memo(LexicalContent)
