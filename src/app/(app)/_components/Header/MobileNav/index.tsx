import * as React from 'react'
import { Modal, useModal } from '@faceless-ui/modal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar } from '@app/_components/Avatar'
import { Gutter } from '@app/_components/Gutter'
import { RichText } from '@app/_blocks/RichText'
import { ArrowIcon } from '@app/_icons/ArrowIcon'
import { CrosshairIcon } from '@app/_icons/CrosshairIcon'
import { Menu } from '@payload-types'
import { useHeaderObserver } from '@app/_providers/HeaderIntersectionObserver'
import { Theme } from '@app/_providers/Theme/types'
import { FullLogo } from '@app/_graphics/FullLogo'
import { MenuIcon } from '@app/_graphics/MenuIcon'
import { CMSLink } from '../../CMSLink'
import classes from './index.module.scss'
import { CartNotification } from '@app/_components/CartNotification'

export const modalSlug = 'mobile-nav'
export const subMenuSlug = 'mobile-sub-menu'

type NavItems = Pick<Menu, 'tabs'>

const MobileNavItems = ({ tabs, setActiveTab }: any) => {
  // const { user } = useAuth()
  const { openModal } = useModal()
  const handleOnClick = (index: any) => {
    openModal(subMenuSlug)
    setActiveTab(index)
  }

  return (
    <ul className={classes.mobileMenuItems}>
      {(tabs || []).map((tab: any, index: any) => {
        const { link, label, enableDirectLink, enableDropdown } = tab

        if (!enableDropdown)
          return <CMSLink {...link} className={classes.mobileMenuItem} key={index} label={label} />

        if (enableDirectLink)
          return (
            <button
              onClick={() => handleOnClick(index)}
              className={classes.mobileMenuItem}
              key={index}
            >
              <CMSLink
                className={classes.directLink}
                {...link}
                label={label}
                onClick={(e: any) => {
                  e.stopPropagation()
                }}
              />
              <ArrowIcon size="medium" rotation={45} />
            </button>
          )
        else
          return (
            <CMSLink
              {...link}
              className={classes.mobileMenuItem}
              key={index}
              label={label}
              onClick={() => handleOnClick(index)}
            >
              <ArrowIcon size="medium" rotation={45} />
            </CMSLink>
          )
      })}

      {/* {!user && (
        <Link className={classes.mobileMenuItem} href="/login" prefetch={false}>
          Login
        </Link>
      )} */}
      {/* <CrosshairIcon
        className={[classes.crosshair, classes.crosshairTopLeft].filter(Boolean).join(' ')}
        size="large"
      />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairBottomLeft].filter(Boolean).join(' ')}
        size="large"
      /> */}
    </ul>
  )
}

const MobileMenuModal: React.FC<
  NavItems & {
    setActiveTab: (index: number) => void
    theme?: Theme | null
  }
> = ({ tabs, setActiveTab, theme }) => {
  return (
    <Modal slug={modalSlug} className={classes.mobileMenuModal} trapFocus={false}>
      <Gutter className={classes.mobileMenuWrap} rightGutter={false} dataTheme={`${theme}`}>
        <MobileNavItems tabs={tabs} setActiveTab={setActiveTab} />
        {/* <BackgroundGrid zIndex={0} /> */}
        {/* <BackgroundScanline /> */}
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

const SubMenuModal: React.FC<
  NavItems & {
    activeTab: number | undefined
    theme?: Theme | null
  }
> = ({ tabs, activeTab, theme }) => {
  const { closeModal, closeAllModals } = useModal()

  return (
    <Modal
      slug={subMenuSlug}
      className={[classes.mobileMenuModal, classes.mobileSubMenu].join(' ')}
      trapFocus={false}
      onClick={closeAllModals}
    >
      <Gutter className={classes.subMenuWrap} dataTheme={`${theme}`}>
        {(tabs || []).map((tab: any, tabIndex: any) => {
          if (tabIndex !== activeTab) return null
          return (
            <div className={classes.subMenuItems} key={tabIndex}>
              <button
                className={classes.backButton}
                onClick={(e) => {
                  closeModal(subMenuSlug)
                  e.stopPropagation()
                }}
              >
                <ArrowIcon size="medium" rotation={225} />
                Back
                <CrosshairIcon
                  className={[classes.crosshair, classes.crosshairTopLeft]
                    .filter(Boolean)
                    .join(' ')}
                  size="large"
                />
              </button>
              {tab.descriptionLinks && tab.descriptionLinks.length > 0 && (
                <div className={classes.descriptionLinks}>
                  {tab.descriptionLinks.map((link: any, linkIndex: any) => (
                    <CMSLink className={classes.descriptionLink} key={linkIndex} {...link.link}>
                      <ArrowIcon className={classes.linkArrow} />
                    </CMSLink>
                  ))}
                </div>
              )}
              {(tab.items || []).map((item: any, index: any) => {
                return (
                  <div className={classes.linkWrap} key={index}>
                    {item.style === 'default' && item.defaultLink && (
                      <CMSLink className={classes.defaultLink} {...item.defaultLink.link} label="">
                        <div className={classes.listLabelWrap}>
                          <div className={classes.listLabel}>
                            {item.defaultLink.link.label}
                            <ArrowIcon size="medium" rotation={0} />
                          </div>
                          <div className={classes.itemDescription}>
                            {item.defaultLink.description}
                          </div>
                        </div>
                      </CMSLink>
                    )}
                    {item.style === 'list' && item.listLinks && (
                      <div className={classes.linkList}>
                        <div className={classes.tag}>{item.listLinks.tag}</div>
                        <div className={classes.listWrap}>
                          {item.listLinks.links &&
                            item.listLinks.links.map((link: any, linkIndex: any) => (
                              <CMSLink className={classes.link} key={linkIndex} {...link.link}>
                                {link.link?.newTab && link.link?.type === 'custom' && (
                                  <ArrowIcon className={classes.linkArrow} />
                                )}
                              </CMSLink>
                            ))}
                        </div>
                      </div>
                    )}
                    {item.style === 'featured' && item.featuredLink && (
                      <div className={classes.featuredLink}>
                        <div className={classes.tag}>{item.featuredLink.tag}</div>
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
                                {...link.link}
                              >
                                <ArrowIcon />
                              </CMSLink>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <CrosshairIcon
                className={[classes.crosshair, classes.crosshairBottomLeft]
                  .filter(Boolean)
                  .join(' ')}
                size="large"
              />
            </div>
          )
        })}
        {/* <BackgroundScanline /> */}
        {/* <BackgroundGrid zIndex={0} /> */}
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

export const MobileNav: React.FC<NavItems> = (props) => {
  const { isModalOpen, openModal, closeAllModals } = useModal()
  const { headerTheme } = useHeaderObserver()
  // const { user } = useAuth()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = React.useState<number | undefined>()

  const isMenuOpen = isModalOpen(modalSlug)

  React.useEffect(() => {
    closeAllModals()
  }, [pathname, closeAllModals])

  const toggleModal = React.useCallback(() => {
    if (isMenuOpen) {
      closeAllModals()
    } else {
      openModal(modalSlug)
    }
  }, [isMenuOpen, closeAllModals, openModal])

  return (
    <div className={classes.mobileNav}>
      <div className={classes.menuBar}>
        <Gutter>
          <div className={'grid'}>
            <div
              className={[classes.menuBarContainer, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
            >
              <Link
                href="/"
                className={[classes.logo, 'no-underline'].join(' ')}
                prefetch={false}
                aria-label="Full Payload Logo"
              >
                <FullLogo />
              </Link>
              <div className={classes.icons}>
                <div className={classes.shoppingBag}>
                  <CartNotification />
                </div>
                {/* <div className={classes.cloudNewProject}>
                  {!user && (
                    <Link href="/login" prefetch={false}>
                      Login
                    </Link>
                  )}
                </div>
                {user && <Avatar className={classes.mobileAvatar} />} */}

                <div
                  className={[classes.modalToggler, isMenuOpen ? classes.hamburgerOpen : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={toggleModal}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <MenuIcon />
                </div>
              </div>
            </div>
          </div>
        </Gutter>
      </div>
      <MobileMenuModal {...props} setActiveTab={setActiveTab} theme={headerTheme} />
      <SubMenuModal {...props} activeTab={activeTab} theme={headerTheme} />
    </div>
  )
}
