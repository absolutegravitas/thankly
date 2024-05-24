'use client'

import React, { useId } from 'react'
import Link from 'next/link'

import { Gutter } from '@app/_components/Gutter'
import { ThemeAutoIcon } from '@app/_graphics/ThemeAutoIcon'
import { ThemeDarkIcon } from '@app/_graphics/ThemeDarkIcon'
import { ThemeLightIcon } from '@app/_graphics/ThemeLightIcon'
import { ChevronUpDownIcon } from '@app/_icons/ChevronUpDownIcon'
import { useAuth } from '@app/_providers/Auth'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { useThemePreference } from '@app/_providers/Theme'
import { getImplicitPreference, themeLocalStorageKey } from '@app/_providers/Theme/shared'
import { Theme } from '@app/_providers/Theme/types'

import classes from './classes.module.scss'
import { blockFormats } from '@/app/(app)/_css/tailwindClasses'

export const SubFooter = () => {
  const { user } = useAuth()

  const selectRef = React.useRef<HTMLSelectElement>(null)
  const themeId = useId()
  const { setTheme } = useThemePreference()
  const { setHeaderTheme } = useHeaderObserver()

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      const implicitPreference = getImplicitPreference() ?? 'light'
      setHeaderTheme(implicitPreference)
      setTheme(implicitPreference)
      if (selectRef.current) selectRef.current.value = 'auto'
    } else {
      setTheme(themeToSet)
      setHeaderTheme(themeToSet)
    }
  }

  return (
    <Gutter className={classes.footerWrap}>
      <footer className={['grid', classes.footer].join(' ')}>
        <nav className={['cols-12 cols-m-6', classes.footerLinks].join(' ')}>
          <div
          // className={`border-t border-gray-900 bg-green px-3  py-4 font-body text-white sm:py-3 md:flex md:items-center md:justify-between`}
          >
            <div
            // className={[blockFormats.blockWidth, ` mt-0 align-middle #text-white md:order-1`]
            //   .filter(Boolean)
            //   .join(' ')}
            >
              <span className="font-logo text-lg font-bold tracking-[-.055em] #text-white">{`thankly `}</span>
              <span className="text-xs uppercase">
                {' | ABN 84 662 101 859 | '} &copy; {new Date().getFullYear()}{' '}
                {` All Rights Reserved`}
              </span>
            </div>
          </div>
          {/* <Link href={'/terms'}>Terms</Link>
          <Link href={'/privacy'}>Privacy</Link>
          {user ? <Link href={'/logout'}>Logout</Link> : <Link href={'/login'}>Login</Link>} */}
        </nav>
        <div className={[classes.selectContainer, 'cols-4 cols-m-2'].join(' ')}>
          <label className="visually-hidden" htmlFor={themeId}>
            Switch themes
          </label>
          {selectRef?.current && (
            <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
              {selectRef.current.value === 'auto' && <ThemeAutoIcon />}
              {selectRef.current.value === 'light' && <ThemeLightIcon />}
              {selectRef.current.value === 'dark' && <ThemeDarkIcon />}
            </div>
          )}

          <select
            id={themeId}
            onChange={(e) => onThemeChange(e.target.value as Theme & 'auto')}
            ref={selectRef}
          >
            <option value="auto">Auto</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>

          <ChevronUpDownIcon className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`} />
        </div>
      </footer>
    </Gutter>
  )
}
