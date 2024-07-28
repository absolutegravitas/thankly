import type { AdditionalBlockProps } from '@app/_blocks'
import { BlockWrapper } from '@app/_components/BlockWrapper'
import LexicalContent from '@app/_components/LexicalContent'
// import type { RichTextBlock } from '@payload-types'
import classes from './index.module.scss'

export function RichText({ content, locale, className }: any & AdditionalBlockProps) {
  if (content?.root?.children?.length === 0) return null
  // console.log('richtext content to show // ', content.root)

  return (
    <div className={[classes.richText, className].filter(Boolean).join(' ')}>
      <LexicalContent
        childrenNodes={content?.root?.children}
        locale={locale}
        lazyLoadImages={false}
      />
    </div>
  )
}

export default RichText
