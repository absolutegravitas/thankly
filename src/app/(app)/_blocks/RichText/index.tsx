import type { AdditionalBlockProps } from '@app/_blocks'
import LexicalContent from '@app/_components/LexicalContent'
// import type { RichTextBlock } from '@payload-types'

export function RichText({ content, locale, className }: any & AdditionalBlockProps) {
  if (content?.root?.children?.length === 0) return null
  // console.log('richtext content to show // ', content.root)

  return (
    <div>
      <LexicalContent
        childrenNodes={content?.root?.children}
        locale={locale}
        lazyLoadImages={false}
      />
    </div>
  )
}

export default RichText
