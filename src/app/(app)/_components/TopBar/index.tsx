/* Comments preserved */
'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'

// import { modalSlug } from '@app/_components/Header/MobileNav'
import { RichText } from '@app/_blocks/RichText'

import type { TopBar as TopBarType } from '@payload-types'

import cn from '@/utilities/cn'
import { contentFormats } from '../../_css/tailwindClasses'

export const TopBar: React.FC<TopBarType> = (props) => {
  // const { isModalOpen } = useModal()
  // const isMobileNavOpen = isModalOpen(modalSlug)
  const { content } = props
  return (
    <React.Fragment>
      {content && typeof content === 'object' && Object.keys(content).length > 0 && (
        <div
          className={cn(
            'fixed top-0 w-full z-50 bg-theme text-white',
            // isMobileNavOpen && 'z-60',
            'transition-colors duration-300 ease',
          )}
        >
          <div className="relative px-2 flex items-center justify-between gap-4 w-full h-full pointer-events-auto text-inherit">
            <div>
              <RichText
                className={cn(contentFormats.text, 'inline-flex flex-col gap-2')}
                content={content}
              />
            </div>
          </div>
        </div>
      )}
      {/* Additional margin to ensure separation from the Header */}
      <div className="mt-14" />
    </React.Fragment>
  )
}
