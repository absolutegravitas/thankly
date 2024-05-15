import type { AdditionalBlockProps } from '@web/_blocks'
import { BlockWrapper } from '@web/_components/BlockWrapper'
import LexicalContent from '@web/_components/LexicalContent'
// import type { RichTextBlock } from '@payload-types'
import classes from './index.module.scss'

export function RichText({ content, locale, className }: any & AdditionalBlockProps) {
  if (content?.root?.children?.length === 0) return null
  // console.log('richtext content to show // ', content.root.children)

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      {/* <BlockWrapper> */}
      {/* <div className="prose dark:prose-invert md:prose-lg"> */}
      {/* @ts-ignore */}
      <LexicalContent
        childrenNodes={content?.root?.children}
        locale={locale}
        lazyLoadImages={false}
      />
      {/* </div> */}
      {/* </BlockWrapper> */}
    </div>
  )
}

export default RichText
