'use client'

import * as React from 'react'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const DynamicThemeProvider = dynamic(() => import('next-themes').then((mod) => mod.ThemeProvider), {
  ssr: false,
})

export function ThemeProvider({ children, ...props }: any) {
  useEffect(() => {
    // This effect will only run on the client-side
    console.log('Client-side rendering')
  }, [])

  return <DynamicThemeProvider {...props}>{children}</DynamicThemeProvider>
}
