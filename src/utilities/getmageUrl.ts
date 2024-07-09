import { Media } from '@/payload-types'

export const getImageUrl = (mediaItem: number | Media | null | undefined): string => {
  // console.log('mediaItem:', mediaItem) // Log the input
  if (
    typeof mediaItem === 'object' &&
    mediaItem !== null &&
    'url' in mediaItem &&
    typeof mediaItem.url === 'string'
  ) {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
    const fullUrl = `${baseUrl}${mediaItem.url}`
    // console.log('Generated URL:', fullUrl) // Log the generated URL
    return fullUrl
  }
  // console.log('Using placeholder image')
  return `https://placehold.co/800x800?text=No+Image`
}

export const getImageAlt = (mediaItem: number | Media | null | undefined): string => {
  if (
    typeof mediaItem === 'object' &&
    mediaItem !== null &&
    'alt' in mediaItem &&
    typeof mediaItem.alt === 'string'
  ) {
    return mediaItem.alt
  }
  return 'Product image placeholder'
}
