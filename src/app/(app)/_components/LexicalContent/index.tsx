/**
 * @file
 * @module LexicalContent
 * @description Renders serialized Lexical nodes as React components.
 * @overview This file contains utility functions and components for rendering Lexical rich text content in a React application. It handles various node types such as text, links, lists, headings, quotes, and images. The main component is `LexicalContent`, which recursively renders child nodes based on their types.
 */

/* eslint-disable react/no-children-prop */
import ensurePath from '@/utilities/ensurePath'
import clsx from 'clsx'
import Link from 'next/link'
import React, { CSSProperties, type FC, type ReactElement } from 'react'
import Image from 'next/image'
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './RichTextNodeFormat'
import {
  IS_ALIGN_LEFT,
  IS_ALIGN_CENTER,
  IS_ALIGN_RIGHT,
  IS_ALIGN_JUSTIFY,
  IS_ALIGN_START,
  IS_ALIGN_END,
} from './RichTextNodeFormat'

/**
 * @typedef {Object} SerializedLexicalNode
 * @property {SerializedLexicalNode[]} [children] - Child nodes
 * @property {string} direction - Text direction
 * @property {number} format - Format flags
 * @property {(string|number)} [indent] - Indentation level
 * @property {string} type - Node type
 * @property {number} version - Version number
 * @property {string} [style] - Inline styles
 * @property {string} [mode] - Mode
 * @property {string} [text] - Text content
 * @property {any} [other] - Other properties
 */
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

/**
 * @typedef {Object} TextComponentProps
 * @property {ReactElement|string} children - Child elements or text
 * @property {number} format - Format flags
 */
type TextComponentProps = {
  children: ReactElement | string
  format: number
}

/**
 * @function
 * @description Gets the link for a document based on its path and locale.
 * @param {any} doc - The document object
 * @param {string} [locale] - The locale
 * @returns {string} The link URL
 */
const getLinkForDocument = (doc: any, locale?: string): string => {
  let path = doc?.path
  if (!path || path.startsWith('/home') || path === '/' || path === '') path = '/'
  return ensurePath(`/${locale}${path}`)
}

/**
 * @function
 * @description Calculates the greatest common divisor of two numbers.
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The greatest common divisor
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/**
 * @function
 * @description Calculates the aspect ratio of a given width and height as a string.
 * @param {number} width - The width
 * @param {number} height - The height
 * @returns {string} The aspect ratio as a string (e.g., "4x3")
 */
function calculateAspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height)
  const simplifiedWidth = width / divisor
  const simplifiedHeight = height / divisor

  return `${simplifiedWidth}x${simplifiedHeight}`
}

/**
 * @component
 * @description Renders formatted text with different styles (bold, italic, etc.).
 * @param {TextComponentProps} props - The component props
 * @param {ReactElement|string} props.children - The child elements or text
 * @param {number} props.format - The format flags
 * @returns {JSX.Element}
 */
const TextComponent: FC<TextComponentProps> = ({ children, format }) => {
  const formatFunctions: { [key: number]: (child: ReactElement | string) => ReactElement } = {
    [IS_BOLD]: (child) => <strong>{child}</strong>,
    [IS_ITALIC]: (child) => <em>{child}</em>,
    [IS_STRIKETHROUGH]: (child) => <del>{child}</del>,
    [IS_UNDERLINE]: (child) => <u>{child}</u>,
    [IS_CODE]: (child) => <code>{child}</code>,
    [IS_SUBSCRIPT]: (child) => <sub>{child}</sub>,
    [IS_SUPERSCRIPT]: (child) => <sup>{child}</sup>,
  }

  const formattedText = Object.entries(formatFunctions).reduce(
    (formattedText, [key, formatter]) => {
      return format & Number(key) ? formatter(formattedText) : formattedText
    },
    children,
  )

  return <React.Fragment>{formattedText}</React.Fragment>
}

/**
 * @component
 * @description Renders a link component with a custom URL or a document path.
 * @param {Object} props - The component props
 * @param {SerializedLexicalNode} props.node - The serialized Lexical node
 * @param {string} props.locale - The locale
 * @param {JSX.Element|null} props.children - The child elements
 * @returns {JSX.Element}
 */
const SerializedLink: React.FC<{
  node: SerializedLexicalNode
  locale: string
  children: JSX.Element | null
}> = ({ node, locale, children }) => {
  const { doc, url, newTab, linkType } = node.fields as any
  const document = doc?.value
  const href = linkType === 'custom' ? url : getLinkForDocument(document, locale)
  const target = newTab ? '_blank' : undefined

  return (
    <Link href={href} target={target}>
      {children}
    </Link>
  )
}

/**
 * @function
 * @description Gets the class names and styles for a serialized Lexical node.
 * @param {SerializedLexicalNode} node - The serialized Lexical node
 * @returns {Record<string, any>} An object containing class names and styles
 */

const getNodeClassNames = (node: SerializedLexicalNode) => {
  const attributes: Record<string, any> = {}
  if (!node) return attributes

  let classNames = ''

  if (typeof node.format === 'number') {
    switch (node.format) {
      case IS_ALIGN_LEFT:
        classNames += 'text-left '
        break
      case IS_ALIGN_CENTER:
        classNames += 'text-center '
        break
      case IS_ALIGN_RIGHT:
        classNames += 'text-right '
        break
      case IS_ALIGN_JUSTIFY:
        classNames += 'text-justify '
        break
      case IS_ALIGN_START:
        classNames += node.direction === 'rtl' ? 'text-right ' : 'text-left '
        break
      case IS_ALIGN_END:
        classNames += node.direction === 'rtl' ? 'text-left ' : 'text-right '
        break
      default:
        // Default to left alignment if no alignment is specified
        classNames += 'text-left '
    }
  }

  if (classNames.length > 0) attributes.className = classNames.trim()

  const indent = parseInt(`${node?.indent || 0}`)
  if (!isNaN(indent) && indent !== 0) {
    attributes.style = { '--indent': `${indent * 10}px` } as CSSProperties
    attributes.className = `${attributes.className ?? ''} ml-[--indent]`.trim()
  }

  return attributes
}

/**
 * @component
 * @description Renders serialized Lexical nodes as React components.
 * @param {Object} props - The component props
 * @param {SerializedLexicalNode[]} props.childrenNodes - The array of child nodes
 * @param {string} props.locale - The locale
 * @param {string} [props.className] - The additional class names
 * @param {boolean} [props.lazyLoadImages=false] - Whether to lazy load images
 * @returns {JSX.Element|null}
 */
const LexicalContent: React.FC<{
  childrenNodes: SerializedLexicalNode[]
  locale: string
  className?: string
  lazyLoadImages: boolean
}> = ({ childrenNodes, locale, lazyLoadImages = false }) => {
  if (!Array.isArray(childrenNodes)) return null

  const renderedChildren = childrenNodes.map((node, ix) => {
    if (!node) return null
    const attributes = getNodeClassNames(node || '')
    if (node.type === 'text') {
      return (
        <TextComponent key={ix} format={node.format}>
          <React.Fragment>
            {Object.keys(attributes).length > 0 && <span {...attributes}>{node?.text || ''}</span>}
            {(Object.keys(attributes).length === 0 && node?.text) || ''}
          </React.Fragment>
        </TextComponent>
      )
    }

    const serializedChildren = node.children ? (
      <LexicalContent
        key={ix}
        childrenNodes={node.children}
        locale={locale}
        lazyLoadImages={lazyLoadImages}
      />
    ) : null
    switch (node.type) {
      case 'linebreak':
        return <br key={ix} />
      case 'link':
        return <SerializedLink key={ix} node={node} locale={locale} children={serializedChildren} />
      case 'list':
        const ListTag = node.listType === 'bullet' ? 'ul' : 'ol'
        attributes.className = clsx(
          attributes.className,
          'mb-4 pl-8',
          ListTag === 'ol' ? 'list-decimal' : 'list-disc',
        )
        return (
          <ListTag key={ix} {...attributes}>
            {serializedChildren}
          </ListTag>
        )
      case 'listitem':
        return (
          <li key={ix} {...attributes}>
            {serializedChildren}
          </li>
        )
      case 'heading':
        const HeadingTag = node.tag as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={ix} {...attributes}>
            {serializedChildren}
          </HeadingTag>
        )
      case 'quote':
        return (
          <blockquote key={ix} {...attributes}>
            {serializedChildren}
          </blockquote>
        )
      case 'upload':
        const upload = node?.value
        if (!upload) return null
        const imageAspectRatio = calculateAspectRatio(upload.width, upload.height)
        return (
          <Image
            key={ix}
            width={upload.width}
            height={upload.height}
            src={upload?.url}
            loading={lazyLoadImages ? 'lazy' : 'eager'}
            fetchPriority={lazyLoadImages ? 'low' : 'high'}
            sizes="(max-width: 768) 65ch, 100vw"
            className="max-w-[calc(100%+40px)] translate-x-[-20px]"
            alt={upload?.alt || upload.filename}
          />
        )
      default:
        if (
          Array.isArray(serializedChildren?.props?.childrenNodes) &&
          serializedChildren?.props?.childrenNodes.length === 0
        )
          return <br key={ix} />
        return (
          <p key={ix} {...attributes}>
            {serializedChildren}
          </p>
        )
    }
  })

  return <React.Fragment>{renderedChildren.filter((node) => node !== null)}</React.Fragment>
}

export default LexicalContent
