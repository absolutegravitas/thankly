// import PageTemplate from './[...slug]/page'
// import { generateMetadata } from './[...slug]/page'

// export default PageTemplate

// app/page.ts

import React from 'react'
import { fetchPage } from './[...slug]/page' // Import fetchPage to use it
import Blocks from '@app/_blocks' // Adjust import path if necessary

const HomePage = async () => {
  const slug = 'home'
  const page = await fetchPage(slug) // Fetch page data for slug "home"

  // Handle case where the page might not exist
  if (!page) {
    return <div>Page not found</div> // Handle not found case as needed
  }

  return <Blocks blocks={page.layout.root.children} />
}

// Optionally, you can define static metadata for this page
export async function generateMetadata() {
  return {
    title: 'Thankly - Home',
    description:
      'Express your gratitude with Thankly - Your one-stop shop for thoughtful gifts and cards.',
  }
}

export default HomePage
