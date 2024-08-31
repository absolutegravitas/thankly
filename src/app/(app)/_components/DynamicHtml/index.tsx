import React, { useState, useEffect } from 'react'

interface Props {
  htmlContent: string
}

const DynamicHTML: React.FC<Props> = ({ htmlContent }) => {
  const [sanitizedContent, setSanitizedContent] = useState(htmlContent)

  useEffect(() => {
    const sanitizeContent = async () => {
      const DOMPurify = (await import('dompurify')).default
      const sanitized = DOMPurify.sanitize(htmlContent)
      setSanitizedContent(sanitized)
    }
    ~sanitizeContent()
  }, [htmlContent])

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}

export default DynamicHTML
