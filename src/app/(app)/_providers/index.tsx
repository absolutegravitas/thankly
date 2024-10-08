'use client'

import React from 'react'
import { CookiesProvider } from 'react-cookie'
import { GridProvider } from '@faceless-ui/css-grid'
import { ModalContainer, ModalProvider } from '@faceless-ui/modal'
import { MouseInfoProvider } from '@faceless-ui/mouse-info'
import { ScrollInfoProvider } from '@faceless-ui/scroll-info'
import { WindowInfoProvider } from '@faceless-ui/window-info'
import { CartProvider } from '@/app/(app)/_providers/Cart'
import { HeaderIntersectionObserver } from '@app/_providers/HeaderIntersectionObserver'
import { PageTransition } from './PageTransition'
import { ThemePreferenceProvider } from './Theme'
import AuthProvider from './Auth'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <CookiesProvider>
      <AuthProvider>
        <CartProvider>
          <ScrollInfoProvider>
            <MouseInfoProvider>
              <WindowInfoProvider
                breakpoints={{
                  s: '(max-width: 768px)',
                  m: '(max-width: 1100px)',
                  l: '(max-width: 1600px)',
                }}
              >
                <ThemePreferenceProvider>
                  <GridProvider
                    breakpoints={{
                      s: 768,
                      m: 1024,
                      l: 1680,
                    }}
                    rowGap={{
                      s: '1rem',
                      m: '1rem',
                      l: '2rem',
                      xl: '4rem',
                    }}
                    colGap={{
                      s: '1rem',
                      m: '2rem',
                      l: '2rem',
                      xl: '3rem',
                    }}
                    cols={{
                      s: 8,
                      m: 8,
                      l: 12,
                      xl: 12,
                    }}
                  >
                    <ModalProvider transTime={0} zIndex="var(--z-modal)">
                      <PageTransition>
                        <HeaderIntersectionObserver>
                          {children}
                          <ModalContainer />
                        </HeaderIntersectionObserver>
                      </PageTransition>
                    </ModalProvider>
                  </GridProvider>
                </ThemePreferenceProvider>
              </WindowInfoProvider>
            </MouseInfoProvider>
          </ScrollInfoProvider>
        </CartProvider>
      </AuthProvider>
    </CookiesProvider>
  )
}
