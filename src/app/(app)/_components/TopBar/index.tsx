'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'

import { modalSlug } from '@app/_components/Header/MobileNav'
// import { RichText } from '@app/_blocks/RichText'
import { RichText } from '@app/_blocks/RichText'

import type { TopBar as TopBarType } from '@payload-types'

import classes from './index.module.scss'

export const TopBar: React.FC<TopBarType> = ({ content }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(modalSlug)

  return (
    <div
      className={[classes.topBar, isMobileNavOpen && classes.mobileNavOpen]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.wrap}>
        {content && (
          <div>
            <RichText className={classes.richText} content={content} />
          </div>
        )}
      </div>
    </div>
  )
}
