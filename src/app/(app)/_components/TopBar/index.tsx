'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'

import { modalSlug } from '@app/_components/Header/MobileNav'
import { RichText } from '@app/_blocks/RichText'

import type { TopBar as TopBarType } from '@payload-types'

import classes from './index.module.scss'

export const TopBar: React.FC<TopBarType> = (props) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(modalSlug)
  const { content } = props
  return (
    <>
      {content && typeof content === 'object' && Object.keys(content).length > 0 && (
        <div
          className={[classes.topBar, isMobileNavOpen && classes.mobileNavOpen]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={classes.wrap}>
            <div>
              <RichText className={classes.richText} content={content} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
