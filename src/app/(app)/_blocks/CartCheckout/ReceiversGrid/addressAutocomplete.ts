'use server'

import { revalidatePath } from 'next/cache'

export async function addressAutocomplete(query: string, countryCode: string = 'AU') {
  if (!query || query.length < 2) {
    return []
  }

  try {
    const response = await fetch(
      `https://api.radar.io/v1/search/autocomplete?query=${encodeURIComponent(query)}&country=${countryCode}`,
      {
        headers: { Authorization: process.env.RADAR_LIVE_SECRET as string },
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Radar API')
    }

    const data = await response.json()
    revalidatePath('/shop/cart') // Adjust this path as needed
    return data.addresses || []
  } catch (error) {
    console.error('Error fetching address suggestions:', error)
    return []
  }
}
