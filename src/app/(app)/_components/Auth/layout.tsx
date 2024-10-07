import Header from './header'
import Footer from './footer'
import type { ReactNode } from 'react'
import * as React from 'react'
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
