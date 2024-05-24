'use client'

import React, { useId } from 'react'
import { Text } from '@app/_components/forms/fields/Text'
import FormComponent from '@app/_components/forms/Form'
import { validateEmail } from '@app/_components/forms/validations'
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
import { blockFormats, contentFormats } from '../../_css/tailwindClasses'
import Link from 'next/link'

export const Footer: React.FC<FooterType> = (props) => {
  // console.log('footer props --', props)
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

  const [formData, setFormData] = React.useState({ firstName: '', email: '' })

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

  const pathnameSegments = pathname.split('/').filter(Boolean)
  const themeId = useId()
  const newsletterId = useId()

  const onSubmit = React.useCallback(() => {
    setButtonClicked(false)
    const submitForm = async () => {
      setError(undefined)

      try {
        const formID = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ID
        const hubspotCookie = getCookie('hubspotutk')
        const pageUri = `${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`
        const slugParts = pathname?.split('/')
        const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form: formID,
            submissionData: { field: 'email', value: formData.email },
            hubspotCookie,
            pageUri,
            pageName,
          }),
        })

        const res = await req.json()

        if (req.status >= 400) {
          setError({
            status: res.status,
            message: res.errors?.[0]?.message || 'Internal Server Error',
          })

          return
        }

        const url = '/thanks-for-subscribing'
        const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SERVER_URL)

        try {
          if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SERVER_URL) {
            router.push(redirectUrl.href)
          } else {
            window.location.assign(url)
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setError({
            message: 'Something went wrong. Did not redirect.',
          })
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setError({
          message: 'Newsletter form submission failed.',
        })
      }
    }
    submitForm()
  }, [pathname, formData, router])

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
            {columns?.map(({ label: column, items }, i) => {
              // console.log('items -- ', items)

              return (
                <div
                  key={`col-${i}`}
                  className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}
                >
                  <h3
                    className={[
                      contentFormats.global,
                      `font-title text-lg font-semibold tracking-tighter`,
                    ].join(' ')}
                  >
                    {column}
                  </h3>
                  <ul role="list" className={`mt-4 list-none space-y-4 pl-0 leading-none`}>
                    {items?.map(({ link }, j) => (
                      <li
                        key={`link-${i}-${j}`}
                        // className="text-gray-700 hover:text-gray-900 "
                      >
                        <CMSLink
                          {...link}
                          // appearance={'links'}
                          className={blockFormats.footerMenu}
                        />
                      </li>
                    ))}
                  </ul>
                  {/* <div className={`mt-4 list-none space-y-4 pl-0 leading-none`}>
                    {items?.map(({ link }, index) => {
                      console.log('link -- ', JSON.stringify(link))
                      return (
                        <CMSLink
                          key={index}
                          {...link}
                          // appearance={'links'}
                          // className={blockFormats.footerMenu}
                        />
                      )
                    })}
                  </div> */}
                </div>
              )
            })}

            <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
              {/* <p className={`${classes.colHeader} ${classes.thirdColumn}`}>Stay connected</p> */}
              <h3
                className={[
                  contentFormats.global,
                  `font-title text-lg font-semibold tracking-tighter`,
                ].join(' ')}
              >
                Stay Connected
              </h3>
              <div>
                <FormComponent onSubmit={onSubmit}>
                  <label className="visually-hidden" htmlFor={newsletterId}>
                    Your Name
                  </label>
                  <Text
                    type="text"
                    path={newsletterId}
                    name="firstName"
                    value={formData.firstName}
                    customOnChange={handleChange}
                    required
                    // validate={}
                    className={`classes.emailInput`}
                    placeholder="Enter your name"
                  />
                  <div className={classes.inputWrap}>
                    <label className="visually-hidden" htmlFor={newsletterId}>
                      // Subscribe to our newsletter
                    </label>
                    <Text
                      type="text"
                      path={newsletterId}
                      name="email"
                      value={formData.email}
                      customOnChange={handleChange}
                      required
                      validate={validateEmail}
                      className={`classes.emailInput`}
                      placeholder="Enter your email"
                    />
                    <button ref={submitButtonRef} className={classes.submitButton} type="submit">
                      <ArrowIcon className={[classes.inputArrow].filter(Boolean).join(' ')} />
                      <span className="visually-hidden">Submit</span>
                    </button>
                  </div>

                  <div className={classes.subscribeAction}>
                    <p
                      className={[contentFormats.global, contentFormats.text].join(' ')}
                      // className={classes.subscribeDesc}
                    >
                      Sign up to receive periodic updates to your email.
                    </p>
                  </div>
                  {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
                </FormComponent>
              </div>

              <div
                className="grid space-x-3 justify-start"
                // className={classes.socialLinks}
              >
                <Link
                  href="https://www.instagram.com/thankly.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-gray-400 hover:text-gray-900"
                  aria-label="Thankly's Instagram page"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" {...props}>
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                <Link
                  href="https://www.facebook.com/thankly.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  // className={classes.socialIconLink}
                  className="flex-1 text-gray-400 hover:text-gray-900"
                  aria-label="Thankly's Facebook page"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" {...props}>
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>

                <Link
                  href="https://www.linkedin.com/company/thankly"
                  target="_blank"
                  rel="noopener noreferrer"
                  // className={[classes.socialIconLink].join(' ')}
                  className="flex-1 text-gray-400 hover:text-gray-900"
                  aria-label="Thankly's LinkedIn page"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 12"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMinYMin"
                    className="jam jam-linkedin"
                    width="28"
                    height="28"
                    {...props}
                  >
                    <path d="M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792zM2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254v12.869z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </Gutter>
      </footer>
      <SubFooter />
    </>
  )
}
