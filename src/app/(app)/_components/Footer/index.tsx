'use client'

import React, { useId } from 'react'
// import { Text } from '@app/_components/forms/fields/Text'
// import FormComponent from '@app/_components/forms/Form'
// import { validateEmail } from '@app/_components/forms/validations'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { Footer as FooterType } from '@payload-types'
import { usePathname, useRouter } from 'next/navigation'

// import { BackgroundGrid } from '@app/_components/BackgroundGrid'
import { CMSLink } from '@app/_components/CMSLink'
import { Gutter } from '@app/_components/Gutter'
import { FacebookIcon } from '@app/_graphics/FacebookIcon'
import { InstagramIcon } from '@app/_graphics/InstagramIcon'
import { ThemeAutoIcon } from '@app/_graphics/ThemeAutoIcon'
import { ThemeDarkIcon } from '@app/_graphics/ThemeDarkIcon'
import { ThemeLightIcon } from '@app/_graphics/ThemeLightIcon'

import { ChevronUpDownIcon } from '@app/_icons/ChevronUpDownIcon'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { useThemePreference } from '@app/_providers/Theme'
import { getImplicitPreference, themeLocalStorageKey } from '@app/_providers/Theme/shared'
import { Theme } from '@app/_providers/Theme/types'
import { getCookie } from '@app/_utilities/get-cookie'

import classes from './index.module.scss'
import { SubFooter } from './SubFooter'

export const Footer: React.FC<FooterType> = (props) => {
  const { columns } = props
  // const [products, developers, company] = columns ?? []
  const { setTheme } = useThemePreference()
  const { setHeaderTheme } = useHeaderObserver()
  const wrapperRef = React.useRef<HTMLElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const [buttonClicked, setButtonClicked] = React.useState(false)

  const submitButtonRef = React.useRef<HTMLButtonElement>(null)

  const handleButtonClick = () => {
    setButtonClicked(true)
  }

  React.useEffect(() => {
    const buttonElement = submitButtonRef.current

    if (buttonElement) {
      buttonElement.addEventListener('click', handleButtonClick)
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('click', handleButtonClick)
      }
    }
  }, [])

  const [formData, setFormData] = React.useState({ email: '' })

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target?.name]: e.target?.value })
  }

  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

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

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (selectRef.current) {
      selectRef.current.value = preference ?? 'auto'
    }
  }, [])
  const router = useRouter()

  const pathname = usePathname()

  const allowedSegments = [
    'cloud',
    'cloud-terms',
    'forgot-password',

    'login',
    'logout',

    'reset-password',
  ]

  // const pathnameSegments = pathname.split('/').filter(Boolean)
  // const themeId = useId()
  // const newsletterId = useId()

  // const onSubmit = React.useCallback(() => {
  //   setButtonClicked(false)
  //   const submitForm = async () => {
  //     setError(undefined)

  //     try {
  //       const formID = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ID
  //       const hubspotCookie = getCookie('hubspotutk')
  //       const pageUri = `${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`
  //       const slugParts = pathname?.split('/')
  //       const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)
  //       const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
  //         method: 'POST',
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           form: formID,
  //           submissionData: { field: 'email', value: formData.email },
  //           hubspotCookie,
  //           pageUri,
  //           pageName,
  //         }),
  //       })

  //       const res = await req.json()

  //       if (req.status >= 400) {
  //         setError({
  //           status: res.status,
  //           message: res.errors?.[0]?.message || 'Internal Server Error',
  //         })

  //         return
  //       }

  //       const url = '/thanks-for-subscribing'
  //       const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SERVER_URL)

  //       try {
  //         if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SERVER_URL) {
  //           router.push(redirectUrl.href)
  //         } else {
  //           window.location.assign(url)
  //         }
  //       } catch (err) {
  //         console.warn(err) // eslint-disable-line no-console
  //         setError({
  //           message: 'Something went wrong. Did not redirect.',
  //         })
  //       }
  //     } catch (err) {
  //       console.warn(err) // eslint-disable-line no-console
  //       setError({
  //         message: 'Newsletter form submission failed.',
  //       })
  //     }
  //   }
  //   submitForm()
  // }, [pathname, formData, router])

  return (
    <>
      <footer ref={wrapperRef} className={classes.footer}>
        {/* <BackgroundGrid
        zIndex={2}
        className={[classes.background, isCloudPage ? classes.topBorder : '']
          .filter(Boolean)
          .join(' ')}
      /> */}
        <Gutter className={classes.container}>
          <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')}>
            <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
              {/* <p className={classes.colHeader}>{products.label}</p> */}
              <div className={classes.colItems}>
                {/* {products?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })} */}
              </div>
            </div>

            <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
              {/* <p className={classes.colHeader}>{developers.label}</p> */}
              <div className={classes.colItems}>
                {/* {developers?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })} */}
              </div>
            </div>

            <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
              {/* <p className={classes.colHeader}>{company.label}</p> */}
              <div className={classes.colItems}>
                {/* {company?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })} */}
              </div>
            </div>

            <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
              <p className={`${classes.colHeader} ${classes.thirdColumn}`}>Stay connected</p>
              <div>
                {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
                {/* <FormComponent onSubmit={onSubmit}>
                <div className={classes.inputWrap}>
                  <label className="visually-hidden" htmlFor={newsletterId}>
                    Subscribe to our newsletter
                  </label>
                  <Text
                    type="text"
                    path={newsletterId}
                    name="email"
                    value={formData.email}
                    customOnChange={handleChange}
                    required
                    validate={validateEmail}
                    className={classes.emailInput}
                    placeholder="Enter your email"
                  />
                  <button ref={submitButtonRef} className={classes.submitButton} type="submit">
                    <ArrowIcon className={[classes.inputArrow].filter(Boolean).join(' ')} />
                    <span className="visually-hidden">Submit</span>
                  </button>
                </div>

                <div className={classes.subscribeAction}>
                  <p className={classes.subscribeDesc}>
                    Sign up to receive periodic updates and feature releases to your email.
                  </p>
                </div>
              </FormComponent> */}
              </div>

              <div className={classes.socialLinks}>
                <a
                  href="https://www.instagram.com/payloadcms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                  aria-label="Payload's Instagram page"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="https://www.facebook.com/payloadcms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                  aria-label="Payload's Facebook page"
                >
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </div>
        </Gutter>
      </footer>
      <SubFooter />
    </>
  )
}
