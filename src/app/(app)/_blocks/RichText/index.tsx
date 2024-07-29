import type { AdditionalBlockProps } from '@app/_blocks'
import LexicalContent from '@app/_components/LexicalContent'

export function RichText({ content, locale, className }: any & AdditionalBlockProps) {
  if (content?.root?.children?.length === 0) return null
  return (
    <div className={className}>
      <LexicalContent
        childrenNodes={content?.root?.children}
        locale={locale}
        lazyLoadImages={false}
      />
    </div>
  )
}
export default RichText
