import * as React from 'react'
import Link from 'next/link'

import { Avatar } from '@app/_components/Avatar'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { Menu } from '@payload-types'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { FullLogo } from '@/app/(app)/_icons/FullLogo'
import { CMSLink } from '../../CMSLink'

import classes from './index.module.scss'
import { CartNotification } from '@app/_components/CartNotification'
import UserButton from '../../Auth/user-button'

type DesktopNavType = Pick<Menu, 'tabs'> & { hideBackground?: boolean }

export const DesktopNav: React.FC<DesktopNavType> = ({ tabs, hideBackground }) => {
  console.log('tabs --', tabs)
  const [activeTab, setActiveTab] = React.useState<number | undefined>()
  const [activeDropdown, setActiveDropdown] = React.useState<boolean | undefined>(false)
  const [backgroundStyles, setBackgroundStyles] = React.useState<any>({
    height: '0px',
  })
  const bgHeight = hideBackground ? { top: '0px' } : ''
  const [underlineStyles, setUnderlineStyles] = React.useState<any>({})
  const { headerTheme } = useHeaderObserver()
  const [activeDropdownItem, setActiveDropdownItem] = React.useState<number | undefined>(undefined)

  const menuItemRefs = [] as (HTMLButtonElement | null)[]
  const dropdownMenuRefs = [] as (HTMLDivElement | null)[]

  React.useEffect(() => {
    if (activeTab !== undefined) {
      const hoveredDropdownMenu = dropdownMenuRefs[activeTab]
      const bgHeight = hoveredDropdownMenu?.clientHeight || 0
      if (bgHeight === 0) {
        setBackgroundStyles({ height: '0px' })
        setActiveDropdown(undefined)
      } else {
        setBackgroundStyles({
          height: hideBackground ? `${bgHeight + 90}px` : `${bgHeight}px`,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideBackground])

  const handleHoverEnter = (index: any) => {
    setActiveTab(index)
    setActiveDropdown(true)

    const hoveredMenuItem = menuItemRefs[index]
    const hoveredDropdownMenu = dropdownMenuRefs[index]
    const bgHeight = hoveredDropdownMenu?.clientHeight || 0

    if (hoveredMenuItem) {
      setUnderlineStyles({
        width: `${hoveredMenuItem.clientWidth}px`,
        left: hoveredMenuItem.offsetLeft,
      })
    }

    if (bgHeight === 0) {
      setBackgroundStyles({ height: '0px' })
      setActiveDropdown(undefined)
    } else {
      setBackgroundStyles({
        height: hideBackground ? `${bgHeight + 90}px` : `${bgHeight}px`,
      })
    }

    setActiveDropdownItem(undefined)
  }

  const resetHoverStyles = () => {
    setActiveDropdown(false)
    setActiveTab(undefined)
    setBackgroundStyles({ height: '0px' })
  }

  return (
    <div
      className={[
        'fixed top-0 flex items-center w-full z-40 transition-colors duration-300 max-w-full',
        'before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full #before:bg-white before:backdrop-blur-md before:opacity-100 before:z-[-1] before:transition-opacity before:duration-500 before:ease-out',
        'after:content-[""] after:block after:absolute after:top-0 after:left-0 after:w-full after:h-full after:z-[-1] after:opacity-100 after:transition-opacity after:duration-500 after:ease-out',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ width: '100%' }}
    >
      <Gutter
        className={[classes.desktopNav, activeDropdown && classes.active].filter(Boolean).join(' ')}
      >
        <div className={[classes.grid, 'grid'].join(' ')}>
          <div className={[classes.logo, 'cols-4'].join(' ')}>
            <Link href="/" className={classes.logo} prefetch={false} aria-label="Thankly Logo">
              <FullLogo />
            </Link>
          </div>
          <div className={[classes.content, 'cols-8'].join(' ')}>
            <div className={classes.tabs} onMouseLeave={resetHoverStyles}>
              {(tabs || []).map((tab: any, tabIndex: any) => {
                const { enableDirectLink = false, enableDropdown = false } = tab
                console.log(tab.label, tab.enableDirectLink, tab.enableDropdown)
                return (
                  <div key={tabIndex} onMouseEnter={() => handleHoverEnter(tabIndex)}>
                    <button
                      className={classes.tab}
                      ref={(ref: HTMLButtonElement | null) => {
                        if (ref) menuItemRefs[tabIndex] = ref
                      }}
                    >
                      {enableDirectLink ? (
                        <CMSLink
                          className={`${classes.directLink} `}
                          data={{
                            label: tab.label,
                            ...tab.link,
                          }}
                          look={{ variant: 'links' }}
                        >
                          {tab.label}
                          {tab.link?.newTab && tab.link.type === 'custom' && (
                            <ArrowIcon className={classes.tabArrow} />
                          )}
                        </CMSLink>
                      ) : (
                        <span>{tab.label}</span>
                      )}
                    </button>

                    {enableDropdown && (
                      <div
                        className={[
                          'grid',
                          classes.dropdown,
                          tabIndex === activeTab && classes.activeTab,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        ref={(ref: HTMLDivElement | null) => {
                          if (ref) dropdownMenuRefs[tabIndex] = ref
                        }}
                        onClick={resetHoverStyles}
                      >
                        <div className={[classes.description, 'cols-4'].join(' ')}>
                          {tab.description}
                          {tab.descriptionLinks && (
                            <div className={classes.descriptionLinks}>
                              {tab.descriptionLinks.map((link: any, linkIndex: any) => (
                                <CMSLink
                                  className={classes.descriptionLink}
                                  key={linkIndex}
                                  data={link.link}
                                  look={{ variant: 'links' }}
                                >
                                  <ArrowIcon className={classes.linkArrow} />
                                </CMSLink>
                              ))}
                            </div>
                          )}
                        </div>
                        {tab.items &&
                          tab.items?.map((item: any, index: any) => {
                            const isActive = activeDropdownItem === index
                            let columnSpan = 12 / (tab.items?.length || 1)
                            const containsFeatured = tab.items?.some(
                              (navItem: any) => navItem.style === 'featured',
                            )
                            const showUnderline = isActive && item.style === 'default'

                            if (containsFeatured) {
                              columnSpan = item.style === 'featured' ? 6 : 3
                            }

                            return (
                              <div
                                className={[
                                  `cols-${columnSpan}`,
                                  classes.dropdownItem,
                                  showUnderline && classes.showUnderline,
                                ].join(' ')}
                                onMouseEnter={() => setActiveDropdownItem(index)}
                                key={index}
                              >
                                {item.style === 'default' && item.defaultLink && (
                                  <CMSLink
                                    className={classes.defaultLink}
                                    data={{
                                      label: item.defaultLink.link.label,
                                      ...item.defaultLink.link,
                                    }}
                                    look={{ variant: 'links' }}
                                  >
                                    <div className={classes.defaultLinkLabel}>
                                      {item.defaultLink.link.label}
                                    </div>
                                    <div className={classes.defaultLinkDescription}>
                                      {item.defaultLink.description}
                                      <ArrowIcon size="medium" />
                                    </div>
                                  </CMSLink>
                                )}
                                {item.style === 'list' && item.listLinks && (
                                  <div className={classes.linkList}>
                                    <div className={classes.listLabel}>{item.listLinks.tag}</div>
                                    {item.listLinks.links &&
                                      item.listLinks.links.map((link: any, linkIndex: any) => (
                                        <CMSLink
                                          className={classes.link}
                                          key={linkIndex}
                                          data={link.link}
                                          look={{ variant: 'links' }}
                                        >
                                          {link.link?.newTab && link.link?.type === 'custom' && (
                                            <ArrowIcon className={classes.linkArrow} />
                                          )}
                                        </CMSLink>
                                      ))}
                                  </div>
                                )}
                                {item.style === 'featured' && item.featuredLink && (
                                  <div className={classes.featuredLink}>
                                    <div className={classes.listLabel}>{item.featuredLink.tag}</div>
                                    {item.featuredLink?.label && (
                                      <RichText
                                        className={classes.featuredLinkLabel}
                                        content={item.featuredLink.label}
                                      />
                                    )}
                                    <div className={classes.featuredLinkWrap}>
                                      {item.featuredLink.links &&
                                        item.featuredLink.links.map((link: any, linkIndex: any) => (
                                          <CMSLink
                                            className={classes.featuredLinks}
                                            key={linkIndex}
                                            data={link.link}
                                            look={{ variant: 'links' }}
                                          >
                                            <ArrowIcon className={classes.linkArrow} />
                                          </CMSLink>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )
              })}
              <div
                className={classes.underline}
                style={{ ...underlineStyles, opacity: activeDropdown || activeTab ? 1 : 0 }}
                aria-hidden="true"
              >
                <div className={classes.underlineFill} />
              </div>
            </div>
          </div>
          <div className={'cols-4'}>
            <div className={[classes.secondaryNavItems, classes.show].join(' ')}>
              <CartNotification />
              <UserButton />
            </div>
          </div>
        </div>
        <div className={classes.background} style={{ ...backgroundStyles, ...bgHeight }} />
      </Gutter>
    </div>
  )
}
