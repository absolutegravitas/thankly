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
  text: `text-justify font-body font-light tracking-tight leading-snug prose-em:font-extrabold #prose-em:text-gray-700`,
  smallText: `text-sm text-left #text-justify font-body font-light tracking-tight leading-snug prose-em:font-extrabold #prose-em:text-gray-700`,

  h1: `font-title font-semibold text-5xl tracking-tight`,
  h2: `font-title font-semibold text-2xl tracking-tight`,
  h3: `font-title font-semibold text-xl tracking-tighter`,
  h4: `font-title font-semibold text-lg tracking-tighter`,
  h5: `font-title font-semibold text-base tracking-tighter`,
  h6: `font-title font-semibold text-base tracking-tighter`,

  p: `font-body font-light text-gray-800 tracking-tight lg:tracking-tighter`,
  blockquote: `font-body font-light text-gray-800 tracking-tight lg:tracking-tighter`,
  pre: `font-body font-light text-gray-800 tracking-tight lg:tracking-tighter`,
  code: `font-body font-light text-gray-800 tracking-tight lg:tracking-tighter`,
  a: `font-body  font-light underline underline-offset-4 decoration-dotted decoration-gray-800 text-gray-800 hover:font-medium`,
  strong: `font-bold text-gray-700`,

  em: 'font-bold text-gray-700',
  italic: `italic`,
  ul: 'font-title font-light text-gray-800 tracking-tight lg:tracking-tighter prose-ul:list-disc marker:text-gray-700',
  li: 'font-title font-light text-gray-800 tracking-tight lg:tracking-tighter  marker:text-gray-700',
  ol: 'font-title font-light text-gray-800 tracking-tight lg:tracking-tighter prose-ol:list-decimal marker:text-gray-700',

  error: 'rounded-sm font-medium text-white bg-red-700 px-4 py-3',
  success: 'rounded-sm font-medium text-offwhite bg-lime-600 px-4 py-3',
  warning: 'rounded-sm font-medium  bg-amber-400 px-4 py-3',

  // order status
  orderProcessing: `text-gray-600 bg-gray-50 ring-gray-500/10`,

  orderCompleted: `text-green-700 bg-green-50 ring-green-600/20`,
  orderCancelled: `text-red-600 bg-gray-50 ring-gray-500/10`,
  orderReturned: `text-gray-600 bg-gray-50 ring-gray-500/10`,

  // order line item status
  lineItemProcessing: `text-gray-600 bg-gray-50 ring-gray-500/10`, // when just created
  lineItemShipped: `text-gray-600 bg-gray-50 ring-gray-500/10`, // when fulfilled

  lineItemCompleted: `text-green-700 bg-green-50 ring-green-600/20`,
  lineItemCancelled: `text-gray-600 bg-gray-50 ring-gray-500/10`,
  lineItemReturned: `text-gray-600 bg-gray-50 ring-gray-500/10`,
}

export const buttonFormats = {
  global: `cursor-pointer antialiased font-body font-light tracking-tight rounded-xs items-center animate-fade-in transition justify-between `,

  // appearance
  default: ``, // style if no set class

  links: `underline underline-offset-2 decoration-gray-800 text-gray-800 hover:font-medium`,
  content: `no-underline  inline-flex`,
  hero: `no-underline inline-flex`,
  product: `no-underline  inline-flex`,
  checkout: `no-underline  inline-flex`,
  cart: `no-underline  inline-flex`,
  pagination: `text-sm p-1 inline-flex items-center border border-gray-400 border-solid text-gray-900 hover:bg-gray-800 `,

  // style
  dark: `bg-gray-900 text-gray-50 border border-solid border-gray-900 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-500`,
  light: `bg-white text-gray-900 border border-solid border-gray-500 hover:bg-gray-900 hover:text-gray-100 hover:border-gray-500`,
  transparentLight: `bg-transparent text-gray-100 border border-solid border-gray-100 hover:bg-lightkhaki`,
  transparentDark: `bg-transparent text-gray-900 border border-solid border-gray-600 hover:bg-lightkhaki`,

  // button sizes
  // className={cn(`!mb-0 w-full justify-between px-6 text-sm sm:mb-0 `)}
  large: `text-lg px-5 py-4 `,
  medium: `text-sm px-4 py-3`,
  small: `text-sm px-3 py-2`,
  extrasmall: `text-xs px-2 py-2`,

  // button widths
  narrow: ``,
  wide: `min-w-[250px]`, // some arbitrary wide option
  full: `w-full`, // full width of containing element

  // actions
  submit: `cursor-pointer`,
  processing: `cursor-wait`,
  disabled: `cursor-not-allowed opacity-75`,
}

export const tailwindColorMatch = {
  '#ffffff': 'bg-white', // white
  '#c2c0ae': 'bg-lightkhaki', // light khaki
  '#dfded9': 'bg-lighterkhaki', // lighter khaki
  '#cbd5e1': 'bg-gray-300', // slate gray
  '#557755': 'bg-green', // thankly green (dark)
  '#374151': 'bg-gray-700', // slate black
  '#030712': 'bg-gray-900', // jet black
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