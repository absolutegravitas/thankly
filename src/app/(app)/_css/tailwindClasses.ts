import cn from '@/utilities/cn'

export const blockFormats = {
  headerMenu: `antialiased font-title font-medium no-underline tracking-tight`,
  footerMenu: `antialiased font-title font-normal no-underline tracking-tight text-sm leading-snug ml-0 pl-0`,
  blockWidth: ` mx-auto max-w-screen-xl px-5`,
  blockPadding: ` py-16 sm:py-16 #mt-10`,
  shortVerticalPadding: `py-8 sm:py-8`,
}

export const contentFormats = {
  global: `antialiased`,

  alignLeft: ``,
  alignRight: ``,
  alignCenter: ``,
  alignJustify: ``,

  // gen text
  text: `text-justify font-body font-light tracking-tight leading-snug prose-em:font-extrabold`,
  smallText: `text-sm text-left #text-justify font-body font-light tracking-tight leading-snug prose-em:font-extrabold #prose-em:text-neutral-700`,

  h1: `font-title font-semibold text-5xl tracking-tight`,
  h2: `font-title font-semibold text-2xl tracking-tight`,
  h3: `font-title font-semibold text-xl tracking-tighter`,
  h4: `font-title font-semibold text-lg tracking-tighter`,
  h5: `font-title font-semibold text-base tracking-tighter`,
  h6: `font-title font-semibold text-base tracking-tighter`,

  p: `font-body font-light tracking-tight lg:tracking-tighter`,
  blockquote: `font-body font-light tracking-tight lg:tracking-tighter`,
  pre: `font-body font-light tracking-tight lg:tracking-tighter`,
  code: `font-body font-light tracking-tight lg:tracking-tighter`,
  a: `font-body  font-light underline underline-offset-4 decoration-dotted decoration-neutral-800 hover:font-medium`,
  strong: `font-bold text-neutral-700`,

  em: 'font-bold text-neutral-700',
  italic: `italic`,
  ul: 'font-title font-light tracking-tight lg:tracking-tighter prose-ul:list-disc marker:text-neutral-700',
  li: 'font-title font-light tracking-tight lg:tracking-tighter  marker:text-neutral-700',
  ol: 'font-title font-light tracking-tight lg:tracking-tighter prose-ol:list-decimal marker:text-neutral-700',

  error: 'rounded-sm font-medium text-white bg-red-700 px-4 py-3',
  success: 'rounded-sm font-medium text-offwhite bg-lime-600 px-4 py-3',
  warning: 'rounded-sm font-medium  bg-amber-400 px-4 py-3',

  // order status
  orderProcessing: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,

  orderCompleted: `text-green-700 bg-green-50 ring-green-600/20`,
  orderCancelled: `text-red-600 bg-neutral-50 ring-neutral-500/10`,
  orderReturned: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,

  // order line item status
  lineItemProcessing: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`, // when just created
  lineItemShipped: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`, // when fulfilled

  lineItemCompleted: `text-green-700 bg-green-50 ring-green-600/20`,
  lineItemCancelled: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,
  lineItemReturned: `text-neutral-600 bg-neutral-50 ring-neutral-500/10`,
}

export const buttonLook = {
  base: `cursor-pointer antialiased font-body font-light tracking-tight items-center animate-fade-in transition justify-between`,

  sizes: {
    extrasmall: `text-xs px-2 py-2`,
    small: `text-sm px-3 py-2`,
    medium: `text-sm px-4 py-4`,
    large: `text-lg px-5 py-5 `,
  },

  widths: {
    narrow: ``,
    normal: `w-1/2`, // half container width, make sure there's a container
    wide: `w-full md:w-3/4`,
    full: `w-full`, // full width of containing element
  },

  variants: {
    base: `no-underline hover:no-underline border border-solid border-neutral-500 rounded-sm transition hover:border-green hover:shadow-md duration-150 shadow-sm dark:hover:border-green`, // for buttons only
    links: `underline underline-offset-2 decoration-neutral-800 text-neutral-800 dark:text-neutral-100 hover:font-medium`,

    default: ``, // default look button
    blocks: `cursor-pointer bg-transparent no-underline inline-flex hover:border-green hover:shadow-md hover:bg-neutral-950 hover:text-white dark:hover:bg-green dark:hover:text-white dark:hover:border-green dark:hover:shadow-md`,
  },

  actions: {
    submit: `cursor-pointer`,
    submitting: `cursor-wait`,
    submitted: `cursor-auto`,
    disabled: `cursor-not-allowed opacity-75`,
  },
} as const

export const tailwindColorMatch = {
  '#ffffff': 'bg-white', // white
  '#c2c0ae': 'bg-lightkhaki', // light khaki
  '#dfded9': 'bg-lighterkhaki', // lighter khaki
  '#cbd5e1': 'bg-neutral-300', // slate gray
  '#557755': 'bg-green', // thankly green (dark)
  '#374151': 'bg-neutral-700', // slate black
  '#030712': 'bg-neutral-900', // jet black
}

export const textColorVariants = {
  '#557755': 'text-green', // thankly green (dark)
  '#c2c0ae': 'text-lightkhaki', // light khaki
  '#dfded9': 'text-lighterkhaki', // lighter khaki
  '#e7ecef': 'text-offwhite', // off-white
  '#d9d9d9': 'text-slategray', // slate gray
  '#292929': 'text-slateblack', // slate black
  '#0d1317': 'text-black', // jet black
}

type PaddingBlock = {
  mobile: string
  desktop: string
  description: string
}

type ContentBlockTypes =
  | 'standard'
  | 'hero'
  | 'compact'
  | 'feature'
  | 'cta'
  | 'footer'
  | 'narrow'
  | 'wide'

type ContentBlockPadding = {
  [key in ContentBlockTypes]: PaddingBlock
}

const contentBlockPadding: ContentBlockPadding = {
  standard: {
    mobile: '#px-4 py-8',
    desktop: '#md:px-8 md:py-16',
    description: 'Standard content blocks',
  },
  hero: {
    mobile: '#px-4 py-12',
    desktop: '#md:px-8 md:py-24',
    description: 'Hero sections',
  },
  compact: {
    mobile: 'px-4 py-6',
    desktop: 'md:px-6 md:py-8',
    description: 'Compact content blocks',
  },
  feature: {
    mobile: 'px-4 py-10',
    desktop: 'md:px-8 md:py-20',
    description: 'Feature sections',
  },
  cta: {
    mobile: 'px-4 py-10',
    desktop: 'md:px-8 md:py-16',
    description: 'Call-to-Action blocks',
  },
  footer: {
    mobile: 'px-4 py-8',
    desktop: 'md:px-8 md:py-12',
    description: 'Footer section',
  },
  narrow: {
    mobile: 'px-2 py-4',
    desktop: 'md:px-4 md:py-8',
    description: 'Narrow content blocks',
  },
  wide: {
    mobile: 'px-4 py-12',
    desktop: 'md:px-12 md:py-24',
    description: 'Wide content blocks',
  },
}

const getPaddingClasses = (blockType: ContentBlockTypes): string => {
  const block = contentBlockPadding[blockType]
  return `${block.mobile} ${block.desktop}`
}

export { contentBlockPadding, getPaddingClasses }
export type { ContentBlockTypes }
